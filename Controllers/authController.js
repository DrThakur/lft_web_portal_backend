const User = require("./../Models/userModel");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const CustomError = require("../Utils/CustomError");
const authentication = require("../Utils/authentication");
const sendEmail = require("../Utils/email");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// exports.signup = asyncErrorHandler(async (req, res, next) => {
//   const newUser = await User.create(req.body);

//   res.status(201).json({
//     status: "success",
//     data: {
//       user: newUser,
//     },
//   });
//   next();
// });

const login = asyncErrorHandler(async (req, res, next) => {
  try {
    const email = req.body.email;
    console.log("my login user email", email);
    const password = req.body.password;
    console.log("my login user password", password);

    // const {email, password}= req.body
    if (!email || !password) {
      const error = new CustomError(
        "Please provide email ID and Password for login in!",
        400
      );
      return next(error);
    }
    // check if user exits with that email
    const user = await User.findOne({ email }).select("+password");
    console.log("my user", user);
    console.log(
      "my passoword check status",
      await user.matchPassword(password, user.password)
    );

    //   const isMatch = await user.matchPassword(password, user.password);[ for refrence]

    // check if user exits and password matches
    if (!user || !(await user.matchPassword(password, user.password))) {
      const error = new CustomError("Incorrect Email or Password", 400);
      return next(error);
    }

    const token = authentication.createTokenForUsers(user);

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    next(error);
  }
});

// Protecting Routes
const protect = asyncErrorHandler(async (req, res, next) => {
  try {
    //1. Read the token & check if it exits
    const testToken = req.headers.authorization;
    let token;
    if (testToken && testToken.startsWith("Bearer")) {
      token = testToken.split(" ")[1];
    }
    console.log("Test token", token);
    if (!token) {
      next(new CustomError("You are not authorized to access thi route", 401));
    }

    //2. Validate the token
    const decodedToken = authentication.validateToken(token);
    console.log("my decoded token", decodedToken);

    //3. If the user exists
    const user = await User.findById(decodedToken._id);
    console.log("my user", user);

    if (!user) {
      return next(
        new CustomError("The user with given token does not exist", 401)
      );
    }

    //4. If the user changed password after the token was issued
    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
    if (isPasswordChanged) {
      return next(
        new CustomError("Password changed recently. Please login again", 401)
      );
    }

    req.user = user;

    //5. Allow user to acces the route
    next();
  } catch (error) {
    return next(error);
  }
});

const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  //1. Get User based on Posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    const error = new CustomError(
      "We could not find the user with given email",
      404
    );
    next(error);
  }

  //2. Generate a Random Reset Code
  const resetToken = user.createResetPasswordToken();
  await user.save();

  //3. Send The Code back to the user email

  const message = `We have received a password reset request. Please use the below One Time Password(OTP) to reset your password.\n\n ${resetToken}\n\n This OTP is valid only for 10 minutes.`;

  try {
    sendEmail({
      email: user.email,
      subject: "Reset Password Request",
      message: message,
    });

    res.status(200).json({
      status: "success",
      message: "password reset code sent to the user email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save();

    return next(
      new CustomError(
        "There was an error sending password reset email. Please try again later",
        500
      )
    );
  }
});

const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const { email, resetCode, newPassword, confirmPassword } = req.body;

  // 1. Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    const error = new CustomError("User not found", 404);
    return next(error);
  }

  // 2. Check if the reset code is valid and not expired
  const hashedCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  console.log("my hashed code", hashedCode);

  if (
    hashedCode !== user.passwordResetToken ||
    user.passwordResetTokenExpires < Date.now()
  ) {
    const error = new CustomError("Invalid or expired reset code", 400);
    return next(error);
  }

  // 3. Check if passwords match
  if (newPassword !== confirmPassword) {
    const error = new CustomError("Passwords do not match", 400);
    return next(error);
  }

  // 4. Hash and set the new password
  // user.password = await bcrypt.hash(newPassword, 12);
  user.password = newPassword;
  user.passwordResetToken = undefined; // Clear the reset token
  user.passwordResetTokenExpires = undefined; // Clear the token expiration
  user.passwordChangedAt = Date.now();
  await user.save();
  //$2a$12$GW/gYowkPmxdQHONZGajRu/PILUOTO7ctXXHc95E38mun7k7QVLXG
  console.log("my changed password", user.password);

  // Login the user

  const token = authentication.createTokenForUsers(user);

  res.status(200).json({
    status: "success",
    message: "Password has been reset. You can login now",
    token,
  });
});

module.exports = {
  login,
  protect,
  forgotPassword,
  resetPassword,
};

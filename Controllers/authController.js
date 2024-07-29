const User = require("./../Models/userModel");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const CustomeError = require("../Utils/CustomError");
const authentication = require("../Utils/authentication");

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
  if (testToken && testToken.startsWith("bearer")) {
    token = testToken.split(" ")[1];
  }
  // console.log("Test token", token)
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
    return next(new CustomError("The user with given token does not exist", 401));
  }

  
  //4. If the user changed password after the token was issued
  const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
  if (isPasswordChanged) {
    return next(new CustomError("Password changed recently. Please login again", 401));
  }

  req.user = user;

  //5. Allow user to acces the route
  next();  
} catch (error) {
  return next(error)
}
});

module.exports = {
  login,
  protect,
};

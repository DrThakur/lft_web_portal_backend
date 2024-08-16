const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//Schema
const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, "Please provide employee id-Mandatory"],
    },

    fullName: {
      type: String,
      required: [true, "Please enter your Name"],
    },
    email: {
      type: String,
      // required: [true, "Please enter your email"],
      unique: true,
      lowercaser: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      validate: {
        // only work for save and create not for update
        validator: function (val) {
          return val === this.password;
        },
        message: "Password and confirm Password does not match",
      },
    },
    phoneNumber: {
      type: String,
      default: "N/A",
    },

    profileImageURL: {
      type: String,
      default: "/images/profile_image.jpg",
    },
    designation: {
      type: String,
      required: [true, "Please provide proper designation of the employee"],
    },
    reportingManager: {
      type: String,
      required: [true, "Please provide reporting Manager name of the employee"],
    },
    department: {
      type: String,
      required: [true, "Please provide department employee joined in"],
    },
    dateOfJoining: {
      type: Date,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
    },
    maritalStatus: {
      type: String,
    },
    religion: { type: String },
    nationality: { type: String },
    status: {
      type: String,
      enum: ["Active", "Left"],
      default: "Active",
    },
    temporaryAddress: { type: String },
    permanentAddress: { type: String },
    totalIndustryExp: { type: Number }, // Total industry experience in years
    lftExp: { type: Number }, // LFT experience in years
    degree: { type: String },
    institute: { type: String },
    duration: { type: String },
    location: {
      type: String,
      required: [
        true,
        "Please provide location at which employee will be reporting",
      ],
    },
    role: {
      type: String,
      enum: ["admin", "technician", "user"],
      default: "user",
    },
    passwordChangedAt: Date,
    passwordResetToken: { type: String },
    passwordResetTokenExpires: { type: Date },
    projects: [
      {
        project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
        role: { type: String },
        occupancy: { type: Number },
      },
    ],
    activities: [
      {
        activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
        role: { type: String }, // Role or involvement in the activity
        occupancy: { type: Number }, // Hours or percentage involved in the activity
      },
    ],
    performance: {
      type: Number,
    },
    techSkills:{
      type: [String],
    },
    remarks: [
      {
        remark: String,
        givenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Manager/HR who gave the remark
        date: { type: Date, default: Date.now },
      },
    ],
  },

  { timestamps: true }
);

// pre middleware of mongoose for encrypting password before saving it in the DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // encrypt the password before saving it-- Hashing
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

// Match Password
userSchema.methods.matchPassword = async function (password, passwordInDB) {
  return await bcrypt.compare(password, passwordInDB);
};

userSchema.methods.isPasswordChanged = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(passwordChangedTimeStamp, JWTTimestamp);

    return JWTTimestamp < passwordChangedTimeStamp;
  }
  return false;
};
// const generateRandomCode = (length) => {
//   const chars =
//     "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   let code = "";
//   for (let i = 0; i < length; i++) {
//     code += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return code;
// };

// userSchema.methods.createResetPasswordToken = function () {
//   const resetToken = generateRandomCode(16);

//   this.passwordResetToken = createHash("sha256")
//     .update(resetToken)
//     .digest("hex");
//   this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

//   console.log(resetToken, this.passwordResetToken);
//   return resetToken;
// };

// Model
const User = mongoose.model("user", userSchema);

module.exports = User;

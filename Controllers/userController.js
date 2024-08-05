const User = require("../Models/userModel");
const csvParser = require("csv-parser");
const fs = require("fs");
const {saveUserDataToDatabase} = require("../Utils/importFile");
const setRequiredFields = require("../Utils/requiredFields");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");

// Create Users

const createNewUser = asyncErrorHandler(async (req, res, next) => {
  try {
    const body = req.body;
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "Success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
});

const createNewUsersFromCSV = asyncErrorHandler(async (req, res, next) => {
  console.log("User Dtata recieved in file form", req);
  try {
    const jsonArray = [];
    // Map the CSV column headers to the Mongoose field names
    const fieldMappings = {
      "Employee Id": "employeeId",
      "Employee Full Name": "fullName",
      Email: "email",
      Password: "password",
      "Phone Number": "phoneNumber",
      Location: "location",
      Designation: "designation",
      "Reporting Manager": "reportingManager",
      Department: "department",
      "Date of Joining": "dateOfJoining",
      "Date of Birth": "dateOfBirth",
      Gender: "gender",
      "Marital Status": "maritalStatus",
      Religion: " religion",
      Status: "status",
      "Temproary Address": "temporaryAddress",
      "Permananet Address": "permanentAddress",
      "Total Industry Experience": "totalIndustryExp",
      "LFT Experience": "lftExp",
      Degree: "degree",
      Institute: "institute",
      Duration: "duration",
    };

    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on("data", (row) => {
        const mappedRow = {};
        for (const key in row) {
          if (fieldMappings[key]) {
            mappedRow[fieldMappings[key]] = row[key];
          }
        }
        console.log("Mapped Row:", mappedRow);
        jsonArray.push(mappedRow);
      })
      .on("end", async () => {
        for (const entry of jsonArray) {
          console.log("my entery: ", entry);
          // const processedRow = setRequiredFields(entry);
          // console.log("Processed Row:", processedRow);
          // await saveUserDataToDatabase(processedRow);
          await saveUserDataToDatabase(entry);
        }
      });
    res.json({ msg: "Added successfully to MongoDb" });
  } catch (error) {
    next(error);
  }
});

//get Users

const getAllUsers = asyncErrorHandler(async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      status: "Success",
      total: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
});

// Get users with pagination
const getUsers = asyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const totalUsers = await User.countDocuments();
  const users = await User.find().skip(skip).limit(limit);

  res.status(200).json({
      success: true,
      page,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users,
  });
});


const getUserById = asyncErrorHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

const getUserFromDesignation = async (req, res) => {};

const getUserFromRole = async (req, res) => {};

// Update Users

// Update User By Id

const updateUserById = asyncErrorHandler(async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ msg: "Success", id: user._id });
  } catch (error) {
    next(error);
  }
});

// Delete users

// Delete User By Id
const deleteUserById = asyncErrorHandler(async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// Delete multiple users by IDs
const deleteMultipleUsersByIds = asyncErrorHandler(async (req, res, next) => {
  try {
    const { userIds } = req.body;
    console.log("my user ids", userIds);

    // Check if userIds array is provided
    console.log("Asset Ids", userIds);
    if (!Array.isArray(userIds)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Delete the users
    const result = await User.deleteMany({ _id: { $in: userIds } });

    // Check if any documents were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Users not found" });
    }

    res
      .status(200)
      .json({ status: "Success", deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
});

const deleteAll = asyncErrorHandler(async (req, res, next) => {
  console.log("If request reached or not", req);
  try {
    const result = await User.deleteMany({});
    res.status(200).json({
      message: `All ${result.deletedCount} users deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getUsers,
  getAllUsers,
  createNewUser,
  createNewUsersFromCSV,
  getUserById,
  getUserFromDesignation,
  getUserFromRole,
  updateUserById,
  deleteUserById,
  deleteMultipleUsersByIds,
  deleteAll,
};

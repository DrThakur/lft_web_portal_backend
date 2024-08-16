const User = require("../Models/userModel");
const csvParser = require("csv-parser");
const fs = require("fs");
const { saveUserDataToDatabase } = require("../Utils/importFile");
const setRequiredFields = require("../Utils/requiredFields");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const Project = require("../Models/projectModel");

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
    const users = await User.find({})
      .populate({
        path: "projects.project", // Populate the project field in the projects array
        model: "project", // Reference the Project model
        select: "-__v", // Select fields to include/exclude (optional, e.g., exclude the __v field)
      })
      .exec();

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
    const user = await User.findById(req.params.id)
      .populate({
        path: "projects.project", // Populate the project field in the projects array
        model: "project", // Reference the Project model
        select: "-__v", // Select fields to include/exclude (optional, e.g., exclude the __v field)
        populate: {
          path: "projectManager", // Populate the projectManager field in the project
          model: "user", // Reference the User model for projectManager
          select: "-password -__v", // Select fields to include/exclude (optional)
        },
      })
      .exec();
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

// Controller function to update performance from CSV
const updatePerformanceFromCSV = async (req, res) => {
  const filePath = req.file.path; // Assuming you're using multer to handle file uploads

  try {
    const results = [];

    // Read the CSV file
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Iterate over the parsed data and update user performance
        for (const row of results) {
          const { 'Employee ID': employeeId, Performance } = row;

          // Check if the performance value is valid
          if (Performance && !isNaN(Performance)) {
            await User.findOneAndUpdate(
              { employeeId },
              { performance: parseFloat(Performance) },
              { new: true }
            );
          } else {
            console.log(`Skipping update for employee ID ${employeeId} due to invalid performance value.`);
          }
        }
        res.status(200).json({ status: 'success', message: 'Performance updated successfully!' });
      });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const importTechSkillsFromCSV = (req, res) => {
  const filePath = req.file.path;
  const results = [];
  
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      // Process each row and add to results array
      results.push(row);
    })
    .on('end', async () => {
      try {
        for (const row of results) {
          const employeeId = row['Employee ID'];
          const techSkills = [];

          // Iterate over each column in the row, skipping the first two columns (Employee ID and Employee Full Name)
          Object.keys(row).slice(2).forEach((skill) => {
            if (row[skill].toLowerCase() === 'yes') {
              techSkills.push(skill);
            }
          });

          // Find the user by employeeId and update their techSkills
          await User.findOneAndUpdate(
            { employeeId },
            { techSkills }, // Set techSkills array
            { new: true, useFindAndModify: false }
          );
        }

        res.status(200).json({
          status: 'success',
          message: 'Tech skills imported successfully!',
        });
      } catch (err) {
        res.status(500).json({
          status: 'error',
          message: 'An error occurred while importing tech skills.',
          error: err.message,
        });
      }
    });
};


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
  updatePerformanceFromCSV,
  importTechSkillsFromCSV,
  deleteUserById,
  deleteMultipleUsersByIds,
  deleteAll,
};

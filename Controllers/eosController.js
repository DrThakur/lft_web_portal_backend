const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const User = require("../Models/userModel");
const Project = require("../Models/projectModel");
const Activity = require("../Models/activityModel");
const EOS = require("../Models/eosModel");

const createEos = async (req, res) => {
  try {
    const { employeeId, month, year, projects, activities } = req.body;

    console.log("employee jd", employeeId);

    // Fetch employee ObjectId
    const employee = await User.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Fetch project ObjectIds
    const updatedProjects = await Promise.all(
      projects.map(async (proj) => {
        const project = await Project.findOne({
          projectId: proj.projectId,
        }).exec();
        if (!project) {
          throw new Error(`Project with ID ${proj.projectId} not found.`);
        }
        return {
          project: project._id,
          occupancy: parseFloat(proj.occupancy), // Ensure occupancy is a number
        };
      })
    );

    // Fetch activity ObjectIds
    const updatedActivities = await Promise.all(
      activities.map(async (act) => {
        const activity = await Activity.findOne({
          activityId: act.activityId,
        }).exec();
        if (!activity) {
          throw new Error(`Activity with ID ${act.activityId} not found.`);
        }
        return {
          activity: activity._id,
          occupancy: parseFloat(act.occupancy), // Ensure occupancy is a number
        };
      })
    );

    // Create new EOS document
    const newEos = new EOS({
      employee: employee._id,
      month,
      year,
      projects: updatedProjects,
      activities: updatedActivities,
    });

    // Save the document to the database
    const savedEos = await newEos.save();
    res.status(201).json(savedEos);
  } catch (error) {
    console.error("Error in createEos function:", error);
    res.status(400).json({ message: error.message });
  }
};

const getAllEos = async (req, res) => {
  try {
    const totalEos = await EOS.countDocuments();
    const eosList = await EOS.find()
      .populate({
        path: "employee",
        model: "user",
        select: "employeeId fullName status department reportingManager", // Specify the fields to include
      })
      .populate({
        path: "projects.project",
        model: "project",
        select: "projectName projectManager", // Specify the fields to include
        populate: {
          path: "projectManager", // Populate the projectManager field in the project
          model: "user", // Reference the User model
          select: "employeeId designation fullName", // Select specific fields from the User schema
        },
      })
      .populate({
        path: "activities.activity",
        model: "Activity",
        select: "name", // Specify the fields to include
      });

    res.status(200).json({ success: true, totalEos, eosList });
  } catch (error) {
    console.error("Error in getAllEos function:", error);
    res.status(500).json({ message: error.message });
  }
};
const getEosById = async (req, res) => {
  try {
    const { id } = req.params;
    const eos = await EOS.findById(id)
      .populate({
        path: "employee",
        model: "user",
        select: "employeeId fullName status department reportingManager", // Specify the fields to include
      })
      .populate({
        path: "projects.project",
        model: "project",
        select: "projectName", // Specify the fields to include
      })
      .populate({
        path: "activities.activity",
        model: "Activity",
        select: "name", // Specify the fields to include
      });

    if (!eos) {
      return res.status(404).json({ message: "EOS not found" });
    }

    res.status(200).json(eos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEosByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const eosList = await EOS.find({ employee: userId })
      .populate({
        path: "employee",
        model: "user",
        select: "employeeId fullName status department reportingManager", // Specify the fields to include
      })
      .populate({
        path: "projects.project",
        model: "project",
        select: "projectName", // Specify the fields to include
      })
      .populate({
        path: "activities.activity",
        model: "Activity",
        select: "name", // Specify the fields to include
      });

    res.status(200).json(eosList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEosByMonthForAUser = async (req, res) => {
  try {
    const { userId, month, year } = req.params;
    const eos = await EOS.findOne({ employee: userId, month, year })
      .populate({
        path: "employee",
        model: "user",
        select: "employeeId fullName status department reportingManager", // Specify the fields to include
      })
      .populate({
        path: "projects.project",
        model: "project",
        select: "projectName", // Specify the fields to include
      })
      .populate({
        path: "activities.activity",
        model: "Activity",
        select: "name", // Specify the fields to include
      });

    if (!eos) {
      return res.status(404).json({ message: "EOS not found for this month" });
    }

    res.status(200).json(eos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEosByMonth = async (req, res) => {
  try {
    const { month, year } = req.params;
    const eosList = await EOS.find({ month, year })
      .populate({
        path: "employee",
        model: "user",
        select: "employeeId fullName status department reportingManager", // Specify the fields to include
      })
      .populate({
        path: "projects.project",
        model: "project",
        select: "projectName", // Specify the fields to include
      })
      .populate({
        path: "activities.activity",
        model: "Activity",
        select: "name", // Specify the fields to include
      });

    res.status(200).json(eosList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEosById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEos = await EOS.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("employee")
      .populate("activities.activity");

    if (!updatedEos) {
      return res.status(404).json({ message: "EOS not found" });
    }

    res.status(200).json(updatedEos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateEosByMonth = async (req, res) => {
  try {
    const { month, year } = req.params;
    const updatedEos = await EOS.updateMany({ month, year }, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("employee")
      .populate("activities.activity");

    res.status(200).json(updatedEos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateEosByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedEos = await EOS.updateMany({ employee: userId }, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("employee")
      .populate("activities.activity");

    res.status(200).json(updatedEos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAllEos = async (req, res) => {
  try {
    await EOS.deleteMany();
    res.status(200).json({ message: "All EOS records deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAllEosByMonth = async (req, res) => {
  try {
    const { month, year } = req.params;
    await EOS.deleteMany({ month, year });
    res
      .status(200)
      .json({ message: "All EOS records for the month deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEosById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEos = await EOS.findByIdAndDelete(id);

    if (!deletedEos) {
      return res.status(404).json({ message: "EOS not found" });
    }

    res.status(200).json({ message: "EOS deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEosByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    await EOS.deleteMany({ employee: userId });
    res
      .status(200)
      .json({ message: "All EOS records for the user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEosByMonthByUserId = async (req, res) => {
  try {
    const { userId, month, year } = req.params;

    await EOS.deleteMany({ employee: userId, month, year });
    res.status(200).json({
      message:
        "EOS records for the user in the specified month deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const importEosFromCsv = async (req, res) => {
  try {
    const results = [];
    // const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
    // const fieldMappings = {
    //   "EmpId": "employeeId",
    //   "Employee Full Name": "fullName",
    //   Email: "email",
    //   Password: "password",
    //   "Phone Number": "phoneNumber",
    //   Location: "location",
    //   Designation: "designation",
    //   "Reporting Manager": "reportingManager",
    //   Department: "department",
    //   "Date of Joining": "dateOfJoining",
    //   "Date of Birth": "dateOfBirth",
    //   Gender: "gender",
    //   "Marital Status": "maritalStatus",
    //   Religion: " religion",
    //   Status: "status",
    //   "Temproary Address": "temporaryAddress",
    //   "Permananet Address": "permanentAddress",
    //   "Total Industry Experience": "totalIndustryExp",
    //   "LFT Experience": "lftExp",
    //   Degree: "degree",
    //   Institute: "institute",
    //   Duration: "duration",
    // };
    // Read and parse the CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        // Trim each value in the row
        const trimmedData = {};
        for (const [key, value] of Object.entries(data)) {
          trimmedData[key.trim()] =
            typeof value === "string" ? value.trim() : value;
        }
        results.push(trimmedData);
      })
      .on("end", async () => {
        // Iterate over each row in the CSV file
        for (const row of results) {
          const { EmpId, Name, Status, Department, ReportingManager, ...rest } =
            row;
          console.log("my row", row);
          // Find the employee by EmpId
          const employee = await User.findOne({ employeeId: EmpId });
          if (!employee) {
            console.log(`Employee not found: ${EmpId}`);
            continue;
          }
          // Find the existing EOS document for this employee
          let eos = await EOS.findOne({ employee: employee._id });
          const projects = [];
          const activities = [];

          // Iterate over the rest of the columns (projects and activities)
          for (const [key, value] of Object.entries(rest)) {
            console.log("my key", key);
            console.log("my value", value);

            const occupancy = parseFloat(value);

            if (occupancy > 0) {
              // Try to find a project with the current key as its name
              const project = await Project.findOne({ projectName: key });
              console.log("my project to be pushed", project);
              if (project) {
                projects.push({ project: project._id, occupancy });

                // Update or add the project in the user's projects array
                const existingProjectIndex = employee.projects.findIndex(
                  (p) => p.project.toString() === project._id.toString()
                );

                if (existingProjectIndex > -1) {
                  // Update occupancy if the project already exists
                  employee.projects[existingProjectIndex].occupancy = occupancy;
                } else {
                  // Add the project if it doesn't exist
                  employee.projects.push({ project: project._id, occupancy });
                }
              } else {
                // Try to find an activity with the current key as its name
                const activity = await Activity.findOne({ name: key });
                console.log("my activity to be pushed", activity);
                if (activity) {
                  activities.push({ activity: activity._id, occupancy });

                  // Update or add the activity in the user's activities array
                  const existingActivityIndex = employee.activities.findIndex(
                    (a) => a.activity.toString() === activity._id.toString()
                  );

                  if (existingActivityIndex > -1) {
                    // Update occupancy if the activity already exists
                    employee.activities[existingActivityIndex].occupancy =
                      occupancy;
                  } else {
                    // Add the activity if it doesn't exist
                    employee.activities.push({
                      activity: activity._id,
                      occupancy,
                    });
                  }
                }
              }
            }
          }

          if (eos) {
            // If an EOS document exists, update the projects and activities arrays
            eos.projects = [...eos.projects, ...projects];
            eos.activities = [...eos.activities, ...activities];
            eos.status = Status;
            eos.department = Department;
            eos.reportingManager = ReportingManager;
          } else {
            // If no EOS document exists, create a new one
            eos = new EOS({
              employee: employee._id,
              status: Status,
              department: Department,
              reportingManager: ReportingManager,
              projects,
              activities,
            });
          }

          // Create a new EOS record
          // const eos = new EOS({
          //   employee: employee._id,
          //   status: Status,
          //   department: Department,
          //   reportingManager: ReportingManager,
          //   projects,
          //   activities,
          // });

          // Save the EOS record to the database
          await eos.save();


          // Save the updated employee document
          await employee.save();
        }

        // Remove the uploaded file after processing
        fs.unlinkSync(req.file.path);

        res.status(200).json({ message: "EOS data imported successfully" });
      });
  } catch (error) {
    console.error("Error importing EOS data:", error);
    res
      .status(500)
      .json({ message: "An error occurred while importing EOS data", error });
  }
};

module.exports = {
  createEos,
  getAllEos,
  getEosById,
  getEosByUserId,
  getEosByMonthForAUser,
  getAllEosByMonth,
  updateEosById,
  updateEosByMonth,
  updateEosByUserId,
  deleteAllEos,
  deleteAllEosByMonth,
  deleteEosById,
  deleteEosByUserId,
  deleteEosByMonthByUserId,
  importEosFromCsv,
};

const Project = require("../Models/projectModel");
const Team = require("../Models/teamModel");
const TeamMember = require("../Models/teamMemberModel");
const Milestone = require("../Models/milestoneModel");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const csvParser = require("csv-parser");
const User = require("../Models/userModel");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const { saveProjectDataToDatabase } = require("../Utils/importFile");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

// const createNewProject = async (req, res) => {
//   try {
//     console.log("my requet biody for oroject", req.body);
//     const { name, id, teams, milestones, ...otherProjectData } = req.body;

//     console.log("my teams for project", teams);
//     console.log("my milestones", milestones);

//     // Create and save team members, then teams
//     const savedTeams = [];
//     for (const team of teams) {
//       const savedTeamMembers = [];
//       for (const member of team.members) {
//         console.log("my mebers", member);
//         const newMember = new TeamMember({
//           user: member.user,
//           role: member.role,
//         });
//         const savedMember = await newMember.save();
//         savedTeamMembers.push(savedMember._id);
//       }

//       console.log("my saved memebers", savedTeamMembers)

//       const newTeam = new Team({
//         name: team.teamName,
//         members: savedTeamMembers,
//       });
//       console.log("my new team", newTeam);
//       const savedTeam = await newTeam.save();
//       console.log("my saved teams", savedTeam);
//       savedTeams.push(savedTeam);
//     }
//     console.log("my saved teanmssss", savedTeams);

//     // Create and save milestones
//     const savedMilestones = [];
//     for (const milestone of milestones) {
//       const newMilestone = new Milestone({
//         milestoneName: milestone.milestoneName,
//         plannedStartDate: milestone.plannedStartDate,
//         plannedEndDate: milestone.plannedEndDate,
//         actualStartDate: milestone.actualStartDate,
//         actualEndDate: milestone.actualEndDate,
//         invoiceValue: milestone.invoiceValue,
//         description: milestone.description,
//         status: milestone.status,
//         health: milestone.health,
//       });
//       const savedMilestone = await newMilestone.save();
//       savedMilestones.push(savedMilestone);
//     }

//     console.log("my milstones saved oines", savedMilestones);
//     // Create and save project
//     const newProject = new Project({
//       name,
//       projectId: id,
//       teams: savedTeams.map((team) => team._id),
//       milestones: savedMilestones.map((milestone) => milestone._id),
//       ...otherProjectData,
//     });

//     await newProject.save();
//     console.log("my new project that got created", newProject);
//     res.status(201).json(newProject);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

const createNewProject = async (req, res) => {
  try {
    console.log("Request body for project", req.body);
    const { projectName, projectId, teams, milestones, ...otherProjectData } =
      req.body;

    console.log("Teams for project", teams);
    console.log("Milestones", milestones);

    // Create and save team members directly within teams
    const savedTeams = [];
    for (const team of teams) {
      console.log("my team", team);
      const teamMembers = [];
      for (const member of team.members) {
        console.log("Members", member);
        const newMember = {
          user: member.user,
          role: member.role,
        };
        teamMembers.push(newMember);
      }

      console.log("teamMmeebr", teamMembers);
      console.log("team name", team.teamName);

      const newTeam = new Team({
        name: team.teamName,
        members: teamMembers,
      });
      const savedTeam = await newTeam.save();
      savedTeams.push(savedTeam);
    }

    console.log("Saved teams", savedTeams);

    // Create and save milestones
    const savedMilestones = [];
    for (const milestone of milestones) {
      const newMilestone = new Milestone({
        milestoneName: milestone.milestoneName,
        plannedStartDate: milestone.plannedStartDate,
        plannedEndDate: milestone.plannedEndDate,
        actualStartDate: milestone.actualStartDate,
        actualEndDate: milestone.actualEndDate,
        invoiceValue: milestone.invoiceValue,
        description: milestone.description,
        status: milestone.status,
        health: milestone.health,
      });
      const savedMilestone = await newMilestone.save();
      savedMilestones.push(savedMilestone);
    }

    console.log("Saved milestones", savedMilestones);

    console.log("my other project data", otherProjectData);

    console.log("saved Teams", savedTeams);
    console.log("saved Teams 0", savedTeams[0]);
    console.log("saved Teams 1", savedTeams[1]);

    // Create and save project
    const newProject = new Project({
      projectName,
      projectId,
      teams: savedTeams.map((team) => team._id),
      milestones: savedMilestones.map((milestone) => milestone._id),
      ...otherProjectData,
    });

    console.log("my new project...", newProject);

    await newProject.save();
    console.log("New project created", newProject);
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const importProjects = async (req, res) => {
  try {
    // Handle file upload
    upload(req, res, async (err) => {
      if (err) return res.status(500).json({ message: "File upload error" });

      if (!req.file)
        return res.status(400).json({ message: "No file provided" });

      // Parse the Excel file
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

      console.log("My workbook", workbook);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      //   console.log("my sheet name", sheet);
      const data = xlsx.utils.sheet_to_json(sheet);

      // Check if the sheet has any data
      if (data.length !== 0) {
        console.log("Sheet is empty, exiting function.");
        return res.status(400).json({ message: "Sheet is empty." });
      }

      // Process and save data
      for (const item of data) {
        const projectData = {
          projectId: item["Project Id"],
          projectName: item["Project Name As Per EOS form"],
          clientName: item["Customer Name"],
          projectDescription: item["Project Description"],
          projectManager: await findOrCreateUser(item["Project Manager"]),
          status: item["Project Status (Jul 2024)"],
          lastUpdatedStatus: new Date(item["Last Updated"]),
          // Add more fields as necessary
        };

        await Project.create(projectData);
      }

      res.status(200).json({ message: "Projects imported successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error importing projects" });
  }
};

const findOrCreateUser = async (name) => {
  // Implement user lookup or creation logic
  // For simplicity, let's assume you create a new user if not found
  // Adjust the path as needed
  let user = await User.findOne({ name });

  if (!user) {
    user = await User.create({ name });
  }

  return user._id;
};

const getAllProjects = asyncErrorHandler(async (req, res, next) => {
  try {
    const projects = await Project.find({}).populate({
        path: 'projectManager',
        model: 'user',
        select: 'fullName designation employeeId profileImageURL'
      });
    res.status(200).json({
      status: "Success",
      total: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
});

const deleteAll = asyncErrorHandler(async (req, res, next) => {
  console.log("If request reached or not", req);
  try {
    const result = await Project.deleteMany({});
    res.status(200).json({
      message: `All ${result.deletedCount} projects deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
});

const createProjectFromCSV = asyncErrorHandler(async (req, res, next) => {
  console.log("User Dtata recieved in file form", req);
  try {
    const jsonArray = [];
    // Map the CSV column headers to the Mongoose field names
    const fieldMappings = {
      "Customer Name": "clientName",
      "Project Name As Per EOS form": "projectName",
      "Project Id": "projectId",
      "Project Manager": "projectManager",
      "Project Status (Jul 2024)": "status",
      "Last Updated": "lastUpdatedStatus",
      "Project Description": "projectDescription",
      "Sales Manager (May 2024)": "smLeadName",
    };

    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on("data", (row) => {
        const mappedRow = {};
        for (const key in row) {
          if (fieldMappings[key]) {
            mappedRow[fieldMappings[key]] = row[key].trim();
          }
        }
        console.log("Mapped Row:", mappedRow);
        jsonArray.push(mappedRow);
      })
      .on("error", (error) => {
        console.error("Error while reading CSV file", error);
        next(error); // Properly handle the error
      })
      .on("end", async () => {
        try {
          for (const entry of jsonArray) {
            console.log("my entery: ", entry);
            // const processedRow = setRequiredFields(entry);
            // console.log("Processed Row:", processedRow);
            // await saveUserDataToDatabase(processedRow);
            // Find the project manager's ObjectId
            console.log("my project mnager name", entry.projectManager)
            const projectManagerName = entry.projectManager;
            const projectManager = await User.findOne({
              fullName: projectManagerName,
            });

            if (projectManager) {
              entry.projectManager = projectManager._id;
            } else {
              console.log(
                `Project Manager ${projectManagerName} not found in the User database.`
              );
              entry.projectManager = null; // or handle this case as needed
            }

            // Find the Sales Manager's ObjectId
            const smLeadName = entry.smLeadName;
            const smLead = await User.findOne({ fullName: smLeadName });

            if (smLead) {
              entry.smLeadId = smLead._id;
            } else {
              console.log(`Sales Manager ${smLeadName} not found in the User database.`);
              entry.smLeadId = null; // or handle this case as needed
            }


            await saveProjectDataToDatabase(entry);
          }
          res.json({ msg: "Added successfully to MongoDb" });
        } catch (processingError) {
          console.error(
            "Error while processing and saving data",
            processingError
          );
          next(processingError);
        } finally {
          // Ensure the temporary file is removed
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error("Error while deleting temporary file", err);
            }
          });
        }
      });
  } catch (error) {
    next(error);
  }
});


const updateProjectById = asyncErrorHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { teams, milestones, ...projectData } = req.body;

  try {
    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update project fields
    Object.assign(project, projectData);

    // Update teams if provided
    if (teams) {
      const updatedTeams = [];
      for (const team of teams) {
        const teamMembers = [];
        for (const member of team.members) {
          const newMember = {
            user: member.user,
            role: member.role,
          };
          teamMembers.push(newMember);
        }

        const existingTeam = await Team.findById(team._id);
        if (existingTeam) {
          existingTeam.name = team.teamName;
          existingTeam.members = teamMembers;
          const savedTeam = await existingTeam.save();
          updatedTeams.push(savedTeam);
        } else {
          const newTeam = new Team({
            name: team.teamName,
            members: teamMembers,
          });
          const savedTeam = await newTeam.save();
          updatedTeams.push(savedTeam);
        }
      }
      project.teams = updatedTeams.map((team) => team._id);
    }

    // Update milestones if provided
    if (milestones) {
      const updatedMilestones = [];
      for (const milestone of milestones) {
        const existingMilestone = await Milestone.findById(milestone._id);
        if (existingMilestone) {
          existingMilestone.milestoneName = milestone.milestoneName;
          existingMilestone.plannedStartDate = milestone.plannedStartDate;
          existingMilestone.plannedEndDate = milestone.plannedEndDate;
          existingMilestone.actualStartDate = milestone.actualStartDate;
          existingMilestone.actualEndDate = milestone.actualEndDate;
          existingMilestone.invoiceValue = milestone.invoiceValue;
          existingMilestone.description = milestone.description;
          existingMilestone.status = milestone.status;
          existingMilestone.health = milestone.health;
          const savedMilestone = await existingMilestone.save();
          updatedMilestones.push(savedMilestone);
        } else {
          const newMilestone = new Milestone({
            milestoneName: milestone.milestoneName,
            plannedStartDate: milestone.plannedStartDate,
            plannedEndDate: milestone.plannedEndDate,
            actualStartDate: milestone.actualStartDate,
            actualEndDate: milestone.actualEndDate,
            invoiceValue: milestone.invoiceValue,
            description: milestone.description,
            status: milestone.status,
            health: milestone.health,
          });
          const savedMilestone = await newMilestone.save();
          updatedMilestones.push(savedMilestone);
        }
      }
      project.milestones = updatedMilestones.map((milestone) => milestone._id);
    }

    // Save the updated project
    await project.save();
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = {
  createNewProject,
  importProjects,
  getAllProjects,
  deleteAll,
  createProjectFromCSV,
  updateProjectById
};

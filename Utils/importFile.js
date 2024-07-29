const User = require("../Models/userModel");
const Project = require("../Models/projectModel");

async function saveUserDataToDatabase(data) {
  console.log("Data Received: ", data);
  try {
    // Check if the document already exists based on the assetCode and serviceTag
    const existingUser = await User.findOne({
      email: data.email,
      employeeId: data.employeeId,
    });

    if (existingUser) {
      // If the document already exists, do not save it again.
      console.log(
        `User with email: ${data.email} and employee Id: ${data.employeeId} already exists. Skipping...`
      );
    } else {
      // If the document does not exist, create a new document
      const user = new User(data);
      await user.validate();
      await user.save();
      console.log("User Data saved successfully!");
    }
  } catch (error) {
    console.error("Error saving data:", error.message);
  }
}

async function saveProjectDataToDatabase(data) {
  console.log("Data Received: ", data);
  try {
    // Check if the document already exists based on the assetCode and serviceTag
    const existingProject = await Project.findOne({
      projectId: data.projectId,
    });

    if (existingProject) {
      // If the document already exists, do not save it again.
      console.log(
        `Project with email: ${data.projectId} already exists. Skipping...`
      );
    } else {
      // If the document does not exist, create a new document
      const project = new Project(data);
      await project.validate();
      await project.save();
      console.log("Project Data saved successfully!");
    }
  } catch (error) {
    console.error("Error saving data:", error.message);
  }
}

module.exports = { saveUserDataToDatabase, saveProjectDataToDatabase };

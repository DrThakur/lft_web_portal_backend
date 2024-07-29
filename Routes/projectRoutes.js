const express = require("express");
const router = express.Router();
const Project = require("../Models/projectModel");
const upload = require("../Utils/upload");
const {
  createNewProject,
  importProjects,
  getAllProjects,
  deleteAll,
  createProjectFromCSV,
} = require("../Controllers/projectController");

router.post("/", createNewProject);
router.get("/", getAllProjects);
router.delete("/", deleteAll);
router.post("/import-projects", upload, createProjectFromCSV);

module.exports = router;

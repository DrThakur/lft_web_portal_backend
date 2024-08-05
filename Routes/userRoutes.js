const express = require("express");
const router = express.Router();
const upload = require("../Utils/upload");
const User = require("../Models/userModel");


const {
  getUsers,
  getAllUsers,
  createNewUser,
  createNewUsersFromCSV,
  getUserById,
  getUserFromDesignation,
  getUserFromRole,
  updateUserById,
  deleteMultipleUsersByIds,
  deleteUserById,
  deleteAll,
} = require("../Controllers/userController");

// router.route("/")
// .get(getAllUsers)
// .post(createNewUser)

// router.route("/:id")
// .get(getUserById)
// .patch(updateUserById)
// .delete(deleteUserById)

// router.route("/delete-multiple")
// .delete(deleteMultipleUsersByIds)

// router.route('/importFile')
// .post(upload,createNewUsersFromCSV )

// router.delete("/deleteAll", deleteAll);

// Define routes with explicit HTTP methods for clarity
router.get("/", getUsers)
router.get("/all", getAllUsers);
router.post("/", createNewUser);


router.get("/:id", getUserById);
router.patch("/:id", updateUserById);


router.delete("/deleteAll", deleteAll);
router.delete("/delete-multiple", deleteMultipleUsersByIds);
router.delete("/:id", deleteUserById);

router.post("/importFile", upload, createNewUsersFromCSV);

// Ensure the deleteAll route is defined after other specific routes

module.exports = router;

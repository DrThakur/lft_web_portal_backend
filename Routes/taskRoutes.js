const express = require('express');
const router = express.Router();
const {
    createTask,
    getAllTasksByMilestoneId,
    getTaskById,
    updateTaskById,
    updateTaskByIdAndMilestoneId,
    deleteAllTasks,
    deleteAllTasksByMilestoneId,
    deleteTaskById,
    getTasksByOwner,
    getTasksByTeam,
    updateTaskByIdAndOwner,
    updateTaskByIdAndTeam,
    deleteTasksByOwner,
    deleteTasksByTeam
} = require('../Controllers/taskController');

// CRUD routes
router.post('/', createTask);
router.get('/milestone/:milestoneId', getAllTasksByMilestoneId);
router.get('/:id', getTaskById);
router.get('/owner/:ownerId', getTasksByOwner);
router.get('/team/:teamId', getTasksByTeam);
router.put('/:id', updateTaskById);
router.put('/:id/milestone/:milestoneId', updateTaskByIdAndMilestoneId);
router.put('/:id/owner/:ownerId', updateTaskByIdAndOwner);
router.put('/:id/team/:teamId', updateTaskByIdAndTeam)
router.delete('/', deleteAllTasks);
router.delete('/milestone/:milestoneId', deleteAllTasksByMilestoneId);
router.delete('/:id', deleteTaskById);
router.delete('/owner/:ownerId', deleteTasksByOwner);
router.delete('/team/:teamId',   deleteTasksByTeam);

module.exports = router;

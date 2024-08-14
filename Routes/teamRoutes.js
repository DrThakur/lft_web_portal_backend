const express = require('express');
const router = express.Router();
const {
    createTeam,
    getAllTeamsByProjectId,
    getTeamById,
    updateTeamById,
    updateTeamByIdAndProjectId,
    deleteAllTeams,
    deleteAllTeamsByProjectId,
    deleteTeamById,
} = require('../Controllers/teamController');

// CRUD routes
router.post('/', createTeam);
router.get('/project/:projectId', getAllTeamsByProjectId);
router.get('/:id', getTeamById);
router.put('/:id', updateTeamById);
router.put('/:id/project/:projectId', updateTeamByIdAndProjectId);
router.delete('/', deleteAllTeams);
router.delete('/project/:projectId', deleteAllTeamsByProjectId);
router.delete('/:id', deleteTeamById);

module.exports = router;

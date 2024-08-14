const express = require('express');
const router = express.Router();
const {
    createMilestone,
    getAllMilestonesByProjectId,
    getMilestoneById,
    updateMilestoneById,
    updateMilestoneByIdAndProjectId,
    deleteAllMilestones,
    deleteAllMilestonesByProjectId,
    deleteMilestoneById,
} = require('../Controllers/milestoneController');

// CRUD routes
router.post('/', createMilestone);
router.get('/project/:projectId', getAllMilestonesByProjectId);
router.get('/:id', getMilestoneById);
router.put('/:id', updateMilestoneById);
router.put('/:id/project/:projectId', updateMilestoneByIdAndProjectId);
router.delete('/', deleteAllMilestones);
router.delete('/project/:projectId', deleteAllMilestonesByProjectId);
router.delete('/:id', deleteMilestoneById);

module.exports = router;

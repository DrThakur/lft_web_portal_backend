const express = require('express');
const router = express.Router();
const {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivityById,
  deleteAllActivities,
  deleteActivityById
} = require('../Controllers/activityController'); // Adjust the path as necessary

router.post('/', createActivity);
router.get('/', getAllActivities);
router.get('/:id', getActivityById);
router.patch('/:id', updateActivityById);
router.delete('/', deleteAllActivities);
router.delete('/:id', deleteActivityById);

module.exports = router;

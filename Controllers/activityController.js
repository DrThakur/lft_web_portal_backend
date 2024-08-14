const Activity = require("../Models/activityModel");


const createActivity = async (req, res) => {
    try {
      const { activityId, name, description } = req.body;
  
      const newActivity = new Activity({
        activityId,
        name,
        description
      });
  
      const savedActivity = await newActivity.save();
      res.status(201).json(savedActivity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

  const getAllActivities = async (req, res) => {
    try {
      const activities = await Activity.find();
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  const getActivityById = async (req, res) => {
    try {
      const { id } = req.params;
      const activity = await Activity.findById(id);
  
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
  
      res.status(200).json(activity);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  const updateActivityById = async (req, res) => {
    try {
      const { id } = req.params;
      const { activityId, name, description } = req.body;
  
      const updatedActivity = await Activity.findByIdAndUpdate(
        id,
        { activityId, name, description },
        { new: true, runValidators: true }
      );
  
      if (!updatedActivity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
  
      res.status(200).json(updatedActivity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

  const deleteAllActivities = async (req, res) => {
    try {
      await Activity.deleteMany();
      res.status(200).json({ message: 'All activities deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  const deleteActivityById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedActivity = await Activity.findByIdAndDelete(id);
  
      if (!deletedActivity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
  
      res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  module.exports = {
    createActivity,
    getAllActivities,
    getActivityById,
    updateActivityById,
    deleteAllActivities,
    deleteActivityById
  };
  
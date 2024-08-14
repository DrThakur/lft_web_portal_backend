const Milestone = require("../Models/milestoneModel");
const createMilestone = async (req, res) => {
    try {
        const milestone = new Milestone(req.body);
        const savedMilestone = await milestone.save();
        res.status(201).json(savedMilestone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllMilestonesByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;
        const milestones = await Milestone.find({ projectId });
        res.status(200).json(milestones);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getMilestoneById = async (req, res) => {
    try {
        const { id } = req.params;
        const milestone = await Milestone.findById(id).populate('tasks');
        if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
        res.status(200).json(milestone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateMilestoneById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMilestone = await Milestone.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMilestone) return res.status(404).json({ message: 'Milestone not found' });
        res.status(200).json(updatedMilestone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateMilestoneByIdAndProjectId = async (req, res) => {
    try {
        const { id, projectId } = req.params;
        const updatedMilestone = await Milestone.findOneAndUpdate(
            { _id: id, projectId },
            req.body,
            { new: true }
        );
        if (!updatedMilestone) return res.status(404).json({ message: 'Milestone not found for this project' });
        res.status(200).json(updatedMilestone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAllMilestones = async (req, res) => {
    try {
        await Milestone.deleteMany({});
        res.status(200).json({ message: 'All milestones deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAllMilestonesByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;
        await Milestone.deleteMany({ projectId });
        res.status(200).json({ message: 'All milestones for this project deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteMilestoneById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMilestone = await Milestone.findByIdAndDelete(id);
        if (!deletedMilestone) return res.status(404).json({ message: 'Milestone not found' });
        res.status(200).json({ message: 'Milestone deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = {
    createMilestone,
    getAllMilestonesByProjectId,
    getMilestoneById,
    updateMilestoneById,
    updateMilestoneByIdAndProjectId,
    deleteAllMilestones,
    deleteAllMilestonesByProjectId,
    deleteMilestoneById,
};

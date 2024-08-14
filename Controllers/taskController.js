const Task = require('../Models/taskModel');

const createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllTasksByMilestoneId = async (req, res) => {
    try {
        const { milestoneId } = req.params;
        const tasks = await Task.find({ milestoneId }).populate('owner').populate('dependency');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTasksByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const tasks = await Task.find({ owner: ownerId }).populate('team').populate('dependency').populate('milestoneId');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTasksByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const tasks = await Task.find({ team: teamId }).populate('owner').populate('dependency').populate('milestoneId');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id).populate('owner').populate('dependency');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true })
            .populate('owner')
            .populate('dependency');
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTaskByIdAndOwner = async (req, res) => {
    try {
        const { id, ownerId } = req.params;
        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, owner: ownerId },
            req.body,
            { new: true }
        ).populate('owner').populate('team').populate('dependency').populate('milestoneId');
        if (!updatedTask) return res.status(404).json({ message: 'Task not found for this owner' });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const updateTaskByIdAndTeam = async (req, res) => {
    try {
        const { id, teamId } = req.params;
        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, team: teamId },
            req.body,
            { new: true }
        ).populate('owner').populate('team').populate('dependency').populate('milestoneId');
        if (!updatedTask) return res.status(404).json({ message: 'Task not found for this team' });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



const updateTaskByIdAndMilestoneId = async (req, res) => {
    try {
        const { id, milestoneId } = req.params;
        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, milestoneId },
            req.body,
            { new: true }
        ).populate('owner').populate('dependency');
        if (!updatedTask) return res.status(404).json({ message: 'Task not found for this milestone' });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAllTasks = async (req, res) => {
    try {
        await Task.deleteMany({});
        res.status(200).json({ message: 'All tasks deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAllTasksByMilestoneId = async (req, res) => {
    try {
        const { milestoneId } = req.params;
        await Task.deleteMany({ milestoneId });
        res.status(200).json({ message: 'All tasks for this milestone deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const deleteTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTasksByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;
        await Task.deleteMany({ owner: ownerId });
        res.status(200).json({ message: 'All tasks for this owner deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTasksByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        await Task.deleteMany({ team: teamId });
        res.status(200).json({ message: 'All tasks for this team deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



module.exports = {
    createTask,
    getAllTasksByMilestoneId,
    getTaskById,
    getTasksByOwner,
    getTasksByTeam,
    updateTaskById,
    updateTaskByIdAndOwner,
    updateTaskByIdAndTeam,
    updateTaskByIdAndMilestoneId,
    deleteAllTasks,
    deleteAllTasksByMilestoneId,
    deleteTaskById,
    deleteTasksByOwner,
    deleteTasksByTeam
};

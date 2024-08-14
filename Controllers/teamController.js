const Team = require("../Models/teamModel");

const createTeam = async (req, res) => {
    try {
        const team = new Team(req.body);
        const savedTeam = await team.save();
        res.status(201).json(savedTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllTeamsByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;
        const teams = await Team.find({ projectId }).populate('members.user');
        res.status(200).json(teams);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findById(id).populate('members.user');
        if (!team) return res.status(404).json({ message: 'Team not found' });
        res.status(200).json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const updateTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTeam = await Team.findByIdAndUpdate(id, req.body, { new: true }).populate('members.user');
        if (!updatedTeam) return res.status(404).json({ message: 'Team not found' });
        res.status(200).json(updatedTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const updateTeamByIdAndProjectId = async (req, res) => {
    try {
        const { id, projectId } = req.params;
        const updatedTeam = await Team.findOneAndUpdate(
            { _id: id, projectId },
            req.body,
            { new: true }
        ).populate('members.user');
        if (!updatedTeam) return res.status(404).json({ message: 'Team not found for this project' });
        res.status(200).json(updatedTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAllTeams = async (req, res) => {
    try {
        await Team.deleteMany({});
        res.status(200).json({ message: 'All teams deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAllTeamsByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;
        await Team.deleteMany({ projectId });
        res.status(200).json({ message: 'All teams for this project deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTeam = await Team.findByIdAndDelete(id);
        if (!deletedTeam) return res.status(404).json({ message: 'Team not found' });
        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createTeam,
    getAllTeamsByProjectId,
    getTeamById,
    updateTeamById,
    updateTeamByIdAndProjectId,
    deleteAllTeams,
    deleteAllTeamsByProjectId,
    deleteTeamById,
};

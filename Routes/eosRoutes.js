const express = require('express');
const router = express.Router();
const {
  createEos,
  getAllEos,
  getEosById,
  getEosByUserId,
  getEosByMonthForAUser,
  getAllEosByMonth,
  updateEosById,
  updateEosByMonth,
  updateEosByUserId,
  deleteAllEos,
  deleteAllEosByMonth,
  deleteEosById,
  deleteEosByUserId,
  deleteEosByMonthByUserId,
importEosFromCsv
} = require('../Controllers/eosController'); // Adjust the path as necessary
const upload = require("../Utils/upload");

router.post('/', createEos);
router.get('/', getAllEos);
router.get('/:id', getEosById);
router.get('/user/:userId', getEosByUserId);
router.get('/user/:userId/:month/:year', getEosByMonthForAUser);
router.get('/month/:month/:year', getAllEosByMonth);
router.put('/:id', updateEosById);
router.put('/month/:month/:year', updateEosByMonth);
router.put('/user/:userId', updateEosByUserId);
router.delete('/', deleteAllEos);
router.delete('/month/:month/:year', deleteAllEosByMonth);
router.delete('/:id', deleteEosById);
router.delete('/user/:userId', deleteEosByUserId);
router.delete('/:userId/:month/:year', deleteEosByMonthByUserId);
router.post('/import', upload, importEosFromCsv);

module.exports = router;

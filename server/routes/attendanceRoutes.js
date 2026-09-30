const express = require('express');
const { checkIn } = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/', checkIn);

module.exports = router;
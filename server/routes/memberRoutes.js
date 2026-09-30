const express = require('express');
const {
  createMember,
  deleteMember,
  getMember,
  listExpiringMembers,
  listMembers,
  renewMember,
  updateMember,
} = require('../controllers/memberController');
const { listAttendance } = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/', createMember);
router.get('/', listMembers);
router.get('/expiring', listExpiringMembers);
router.post('/:id/renew', renewMember);
router.get('/:id/attendance', listAttendance);
router.get('/:id', getMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

module.exports = router;
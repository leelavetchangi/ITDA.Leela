const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const Member = require('../models/Member');

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function isExpired(expiryDate) {
  return new Date(expiryDate) < startOfToday();
}

async function checkIn(req, res) {
  const { memberId } = req.body;

  if (!mongoose.isValidObjectId(memberId)) {
    return res.status(400).json({ message: 'A valid memberId is required' });
  }

  const member = await Member.findOne({
    _id: memberId,
    createdBy: req.user.id,
  });

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  if (isExpired(member.expiryDate)) {
    return res.status(400).json({ message: 'Cannot check in an expired member' });
  }

  const attendance = await Attendance.create({
    memberId: member.id,
    createdBy: req.user.id,
  });

  await attendance.populate('memberId', 'name phone email');
  return res.status(201).json(attendance);
}

async function listAttendance(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Member not found' });
  }

  const member = await Member.exists({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  const requestedPage = Number.parseInt(req.query.page, 10);
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 100)
    : 10;
  const filter = {
    memberId: req.params.id,
    createdBy: req.user.id,
  };
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Attendance.find(filter).sort({ checkInTime: -1 }).skip(skip).limit(limit),
    Attendance.countDocuments(filter),
  ]);

  return res.json({
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

module.exports = { checkIn, listAttendance };
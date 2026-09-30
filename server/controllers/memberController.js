const mongoose = require('mongoose');
const Member = require('../models/Member');
const Plan = require('../models/Plan');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getStatus(expiryDate) {
  return new Date(expiryDate) >= startOfToday() ? 'active' : 'expired';
}

function parseJoinDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const joinDate = new Date(`${value}T00:00:00`);
  return Number.isNaN(joinDate.getTime()) ? null : joinDate;
}

function calculateExpiryDate(joinDate, durationInDays) {
  const expiryDate = new Date(joinDate);
  expiryDate.setDate(expiryDate.getDate() + durationInDays);
  return expiryDate;
}

function validateMemberInput({ name, phone, email, planId, joinDate }) {
  if (typeof name !== 'string' || !name.trim()) {
    return 'Name is required';
  }

  if (typeof phone !== 'string' || !phone.trim()) {
    return 'Phone is required';
  }

  if (typeof email !== 'string' || !emailPattern.test(email.trim())) {
    return 'A valid email is required';
  }

  if (!mongoose.isValidObjectId(planId)) {
    return 'A valid planId is required';
  }

  if (!parseJoinDate(joinDate)) {
    return 'joinDate must be a valid date in YYYY-MM-DD format';
  }

  return null;
}

function validateOptionalMemberInput(input) {
  if (input.age !== undefined && (!Number.isInteger(Number(input.age)) || Number(input.age) < 13 || Number(input.age) > 120)) {
    return 'Age must be a whole number between 13 and 120';
  }

  for (const field of ['address', 'gender', 'fitnessGoal', 'workoutPlan']) {
    if (input[field] !== undefined && typeof input[field] !== 'string') {
      return `${field} must be text`;
    }
  }

  if (input.paymentMethod !== undefined && !['UPI', 'CARD', 'NET BANKING'].includes(input.paymentMethod)) {
    return 'Payment method must be UPI, CARD, or NET BANKING';
  }

  return null;
}

async function getPlanForMember(planId) {
  return Plan.findById(planId);
}

function serializeMember(member) {
  member.status = getStatus(member.expiryDate);
  return member;
}

async function createMember(req, res) {
  const validationError = validateMemberInput(req.body) || validateOptionalMemberInput(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const plan = await getPlanForMember(req.body.planId);

  if (!plan) {
    return res.status(400).json({ message: 'Selected plan was not found' });
  }

  const joinDate = parseJoinDate(req.body.joinDate);
  const expiryDate = calculateExpiryDate(joinDate, plan.durationInDays);
  const member = await Member.create({
    name: req.body.name.trim(),
    phone: req.body.phone.trim(),
    email: req.body.email.trim().toLowerCase(),
    address: req.body.address?.trim(),
    age: req.body.age === undefined ? undefined : Number(req.body.age),
    gender: req.body.gender?.trim(),
    fitnessGoal: req.body.fitnessGoal?.trim(),
    workoutPlan: req.body.workoutPlan?.trim(),
    paymentMethod: req.body.paymentMethod,
    planId: plan.id,
    joinDate,
    expiryDate,
    status: getStatus(expiryDate),
    createdBy: req.user.id,
  });

  await member.populate('planId', 'name durationInDays price');
  return res.status(201).json(serializeMember(member));
}

async function listMembers(req, res) {
  const requestedPage = Number.parseInt(req.query.page, 10);
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 100)
    : 10;
  const skip = (page - 1) * limit;
  const filter = { createdBy: req.user.id };

  const [members, total] = await Promise.all([
    Member.find(filter)
      .populate('planId', 'name durationInDays price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Member.countDocuments(filter),
  ]);

  return res.json({
    data: members.map(serializeMember),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

async function renewMember(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Member not found' });
  }

  const member = await Member.findOne({
    _id: req.params.id,
    createdBy: req.user.id,
  }).populate('planId', 'name durationInDays price');

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  const renewalStart = new Date(Math.max(startOfToday().getTime(), member.expiryDate.getTime()));
  const expiryDate = calculateExpiryDate(renewalStart, member.planId.durationInDays);
  member.expiryDate = expiryDate;
  member.status = 'active';
  await member.save();

  return res.json(serializeMember(member));
}

async function listExpiringMembers(req, res) {
  const requestedDays = Number.parseInt(req.query.days, 10);
  const days = Number.isInteger(requestedDays) && requestedDays > 0 ? requestedDays : 7;
  const from = startOfToday();
  const until = calculateExpiryDate(from, days);
  const members = await Member.find({
    createdBy: req.user.id,
    expiryDate: { $gte: from, $lte: until },
  })
    .populate('planId', 'name durationInDays price')
    .sort({ expiryDate: 1 });

  return res.json({
    data: members.map(serializeMember),
    days,
  });
}

async function getMember(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Member not found' });
  }

  const member = await Member.findOne({
    _id: req.params.id,
    createdBy: req.user.id,
  }).populate('planId', 'name durationInDays price');

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  return res.json(serializeMember(member));
}

async function updateMember(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Member not found' });
  }

  const validationError = validateMemberInput(req.body) || validateOptionalMemberInput(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const plan = await getPlanForMember(req.body.planId);

  if (!plan) {
    return res.status(400).json({ message: 'Selected plan was not found' });
  }

  const joinDate = parseJoinDate(req.body.joinDate);
  const expiryDate = calculateExpiryDate(joinDate, plan.durationInDays);
  const update = {
    name: req.body.name.trim(),
    phone: req.body.phone.trim(),
    email: req.body.email.trim().toLowerCase(),
    planId: plan.id,
    joinDate,
    expiryDate,
    status: getStatus(expiryDate),
  };
  for (const field of ['address', 'age', 'gender', 'fitnessGoal', 'workoutPlan', 'paymentMethod']) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      update[field] = field === 'age' ? Number(req.body[field]) : req.body[field];
    }
  }
  const member = await Member.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user.id },
    update,
    { returnDocument: 'after', runValidators: true }
  ).populate('planId', 'name durationInDays price');

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  return res.json(serializeMember(member));
}

async function deleteMember(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Member not found' });
  }

  const member = await Member.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  return res.json({ message: 'Member deleted successfully' });
}

module.exports = {
  createMember,
  listMembers,
  renewMember,
  listExpiringMembers,
  getMember,
  updateMember,
  deleteMember,
};
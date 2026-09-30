const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

userSchema.set('toJSON', {
  transform: (_document, returnedUser) => {
    delete returnedUser.password;
    delete returnedUser.__v;
    return returnedUser;
  },
});

module.exports = mongoose.model('User', userSchema);
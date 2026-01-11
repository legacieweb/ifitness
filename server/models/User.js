const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  height: {
    type: Number,
  },
  goal: {
    type: String,
    enum: ['weight loss', 'muscle gain', 'maintain fitness', 'improve endurance'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  suspended: {
    type: Boolean,
    default: false,
  },
  suspendedReason: {
    type: String,
    default: null,
  },
  suspendedAt: {
    type: Date,
    default: null,
  },
  profilePictureData: {
    type: Buffer,
    default: null,
  },
  profilePictureContentType: {
    type: String,
    default: null,
  },
  weeklyRoutine: [
    {
      day: { type: String, required: true },
      workout: { type: String, default: '' },
      completed: { type: Boolean, default: false },
      exercises: [
        {
          name: { type: String },
          sets: { type: Number },
          reps: { type: Number },
        }
      ]
    }
  ],
  goals: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      title: { type: String, required: true },
      target: { type: Number, required: true },
      current: { type: Number, default: 0 },
      unit: { type: String, default: 'times' },
      deadline: { type: Date },
      completed: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  achievements: [
    {
      type: { type: String },
      name: { type: String },
      description: { type: String },
      icon: { type: String },
      earnedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (passwordInput) {
  return await bcrypt.compare(passwordInput, this.password);
};

module.exports = mongoose.model('User', UserSchema);

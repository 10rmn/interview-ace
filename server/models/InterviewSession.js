const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    userAnswer: {
      type: String,
      default: '',
    },
    aiFeedback: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    clarity: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    technicalAccuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    confidence: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['Frontend', 'Backend', 'DSA', 'HR'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
    },
    status: {
      type: String,
      default: 'in-progress',
      enum: ['in-progress', 'completed'],
    },
    questions: [answerSchema],
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    averageClarity: {
      type: Number,
      default: 0,
    },
    averageTechnicalAccuracy: {
      type: Number,
      default: 0,
    },
    averageConfidence: {
      type: Number,
      default: 0,
    },
    resumeUrl: {
      type: String,
      default: null,
    },
    isResumeBased: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate average scores before saving
interviewSessionSchema.pre('save', function () {
  if (this.questions.length > 0) {
    const total = this.questions.reduce((sum, q) => sum + (q.score || 0), 0);
    this.totalScore = Math.round(total / this.questions.length);

    const claritySum = this.questions.reduce((sum, q) => sum + (q.clarity || 0), 0);
    this.averageClarity = Math.round(claritySum / this.questions.length);

    const accuracySum = this.questions.reduce(
      (sum, q) => sum + (q.technicalAccuracy || 0),
      0
    );
    this.averageTechnicalAccuracy = Math.round(
      accuracySum / this.questions.length
    );

    const confidenceSum = this.questions.reduce(
      (sum, q) => sum + (q.confidence || 0),
      0
    );
    this.averageConfidence = Math.round(confidenceSum / this.questions.length);
  }
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);

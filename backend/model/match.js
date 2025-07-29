const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const matchSchema = new Schema({
  participants: [
    {
      user: { type: Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
      email: { type: String, required: true },
      wpm: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
      totalTyped: { type: Number, default: 0 },
      status: { type: String, enum: ['notStarted', 'ready', 'playing', 'finished'], default: 'notStarted' },
      isReady: { type: Boolean, default: false },
      isHost: { type: Boolean, default: false },
      joinedAt: { type: Date, default: Date.now }
    },
  ],
  viewers: [
    {
      user: { type: Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
      email: { type: String, required: true },
      joinedAt: { type: Date, default: Date.now }
    }
  ],
  admin: { type: Types.ObjectId, ref: 'User', required: true },
  mode: { 
    type: String, 
    enum: ['multiplayer', 'tournament'], 
    required: true,
    default: 'multiplayer'
  },
  timeLimit: { type: Number, required: true, default: 60 },
  playerLimit: { type: Number, required: true, default: 4 },
  difficulty: { 
    type: String, 
    enum: ['easy', 'normal', 'hard'], 
    required: true,
    default: 'normal'
  },
  isPrivate: { type: Boolean, default: false },
  allowSpectators: { type: Boolean, default: true },
  allowNewPlayers: { type: Boolean, default: true },
  wordList: { type: String, required: true },
  isStarted: { type: Boolean, default: false },
  startedAt: { type: Date },
  endedAt: { type: Date },
  winnerId: { type: Types.ObjectId, ref: 'User' },
  winner: {
    username: { type: String },
    wpm: { type: Number },
    accuracy: { type: Number }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for participant count
matchSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Virtual for viewer count
matchSchema.virtual('viewerCount').get(function() {
  return this.viewers.length;
});

// Virtual for room status
matchSchema.virtual('roomStatus').get(function() {
  if (this.isStarted) return 'playing';
  if (this.participantCount >= this.playerLimit) return 'full';
  return 'waiting';
});

// Virtual to check if user is admin
matchSchema.methods.isAdmin = function(userId) {
  return this.admin.toString() === userId.toString();
};

// Virtual to check if user is participant
matchSchema.methods.isParticipant = function(userId) {
  return this.participants.some(p => p.user.toString() === userId.toString());
};

// Virtual to check if user is viewer
matchSchema.methods.isViewer = function(userId) {
  return this.viewers.some(v => v.user.toString() === userId.toString());
};

const Match = mongoose.models.Match || mongoose.model('Match', matchSchema);
module.exports = Match; 
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const matchSchema = new Schema({
  participants: [
    {
      user: { type: Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
      wpm: { type: Number },
      accuracy: { type: Number },
      errors: { type: Number },
      totalTyped: { type: Number },
    },
  ],
  mode: { type: String, enum: ['solo', 'multiplayer'], required: true },
  timeLimit: { type: Number, required: true },
  wordList: [{ type: String, required: true }],
  startedAt: { type: Date },
  endedAt: { type: Date },
  winnerId: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Match = mongoose.models.Match || mongoose.model('Match', matchSchema);
module.exports = Match; 
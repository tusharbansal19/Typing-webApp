const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

// Match Schema
const matchSchema = new Schema({
  participants: [
    {
      user: { type: Types.ObjectId, ref: "User", required: true },
      username: { type: String, required: true },
      wpm: { type: Number, required: true },
      accuracy: { type: Number, required: true },
      errors: { type: Number, required: true },
      totalTyped: { type: Number, required: true },
    },
  ],
  mode: { type: String, enum: ["solo", "multiplayer"], required: true },
  timeLimit: { type: Number, required: true },
  wordList: [{ type: String, required: true }],
  startedAt: { type: Date },
  endedAt: { type: Date },
  winnerId: { type: Types.ObjectId, ref: "User" },
}, { timestamps: true });

// User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  googleId: { type: String }, // optional
  avatarUrl: { type: String },
  matches: [{ type: Types.ObjectId, ref: "Match" }],
  personalBest: {
    wpm: { type: Number },
    accuracy: { type: Number },
  },
}, { timestamps: true });

const User = model("User", userSchema);
const Match = model("Match", matchSchema);

module.exports = { User, Match };
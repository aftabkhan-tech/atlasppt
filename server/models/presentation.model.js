import mongoose from "mongoose";

const presentationSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    originalName: { type: String, required: true, trim: true },
    storedName: { type: String, required: true, unique: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    renderedName: { type: String },
    slideCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Presentation", presentationSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;

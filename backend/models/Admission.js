import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    selectedClass: { type: String, default: "" },
    course: { type: String, default: "" },
    dob: { type: String, default: "" },
    parentName: { type: String, default: "" },
    contact: { type: String, default: "" },
    address: { type: String, default: "" },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Admission", admissionSchema);

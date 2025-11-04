import React, { useState } from "react";
import Swal from "sweetalert2";
import { useAdmissionAPI } from "../api/admission"; // ✅ Hook that uses Clerk token

export default function Admissions() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: "",
  });

  const { submitAdmission } = useAdmissionAPI(); // ✅ Uses Clerk token automatically

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ Prevents page refresh

    try {
      const response = await submitAdmission(formData);
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Your admission form was submitted successfully 🎉",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });

        // ✅ Reset form fields after submit
        setFormData({
          name: "",
          email: "",
          phone: "",
          course: "",
          message: "",
        });
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while submitting your form.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10 px-5">
      <h1 className="text-3xl font-bold text-sky-700 mb-8">
        Admission Form
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Course */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Course Interested In
          </label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Message */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Message (Optional)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

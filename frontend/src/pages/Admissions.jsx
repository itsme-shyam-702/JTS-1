import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import admissionAPI from "../api/admission";

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const STEPS = ["Personal Info", "Course Details", "Review & Submit"];

export default function Admissions() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formRef, formInView] = useInView(0.1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step === 0 && (!formData.name || !formData.email || !formData.phone)) {
      Swal.fire({ icon: "warning", title: "Missing Fields", text: "Please fill all required fields.", confirmButtonColor: "#3085d6" });
      return;
    }
    if (step === 1 && !formData.course) {
      Swal.fire({ icon: "warning", title: "Missing Fields", text: "Please enter the course you're interested in.", confirmButtonColor: "#3085d6" });
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await admissionAPI.submitAdmission(formData);
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Application Submitted! 🎉",
          text: "We'll review your application and contact you soon.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        setFormData({ name: "", email: "", phone: "", course: "", message: "" });
        setStep(0);
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      Swal.fire({ title: "Error", text: "Something went wrong. Please try again.", icon: "error", confirmButtonColor: "#d33" });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = "w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-700";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-20 px-4 text-center text-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow">Admission Form</h1>
        <p className="text-blue-100 text-lg max-w-lg mx-auto">
          Join Govt. Junior Technical School Kadri — apply for the current academic year.
        </p>
      </div>

      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-lg mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-10 relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-blue-600 z-0 transition-all duration-500"
              style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
            />
            {STEPS.map((label, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  i < step ? "bg-green-500 text-white" : i === step ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-gray-200 text-gray-500"
                }`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs mt-1.5 font-medium ${i === step ? "text-blue-600" : "text-gray-400"}`}>{label}</span>
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div
            ref={formRef}
            className={`bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition-all duration-700 ${formInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-800 mb-5">Personal Information</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" className={fieldClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className={fieldClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" className={fieldClass} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-800 mb-5">Course Details</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade / Course Interested In *</label>
                  <input type="text" name="course" value={formData.course} onChange={handleChange} required placeholder="e.g. Grade 8, Technical Drawing" className={fieldClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message / Additional Info (Optional)</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Any questions or additional information..." className={fieldClass} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-5">Review Your Application</h2>
                <div className="space-y-3 mb-6">
                  {[
                    ["Full Name", formData.name],
                    ["Email", formData.email],
                    ["Phone", formData.phone],
                    ["Course", formData.course],
                    ["Message", formData.message || "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-sm font-semibold text-gray-500 w-24 shrink-0">{label}</span>
                      <span className="text-sm text-gray-800 flex-1">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mb-4">Please verify the details above before submitting.</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={`flex mt-8 ${step > 0 ? "justify-between" : "justify-end"}`}>
              {step > 0 && (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                  ← Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button type="button" onClick={nextStep} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow">
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`px-8 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all hover:scale-105 shadow ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {submitting ? "Submitting..." : "Submit Application ✓"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

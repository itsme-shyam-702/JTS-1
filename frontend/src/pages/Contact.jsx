import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import api from "../api/contact";

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

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [formRef, formInView] = useInView(0.1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.sendMessage(formData);
      Swal.fire({
        title: "Message Sent! ✅",
        text: "Thank you for reaching out! We'll get back to you soon.",
        icon: "success",
        showConfirmButton: false,
        timer: 2500,
        background: "#f0f9ff",
        color: "#1e3a8a",
        position: "center",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Oops!",
        text: "Failed to send your message. Please try again later.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    { icon: "📍", label: "Address", value: "Bondel Rd, Kadri Hills, Kadri, Mangaluru, Karnataka 575016" },
    { icon: "📞", label: "Phone", value: "+91 98765 43210" },
    { icon: "✉️", label: "Email", value: "info@jrschool.edu.in" },
    { icon: "🕐", label: "Hours", value: "Mon–Sat: 8:00 AM – 4:00 PM" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-700 py-20 px-4 text-center text-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Get In Touch</h1>
        <p className="text-blue-100 text-lg max-w-lg mx-auto">
          Reach out for admissions, queries, or to schedule a campus visit. We'd love to hear from you!
        </p>
      </div>

      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
            <div className="space-y-4 mb-8">
              {contactInfo.map(({ icon, label, value }) => (
                <div key={label} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-2xl shrink-0">{icon}</div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</div>
                    <div className="text-gray-700 text-sm mt-0.5">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-64">
              <iframe
                title="Jr Technical School Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3270.4526292970613!2d74.85515908648846!3d12.89192698540115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a142daea297%3A0xfb3240042e04f68!2sJr%20Technical%20School%2C%20Bondel%20Rd%2C%20Kadri%20Hills%2C%20Kadri%2C%20Mangaluru%2C%20Karnataka%20575016!5e0!3m2!1sen!2sin!4v1752823252213!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form */}
          <div
            ref={formRef}
            className={`bg-white rounded-2xl shadow-xl p-8 border border-gray-100 h-fit transition-all duration-700 ${
              formInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Send Us a Message</h2>
            <p className="text-gray-500 text-sm mb-6">We'll get back to you within 24 hours during working days.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                <input
                  id="name" name="name" type="text" placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-700"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <input
                  id="email" name="email" type="email" placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-700"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                <textarea
                  id="message" name="message" rows="5" placeholder="Your message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-700 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all shadow-lg ${
                  sending
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {sending ? "Sending..." : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

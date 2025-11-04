import { useState } from "react";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";
import { FaInstagram, FaGithub, FaLinkedin, FaArrowRight, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const [showDevs, setShowDevs] = useState(false);
  const [activeDev, setActiveDev] = useState(null);
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    message: "",
  });

  const devs = [
    {
      name: "Shyamshree",
      portfolio: "https://my-portfolio-2-rust.vercel.app",
      instagram: "https://instagram.com/_mr_dark_716",
      github: "https://github.com/itsme-shyam-702",
      linkedin: "https://www.linkedin.com/in/shyam702",
    },
    {
      name: "Nagachaithanya",
      portfolio: "https://nagachaithanya-portfolio.vercel.app/",
      instagram: "https://instagram.com/nagachaithanya",
      github: "https://github.com/nagachaithanya",
      linkedin: "https://linkedin.com/in/nagachaithanya",
    },
    {
      name: "D. Yashwanth Reddy",
      portfolio: "https://yashwanthreddy-portfolio.vercel.app/",
      instagram: "https://instagram.com/d_yashwanth",
      github: "https://github.com/yashwanthreddy",
      linkedin: "https://linkedin.com/in/yashwanthreddy",
    },
    {
      name: "Peer Mahamad",
      portfolio: "https://peermuhamad-portfolio.vercel.app/",
      instagram: "https://instagram.com/peer_muhamad",
      github: "https://github.com/peermuhamad",
      linkedin: "https://linkedin.com/in/peer-muhamad",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formWithToEmail = { ...formData, to_email: "sssshyam702@gmail.com" };

    emailjs
      .send("service_f09090c", "template_v1c0nhb", formWithToEmail, "2qQqRGi8joIAYRfb1")
      .then(
        () => {
          Swal.fire({
            title: "✅ Feedback Sent!",
            text: "Thank you for sharing your feedback with us.",
            icon: "success",
            confirmButtonColor: "#3b82f6",
            background: "#1e293b",
            color: "#f8fafc",
          });
          setFormData({ from_name: "", from_email: "", message: "" });
        },
        (error) => {
          console.error("EmailJS Error:", error);
          Swal.fire({
            title: "❌ Oops!",
            text: "Failed to send feedback. Please try again.",
            icon: "error",
            confirmButtonColor: "#ef4444",
            background: "#1e293b",
            color: "#f8fafc",
          });
        }
      );
  };

  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 text-white py-6 shadow-lg relative">
      <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_320px] gap-4 items-start">

        {/* Column 1: School Info */}
        <div className="space-y-0.5 mx-2">
          <h2 className="font-bold text-base text-yellow-300 leading-tight">
            Junior Technical School
          </h2>
          <p className="text-gray-200 text-xs leading-snug">
            Empowering young minds through hands-on innovation and technical learning excellence.
          </p>
          <div className="text-[11px] text-gray-300 mt-1 space-y-0.5">
            <p>📍 Mangaluru, Karnataka</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ info@jrschool.edu.in</p>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="text-center md:text-left mx-auto">
          <h3 className="font-semibold text-yellow-300 text-sm mb-1">Quick Links</h3>
          <ul className="text-xs space-y-0.5">
            <li><a href="/" className="hover:text-yellow-200 transition">Home</a></li>
            <li><a href="/about" className="hover:text-yellow-200 transition">About</a></li>
            <li><a href="/admissions" className="hover:text-yellow-200 transition">Admissions</a></li>
            <li><a href="/events" className="hover:text-yellow-200 transition">Events</a></li>
            <li><a href="/contact" className="hover:text-yellow-200 transition">Contact</a></li>
          </ul>
        </div>

        {/* Column 3: Developer Section */}
        <div className="text-center md:text-right mx-auto">
          <p
            className="font-semibold text-yellow-300 flex items-center justify-center md:justify-end gap-1 cursor-pointer hover:text-yellow-200 text-xs"
            onClick={() => setShowDevs(!showDevs)}
          >
            Developed by KPT Students
            <FaArrowRight className={`transition-transform duration-300 ${showDevs ? "rotate-90" : ""}`} />
          </p>

          {showDevs && (
            <div className="mt-1 space-y-0.5 animate-fadeIn">
              {devs.map((dev) => (
                <div
                  key={dev.name}
                  className="group flex flex-col items-center md:items-end cursor-pointer"
                  onMouseEnter={() => setActiveDev(dev.name)}
                  onMouseLeave={() => setActiveDev(null)}
                >
                  <a
                    href={dev.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium hover:text-yellow-300 transition"
                  >
                    {dev.name}
                  </a>
                  {activeDev === dev.name && (
                    <div className="flex gap-2 mt-0.5">
                      <a href={dev.instagram} target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="hover:text-pink-400 transition text-[11px]" />
                      </a>
                      <a href={dev.github} target="_blank" rel="noopener noreferrer">
                        <FaGithub className="hover:text-gray-300 transition text-[11px]" />
                      </a>
                      <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className="hover:text-blue-400 transition text-[11px]" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 4: Feedback Form (Compact) */}
        <div className="ml-auto w-full md:w-[320px] bg-indigo-800/50 p-3 rounded-lg shadow border border-indigo-700">
          <h3 className="font-semibold text-yellow-300 text-xs mb-1 text-center">
            💬 Your Feedback
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-1">
            <input
              type="text"
              name="from_name"
              placeholder="Name"
              value={formData.from_name}
              onChange={handleChange}
              required
              className="p-1 rounded bg-indigo-900 text-white text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400"
            />
            <input
              type="email"
              name="from_email"
              placeholder="Email"
              value={formData.from_email}
              onChange={handleChange}
              required
              className="p-1 rounded bg-indigo-900 text-white text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400"
            />
            <textarea
              name="message"
              placeholder="Message..."
              value={formData.message}
              onChange={handleChange}
              required
              rows="2"
              className="p-1 rounded bg-indigo-900 text-white text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400 resize-none"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-semibold text-xs py-1 rounded transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919353605622?text=Hi%20Shyam!%20I%20would%20like%20to%20know%20more%20about%20Junior%20Technical%20School."
        target="_blank"
        rel="noopener noreferrer"
        title="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 p-3 rounded-full shadow-lg transition"
      >
        <FaWhatsapp className="text-white text-xl" />
      </a>

      {/* Bottom Bar */}
      <div className="border-t border-blue-700 mt-4 pt-1 text-center text-[10px] text-gray-300">
        <p>© {new Date().getFullYear()} Junior Technical School — All Rights Reserved.</p>
        <p className="text-gray-400 mt-0.5">Made with ❤️ by KPT Students.</p>
      </div>
    </footer>
  );
}

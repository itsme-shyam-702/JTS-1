import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `hover:text-yellow-300 transition-colors duration-200 pb-0.5 ${
      isActive(path)
        ? "text-yellow-300 border-b-2 border-yellow-300 font-semibold"
        : "text-white"
    }`;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/admissions", label: "Admissions" },
    { to: "/events", label: "Events" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/inbox", label: "Inbox" },
  ];

  return (
    <nav className={`text-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-blue-900 shadow-lg" : "bg-blue-700"}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="font-bold text-xl tracking-wide hover:text-yellow-300 transition-colors flex items-center gap-2">
          <span className="text-yellow-300">🏫</span>
          <span>Jr Technical School</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex flex-wrap gap-5 text-sm items-center">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={linkClass(link.to)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          className="flex flex-col gap-1 p-1 md:hidden"
        >
          <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} bg-blue-800`}>
        <ul className="flex flex-col px-5 py-3 gap-3 text-sm">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={`block ${linkClass(link.to)}`}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

function Navbar() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role || "visitor";
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
  ];

  return (
    <nav
      className={`text-white sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-blue-900 shadow-lg"
          : "bg-blue-700"
      }`}
    >
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

          <SignedIn>
            {(role === "admin" || role === "staff") && (
              <li>
                <Link to="/dashboard" className={linkClass("/dashboard")}>
                  Dashboard
                </Link>
              </li>
            )}
            {role === "admin" && (
              <li>
                <Link to="/inbox" className={linkClass("/inbox")}>
                  Inbox
                </Link>
              </li>
            )}
          </SignedIn>

          <li>
            <SignedOut>
              <SignInButton>
                <button className="bg-yellow-400 text-black px-4 py-1.5 rounded-full hover:bg-yellow-300 font-semibold transition-all hover:scale-105 text-sm">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: { rootBox: "ml-2", avatarBox: "w-8 h-8" },
                }}
              />
            </SignedIn>
          </li>
        </ul>

        {/* Mobile: Auth + Hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <SignedOut>
            <SignInButton>
              <button className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-yellow-300 transition">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
          </SignedIn>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex flex-col gap-1 p-1"
          >
            <span
              className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-blue-800`}
      >
        <ul className="flex flex-col px-5 py-3 gap-3 text-sm">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={`block ${linkClass(link.to)}`}>
                {link.label}
              </Link>
            </li>
          ))}
          <SignedIn>
            {(role === "admin" || role === "staff") && (
              <li>
                <Link to="/dashboard" className={`block ${linkClass("/dashboard")}`}>
                  Dashboard
                </Link>
              </li>
            )}
            {role === "admin" && (
              <li>
                <Link to="/inbox" className={`block ${linkClass("/inbox")}`}>
                  Inbox
                </Link>
              </li>
            )}
          </SignedIn>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

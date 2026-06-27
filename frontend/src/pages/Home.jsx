import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Simple counter animation hook
function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// Intersection Observer hook
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// Stat card with animated counter
function StatCard({ value, suffix = "", label, inView }) {
  const count = useCountUp(value, 1800, inView);
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center transform transition-all duration-500 hover:scale-105 hover:bg-white/20">
      <div className="text-4xl font-bold text-yellow-300">
        {count}{suffix}
      </div>
      <div className="text-white/80 text-sm mt-1">{label}</div>
    </div>
  );
}

// Feature card
function FeatureCard({ icon, title, desc, delay }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center transform transition-all duration-700 hover:shadow-xl hover:-translate-y-2 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-blue-700 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

const Home = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [statsRef, statsInView] = useInView(0.3);

  useEffect(() => {
    // Trigger hero animation after mount
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const features = [
    { icon: "📚", title: "Library", desc: "475+ books covering technical subjects, science, and general knowledge for well-rounded learning." },
    { icon: "🔬", title: "Science Labs", desc: "Modern, well-equipped labs that bring theoretical concepts to life through hands-on experiments." },
    { icon: "⚽", title: "Sports Ground", desc: "A dedicated playground for football, cricket, athletics, and outdoor recreational activities." },
    { icon: "💻", title: "Computers", desc: "Functional computer units for teaching and learning, helping students build digital literacy." },
    { icon: "🍱", title: "Mid-Day Meals", desc: "Nutritious meals prepared and served on school premises, supporting student health and attendance." },
    { icon: "🚻", title: "Clean Facilities", desc: "Separate functional toilets for boys and girls, ensuring a safe and hygienic environment." },
  ];

  const stats = [
    { value: 60, suffix: "+", label: "Years of Excellence" },
    { value: 475, suffix: "", label: "Library Books" },
    { value: 3, suffix: "", label: "Classes (Gr 8–10)" },
    { value: 100, suffix: "%", label: "Government Funded" },
  ];

  return (
    <div>
      {/* ── Hero Section ── */}
      <div
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/s31.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-black/60 to-indigo-900/70" />

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-yellow-300/20 animate-pulse"
              style={{
                width: `${Math.random() * 80 + 20}px`,
                height: `${Math.random() * 80 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div
            className={`transition-all duration-1000 ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <span className="inline-block bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              🏛️ Est. 1965 · Mangaluru, Karnataka
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4 drop-shadow-2xl">
              Welcome to{" "}
              <span className="text-yellow-300 block">
                Junior Technical School
              </span>
            </h1>

            <p
              className={`text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${
                heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Empowering students with academic excellence, technical skills, and moral values since 1965.
            </p>

            <div
              className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-500 ${
                heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Link to="/about">
                <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-all hover:scale-105 shadow-lg">
                  Explore School
                </button>
              </Link>
              <Link to="/admissions">
                <button className="bg-white/10 border-2 border-white/50 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-all hover:scale-105 backdrop-blur-sm">
                  Apply Now →
                </button>
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000 ${
              heroVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-white/70 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Section ── */}
      <div
        ref={statsRef}
        className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 py-16 px-4"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} inView={statsInView} />
          ))}
        </div>
      </div>

      {/* ── Features Section ── */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-3">Our Facilities</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Everything a student needs for a complete and fulfilling school experience.
            </p>
            <div className="mt-4 w-16 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 100} />
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Section ── */}
      <div className="bg-blue-700 py-20 px-4 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Ready to Join Our School?
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
          Applications are open. Take the first step toward a bright future in technical education.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/admissions">
            <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-all hover:scale-105 shadow-lg">
              Apply for Admission
            </button>
          </Link>
          <Link to="/contact">
            <button className="bg-white/10 border-2 border-white/50 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-all">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

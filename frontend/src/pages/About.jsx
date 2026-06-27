import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

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

function FacilityCard({ icon, title, desc, delay }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-6 shadow border border-gray-100 text-center
        transition-all duration-700 hover:shadow-xl hover:-translate-y-2
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-blue-700 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}

function About() {
  const [heroRef, heroInView] = useInView(0.1);
  const [contentRef, contentInView] = useInView(0.1);

  const facilities = [
    { icon: "📚", title: "Library", desc: "475+ books and growing — covering technical, science, and general subjects." },
    { icon: "🔬", title: "Science Labs", desc: "Well-equipped labs for practical experiments and hands-on learning." },
    { icon: "⚽", title: "Sports Ground", desc: "Dedicated playground for football, cricket, and outdoor activities." },
    { icon: "💻", title: "Computer Lab", desc: "Functional computers for teaching and digital literacy programs." },
    { icon: "🏗️", title: "School Building", desc: "Government-owned Pucca building with classrooms in good condition." },
    { icon: "🍱", title: "Mid-Day Meals", desc: "Nutritious meals prepared on school premises daily for all students." },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero Banner ── */}
      <div
        className="relative py-32 px-4 flex items-center justify-center"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/s7.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-black/70" />
        <div
          ref={heroRef}
          className={`relative z-10 text-center transition-all duration-1000 ${
            heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-block bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            🏛️ Est. 1965
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow-xl">
            About Our School
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Govt. Junior Technical School Kadri — shaping technical minds since 1965.
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div
            ref={contentRef}
            className={`grid lg:grid-cols-2 gap-12 items-center mb-20 transition-all duration-1000 ${
              contentInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-600/20 rounded-3xl blur-xl" />
                <img
                  src={`${process.env.PUBLIC_URL}/images/s11.png`}
                  alt="School Building"
                  className="relative w-full max-w-md rounded-2xl shadow-2xl object-cover"
                />
              </div>
            </div>

            {/* Text */}
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
                Excellence in Education and Beyond
              </h2>
              <div className="w-12 h-1 bg-blue-600 rounded-full mb-5" />
              <p className="text-gray-600 leading-relaxed mb-4">
                Govt. Junior Technical School Kadri was established in <strong>1965</strong> and is managed by the Department of Education. Located in an urban area in Mangaluru, Karnataka, the school serves Grades 8 to 10.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                The school is co-educational with Kannada as the medium of instruction. It has a government Pucca building, classrooms in good condition, electric connection, a functional library with 475 books, and a playground — all accessible by all-weather road.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  ["Est.", "1965"],
                  ["Grades", "8–10"],
                  ["Library Books", "475+"],
                  ["Management", "Govt."],
                ].map(([label, val]) => (
                  <div key={label} className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700">{val}</div>
                    <div className="text-sm text-gray-500">{label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/admissions">
                  <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow">
                    Apply for Admission
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="border-2 border-blue-600 text-blue-600 px-6 py-2.5 rounded-full font-semibold hover:bg-blue-50 transition-all">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Our Facilities</h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f, i) => (
              <FacilityCard key={i} {...f} delay={i * 80} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

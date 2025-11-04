import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Admissions from "./pages/Admissions";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import AdmissionDashboard from "./pages/AdmissionDashboard";
import InboxDashboard from "./pages/InboxDashboard";
import { SignIn } from "@clerk/clerk-react";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/dashboard" element={<AdmissionDashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/inbox" element={<InboxDashboard />} />
        <Route path="/login" element={<SignIn />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;



// https://jr-school-67nt.onrender.com
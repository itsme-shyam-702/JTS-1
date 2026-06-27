import { useEffect, useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import admissionAPI from "../api/admission";

const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASS || "admin123";

const Toast = Swal.mixin({
  toast: true, position: "bottom-end", showConfirmButton: false,
  timer: 2500, timerProgressBar: true, background: "#fff", color: "#333",
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

function AdmissionDashboard() {
  const [admissions, setAdmissions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem("admissionAdmin") === "true"
  );

  const handleAdminToggle = async () => {
    if (isAdmin) {
      localStorage.removeItem("admissionAdmin");
      setIsAdmin(false);
      return;
    }
    const { value: pass } = await Swal.fire({
      title: "Admin Access",
      input: "password",
      inputLabel: "Enter admin password",
      inputPlaceholder: "Password",
      showCancelButton: true,
    });
    if (pass === ADMIN_PASS) {
      localStorage.setItem("admissionAdmin", "true");
      setIsAdmin(true);
    } else if (pass !== undefined) {
      Swal.fire("Wrong Password", "", "error");
    }
  };

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        setLoading(true);
        const res = await admissionAPI.getAdmissions();
        setAdmissions(res.data);
      } catch (err) {
        console.error("Error fetching admissions:", err);
        Swal.fire("Error!", "Failed to load admissions.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmissions();
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) {
      Swal.fire("Permission Denied", "Only admin can delete records.", "warning");
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "This admission record will be permanently deleted.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#d33", cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await admissionAPI.deleteAdmission(id);
          setAdmissions((prev) => prev.filter((adm) => adm._id !== id));
          setMenuOpen(null);
          Toast.fire({ icon: "success", title: "Admission deleted successfully!" });
        } catch (err) {
          console.error("Error deleting admission:", err);
          Swal.fire("Error!", "Failed to delete admission.", "error");
        }
      }
    });
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Admission Dashboard</h2>
        <button
          onClick={handleAdminToggle}
          className={`px-4 py-2 rounded-xl text-sm font-semibold shadow transition ${isAdmin ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          {isAdmin ? "🔓 Admin Mode" : "🔒 Admin Mode"}
        </button>
      </div>

      {admissions.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No admission records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email/Phone</th>
                <th className="border px-4 py-2">Course/Class</th>
                <th className="border px-4 py-2">Message</th>
                <th className="border px-4 py-2">Submitted On</th>
                {isAdmin && <th className="border px-4 py-2 w-12">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {admissions.map((adm) => (
                <tr key={adm._id} className="text-center relative hover:bg-gray-50 transition">
                  <td className="border px-4 py-2">{adm.name}</td>
                  <td className="border px-4 py-2">{adm.email || adm.phone || adm.contact || "—"}</td>
                  <td className="border px-4 py-2">{adm.course || adm.selectedClass || "—"}</td>
                  <td className="border px-4 py-2 max-w-xs truncate">{adm.message || adm.address || "—"}</td>
                  <td className="border px-4 py-2">{new Date(adm.createdAt).toLocaleString()}</td>
                  {isAdmin && (
                    <td className="border px-4 py-2 relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === adm._id ? null : adm._id)}
                        className="p-1 rounded hover:bg-gray-200 transition"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {menuOpen === adm._id && (
                        <div className="absolute right-6 top-10 bg-white border shadow-md rounded w-32 z-10">
                          <button
                            onClick={() => handleDelete(adm._id)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdmissionDashboard;

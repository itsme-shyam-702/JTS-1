import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import api from "../api/gallery";

const Toast = Swal.mixin({
  toast: true, position: "bottom-end", showConfirmButton: false,
  timer: 2500, timerProgressBar: true,
});

const BACKEND = process.env.REACT_APP_BACKEND_URL || "";

function getImgSrc(filePath) {
  if (!filePath) return "";
  if (filePath.startsWith("http")) return filePath;
  if (filePath.startsWith("/")) return `${BACKEND}${filePath}`;
  return `${BACKEND}/${filePath}`;
}

// Simple admin check - set REACT_APP_ADMIN_PASS in .env or use a toggle
const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASS || "admin123";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [recentlyDeleted, setRecentlyDeleted] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [newImage, setNewImage] = useState({ file: null, title: "", description: "" });
  const [isAdminOrStaff, setIsAdminOrStaff] = useState(
    () => localStorage.getItem("galleryAdmin") === "true"
  );

  useEffect(() => { fetchImages(); fetchDeletedImages(); }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await api.getAll();
      setImages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedImages = async () => {
    try {
      const res = await api.getDeleted();
      setRecentlyDeleted(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminToggle = async () => {
    if (isAdminOrStaff) {
      localStorage.removeItem("galleryAdmin");
      setIsAdminOrStaff(false);
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
      localStorage.setItem("galleryAdmin", "true");
      setIsAdminOrStaff(true);
      Toast.fire({ icon: "success", title: "Admin mode enabled" });
    } else if (pass !== undefined) {
      Swal.fire("Wrong Password", "", "error");
    }
  };

  const handleAddImage = async () => {
    if (!newImage.file) {
      Swal.fire("No File!", "Please select an image file.", "warning");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", newImage.file);
      formData.append("title", newImage.title || "Untitled");
      formData.append("description", newImage.description || "");
      const res = await api.add(formData);
      setImages((prev) => [res.data, ...prev]);
      setNewImage({ file: null, title: "", description: "" });
      setShowForm(false);
      const fileInput = document.getElementById("fileInput");
      if (fileInput) fileInput.value = "";
      Toast.fire({ icon: "success", title: "Image uploaded successfully!" });
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to upload image.", "error");
    }
  };

  const handleDeleteSingle = (id) => {
    Swal.fire({
      title: "Are you sure?", text: "This image will be moved to Recently Deleted.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api.softDelete(id);
        fetchImages(); fetchDeletedImages();
        setSelected((p) => p.filter((x) => x !== id));
        Toast.fire({ icon: "success", title: "Moved to Recently Deleted" });
      }
    });
  };

  const handleDeleteSelected = () => {
    if (!selected.length) return;
    Swal.fire({
      title: "Delete selected images?",
      text: `${selected.length} image(s) will be moved to Recently Deleted.`,
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await Promise.all(selected.map((id) => api.softDelete(id)));
        fetchImages(); fetchDeletedImages(); setSelected([]);
        Toast.fire({ icon: "success", title: "Selected images deleted!" });
      }
    });
  };

  const handleRestore = async (id) => {
    await api.restore(id);
    fetchImages(); fetchDeletedImages();
    Toast.fire({ icon: "success", title: "Image restored!" });
  };

  const handlePermanentDelete = (id) => {
    Swal.fire({
      title: "Permanently delete?", text: "This cannot be undone!",
      icon: "error", showCancelButton: true,
      confirmButtonText: "Delete Permanently", confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api.permanentDelete(id);
        fetchDeletedImages();
        Toast.fire({ icon: "success", title: "Image permanently removed!" });
      }
    });
  };

  const toggleSelect = (id) => {
    setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  };

  const openLightbox = (img, idx) => { setLightbox(img); setLightboxIdx(idx); };

  const navLightbox = (dir) => {
    const newIdx = (lightboxIdx + dir + images.length) % images.length;
    setLightboxIdx(newIdx);
    setLightbox(images[newIdx]);
  };

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") navLightbox(1);
      if (e.key === "ArrowLeft") navLightbox(-1);
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, lightboxIdx]);

  return (
    <section className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-700 py-12 px-4 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-2">School Gallery</h1>
        <p className="text-blue-100">Memories, moments, and milestones from our school community.</p>
      </div>

      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <p className="text-sm text-gray-500">{images.length} photo{images.length !== 1 ? "s" : ""}</p>
          <div className="flex gap-3 flex-wrap items-center">
            {isAdminOrStaff && selected.length > 0 && (
              <button onClick={handleDeleteSelected} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition">
                Delete ({selected.length})
              </button>
            )}
            {isAdminOrStaff && (
              <>
                <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition">
                  + Add Image
                </button>
                <button onClick={() => setShowDeleted((s) => !s)} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition">
                  {showDeleted ? "Hide Deleted" : "Recently Deleted"}
                </button>
              </>
            )}
            <button onClick={handleAdminToggle} className={`px-4 py-2 rounded-xl text-sm font-semibold shadow transition ${isAdminOrStaff ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
              {isAdminOrStaff ? "🔓 Admin" : "🔒 Admin"}
            </button>
          </div>
        </div>

        {/* Masonry Grid */}
        {loading ? (
          <div className="columns-2 sm:columns-3 md:columns-4 gap-2 space-y-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`break-inside-avoid bg-gray-200 animate-pulse rounded-lg ${i % 3 === 0 ? "h-48" : i % 3 === 1 ? "h-32" : "h-40"}`} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🖼️</div>
            <p className="text-lg font-medium">No photos yet.</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 md:columns-4 gap-1 space-y-1">
            {images.map((img, idx) => (
              <motion.div
                key={img._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                className={`relative overflow-hidden rounded-lg break-inside-avoid group cursor-pointer transition-all ${selected.includes(img._id) ? "ring-4 ring-blue-500" : ""}`}
                onClick={() => { if (isAdminOrStaff) toggleSelect(img._id); else openLightbox(img, idx); }}
              >
                <img
                  src={getImgSrc(img.filePath)}
                  alt={img.title}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-400"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                  <p className="text-white text-xs font-semibold truncate">{img.title}</p>
                  {img.description && <p className="text-gray-300 text-xs truncate">{img.description}</p>}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); openLightbox(img, idx); }} className="bg-white/80 text-gray-800 text-xs px-2 py-1 rounded-lg hover:bg-white shadow">🔍</button>
                  {isAdminOrStaff && (
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteSingle(img._id); }} className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg hover:bg-red-600 shadow">✕</button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white text-3xl hover:text-yellow-300 z-10">✕</button>
            <button onClick={(e) => { e.stopPropagation(); navLightbox(-1); }} className="absolute left-4 text-white text-3xl hover:text-yellow-300 z-10 bg-black/40 p-3 rounded-full">‹</button>
            <button onClick={(e) => { e.stopPropagation(); navLightbox(1); }} className="absolute right-4 text-white text-3xl hover:text-yellow-300 z-10 bg-black/40 p-3 rounded-full">›</button>
            <motion.div
              key={lightbox._id}
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }} transition={{ duration: 0.2 }}
              className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}
            >
              <img src={getImgSrc(lightbox.filePath)} alt={lightbox.title} className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
              <div className="text-center mt-3">
                <p className="text-white font-semibold text-lg">{lightbox.title}</p>
                {lightbox.description && <p className="text-gray-400 text-sm">{lightbox.description}</p>}
                <p className="text-gray-600 text-xs mt-1">{lightboxIdx + 1} / {images.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Image Form */}
      <AnimatePresence>
        {isAdminOrStaff && showForm && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.25 }}
            className="fixed bottom-10 right-10 bg-white border border-slate-200 p-6 shadow-2xl rounded-2xl w-80 z-50"
          >
            <h2 className="text-lg font-bold mb-4 text-slate-800">Add New Image</h2>
            <input id="fileInput" type="file" accept="image/*" onChange={(e) => setNewImage((p) => ({ ...p, file: e.target.files?.[0] ?? null }))} className="w-full border px-3 py-2 mb-2 rounded-lg text-sm" />
            <input type="text" placeholder="Title" value={newImage.title} onChange={(e) => setNewImage((p) => ({ ...p, title: e.target.value }))} className="w-full border px-3 py-2 mb-2 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            <input type="text" placeholder="Description (optional)" value={newImage.description} onChange={(e) => setNewImage((p) => ({ ...p, description: e.target.value }))} className="w-full border px-3 py-2 mb-4 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            <div className="flex gap-2">
              <button onClick={handleAddImage} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">Upload</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg border text-sm hover:bg-slate-50 transition">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recently Deleted */}
      <AnimatePresence>
        {isAdminOrStaff && showDeleted && recentlyDeleted.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 bg-slate-100 border-t border-slate-300 py-3 px-4 shadow-lg overflow-x-auto flex gap-3 z-40"
          >
            <div className="text-xs text-gray-500 font-semibold self-center whitespace-nowrap mr-2">Recently Deleted:</div>
            {recentlyDeleted.map((img) => (
              <div key={img._id} className="relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden">
                <img src={getImgSrc(img.filePath)} alt={img.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center opacity-0 hover:opacity-100 transition gap-1">
                  <button onClick={() => handleRestore(img._id)} className="bg-green-600 text-white text-xs px-2 py-1 rounded w-20">♻ Restore</button>
                  <button onClick={() => handlePermanentDelete(img._id)} className="bg-red-600 text-white text-xs px-2 py-1 rounded w-20">🗑 Delete</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

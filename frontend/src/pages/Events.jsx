import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import Swal from "sweetalert2";
import api from "../api/events"; // ✅ Fixed: use events-specific API

export default function Events() {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";
  const isAdmin = userEmail === "sssshyam702@gmail.com";

  const [events, setEvents] = useState([]);
  const [recentlyDeleted, setRecentlyDeleted] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [lightbox, setLightbox] = useState(null); // for image preview
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: "", file: null });

  useEffect(() => {
    fetchEvents();
    fetchDeletedEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.getAll();
      setEvents(res.data);
    } catch (err) {
      console.error("fetchEvents error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedEvents = async () => {
    try {
      const res = await api.getDeleted();
      setRecentlyDeleted(res.data);
    } catch (err) {
      console.error("fetchDeletedEvents error", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setNewEvent((prev) => ({ ...prev, file }));
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      Swal.fire({ icon: "warning", title: "Missing Fields", text: "Please provide both title and date!", confirmButtonColor: "#3085d6" });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", newEvent.title);
      formData.append("description", newEvent.description);
      formData.append("date", newEvent.date);
      if (newEvent.file) formData.append("file", newEvent.file);

      const res = await api.add(formData);
      setEvents((prev) => [res.data, ...prev]);
      setNewEvent({ title: "", description: "", date: "", file: null });
      setShowForm(false);
      Swal.fire({ icon: "success", title: "Event Added!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error("handleAddEvent error", err);
      Swal.fire("Error", "Failed to add event.", "error");
    }
  };

  const confirmDelete = async (message, onConfirm) => {
    const result = await Swal.fire({
      title: "Are you sure?", text: message, icon: "warning",
      showCancelButton: true, confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel", confirmButtonColor: "#e11d48", cancelButtonColor: "#6b7280",
    });
    if (result.isConfirmed) {
      await onConfirm();
      Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
    }
  };

  const handleDeleteSingle = (id) => {
    confirmDelete("Move this event to trash?", async () => {
      await api.softDelete(id);
      await fetchEvents();
      await fetchDeletedEvents();
    });
  };

  const handleDeleteSelected = () => {
    if (!selected.length) return;
    confirmDelete(`Delete ${selected.length} selected event(s)?`, async () => {
      await Promise.all(selected.map((id) => api.softDelete(id)));
      await fetchEvents();
      await fetchDeletedEvents();
      setSelected([]);
    });
  };

  const handleRestore = async (id) => {
    await api.restore(id);
    await fetchEvents();
    await fetchDeletedEvents();
    Swal.fire({ icon: "success", title: "Restored!", timer: 1500, showConfirmButton: false });
  };

  const handlePermanentDelete = (id) => {
    confirmDelete("Permanently delete this event? This cannot be undone.", async () => {
      await api.permanentDelete(id);
      await fetchDeletedEvents();
    });
  };

  const openFileInNewTab = (filePath) => {
    if (!filePath) return;
    const url = filePath.startsWith("/") ? filePath : `/${filePath}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShare = async (ev) => {
    const link = ev.filePath
      ? (ev.filePath.startsWith("/") ? ev.filePath : `/${ev.filePath}`)
      : window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: ev.title, text: ev.description || ev.title, url: link });
      } else {
        await navigator.clipboard.writeText(link);
        Swal.fire({ icon: "info", title: "Link Copied!", timer: 1500, showConfirmButton: false });
      }
    } catch {
      try {
        await navigator.clipboard.writeText(link);
        Swal.fire({ icon: "info", title: "Link Copied!", timer: 1500, showConfirmButton: false });
      } catch (e) {
        console.error("share failed", e);
      }
    }
    setMenuOpen(null);
  };

  const filteredEvents = events.filter(
    (ev) =>
      ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-700 py-12 px-4 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-2">School Events & Circulars</h1>
        <p className="text-blue-100">Stay updated with the latest happenings at our school.</p>
      </div>

      <div className="max-w-7xl mx-auto py-10 px-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white shadow-sm text-sm"
          />

          <div className="flex gap-3 items-center flex-wrap">
            {isAdmin && selected.length > 0 && (
              <button onClick={handleDeleteSelected} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow transition text-sm font-semibold">
                🗑 Delete ({selected.length})
              </button>
            )}
            {isAdmin && (
              <>
                <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow transition text-sm font-semibold">
                  + Add Event
                </button>
                <button onClick={() => setShowDeleted((s) => !s)} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-xl shadow transition text-sm font-semibold">
                  {showDeleted ? "Hide Deleted" : "Recently Deleted"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Event Cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl bg-gray-200 animate-pulse h-52" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-lg font-medium">
              {searchQuery ? "No events match your search." : isAdmin ? 'Click "Add Event" to create one.' : "No events yet — check back later."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredEvents.map((ev, idx) => {
              const isImage = ev.fileType === "image";
              const isPdf = ev.fileType === "application" || ev.fileType === "pdf";
              const fileUrl = ev.filePath ? (ev.filePath.startsWith("/") ? ev.filePath : `/${ev.filePath}`) : "";
              const isSelected = selected.includes(ev._id);

              return (
                <motion.div
                  key={ev._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative bg-white border-2 rounded-xl shadow hover:shadow-lg transition-all overflow-hidden group cursor-pointer ${
                    isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-100"
                  }`}
                  onClick={() => {
                    if (isAdmin) {
                      setSelected((prev) =>
                        prev.includes(ev._id) ? prev.filter((x) => x !== ev._id) : [...prev, ev._id]
                      );
                    }
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="h-40 bg-gray-100 relative overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isImage && fileUrl) setLightbox(ev);
                      else openFileInNewTab(ev.filePath);
                    }}
                  >
                    {isImage && fileUrl ? (
                      <img src={fileUrl} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : isPdf && fileUrl ? (
                      <div className="flex flex-col items-center justify-center w-full h-full bg-red-50 text-red-500 gap-2">
                        <span className="text-4xl">📄</span>
                        <span className="text-xs font-semibold">PDF Document</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-300 text-sm">No File</div>
                    )}

                    {/* Overlay menu button */}
                    <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setMenuOpen(menuOpen === ev._id ? null : ev._id)}
                        className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white text-xs"
                        aria-label="Options"
                      >⋮</button>
                      {menuOpen === ev._id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border rounded-xl shadow-xl text-sm z-50 overflow-hidden">
                          <button onClick={() => handleShare(ev)} className="w-full text-left px-3 py-2 hover:bg-gray-50">🔗 Share</button>
                          {isImage && fileUrl && (
                            <button onClick={() => { setLightbox(ev); setMenuOpen(null); }} className="w-full text-left px-3 py-2 hover:bg-gray-50">🔍 Preview</button>
                          )}
                          {isAdmin && (
                            <button onClick={() => { handleDeleteSingle(ev._id); setMenuOpen(null); }} className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600">🗑 Delete</button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 truncate mb-1">{ev.title}</h3>
                    <p className="text-xs text-blue-600 font-medium mb-1">{new Date(ev.date).toDateString()}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{ev.description || "—"}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setLightbox(null)} className="absolute -top-10 right-0 text-white text-2xl hover:text-yellow-300">✕</button>
              <img
                src={lightbox.filePath?.startsWith("/") ? lightbox.filePath : `/${lightbox.filePath}`}
                alt={lightbox.title}
                className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]"
              />
              <div className="mt-3 text-center">
                <h3 className="text-white font-bold text-lg">{lightbox.title}</h3>
                <p className="text-gray-400 text-sm">{lightbox.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Event Form */}
      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.25 }}
            className="fixed bottom-10 right-10 bg-white border border-slate-200 p-6 shadow-2xl rounded-2xl w-80 z-50"
          >
            <h2 className="text-lg font-bold mb-4 text-slate-800">Add New Event</h2>
            <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} placeholder="Event title *" className="w-full border px-3 py-2 mb-2 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} className="w-full border px-3 py-2 mb-2 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            <textarea name="description" value={newEvent.description} onChange={handleInputChange} placeholder="Description" className="w-full border px-3 py-2 mb-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none" rows="2" />
            <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="w-full border px-3 py-2 mb-4 rounded-lg text-sm" />
            <div className="flex justify-between gap-2">
              <button onClick={handleAddEvent} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">Upload</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg border text-sm hover:bg-slate-50 transition">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recently Deleted */}
      <AnimatePresence>
        {isAdmin && showDeleted && recentlyDeleted.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 bg-slate-100 border-t border-slate-300 py-3 px-4 shadow-lg overflow-x-auto flex gap-3 z-40"
          >
            <div className="text-xs text-gray-500 font-semibold self-center whitespace-nowrap mr-2">Recently Deleted:</div>
            {recentlyDeleted.map((ev) => (
              <div key={ev._id} className="relative flex-shrink-0 w-28 h-20 rounded-lg overflow-hidden">
                {ev.filePath && ev.fileType === "image" ? (
                  <img src={ev.filePath.startsWith("/") ? ev.filePath : `/${ev.filePath}`} alt={ev.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs text-slate-600 text-center p-1">{ev.title}</div>
                )}
                <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center opacity-0 hover:opacity-100 transition gap-1">
                  <button onClick={() => handleRestore(ev._id)} className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded w-20">♻ Restore</button>
                  <button onClick={() => handlePermanentDelete(ev._id)} className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded w-20">🗑 Delete</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

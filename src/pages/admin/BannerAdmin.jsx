import { useEffect, useState, useRef } from "react";
import axios from "axios";

// Banner.jsx
// CRUD Banners (Create, Read, Update, Delete)
// Styling: TailwindCSS

const baseUrl = "http://localhost:8080/api/v1/banners";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states (dùng chung cho create & edit)
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState(true);
  const [endAt, setEndAt] = useState("");

  const [editingId, setEditingId] = useState(null); // null = create, id = edit

  const fileInputRef = useRef();

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${baseUrl}/list`);
      setBanners(res.data || []);
    } catch (err) {
      setError(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  function handleEdit(b) {
    setEditingId(b.id);
    setTitle(b.title || "");
    setTargetUrl(b.targetUrl || "");
    setPosition(b.position || "");
    setStatus(b.status == null ? true : b.status);
    setEndAt(b.endAt || "");
    setFile(null);
    setPreview(b.bannerUrl || null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  }

  function resetForm() {
    setEditingId(null);
    setFile(null);
    setPreview(null);
    setTitle("");
    setTargetUrl("");
    setPosition("");
    setStatus(true);
    setEndAt("");
    if (fileInputRef.current) fileInputRef.current.value = null;
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      if (file) fd.append("file", file);
      if (title) fd.append("title", title);
      if (targetUrl) fd.append("targetUrl", targetUrl);
      if (position) fd.append("position", position);
      if (typeof status === "boolean") fd.append("status", status);
      if (endAt) fd.append("endAt", endAt);

      let res;
      if (editingId) {
        // update
        res = await axios.put(`${baseUrl}/update_banner=${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setBanners((prev) =>
          prev.map((b) => (b.id === editingId ? res.data : b))
        );
      } else {
        if (!file) {
          alert("Vui lòng chọn hình ảnh!");
          setLoading(false);
          return;
        }
        res = await axios.post(`${baseUrl}/create`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setBanners((prev) => [res.data, ...prev]);
      }

      resetForm();
    } catch (err) {
      setError(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Bạn có chắc muốn xóa banner này?")) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${baseUrl}/delete${id}`);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Banner Management</h2>

      {/* Form create / edit */}
      <form
        onSubmit={handleSave}
        className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="col-span-1 md:col-span-1">
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            ref={fileInputRef}
            onChange={handleFileChange}
            type="file"
            accept="image/*"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-2 w-full h-40 object-contain border"
            />
          )}
        </div>

        <div className="col-span-1 md:col-span-2 grid grid-cols-1 gap-2">
          <label className="block text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
          />

          <label className="block text-sm font-medium">Target URL</label>
          <input
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="border p-2 rounded"
          />

          <label className="block text-sm font-medium">Position</label>
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="border p-2 rounded"
          />

          <label className="block text-sm font-medium">Status</label>
          <select
            value={String(status)}
            onChange={(e) => setStatus(e.target.value === "true")}
            className="border p-2 rounded"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <label className="block text-sm font-medium">End At</label>
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            className="border p-2 rounded"
          />

          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingId ? "Update" : "Create"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-4 text-red-600">Error: {JSON.stringify(error)}</div>
      )}

      {/* List */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Start At</th>
              <th className="px-4 py-2 text-left">End At</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {loading && (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && banners.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  No banners found.
                </td>
              </tr>
            )}

            {!loading &&
              banners.map((b, idx) => (
                <tr key={b.id || idx}>
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3">
                    {b.bannerUrl ? (
                      <img
                        src={b.bannerUrl}
                        className="w-32 h-16 object-cover rounded"
                        alt={b.title || "banner"}
                      />
                    ) : (
                      <div className="w-32 h-16 bg-gray-100 flex items-center justify-center text-sm">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">{b.status ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3">
                    {b.startAt ? new Date(b.startAt).toLocaleString("vi-VN") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {b.endAt ? new Date(b.endAt).toLocaleString("vi-VN") : "—"}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(b)}
                      className="px-2 py-1 bg-yellow-400 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

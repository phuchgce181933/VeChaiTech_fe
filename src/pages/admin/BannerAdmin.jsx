import { useEffect, useState, useRef } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const baseUrl = `${API_BASE}/api/v1/banners`;

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState(true);
  const [endAt, setEndAt] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    setLoading(true);
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
    const f = e.target.files?.[0];
    setFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  function handleEdit(b) {
    setEditingId(b.id);
    setTitle(b.title || "");
    setTargetUrl(b.targetUrl || "");
    setPosition(b.position || "");
    setStatus(b.status ?? true);
    setEndAt(b.endAt || "");
    setPreview(b.bannerUrl || null);
    setFile(null);
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
      fd.append("title", title);
      fd.append("targetUrl", targetUrl);
      fd.append("position", position);
      fd.append("status", status);
      if (endAt) fd.append("endAt", endAt);

      let res;
      if (editingId) {
        res = await axios.put(`${baseUrl}/update_banner=${editingId}`, fd);
        setBanners(prev => prev.map(b => (b.id === editingId ? res.data : b)));
      } else {
        if (!file) {
          alert("Vui lòng chọn hình ảnh");
          setLoading(false);
          return;
        }
        res = await axios.post(`${baseUrl}/create`, fd);
        setBanners(prev => [res.data, ...prev]);
      }

      resetForm();
    } catch (err) {
      setError(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Bạn chắc chắn muốn xóa banner này?")) return;
    try {
      await axios.delete(`${baseUrl}/delete${id}`);
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(err?.response?.data || err.message);
    }
  }

  return (
    <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* FORM */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? "✏️ Chỉnh sửa banner" : "➕ Tạo banner mới"}
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Upload */}
          <label className="flex flex-col items-center justify-center
            h-40 border-2 border-dashed rounded-lg cursor-pointer
            hover:border-blue-500 transition">
            {preview ? (
              <img src={preview} className="h-full object-contain" />
            ) : (
              <>
                <span className="text-3xl">🖼️</span>
                <span className="text-sm text-gray-500">
                  Click hoặc kéo ảnh vào đây
                </span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Tiêu đề banner"
            className="w-full border rounded px-3 py-2"
          />

          {/* <input
            value={targetUrl}
            onChange={e => setTargetUrl(e.target.value)}
            placeholder="Link điều hướng"
            className="w-full border rounded px-3 py-2"
          />

          <input
            value={position}
            onChange={e => setPosition(e.target.value)}
            placeholder="Vị trí hiển thị"
            className="w-full border rounded px-3 py-2"
          /> */}

          <select
            value={String(status)}
            onChange={e => setStatus(e.target.value === "true")}
            className="w-full border rounded px-3 py-2"
          >
            <option value="true">Hoạt động</option>
            <option value="false">Ẩn</option>
          </select>

          <input
            type="datetime-local"
            value={endAt}
            onChange={e => setEndAt(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <div className="flex gap-2">
            <button
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {editingId ? "Cập nhật" : "Tạo mới"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600">
            ❌ {JSON.stringify(error)}
          </p>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-5 xl:col-span-2">
        <h3 className="text-lg font-semibold mb-4">📋 Danh sách banner</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Ảnh</th>
                <th className="px-3 py-2">Trạng thái</th>
                <th className="px-3 py-2">Kết thúc</th>
                <th className="px-3 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center py-6">
                    Đang tải...
                  </td>
                </tr>
              )}

              {!loading && banners.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6">
                    Không có banner
                  </td>
                </tr>
              )}

              {banners.map((b, i) => (
                <tr key={b.id} className="border-t">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2">
                    {b.bannerUrl ? (
                      <img
                        src={b.bannerUrl}
                        className="w-32 h-16 object-cover rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                        ${b.status
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {b.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {b.endAt
                      ? new Date(b.endAt).toLocaleString("vi-VN")
                      : "—"}
                  </td>
                  <td className="px-3 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(b)}
                      className="px-2 py-1 bg-yellow-400 rounded"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

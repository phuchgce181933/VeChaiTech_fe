import { useEffect, useState, useRef } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const baseUrl = `${API_BASE}/api/v1/wastelistings`;
const wasteTypes = ["KG", "TON", "ITEM", "LITER", "METER", "BOX", "BAG", "SET"];

export default function WasteListingsAdmin() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fileRef = useRef(null);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/list`);
      setListings(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    setFile(f || null);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setName(item.name || "");
    setDescription(item.description || "");
    setPrice(item.price || "");
    setWasteType(item.wasteType || "");
    setPreviewUrl(item.wasteUrl || null);
    setFile(null);
    if (fileRef.current) fileRef.current.value = null;
  }

  function resetForm() {
    setEditingId(null);
    setFile(null);
    setPreviewUrl(null);
    setName("");
    setDescription("");
    setPrice("");
    setWasteType("");
    if (fileRef.current) fileRef.current.value = null;
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      if (file) fd.append("file", file);
      fd.append("name", name);
      fd.append("description", description);
      fd.append("price", price);
      fd.append("wasteType", wasteType);

      let res;
      if (editingId) {
        res = await axios.put(`${baseUrl}/update=${editingId}`, fd);
        setListings(prev =>
          prev.map(x => (x.id === editingId ? res.data : x))
        );
      } else {
        if (!file) {
          alert("Vui lòng chọn hình ảnh!");
          setLoading(false);
          return;
        }
        res = await axios.post(`${baseUrl}/create`, fd);
        setListings(prev => [res.data, ...prev]);
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Bạn có chắc muốn xóa mục này?")) return;
    try {
      await axios.delete(`${baseUrl}/delete/${id}`);
      setListings(prev => prev.filter(x => x.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* FORM */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? "✏️ Chỉnh sửa vật liệu" : "➕ Thêm vật liệu tái chế"}
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Upload */}
          <label
            className="h-40 border-2 border-dashed rounded-lg
              flex flex-col items-center justify-center
              cursor-pointer hover:border-green-500 transition"
          >
            {previewUrl ? (
              <img src={previewUrl} className="h-full object-contain" />
            ) : (
              <>
                <span className="text-3xl">♻️</span>
                <span className="text-sm text-gray-500">
                  Click hoặc kéo ảnh vào đây
                </span>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Tên vật liệu"
            className="w-full border rounded px-3 py-2"
          />

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Mô tả"
            rows={3}
            className="w-full border rounded px-3 py-2"
          />

          <div className="flex gap-2">
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Giá (VND)"
              className="flex-1 border rounded px-3 py-2"
            />

            <select
              value={wasteType}
              onChange={e => setWasteType(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            >
              <option value="">Đơn vị</option>
              {wasteTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
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

          {error && (
            <p className="text-sm text-red-600">❌ {error}</p>
          )}
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-5 xl:col-span-2">
        <h3 className="text-lg font-semibold mb-4">📋 Danh sách vật liệu</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Ảnh</th>
                <th className="px-3 py-2">Tên</th>
                <th className="px-3 py-2">Giá</th>
                <th className="px-3 py-2">Đơn vị</th>
                <th className="px-3 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    Đang tải...
                  </td>
                </tr>
              )}

              {!loading && listings.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    Không có dữ liệu
                  </td>
                </tr>
              )}

              {listings.map((item, idx) => (
                <tr key={item.id} className="border-t">
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2">
                    {item.wasteUrl ? (
                      <img
                        src={item.wasteUrl}
                        className="w-28 h-14 object-cover rounded"
                      />
                    ) : "—"}
                  </td>
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2">
                    {item.price ? item.price.toLocaleString() + " ₫" : "—"}
                  </td>
                  <td className="px-3 py-2">{item.wasteType || "—"}</td>
                  <td className="px-3 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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

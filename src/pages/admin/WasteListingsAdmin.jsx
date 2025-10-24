import { useEffect, useState, useRef } from "react";
import axios from "axios";

const baseUrl = "http://localhost:8080/api/v1/wastelistings";
const wasteTypes = ["KG", "TON", "ITEM", "LITER", "METER", "BOX", "BAG", "SET"];

export default function WasteListingsAdmin() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [wasteType, setWasteType] = useState("");

    const fileRef = useRef();
    const [editingId, setEditingId] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    
    useEffect(() => {
        fetchListings();
    }, []);

    async function fetchListings() {
        setLoading(true);
        try {
            const res = await axios.get(`${baseUrl}/list`);
            const data = res.data;
            setListings(Array.isArray(data) ? data : [data]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleFileChange(e) {
        const f = e.target.files?.[0] || null;
        setFile(f);
        setPreviewUrl(f ? URL.createObjectURL(f) : previewUrl);
    }

    function handleEdit(item) {
        setEditingId(item.id);
        setName(item.name || "");
        setDescription(item.description || "");
        setPrice(item.price || "");
        setWasteType(item.wasteType || "");
        setFile(null); // nếu muốn đổi file
        setPreviewUrl(item.wasteUrl || null); // preview ảnh hiện tại
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
            if (name) fd.append("name", name);
            if (description) fd.append("description", description);
            if (price) fd.append("price", price);
            if (wasteType) fd.append("wasteType", wasteType);

            let res;
            if (editingId) {
                res = await axios.put(`${baseUrl}/update=${editingId}`, fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setListings((prev) =>
                    prev.map((x) => (x.id === editingId ? res.data : x))
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
                setListings((prev) => [res.data, ...prev]);
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
        setLoading(true);
        try {
            await axios.delete(`${baseUrl}/delete/${id}`);
            setListings((prev) => prev.filter((x) => x.id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Waste Listings Management</h2>

            {/* Form create / edit */}
            <form
                onSubmit={handleSave}
                className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <div>
                    <label className="block text-sm font-medium mb-1">Image</label>
                    <input ref={fileRef} onChange={handleFileChange} type="file" accept="image/*" />
                    {previewUrl && (
                        <div className="mt-2">
                            <span className="text-sm text-gray-500">Preview:</span>
                            <img src={previewUrl} alt="Preview" className="w-32 h-16 object-cover rounded border mt-1" />
                        </div>
                    )}
                </div>

                <div className="col-span-2 grid gap-2">
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded"
                    />

                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-2 rounded"
                    ></textarea>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium">Price</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="border p-2 rounded"
                                placeholder="Giá VND"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium">Waste Type</label>
                            <select
                                value={wasteType}
                                onChange={(e) => setWasteType(e.target.value)}
                                className="border p-2 rounded w-full"
                            >
                                <option value="">-- Chọn loại --</option>
                                {wasteTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                disabled={loading}
                                type="submit"
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
                </div>
            </form>

            {error && <div className="text-red-600 mb-4">Error: {error}</div>}

            {/* List */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full divide-y">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">#</th>
                            <th className="px-4 py-2 text-left">Image</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">Price</th>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y">
                        {loading && (
                            <tr>
                                <td colSpan={7} className="p-6 text-center">Loading...</td>
                            </tr>
                        )}

                        {!loading && listings.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-6 text-center">No listings found.</td>
                            </tr>
                        )}

                        {!loading && listings.map((item, idx) => (
                            <tr key={item.id || idx}>
                                <td className="px-4 py-3">{idx + 1}</td>
                                <td className="px-4 py-3">
                                    {item.wasteUrl ? (
                                        <img src={item.wasteUrl} alt={item.name} className="w-32 h-16 object-cover rounded border" />
                                    ) : (
                                        <div className="w-32 h-16 bg-gray-100 flex items-center justify-center text-sm">No image</div>
                                    )}
                                </td>
                                <td className="px-4 py-3">{item.name}</td>
                                <td className="px-4 py-3 max-w-xs">
                                    <span title={item.description || ""} className="block text-sm text-gray-700">
                                        {item.description?.length > 80 ? item.description.slice(0, 80) + "..." : item.description || "—"}
                                    </span>
                                </td>
                                <td className="px-4 py-3">{item.price ? item.price + " VND" : "—"}</td>
                                <td className="px-4 py-3">{item.wasteType || "—"}</td>
                                <td className="px-4 py-3 flex gap-2">
                                    <button onClick={() => handleEdit(item)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

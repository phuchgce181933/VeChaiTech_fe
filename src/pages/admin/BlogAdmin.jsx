import { useEffect, useState } from "react";
import axios from "axios";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  const [form, setForm] = useState({
    id: null,
    title: "",
    content: "",
  });

  const [image, setImage] = useState(null);

  // Load all posts
  const loadData = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/posts");
    setPosts(res.data.data ?? []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({ id: null, title: "", content: "" });
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("post", new Blob(
      [JSON.stringify({ title: form.title, content: form.content })],
      { type: "application/json" }
    ));
    if (image) fd.append("image", image);

    if (form.id) {
      await axios.put(`http://localhost:8080/api/v1/posts/${form.id}`, fd);
    } else {
      await axios.post("http://localhost:8080/api/v1/posts", fd);
    }

    loadData();
    resetForm();
  };

  const handleEdit = (post) => {
    setForm({ id: post.id, title: post.title, content: post.content });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá bài viết này?")) return;
    await axios.delete(`http://localhost:8080/api/v1/posts/${id}`);
    loadData();
  };

  return (
    <div className="p-8 space-y-10">
      {/* Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          {form.id ? "✏ Cập nhật bài viết" : "➕ Thêm bài viết"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tiêu đề"
            className="border p-2 w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Nội dung bài viết..."
            className="border p-2 w-full h-40"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />

          <div className="space-y-2">
            <label>Ảnh đại diện bài viết</label>
            <input type="file" accept="image/*"
              onChange={(e) => setImage(e.target.files[0])} />

            {/* Preview ảnh nếu đang chọn */}
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt=""
                className="h-20 rounded mt-2 object-cover"
              />
            )}
          </div>

          <button className="px-4 py-2 bg-green-600 text-white rounded">
            {form.id ? "Lưu thay đổi" : "Tạo mới"}
          </button>

          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-3 px-3 py-2 bg-gray-500 text-white rounded"
            >
              Hủy
            </button>
          )}
        </form>
      </div>

      {/* List */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">📑 Danh sách bài viết</h2>

        <table className="w-full border rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border w-1/3">Tiêu đề</th>
              <th className="p-2 border w-40">Ảnh</th>
              <th className="p-2 border">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="border p-2">{p.id}</td>
                <td className="border p-2">{p.title}</td>
                <td className="border p-2">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="h-14 w-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No image</span>
                  )}
                </td>

                <td className="border p-2 space-x-4">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 font-semibold"
                  >
                    ✏ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 font-semibold"
                  >
                    🗑 Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {posts.length === 0 && (
          <p className="pt-6 text-center text-gray-500">
            Chưa có bài viết nào!
          </p>
        )}
      </div>
    </div>
  );
}

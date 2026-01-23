import { useEffect, useState } from "react";
import axios from "axios";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  const [form, setForm] = useState({
    id: null,
    title: "",
    subtitle: "",
    content: "",
  });

  const [image, setImage] = useState(null);

  const loadData = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/posts");
    setPosts(res.data.data ?? []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({ id: null, title: "", subtitle: "", content: "" });
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mergedTitle = `${form.title.toUpperCase()}\n${form.subtitle.toUpperCase()}`;

    const fd = new FormData();
    fd.append(
      "post",
      new Blob(
        [JSON.stringify({ title: mergedTitle, content: form.content })],
        { type: "application/json" }
      )
    );
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
    const [title = "", subtitle = ""] = post.title.split("\n");

    setForm({
      id: post.id,
      title,
      subtitle,
      content: post.content,
    });
  };



  const handleDelete = async (id) => {
    if (!window.confirm("Xoá bài viết này?")) return;
    await axios.delete(`http://localhost:8080/api/v1/posts/${id}`);
    loadData();
  };

  const renderTitle = (rawTitle) => {
    const [title, subtitle] = rawTitle.split("\n");

    return (
      <div className="space-y-1">
        <h3 className="text-green-700 text-xl font-extrabold uppercase">
          {title}
        </h3>

        {subtitle && (
          <p className="text-black text-sm font-bold uppercase">
            {subtitle}
          </p>
        )}
      </div>
    );
  };


  return (
    <div className="p-8 space-y-12 bg-gray-50 min-h-screen">

      {/* FORM */}
      <div className="bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          📝 {form.id ? "Cập nhật bài viết" : "Tạo bài viết mới"}
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="TIÊU ĐỀ CHÍNH (VIẾT HOA)"
            className="border p-3 w-full rounded font-bold"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />


          <textarea
            placeholder="CHÚ THÍCH (VIẾT HOA – nhỏ hơn)"
            className="border p-3 w-full rounded h-20 font-semibold"
            value={form.subtitle}
            onChange={(e) =>
              setForm({ ...form, subtitle: e.target.value })
            }
          />



          <textarea
            placeholder="Nội dung bài viết..."
            className="border p-3 w-full h-48 rounded"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />

          <div>
            <label className="block font-medium mb-1">Ảnh đại diện</label>
            <input type="file" accept="image/*"
              onChange={(e) => setImage(e.target.files[0])} />

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt=""
                className="h-24 rounded mt-3 object-cover border"
              />
            )}
          </div>

          <div className="flex gap-3">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              {form.id ? "💾 Lưu thay đổi" : "➕ Tạo bài viết"}
            </button>

            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">📚 Danh sách bài viết</h2>

        <table className="w-full border rounded overflow-hidden">
          <thead className="bg-green-50">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border w-1/2">Tiêu đề</th>
              <th className="p-3 border w-40">Ảnh</th>
              <th className="p-3 border">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border p-3">{p.id}</td>

                <td className="border p-3">
                  {renderTitle(p.title)}
                </td>


                <td className="border p-3">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="h-16 w-full object-cover rounded"
                    />
                  ) : (
                    <span className="italic text-gray-400">No image</span>
                  )}
                </td>

                <td className="border p-3 space-x-4">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    ✏ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 font-semibold hover:underline"
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
            Chưa có bài viết nào
          </p>
        )}
      </div>
    </div>
  );
}

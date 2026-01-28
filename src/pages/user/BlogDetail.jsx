import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetch(`${API_BASE}/api/v1/posts/${id}`)
      .then((res) => res.json())
      .then((json) => {
        console.log("API RESPONSE:", json);
        setPost(json.data);  // LẤY ĐÚNG TRƯỜNG
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!post) return <p className="pt-32 text-center">Đang tải bài viết...</p>;
  const renderTitle = (rawTitle) => {
    const [title, subtitle] = rawTitle.split("\n");

    return (
      <div className="mb-6 space-y-2">
        <h1 className="text-4xl font-extrabold text-[#2E7D32] uppercase leading-tight">
          {title}
        </h1>

        {subtitle && (
          <h2 className="text-base font-bold text-gray-800 uppercase">
            {subtitle}
          </h2>
        )}
      </div>
    );
  };

  const renderContent = (text) =>
    text.split(/\s+/).map((word, index) =>
      word.match(/\.(png|jpg|jpeg|gif|webp)$/i) ? (
        <img
          key={index}
          src={word}
          alt=""
          className="w-full my-4 rounded-xl shadow"
        />
      ) : (
        word + " "
      )
    );

  return (
    <section className="pt-32 pb-20 px-6 bg-[#E8F5E9] min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          {renderTitle(post.title)}
        </h1>

        {post.createdAt && (
          <p className="text-gray-500 text-sm mb-6">
            📅 {new Date(post.createdAt).toLocaleDateString()}
          </p>
        )}

        <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
          {renderContent(post.content)}
        </div>

        <div className="text-center mt-10">
          <a
            href="/blog"
            className="bg-[#A5D6A7] hover:bg-[#81C784] text-white px-6 py-2 rounded-full font-medium transition"
          >
           Quay lại danh sách
          </a>
        </div>
      </div>
    </section>
  );
}

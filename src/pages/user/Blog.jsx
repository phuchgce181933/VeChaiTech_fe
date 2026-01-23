import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/posts")
      .then((res) => res.json())
      .then((json) => setPosts(json.data ?? []));
  }, []);
  const renderTitle = (rawTitle) => {
    const [title, subtitle] = rawTitle.split("\n");

    return (
      <div className="space-y-1">
        <h3 className="text-[#2E7D32] text-lg font-extrabold uppercase leading-snug">
          {title}
        </h3>

        {subtitle && (
          <p className="text-gray-800 text-sm font-bold uppercase leading-snug">
            {subtitle}
          </p>
        )}
      </div>
    );
  };

  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-center text-4xl sm:text-5xl font-extrabold text-[#2E7D32] mb-12 tracking-tight">
          Tin tức & Blog
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#A5D6A7]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image preview (nếu API chưa có ảnh thì dùng ảnh tạm) */}
              <img
                src={p.imageUrl || "https://placehold.co/600x350?text=Blog+Image"}
                alt={p.title}
                className="w-full h-48 object-cover"
              />

              {/* Content */}
              <div className="p-6">
                <div className="mb-3">
                  {renderTitle(p.title)}
                </div>


                {/* <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                  {p.content?.replace(/<[^>]+>/g, "").slice(0, 120) + "..."}
                </p> */}

                <Link
                  to={`/blog/${p.id}`}
                  className="inline-flex items-center gap-1 mt-4 bg-[#4CAF50] hover:bg-[#388E3C] text-white px-4 py-2 rounded-full transition-all text-sm"
                >
                  Đọc thêm →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-gray-700 mt-20 text-xl">
            😕 Hiện chưa có bài viết nào
          </p>
        )}
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function BlogPage() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ===== FETCH POSTS ===== */
  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/posts`, {
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          signal: controller.signal,
        });

        const contentType = res.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          throw new Error("API không trả JSON");
        }

        const json = await res.json();
        setPosts(Array.isArray(json?.data) ? json.data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Không tải được bài viết");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    return () => controller.abort();
  }, [API_BASE]);

  /* ===== RENDER TITLE ===== */
  const renderTitle = (rawTitle = "") => {
    const [title, subtitle] = rawTitle.split("\n");

    return (
      <div className="space-y-1">
        <h3 className="text-[#2E7D32] text-lg font-extrabold uppercase leading-snug">
          {title || "Không có tiêu đề"}
        </h3>

        {subtitle && (
          <p className="text-gray-800 text-sm font-bold uppercase leading-snug">
            {subtitle}
          </p>
        )}
      </div>
    );
  };

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ===== ERROR ===== */
  if (error) {
    return (
      <p className="text-center text-red-600 py-24 text-lg">
        {error}
      </p>
    );
  }

  return (
    <section className="relative py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h1 className="text-center text-4xl sm:text-5xl font-extrabold text-[#2E7D32] mb-12 tracking-tight">
          Tin tức & Blog
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#A5D6A7]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <img
                src={
                  p.imageUrl ||
                  "https://placehold.co/600x350?text=Blog+Image"
                }
                alt={p.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />

              {/* Content */}
              <div className="p-6">
                <div className="mb-3">
                  {renderTitle(p.title)}
                </div>

                <Link
                  to={`/blog/${p.id}`}
                  className="inline-flex items-center gap-1 mt-4 bg-[#4CAF50] hover:bg-[#388E3C] text-white px-4 py-2 rounded-full transition-all text-sm"
                >
                  Đọc thêm →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* EMPTY */}
        {posts.length === 0 && (
          <p className="text-center text-gray-700 mt-20 text-xl">
            😕 Hiện chưa có bài viết nào
          </p>
        )}
      </div>
    </section>
  );
}

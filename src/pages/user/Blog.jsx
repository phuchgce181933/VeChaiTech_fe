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
        <h3 className="text-[#2E7D32] text-base sm:text-lg font-bold leading-snug line-clamp-2">
          {title || "Không có tiêu đề"}
        </h3>

        {subtitle && (
          <p className="text-gray-700 text-xs sm:text-sm font-semibold line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>
    );
  };

  /* ===== LOADING (Skeleton mobile-friendly) ===== */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white rounded-2xl shadow-md overflow-hidden"
          >
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded-full w-32 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ===== ERROR ===== */
  if (error) {
    return (
      <p className="text-center text-red-600 py-20 text-base sm:text-lg">
        {error}
      </p>
    );
  }

  return (
    <section className="relative py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Title */}
        <h1 className="text-center text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#2E7D32] mb-10 sm:mb-14 tracking-tight">
          Tin tức & Blog
        </h1>

        {/* Grid */}
        {/* Grid / Scroll */}
        <div
          className="
    flex sm:grid
    sm:grid-cols-2
    lg:grid-cols-3
    gap-4 sm:gap-8
    overflow-x-auto
    sm:overflow-visible
    pb-4
    snap-x snap-mandatory
    scrollbar-hide
  "
        >
          {posts.map((p) => (
            <article
              key={p.id}
              className="
        min-w-[85%]
        sm:min-w-0
        bg-white
        rounded-2xl
        shadow-md
        overflow-hidden
        border border-[#A5D6A7]/40
        transition-all duration-300
        hover:shadow-xl
        hover:-translate-y-1
        snap-start
      "
            >
              {/* Image */}
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={
                    p.imageUrl ||
                    "https://placehold.co/600x350?text=Blog+Image"
                  }
                  alt={p.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                {renderTitle(p.title)}

                <Link
                  to={`/blog/${p.id}`}
                  className="
            mt-4
            inline-flex
            justify-center
            items-center
            bg-[#4CAF50]
            hover:bg-[#388E3C]
            text-white
            px-4 py-2
            rounded-full
            text-sm
            transition-all
          "
                >
                  Đọc thêm →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* EMPTY */}
        {posts.length === 0 && (
          <p className="text-center text-gray-600 mt-16 text-base sm:text-lg">
            😕 Hiện chưa có bài viết nào
          </p>
        )}

      </div>
    </section>
  );
}
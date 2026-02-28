import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./css/BannerSlide.css";
export default function BannerSlide() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/banners/list`, {
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          signal: controller.signal,
        });

        const contentType = res.headers.get("content-type");

        if (!res.ok || !contentType?.includes("application/json")) {
          throw new Error("API không trả JSON");
        }

        const json = await res.json();

        const list = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
            ? json.data
            : [];

        setBanners(list.filter((b) => b.status === true));
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Banner error:", err);
          setError("Không tải được banner");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
    return () => controller.abort();
  }, [API_BASE]);

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-green-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-green-700 font-medium">Đang tải banner...</p>
        </div>
      </div>
    );
  }

  /* ===== ERROR ===== */
  if (error) {
    return (
      <p className="text-center text-red-600 py-10">
        {error}
      </p>
    );
  }

  /* ===== EMPTY ===== */
  if (banners.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-600 italic">
        Không có banner nào hoạt động.
      </p>
    );
  }

  return (
    <div className="eco-banner">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="eco-swiper"
      >
        {banners.map((b) => (
          <SwiperSlide key={b.id}>
            <a
              href={b.targetUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="eco-slide"
            >
              {/\.(mp4|webm|ogg)$/i.test(b.bannerUrl) ? (
                <video
                  src={b.bannerUrl}
                  autoPlay
                  muted
                  loop
                  className="eco-media"
                />
              ) : (
                <img
                  src={b.bannerUrl}
                  alt={b.title || "Banner"}
                  className="eco-media"
                />
              )}

              {/* GREEN OVERLAY */}
              <div className="eco-overlay" />

              {b.title && (
                <div className="eco-content">
                  <h2>{b.title}</h2>

                  {b.description && (
                    <p>{b.description}</p>
                  )}

                  <span className="eco-cta">
                    Khám phá ngay →
                  </span>
                </div>
              )}
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="custom-prev eco-nav-btn">‹</button>
      <button className="custom-next eco-nav-btn">›</button>
    </div>
  );
}

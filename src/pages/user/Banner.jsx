import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
    <div className="relative w-full h-[360px] md:h-[500px] lg:h-[520px] overflow-hidden rounded-3xl shadow-xl">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="w-full h-full"
      >
        {banners.map((b) => (
          <SwiperSlide key={b.id}>
            <a
              href={b.targetUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full relative"
            >
              {/\.(mp4|webm|ogg)$/i.test(b.bannerUrl) ? (
                <video
                  src={b.bannerUrl}
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={b.bannerUrl}
                  alt={b.title || "Banner"}
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              {b.title && (
                <div className="absolute bottom-10 left-6 md:left-12 text-white max-w-xl">
                  <h2 className="text-3xl md:text-5xl font-extrabold">
                    {b.title}
                  </h2>

                  {b.description && (
                    <p className="mt-3 text-gray-200">
                      {b.description}
                    </p>
                  )}
                </div>
              )}
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/40 w-10 h-10 rounded-full">
        ‹
      </button>
      <button className="custom-next absolute right-4 top-1/2 -translate-y-1/2 bg-white/40 w-10 h-10 rounded-full">
        ›
      </button>
    </div>
  );
}

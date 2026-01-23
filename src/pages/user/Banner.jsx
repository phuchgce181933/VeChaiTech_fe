import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function BannerSlide() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/banners/list")
      .then((res) => res.json())
      .then((data) => {
        const active = data.filter((b) => b.status === true);
        setBanners(active);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải banner:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[400px] bg-gradient-to-b border-[#2E7D32] to-green-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#2E7D32] font-medium">Đang tải banner...</p>
        </div>
      </div>
    );

  if (banners.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600 italic">
        Không có banner nào hoạt động.
      </p>
    );

  return (
    <div className="relative w-full h-[1px] md:h-[500px] lg:h-[520px] overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] ">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          enabled: true,
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        pagination={{
          clickable: true,
          bulletClass:
            "swiper-pagination-bullet !w-3 !h-3 !bg-white !opacity-50",
          bulletActiveClass:
            "!bg-[#2E7D32] !opacity-100 !shadow-[0_0_8px_2px_rgba(46,125,50,0.6)]",
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="w-full h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <a
              href={banner.targetUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block w-full h-full"
            >
              {/* Video hoặc ảnh */}
              {banner.bannerUrl.match(/\.(mp4|mov|webm|ogg)$/i) ? (
                <video
                  src={banner.bannerUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={banner.bannerUrl}
                  alt={banner.title || "Banner"}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              {/* Text animation */}
              {banner.title && (
                <div className="absolute bottom-12 left-6 md:left-12 text-white max-w-xl animate-fade-in">
                  <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
                    {banner.title}
                  </h2>

                  {banner.description && (
                    <p className="mt-4 text-base md:text-lg text-gray-200">
                      {banner.description}
                    </p>
                  )}

                  <button
                    className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500
    text-white font-medium shadow-lg hover:scale-105 transition"
                  >
                    Khám phá ngay
                  </button>
                </div>

              )}
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      <button className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 backdrop-blur-md text-[#2E7D32] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition">
        <span className="text-xl font-bold">‹</span>
      </button>
      <button className="custom-next absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 backdrop-blur-md text-[#2E7D32] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition">
        <span className="text-xl font-bold">›</span>
      </button>
    </div>
  );
}

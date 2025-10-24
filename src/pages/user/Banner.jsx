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
      <div className="flex justify-center items-center h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-green-700 font-medium">Đang tải banner...</p>
        </div>
      </div>
    );

  if (banners.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">
        Không có banner nào hoạt động.
      </p>
    );

  return (
    <div className="relative w-full max-w-7xl mx-auto h-[450px] md:h-[550px] mt-6 rounded-2xl overflow-hidden shadow-2xl">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{
          clickable: true,
          bulletClass:
            "swiper-pagination-bullet !bg-white !opacity-60 hover:!opacity-100 transition",
          bulletActiveClass: "!opacity-100 !bg-green-500",
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
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
              <img
                src={banner.bannerUrl}
                alt={banner.title || "Banner"}
                className="w-full h-full object-cover"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>

              {/* Tiêu đề banner */}
              {banner.title && (
                <div className="absolute bottom-10 left-10 text-white drop-shadow-md">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    {banner.title}
                  </h2>
                  {banner.description && (
                    <p className="text-lg mt-2 max-w-md text-gray-200">
                      {banner.description}
                    </p>
                  )}
                </div>
              )}
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className="swiper-button-prev !text-white !bg-black/30 hover:!bg-black/50 !w-10 !h-10 !rounded-full !top-1/2 !-translate-y-1/2 transition"></div>
      <div className="swiper-button-next !text-white !bg-black/30 hover:!bg-black/50 !w-10 !h-10 !rounded-full !top-1/2 !-translate-y-1/2 transition"></div>
    </div>
  );
}

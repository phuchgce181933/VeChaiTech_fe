import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function WasteListings() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [wasteListings, setWasteListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWastes = async () => {
      try {
        const res = await axiosClient.get("/api/v1/wastelistings/list");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setWasteListings(data);
      } catch (err) {
        console.error("Lỗi tải waste listings:", err);
        setError("Không thể tải dữ liệu vật liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchWastes();
  }, []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <section className="pt-14 pb-8">
        <h2 className="text-2xl md:text-5xl font-bold text-center text-emerald-800 mb-6">
          Vật liệu tái chế phổ biến ♻️
        </h2>

        <div className="flex gap-4 px-4 md:px-10 max-w-7xl mx-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-44 h-56 bg-gray-200 rounded-2xl animate-pulse flex-none"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-10 font-medium">
        {error}
      </p>
    );
  }

  if (wasteListings.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500 italic">
        Chưa có vật liệu tái chế nào
      </p>
    );
  }

  return (
    <section className="pt-14 pb-10">
      <h2 className="text-2xl md:text-5xl font-bold text-center text-emerald-800 mb-6">
        Vật liệu tái chế phổ biến ♻️
      </h2>

      <div className="relative max-w-7xl mx-auto">

        {/* LEFT – chỉ desktop */}
        <button
          onClick={() => scroll("left")}
          className="
  hidden md:flex
  absolute -left-4 top-1/2 -translate-y-1/2 z-10
  bg-white shadow-lg rounded-full w-10 h-10
  items-center justify-center
"

        >
          ‹
        </button>

        {/* LIST */}
        <div
          ref={scrollRef}
          className="
            flex gap-4
            overflow-x-auto
            px-4 md:px-10
            scroll-smooth
            no-scrollbar
          "
          style={{
            touchAction: "pan-x",
            overscrollBehaviorX: "contain",
          }}
        >
          {wasteListings.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                navigate(`/create-collection?wasteListingId=${item.id}`)
              }
              className="
                w-44 md:w-56
                flex-none
                bg-white rounded-2xl p-3 md:p-4
                shadow hover:shadow-xl
                transition cursor-pointer
                active:scale-95
              "
            >
              <img
                src={item.wasteUrl}
                alt={item.name}
                className="h-28 md:h-32 w-full object-cover rounded-xl mb-2"
                loading="lazy"
              />
              <h3 className="font-semibold text-emerald-700 text-sm md:text-base truncate">
                {item.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                {item.price
                  ? `${item.price.toLocaleString()} đ / kg`
                  : `${item.quantity || 0} kg`}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT – chỉ desktop */}
        <button
         className="
  hidden md:flex
  absolute -right-4 top-1/2 -translate-y-1/2 z-10
  bg-white shadow-lg rounded-full w-10 h-10
  items-center justify-center
"

        >
          ›
        </button>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/create-collection")}
          className="
            px-6 md:px-8 py-3 rounded-full
            bg-emerald-600 text-white
            font-semibold
            hover:bg-emerald-700 transition
          "
        >
          Tạo đơn thu gom ngay
        </button>
      </div>
    </section>
  );
}

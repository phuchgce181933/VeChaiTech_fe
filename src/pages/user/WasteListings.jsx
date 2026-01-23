import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function WasteListings() {
  const navigate = useNavigate();
  const [wasteListings, setWastes] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/wastelistings/list")
      .then((res) => res.json())
      .then(setWastes);
  }, []);

  const scroll = (dir) => {
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="-mt-10 pt-20 pb-10 from-[#aff0b5] via-[#b2e0b6] to-[#17e11e]">
      <h2 className="text-5xl font-bold text-center text-emerald-800 mb-6">
        Vật liệu tái chế phổ biến ♻️
      </h2>

      <div className="relative max-w-7xl mx-auto">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full w-9 h-9"
        >
          ‹
        </button>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto px-10 scroll-smooth no-scrollbar"
        >
          {wasteListings.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                navigate(`/create-collection?wasteListingId=${item.id}`)
              }
              className="w-56 flex-none bg-white rounded-2xl p-4 shadow hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={item.wasteUrl}
                alt={item.name}
                className="h-32 w-full object-cover rounded-xl mb-3"
              />
              <h3 className="font-semibold text-emerald-700">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {item.price
                  ? `${item.price.toLocaleString()} đ / kg`
                  : `${item.quantity || 0} kg`}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full w-9 h-9"
        >
          ›
        </button>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/create-collection")}
          className="px-8 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
        >
          Tạo đơn thu gom ngay
        </button>
      </div>
    </section>
  );
}

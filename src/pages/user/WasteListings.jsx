import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function WasteListings() {
  const navigate = useNavigate();
  const [wasteListings, setWastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/wastelistings/list")
      .then((res) => res.json())
      .then((data) => {
        setWastes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách rác:", err);
        setLoading(false);
      });
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 350;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[1000px] bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#66BB6A] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#2E7D32] font-medium">Đang tải danh sách vật liệu...</p>
        </div>
      </div>
    );

  return (
    <div className="px-6 py-16 bg-gradient-to-b from-[#E8F5E9] via-[#D0ECD8] to-[#C8E6C9] relative">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#2E7D32] via-[#00A8CC] to-[#66BB6A] mb-10">
        ♻️ Danh sách vật liệu tái chế
      </h1>

      <div className="relative max-w-7xl mx-auto">
        {/* Nút trái */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#2E7D32] via-[#00A8CC] to-[#66BB6A] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition z-20"
        >
          ←
        </button>

        {/* Cuộn ngang */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-12 py-4 no-scrollbar"
        >
          {wasteListings.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/create-collection?wasteListingId=${item.id}`)}
              className="flex-none w-60 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center p-6 border border-[#66BB6A]/30 cursor-pointer hover:border-[#66BB6A]"
            >
              <img
                src={
                  item.wasteUrl ||
                  "https://cdn-icons-png.flaticon.com/512/565/565547.png"
                }
                alt={item.name}
                className="w-full h-36 object-cover rounded-xl mb-4 drop-shadow-md"
              />
              <h2 className="text-lg font-semibold text-[#2E7D32] mb-1">
                {item.name}
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                💰{" "}
                {item.price
                  ? `${item.price.toLocaleString()}đ / kg`
                  : `${item.quantity?.toLocaleString() || 0} kg`}
              </p>
            </div>
          ))}
        </div>

        {/* Nút phải */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#2E7D32] via-[#00A8CC] to-[#66BB6A] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition z-20"
        >
          →
        </button>
      </div>
      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/create-collection")}
          className="bg-gradient-to-r from-[#2E7D32] via-[#00A8CC] to-[#66BB6A] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-lg"
        >
          📦 Tạo đơn thu gom ngay
        </button>
      </div>
    </div>
  );
}

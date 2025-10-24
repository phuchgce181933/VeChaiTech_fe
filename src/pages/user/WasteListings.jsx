import { useEffect, useState, useRef } from "react";

export default function WasteListings() {
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
      <div className="flex justify-center items-center h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-green-700 font-medium">Đang tải danh sách vật liệu...</p>
        </div>
      </div>
    );

  return (
    <div className="px-6 py-10 bg-gradient-to-b from-gray-50 to-green-50 relative">
      <h1 className="text-3xl font-extrabold text-center text-green-700 mb-8">
        ♻️ Danh sách vật liệu tái chế
      </h1>

      <div className="relative max-w-7xl mx-auto">
        {/* Nút điều hướng trái */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-green-700 transition z-20"
        >
          ←
        </button>

        {/* Danh sách cuộn ngang */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-12 py-4 no-scrollbar"
        >
          {wasteListings.map((item) => (
            <div
              key={item.id}
              className="flex-none w-60 bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center p-5"
            >
              <img
                src={
                  item.wasteUrl ||
                  "https://cdn-icons-png.flaticon.com/512/565/565547.png"
                }
                alt={item.name}
                className="w-20 h-20 object-contain mb-4"
              />
              <h2 className="text-lg font-semibold text-green-700 mb-1">
                {item.name}
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                💰{" "}
                {item.price
                  ? `${item.price.toLocaleString()}đ / kg`
                  : `${item.quantity?.toLocaleString() || 0} kg`}
              </p>
              <button className="mt-auto bg-green-600 hover:bg-green-700 text-white font-medium text-sm py-2 px-5 rounded-full shadow-sm transition">
                Bán ngay
              </button>
            </div>
          ))}
        </div>

        {/* Nút điều hướng phải */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-green-700 transition z-20"
        >
          →
        </button>
      </div>
    </div>
  );
}

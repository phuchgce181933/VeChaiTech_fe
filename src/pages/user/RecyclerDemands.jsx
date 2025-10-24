import { useEffect, useState } from "react";
import axios from "axios";

const RecyclerDemands = () => {
  const [demands, setDemands] = useState([]);
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [wasteList, setWasteList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/v1/recycler-demands")
      .then((res) => setDemands(res.data))
      .catch((err) => console.error("Error fetching recycler demands:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectDemand = (demand) => {
    setSelectedDemand(demand);
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/v1/wastelistings/recycler/${demand.id}`)
      .then((res) => setWasteList(res.data))
      .catch((err) => console.error("Error fetching waste listings:", err))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-green-700 font-medium text-lg">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {!selectedDemand ? (
        <>
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mb-10">
            Đối tác & Doanh nghiệp Hợp Tác
          </h2>

          {demands.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              Không có dữ liệu doanh nghiệp.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {demands.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectDemand(item)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:scale-[1.03] cursor-pointer p-6 flex flex-col items-center text-center"
                >
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/100"}
                    alt={item.name}
                    className="w-24 h-24 object-contain mb-4 rounded-full border border-green-100"
                  />
                  <h3 className="text-green-700 font-semibold text-lg mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">
                    Xem vật liệu →
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <button
            onClick={() => setSelectedDemand(null)}
            className="mb-6 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
          >
            ← Quay lại
          </button>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-green-700 mb-2">
              ♻️ Danh sách vật liệu của{" "}
              <span className="text-green-800">{selectedDemand.name}</span>
            </h2>
            <p className="text-gray-500">
              Khám phá các loại vật liệu mà doanh nghiệp này đang cần.
            </p>
          </div>

          {wasteList.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              Doanh nghiệp chưa có vật liệu nào được đăng.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {wasteList.map((waste) => (
                <div
                  key={waste.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-[1.02] p-6 flex flex-col items-center"
                >
                  <img
                    src={waste.wasteUrl || "https://via.placeholder.com/100"}
                    alt={waste.name}
                    className="w-24 h-24 object-cover rounded-lg mb-4 border border-gray-100"
                  />
                  <h3 className="text-green-700 font-semibold text-center text-lg">
                    {waste.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    💰 {waste.price?.toLocaleString()} đ / kg
                  </p>
                  <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-sm transition font-medium">
                    Bán ngay
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecyclerDemands;

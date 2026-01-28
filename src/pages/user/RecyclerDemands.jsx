import { useEffect, useState } from "react";
import axios from "axios";

export default function RecyclerDemands() {
  const [demands, setDemands] = useState([]);
  const [selected, setSelected] = useState(null);
  const [wastes, setWastes] = useState([]);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/v1/recycler-demands`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setDemands(data);
      })
      .catch((err) => {
        console.error("Lỗi tải recycler-demands:", err);
        setDemands([]);
      });
  }, [API_BASE]);

  const selectDemand = (d) => {
    setSelected(d);
    axios
      .get(`${API_BASE}/api/v1/wastelistings/recycler/${d.id}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((res) => {
        setWastes(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Lỗi tải waste:", err);
        setWastes([]);
      });
  };

  return (
    <section className="py-12 md:py-16">
      {!selected ? (
        <>
          <h2 className="text-3xl md:text-5xl font-bold text-center text-emerald-800 mb-8 md:mb-10">
            Doanh nghiệp tái chế
          </h2>

          {/* ===== MOBILE: KÉO NGANG ===== */}
          <div className="md:hidden">
            <div
              className="
                flex gap-4 overflow-x-auto
                px-4 pb-4
                snap-x snap-mandatory
              "
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {demands.map((d) => (
                <div
                  key={d.id}
                  onClick={() => selectDemand(d)}
                  className="
                    min-w-[80%]
                    snap-start
                    bg-white p-6
                    rounded-2xl shadow
                    cursor-pointer
                    text-center
                  "
                >
                  <img
                    src={d.imageUrl}
                    alt={d.name}
                    className="w-20 h-20 mx-auto object-contain mb-4"
                  />
                  <h3 className="font-semibold text-emerald-700">
                    {d.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* ===== DESKTOP: GRID ===== */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
            {demands.map((d) => (
              <div
                key={d.id}
                onClick={() => selectDemand(d)}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer transition text-center"
              >
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  className="w-20 h-20 mx-auto object-contain mb-4"
                />
                <h3 className="font-semibold text-emerald-700">
                  {d.name}
                </h3>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => setSelected(null)}
            className="mb-6 text-emerald-700 font-medium"
          >
            ← Quay lại
          </button>

          <h3 className="text-xl md:text-2xl font-bold text-emerald-800 mb-6 md:mb-8">
            Vật liệu của {selected.name}
          </h3>

          {/* ===== MOBILE: KÉO NGANG ===== */}
          <div className="md:hidden">
            <div
              className="
                flex gap-4 overflow-x-auto
                pb-4
                snap-x snap-mandatory
              "
            >
              {wastes.map((w) => (
                <div
                  key={w.id}
                  className="
                    min-w-[75%]
                    snap-start
                    bg-white p-4
                    rounded-2xl shadow
                  "
                >
                  <img
                    src={w.wasteUrl}
                    alt={w.name}
                    className="w-full h-32 object-cover rounded-xl mb-3"
                  />
                  <h4 className="font-semibold text-emerald-700">
                    {w.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    💰 {w.price?.toLocaleString()} đ / kg
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== DESKTOP: GRID ===== */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {wastes.map((w) => (
              <div
                key={w.id}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-lg"
              >
                <img
                  src={w.wasteUrl}
                  alt={w.name}
                  className="w-full h-32 object-cover rounded-xl mb-3"
                />
                <h4 className="font-semibold text-emerald-700">
                  {w.name}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  💰 {w.price?.toLocaleString()} đ / kg
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

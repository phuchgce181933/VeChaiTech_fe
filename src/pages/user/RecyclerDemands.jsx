import { useEffect, useState } from "react";
import axios from "axios";
import "./css/RecyclerDemands.css";
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
  <section className="py-14 md:py-20 mt-10 bg-gradient-to-b from-emerald-50 to-white">
    {!selected ? (
      <>
        <h2 className="text-3xl md:text-5xl font-bold text-center text-emerald-800 mb-14 tracking-tight">
          Doanh nghiệp tái chế
        </h2>

        {/* ===== MOBILE: KÉO NGANG ===== */}
        <div className="md:hidden">
          <div
            className="
              flex gap-5 overflow-x-auto
              px-4 pb-6
              snap-x snap-mandatory
              no-scrollbar
            "
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {demands.map((d) => (
              <div
                key={d.id}
                onClick={() => selectDemand(d)}
                className="
                  min-w-[85%]
                  snap-start
                  bg-white p-6
                  rounded-3xl
                  shadow-md
                  active:scale-95
                  transition
                  cursor-pointer
                  text-center
                  border border-emerald-100
                "
              >
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  className="w-24 h-24 mx-auto object-contain mb-4"
                />
                <h3 className="font-semibold text-lg text-emerald-700">
                  {d.name}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* ===== DESKTOP: GRID ===== */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
          {demands.map((d) => (
            <div
              key={d.id}
              onClick={() => selectDemand(d)}
              className="
                bg-white p-8 rounded-3xl
                border border-emerald-100
                hover:border-emerald-500
                shadow-sm hover:shadow-xl
                hover:-translate-y-2
                transition-all duration-300
                cursor-pointer
                text-center
              "
            >
              <img
                src={d.imageUrl}
                alt={d.name}
                className="w-24 h-24 mx-auto object-contain mb-5"
              />
              <h3 className="font-semibold text-lg text-emerald-700">
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
          className="
            mb-8 inline-flex items-center gap-2
            text-emerald-700 font-medium
            hover:text-emerald-900
            transition
          "
        >
          ← Quay lại
        </button>

        <h3 className="text-2xl md:text-4xl font-bold text-emerald-800 mb-10">
          Vật liệu của {selected.name}
        </h3>

        {/* ===== MOBILE: KÉO NGANG ===== */}
        <div className="md:hidden">
          <div
            className="
              flex gap-5 overflow-x-auto
              pb-6
              snap-x snap-mandatory
              no-scrollbar
            "
          >
            {wastes.map((w) => (
              <div
                key={w.id}
                className="
                  min-w-[80%]
                  snap-start
                  bg-white p-5
                  rounded-3xl
                  shadow-md
                  border border-emerald-100
                "
              >
                <img
                  src={w.wasteUrl}
                  alt={w.name}
                  className="w-full h-40 object-cover rounded-2xl mb-4"
                />

                <h4 className="font-semibold text-lg text-emerald-700">
                  {w.name}
                </h4>

                <p className="text-emerald-600 font-semibold mt-2 text-base">
                  {w.price?.toLocaleString()} đ / kg
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== DESKTOP: GRID ===== */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
          {wastes.map((w) => (
            <div
              key={w.id}
              className="
                bg-white p-6 rounded-3xl
                shadow-sm hover:shadow-xl
                hover:-translate-y-2
                transition-all duration-300
                border border-emerald-100
              "
            >
              <img
                src={w.wasteUrl}
                alt={w.name}
                className="w-full h-40 object-cover rounded-2xl mb-4"
              />

              <h4 className="font-semibold text-lg text-emerald-700">
                {w.name}
              </h4>

              <p className="text-emerald-600 font-semibold mt-2 text-base">
                {w.price?.toLocaleString()} đ / kg
              </p>
            </div>
          ))}
        </div>
      </div>
    )}
  </section>
);
}
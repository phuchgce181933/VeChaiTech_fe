import { useEffect, useState } from "react";
import axios from "axios";

export default function RecyclerDemands() {
  const [demands, setDemands] = useState([]);
  const [selected, setSelected] = useState(null);
  const [wastes, setWastes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/recycler-demands")
      .then((res) => setDemands(res.data));
  }, []);

  const selectDemand = (d) => {
    setSelected(d);
    axios
      .get(`http://localhost:8080/api/v1/wastelistings/recycler/${d.id}`)
      .then((res) => setWastes(res.data));
  };

  return (
    <section className="py-16 from-[#aff0b5] via-[#b2e0b6] to-[#17e11e]">
      {!selected ? (
        <>
          <h2 className="text-5xl font-bold text-center text-emerald-800 mb-10">
            Doanh nghiệp tái chế
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
            {demands.map((d) => (
              <div
                key={d.id}
                onClick={() => selectDemand(d)}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer transition"
              >
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  className="w-20 h-20 mx-auto object-contain mb-4"
                />
                <h3 className="text-center font-semibold text-emerald-700">
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

          <h3 className="text-2xl font-bold text-emerald-800 mb-8">
            Vật liệu của {selected.name}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

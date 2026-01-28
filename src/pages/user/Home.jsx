import BannerSlide from "./Banner";
import WasteListings from "./WasteListings";
import RecyclerDemands from "./RecyclerDemands";
import MapDirection from "./MapDirection";
import Contact from "./Contact";

export default function About() {
  return (
    <div className="relative w-full overflow-x-hidden">
      {/* ================= BANNER ================= */}
      {/* Mobile: cao vừa | Desktop: cao hơn */}
      <section className="relative w-full overflow-hidden">
        <div className="min-h-[220px] sm:min-h-[300px] md:min-h-[420px]">
          <BannerSlide />
        </div>
      </section>

      {/* ================= WASTE + RECYCLER ================= */}
      <section className="relative -mt-6 sm:-mt-10 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">
          <WasteListings />
          <RecyclerDemands />
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="mt-14 sm:mt-20 px-3 sm:px-6">
        <div className="text-center mb-6 sm:mb-10 px-2">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-800 leading-tight">
            Tìm điểm thu gom gần bạn
          </h3>
          <p className="text-gray-600 mt-3 text-sm sm:text-base max-w-2xl mx-auto">
            Xác định vị trí nhanh chóng, tìm điểm thu gom hoặc nhà tái chế gần nhất
            để tiết kiệm thời gian và chi phí.
          </p>
        </div>

        <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
          {/* Map responsive height */}
          <div className="h-[300px] sm:h-[400px] md:h-[480px]">
            <MapDirection />
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="mt-10 sm:mt-16 px-3 sm:px-6 pb-12">
        <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
          <Contact />
        </div>
      </section>
    </div>
  );
}

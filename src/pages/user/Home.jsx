import BannerSlide from "./Banner";
import WasteListings from "./WasteListings";
import RecyclerDemands from "./RecyclerDemands";
import MapDirection from "./MapDirection";
import Contact from "./Contact";
export default function About() {
  return (
   <div className="relative">
      {/* ================= BANNER ================= */}
      {/* ❌ bỏ h-screen, dùng chiều cao thật của banner */}
      <section className="relative w-full overflow-hidden">
        <BannerSlide />
      </section>

      {/* ================= WASTE + RECYCLER ================= */}
      {/* 🔽 Kéo sát banner, bỏ khoảng trắng thừa */}
      <section className="relative -mt-8 px-2 md:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <WasteListings />

          <div className="mt-4">
            <RecyclerDemands />
          </div>
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="mt-20 px-4 md:px-6 relative">
        <div className="text-center mb-10">
          <h3 className="text-5xl font-bold text-center text-emerald-800 mb-1">
            Tìm điểm thu gom gần bạn
          </h3>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Xác định vị trí nhanh chóng, tìm điểm thu gom hoặc nhà tái chế gần nhất để tiết kiệm thời gian và chi phí.
          </p>
        </div>

        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl from-[#aff0b5] via-[#b2e0b6] to-[#17e11e]">
          <MapDirection />
        </div>
      </section>
      {/* ================= CONTACT ================= */}
      <div className="mt-8 max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl from-[#aff0b5] via-[#b2e0b6] to-[#17e11e]">
          <Contact />
        </div>     
    </div>
  );
}

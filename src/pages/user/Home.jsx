import BannerSlide from "./Banner";
import WasteListings from "./WasteListings";
import RecyclerDemands from "./RecyclerDemands";
import MapDirection from "./MapDirection";
import Contact from "./Contact";
import ServicesSection from "./ServicesSection";
import BlogPage from "./Blog";
import AboutProject from "./AboutProject";
import "./css/Home.css";

export default function About() {
  return (
    <div className="relative w-full overflow-x-hidden about-theme">

      {/* ================= BANNER ================= */}
      <section className="relative w-full overflow-hidden">
        <div className="min-h-[220px] sm:min-h-[300px] md:min-h-[420px]">
          <BannerSlide />
        </div>
      </section>

      {/* ================= ABOUT PROJECT ================= */}
      <section className="relative">
        <AboutProject />
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" className="relative -mt-8 sm:-mt-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <ServicesSection />
        </div>
      </section>

      {/* ================= WASTE ================= */}
      <section id="waste" className="mt-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <WasteListings />
        </div>
      </section>

      {/* ================= RECYCLER ================= */}
      <section id="recycler" className="mt-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <RecyclerDemands />
        </div>
      </section>

      {/* ================= BLOG ================= */}
      <section id="blog" className="mt-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <BlogPage />
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="mt-16 px-4 sm:px-6">
        <div className="text-center mb-10">
          <h3 className="section-title">
            Tìm điểm thu gom gần bạn
          </h3>
          <p className="section-desc">
            Xác định vị trí nhanh chóng, tìm điểm thu gom hoặc nhà tái chế gần nhất
            để tiết kiệm thời gian và chi phí.
          </p>
        </div>

        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden green-card">
          <div className="h-[320px] sm:h-[420px] md:h-[500px]">
            <MapDirection />
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
     <section id="contact" className="mt-16 px-4 sm:px-6 pb-12">
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden green-card">
          <Contact />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="green-footer mt-20 py-10 text-center">
        <p className="text-sm opacity-80">© 2026 GreenCycle Platform</p>
        <p className="text-xs opacity-60">
          Sustainable Technology for a Better Planet 🌍
        </p>
      </footer>

    </div>
  );
}
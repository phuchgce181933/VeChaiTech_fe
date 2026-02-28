import PropTypes from "prop-types";
import "./css/AboutProject.css";
export default function AboutProject() {
  return (
    <div className="about-section min-h-screen text-white px-4 sm:px-6 lg:px-12 py-16">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

        {/* ================= LEFT ================= */}
        <div className="space-y-8 text-center lg:text-left">

          {/* Avatar */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 rounded-full overflow-hidden border-4 border-emerald-400 shadow-2xl">
              <img
                src="https://res.cloudinary.com/dcg5wftdq/image/upload/v1760774533/xpknvzz5hfelc4c3qaqc.png"
                alt="GreenCycle"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              GreenCycle VeChaiTech
            </h1>
            <p className="mt-3 text-emerald-300 text-base sm:text-lg">
              Rác là cũ, tái chế là Gu. Cùng VeChaiTech đưa rác trở lại đường đua giá trị!
            </p>
            <p className="mt-3 text-emerald-300 text-base sm:text-lg">
              Đừng gọi là rác, hãy gọi là tài nguyên chờ hồi sinh tại VeChaiTech.
            </p>
            <p className="mt-3 text-emerald-300 text-base sm:text-lg">
              Thế giới không thiếu rác, chỉ thiếu những hành trình tái sinh. VeChaiTech - Viết tiếp vòng đời cho mọi nguồn lực.
            </p>
          </div>
          <a
            href="https://www.facebook.com/people/VECHAITech/61583162542936/"
            target="_blank"
            rel="noopener noreferrer"
            className="
    inline-flex items-center gap-2
    mt-5
    px-5 py-2
    rounded-full
    bg-blue-600
    hover:bg-blue-700
    transition-all duration-300
    shadow-lg
    hover:shadow-xl
    text-sm sm:text-base
    font-semibold
  "
          >
            🌐 Theo dõi Fanpage
          </a>
          {/* Info */}
          <div className="space-y-3 text-emerald-100 text-sm sm:text-base lg:text-lg">
            <p>♻️ Kết nối người dân với điểm thu gom & nhà tái chế.</p>
            <p>🗺️ Tìm điểm thu gom gần bạn bằng bản đồ thông minh.</p>
            <p>💰 Cập nhật giá thu mua liên tục và minh bạch.</p>
            <p>📰 Cung cấp kiến thức & tin tức môi trường.</p>
            <p>📍 Phát triển tại Cần Thơ, Việt Nam.</p>
          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-4">

          <AboutLink title="Danh sách rác tái chế" desc="Xem vật liệu & giá thu mua" targetId="waste" />
          <AboutLink title="Doanh nghiệp tái chế" desc="Kết nối nhà tái chế" targetId="recycler" />
          <AboutLink title="Blog & Tin tức" desc="Kiến thức môi trường" targetId="blog" />
          <AboutLink title="Bản đồ thu gom" desc="Tìm điểm gần bạn" targetId="map" />
          <AboutLink title="Liên hệ" desc="Hợp tác & đóng góp" targetId="contact" />

        </div>

      </div>
    </div>
  );
}


/* ================= LINK CARD ================= */

function AboutLink({ title, desc, targetId }) {

  const handleScroll = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <button
      onClick={handleScroll}
      className="
        w-full
        p-5 sm:p-6
        rounded-2xl
        text-left
        bg-emerald-800/40
        backdrop-blur-md
        border border-emerald-500/30
        transition-all duration-300
        hover:bg-emerald-700/60
        hover:border-emerald-400
        hover:-translate-y-1
        hover:shadow-xl
        active:scale-[0.98]
      "
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold">
            {title}
          </h3>
          <p className="text-emerald-200 text-xs sm:text-sm mt-1">
            {desc}
          </p>
        </div>

        <span className="text-xl sm:text-2xl text-emerald-300">
          →
        </span>
      </div>
    </button>
  );
}


/* ===== PROP TYPES ===== */

AboutLink.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  targetId: PropTypes.string.isRequired,
};
import { Leaf, Users, Rocket } from "lucide-react";

const iconStyle =
  "w-12 h-12 text-emerald-600 bg-emerald-100/70 p-3 rounded-2xl";

export default function AboutPage() {
  const coreValues = [
    {
      icon: <Leaf className={iconStyle} />,
      title: "Bền vững",
      desc: "Mỗi hành động đều hướng đến môi trường xanh và tái chế hiệu quả.",
    },
    {
      icon: <Users className={iconStyle} />,
      title: "Kết nối",
      desc: "Liên kết người dân, doanh nghiệp và cộng đồng để xây dựng kinh tế tuần hoàn.",
    },
    {
      icon: <Rocket className={iconStyle} />,
      title: "Đổi mới",
      desc: "Ứng dụng công nghệ, AI và bản đồ thông minh để tối ưu thu gom.",
    },
  ];

  const timeline = [
    { year: "2023", event: "Ý tưởng VeChaiTech ra đời tại Hackathon Đại học FPT." },
    { year: "2024", event: "Ra mắt bản thử nghiệm VeChaiTech Beta." },
    { year: "2025", event: "Phát triển gamification & bản đồ thu gom thông minh." },
    { year: "Tương lai", event: "Mở rộng toàn quốc và Đông Nam Á." },
  ];

  return (
    <div className="relative space-y-24">

      {/* INTRO */}
      <section className="max-w-5xl mx-auto px-6 pt-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 mb-6">
          VeChaiTech là gì?
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-gray-600">
          VeChaiTech là nền tảng công nghệ xanh kết nối người dân, điểm thu gom và
          doanh nghiệp tái chế nhằm xây dựng hệ sinh thái tái chế minh bạch và bền vững.
        </p>
      </section>

      {/* VISION & MISSION */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl
          rounded-3xl shadow-xl border border-emerald-100 p-10 text-center">
          <h2 className="text-3xl font-bold text-emerald-700 mb-6">
            Tầm nhìn & Sứ mệnh
          </h2>
          <p className="mb-4 text-gray-600">
            <strong className="text-gray-800">Tầm nhìn:</strong> Trở thành nền tảng công nghệ
            hàng đầu Việt Nam trong thu gom và tái chế rác thải.
          </p>
          <p className="text-gray-600">
            <strong className="text-gray-800">Sứ mệnh:</strong> Kết nối cộng đồng thông qua
            công nghệ số để rác thải được quản lý minh bạch và hiệu quả.
          </p>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="px-6 text-center">
        <h2 className="text-3xl font-bold text-emerald-700 mb-12">
          Giá trị cốt lõi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {coreValues.map((v, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-xl rounded-3xl
                shadow-lg border border-emerald-100 p-8
                hover:-translate-y-1 hover:shadow-2xl transition-all"
            >
              <div className="mb-6 flex justify-center">{v.icon}</div>
              <h3 className="text-xl font-semibold text-emerald-700">
                {v.title}
              </h3>
              <p className="text-gray-600 mt-3">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl
          rounded-3xl shadow-xl border border-emerald-100 p-10">
          <h2 className="text-3xl font-bold text-emerald-700 text-center mb-10">
            Hành trình phát triển
          </h2>

          <div className="space-y-8">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <span className="px-5 py-2 rounded-full text-sm font-semibold
                  bg-emerald-100 text-emerald-700">
                  {item.year}
                </span>
                <p className="text-gray-600">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto rounded-3xl
          bg-gradient-to-r from-emerald-600 to-green-700
          text-white text-center p-12 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Cùng VeChaiTech xây dựng tương lai xanh
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Mỗi hành động nhỏ đều có thể tạo nên thay đổi lớn cho môi trường.
          </p>
          <button className="bg-white text-emerald-700 font-semibold
            px-10 py-3 rounded-full hover:bg-emerald-50 transition">
            Tham gia cộng đồng
          </button>
        </div>
      </section>
    </div>
  );
}

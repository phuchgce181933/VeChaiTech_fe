import {
  ShieldCheck,
  Leaf,
  Handshake,
  Lightbulb,
  Recycle,
  Users,
  Building2,
} from "lucide-react";

const iconStyle =
  "w-10 h-10 text-emerald-600 bg-emerald-100/70 p-2 rounded-xl";

export default function PolicyPage() {
  return (
    <section className="relative space-y-24 px-6 pb-24">

      {/* HERO */}
      <div className="max-w-3xl mx-auto text-center space-y-6 pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700">
          Chính sách & Điều khoản
        </h1>
        <p className="text-lg text-gray-600">
          Khi sử dụng dịch vụ <b>VeChaiTech</b>, bạn đồng ý tuân thủ các chính sách
          nhằm đảm bảo minh bạch, bền vững và quyền lợi cho cộng đồng.
        </p>
        <button className="px-8 py-3 rounded-full font-semibold
          bg-emerald-600 text-white hover:bg-emerald-700 transition">
          Tìm hiểu thêm
        </button>
      </div>

      {/* CORE VALUES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {[
          {
            title: "Minh bạch",
            icon: <ShieldCheck className={iconStyle} />,
            desc: "Công khai thông tin và quy trình vận hành.",
          },
          {
            title: "Bền vững",
            icon: <Leaf className={iconStyle} />,
            desc: "Góp phần bảo vệ môi trường lâu dài.",
          },
          {
            title: "Trách nhiệm",
            icon: <Handshake className={iconStyle} />,
            desc: "Chịu trách nhiệm với cộng đồng.",
          },
          {
            title: "Đổi mới",
            icon: <Lightbulb className={iconStyle} />,
            desc: "Liên tục cải tiến công nghệ và quy trình.",
          },
        ].map((c, i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur-xl rounded-3xl
              shadow-lg border border-emerald-100 p-6
              hover:-translate-y-1 hover:shadow-2xl transition"
          >
            <div className="mb-4">{c.icon}</div>
            <h3 className="text-xl font-semibold text-emerald-700 mb-2">
              {c.title}
            </h3>
            <p className="text-gray-600 text-sm">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* BENEFITS & RESPONSIBILITIES */}
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {[
          {
            title: "Quyền lợi",
            items: [
              "Người dùng: tích điểm, quà tặng và hỗ trợ trực tiếp.",
              "Doanh nghiệp: tiết kiệm chi phí, tăng uy tín.",
              "Người thu gom: đào tạo và công cụ hỗ trợ.",
            ],
          },
          {
            title: "Trách nhiệm",
            items: [
              "Cung cấp thông tin chính xác.",
              "Tuân thủ quy trình phân loại và giao dịch.",
              "Bảo vệ dữ liệu cá nhân.",
            ],
          },
        ].map((block, i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur-xl rounded-3xl
              shadow-lg border border-emerald-100 p-8"
          >
            <h2 className="text-2xl font-bold text-emerald-700 mb-4">
              {block.title}
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              {block.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* PRIVACY */}
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl
        rounded-3xl shadow-lg border border-emerald-100 p-8">
        <h2 className="text-2xl font-bold text-emerald-700 mb-4">
          Chính sách bảo mật & minh bạch
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Bảo mật thông tin cá nhân và giao dịch.</li>
          <li>Dữ liệu minh bạch theo quy định.</li>
          <li>Tuân thủ pháp luật về quyền riêng tư.</li>
        </ul>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto text-center">
        {[
          {
            label: "Tấn rác tái chế",
            value: "1000+",
            icon: <Recycle className="w-8 h-8 mx-auto text-emerald-600 mb-2" />,
          },
          {
            label: "Người tham gia",
            value: "50,000+",
            icon: <Users className="w-8 h-8 mx-auto text-emerald-600 mb-2" />,
          },
          {
            label: "Đối tác",
            value: "30+",
            icon: <Building2 className="w-8 h-8 mx-auto text-emerald-600 mb-2" />,
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur-xl rounded-3xl
              shadow-lg border border-emerald-100 p-6"
          >
            {s.icon}
            <div className="text-4xl font-extrabold text-emerald-700 mb-1">
              {s.value}
            </div>
            <div className="text-gray-600 font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-3xl font-bold text-center text-emerald-700 mb-6">
          Câu hỏi thường gặp
        </h2>

        {[
          {
            q: "Thông tin cá nhân có được bảo mật không?",
            a: "Có. Chúng tôi cam kết bảo mật dữ liệu và chỉ sử dụng cho mục đích vận hành.",
          },
          {
            q: "Điểm thưởng có hết hạn không?",
            a: "Điểm thưởng có giá trị trong 12 tháng kể từ ngày phát sinh.",
          },
        ].map((f, i) => (
          <details
            key={i}
            className="bg-white/80 backdrop-blur-xl rounded-2xl
              shadow border border-emerald-100 p-6"
          >
            <summary className="font-semibold text-emerald-700 cursor-pointer">
              {f.q}
            </summary>
            <p className="text-gray-600 mt-2">{f.a}</p>
          </details>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <button className="px-10 py-4 rounded-full font-semibold
          bg-emerald-600 text-white hover:bg-emerald-700 transition">
          Dành cho cá nhân
        </button>
        <button className="px-10 py-4 rounded-full font-semibold
          border-2 border-emerald-600 text-emerald-700
          hover:bg-emerald-50 transition">
          Dành cho doanh nghiệp
        </button>
      </div>
    </section>
  );
}

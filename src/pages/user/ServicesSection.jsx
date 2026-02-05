export default function ServicesSection() {
  const services = [
    {
      title: "Thu gom ve chai tận nơi",
      desc: "Thu gom ve chai tận nơi chi đồng nhỏ và cho gom/nhận ve chai.",
      icon: "🚛",
    },
    {
      title: "Tái chế thông minh",
      desc: "Tái chế thông minh sản xuất và thăng mai điện có sản phẩm được sử dụng.",
      icon: "♻️",
    },
    {
      title: "Mua bán sản phẩm tái chế",
      desc: "Mua bán sản phẩm tái chế như túi, bàn, đồ dùng từ ve chai.",
      icon: "🛍️",
    },
    {
      title: "Mua bán đồ cũ",
      desc: "Mua bán đồ cũ mới cải tạo và dùng lại điện tử cho sản phẩm đã qua sử dụng.",
      icon: "🏪",
    },
  ];

  return (
    <section className="mt-12 sm:mt-20 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h3 className="text-4xl md:text-6xl font-bold text-center text-emerald-800 mb-20">
          Services Section
        </h3>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-10">
          {services.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-emerald-100 p-6 text-center shadow-sm hover:shadow-lg transition"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 text-3xl">
                {item.icon}
              </div>

              <h4 className="font-semibold text-lg text-emerald-800 mb-2">
                {item.title}
              </h4>

              <p className="text-gray-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

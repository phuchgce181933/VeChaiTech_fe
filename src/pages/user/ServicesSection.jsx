import "./css/ServicesSection.css";

export default function ServicesSection() {
  const services = [
    {
      title: "Thu gom ve chai tận nơi",
      desc: "Thu gom ve chai tận nơi chỉ với vài thao tác đơn giản.",
      icon: "🚛",
    },
    {
      title: "Tái chế thông minh",
      desc: "Sản xuất và thương mại các sản phẩm tái sử dụng bền vững.",
      icon: "♻️",
    },
    {
      title: "Mua bán sản phẩm tái chế",
      desc: "Túi, bàn, đồ dùng sáng tạo từ vật liệu tái chế.",
      icon: "🛍️",
    },
    {
      title: "Mua bán đồ cũ",
      desc: "Tái sử dụng và trao đổi đồ điện tử, nội thất đã qua sử dụng.",
      icon: "🏪",
    },
  ];

  return (
    <section className="services-wrapper mt-16 sm:mt-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-10 sm:mb-16">
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-emerald-800">
            Dịch vụ của chúng tôi
          </h3>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Giải pháp bền vững cho thu gom, tái chế và tái sử dụng tài nguyên.
          </p>
        </div>

        {/* Mobile Scroll / Desktop Grid */}
        <div
          className="
            flex sm:grid
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4 sm:gap-8
            overflow-x-auto
            sm:overflow-visible
            snap-x snap-mandatory
            pb-4
            scrollbar-hide
          "
        >
          {services.map((item, index) => (
            <div
              key={index}
              className="
                min-w-[80%]
                sm:min-w-0
                group
                bg-white
                rounded-2xl
                border border-emerald-100
                p-6
                text-center
                shadow-sm
                transition-all duration-300
                hover:shadow-xl
                hover:-translate-y-2
                snap-start
              "
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-50 text-2xl transition group-hover:bg-emerald-100">
                {item.icon}
              </div>

              {/* Title */}
              <h4 className="font-semibold text-base sm:text-lg text-emerald-800 mb-2">
                {item.title}
              </h4>

              {/* Desc */}
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
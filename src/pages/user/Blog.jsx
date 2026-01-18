import  { useState } from "react";

export default function BlogPage() {
  const [search, setSearch] = useState("");

  const articles = [
    {
      title: "Rác thải điện tử – Vấn đề và giải pháp tái chế tại Việt Nam",
      date: "02/10/2025",
      author: "VeChaiTech Team",
      category: "Môi trường",
      img: "https://cdn-icons-png.flaticon.com/512/1048/1048970.png",
      desc: "Rác thải điện tử đang gia tăng nhanh chóng. Hãy cùng VeChaiTech tìm hiểu cách xử lý và tái chế hiệu quả để giảm thiểu tác động đến môi trường.",
    },
    {
      title: "Công nghệ AI trong phân loại rác – Xu hướng tương lai",
      date: "20/09/2025",
      author: "Nguyễn Thanh Phú (CTO)",
      category: "Công nghệ",
      img: "https://cdn-icons-png.flaticon.com/512/1087/1087927.png",
      desc: "Ứng dụng trí tuệ nhân tạo giúp phân loại rác nhanh hơn, chính xác hơn và tiết kiệm chi phí cho các doanh nghiệp tái chế.",
    },
    {
      title: "Câu chuyện người thu gom xanh – Góp phần xây dựng hành tinh sạch",
      date: "10/09/2025",
      author: "Trần Thị Như Ý (CMO)",
      category: "Cộng đồng",
      img: "https://cdn-icons-png.flaticon.com/512/706/706195.png",
      desc: "Những câu chuyện đầy cảm hứng về những người âm thầm góp phần làm sạch môi trường thông qua hoạt động thu gom và tái chế.",
    },
    {
      title: "5 mẹo tái chế rác thải nhựa tại nhà đơn giản mà hiệu quả",
      date: "25/08/2025",
      author: "VeChaiTech Team",
      category: "Mẹo tái chế",
      img: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
      desc: "Chỉ với vài thao tác nhỏ, bạn có thể biến rác thải nhựa thành vật dụng hữu ích trong gia đình, cùng giảm lượng rác ra môi trường.",
    },
  ];

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="pt-32 pb-20 px-6 bg-[#bfe395] min-h-screen">
      {/* 🔝 Tiêu đề */}
      <div className="text-center mb-10">
        <h1 className="mb- text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#A5D6A7] to-[#2E7D32]">
          Tin tức & Blog
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
          Cập nhật xu hướng, tin tức và kiến thức mới nhất về tái chế, công nghệ xanh và cộng đồng bền vững cùng VeChaiTech.
        </p>
      </div>

      {/* 🔍 Thanh tìm kiếm */}
      <div className="max-w-lg mx-auto mb-10">
        <input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          className="w-full border border-[#A5D6A7] rounded-full px-5 py-3 shadow-sm focus:ring-2 focus:ring-[#A5D6A7] focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 📰 Danh sách bài viết */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredArticles.map((a, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-[#A5D6A7]/40"
          >
            <img src={a.img} alt={a.title} className="w-full h-48 object-contain bg-[#E8F5E9]" />
            <div className="p-6 text-left">
              <p className="text-sm text-[#2E7D32] font-semibold">{a.category}</p>
              <h3 className="text-xl font-bold text-gray-800 mt-2">{a.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{a.desc}</p>
              <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
                <span>{a.author}</span>
                <span>{a.date}</span>
              </div>
              <button className="mt-5 bg-[#A5D6A7] hover:bg-[#81C784] text-white px-5 py-2 rounded-full font-medium transition">
                Đọc thêm
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✨ Kêu gọi hành động */}
      <div className="mt-20 text-center bg-gradient-to-r from-[#A5D6A7] to-[#81C784] text-white py-12 px-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-4">
          Bạn muốn chia sẻ câu chuyện xanh của mình?
        </h2>
        <p className="text-lg mb-6">
          Gửi bài viết, câu chuyện hoặc hình ảnh đến VeChaiTech để lan tỏa thông điệp “Biến rác thành tài nguyên”.
        </p>
        <button className="bg-white text-[#2E7D32] px-8 py-3 rounded-full font-semibold hover:bg-[#F1F8E9] transition">
          Gửi bài viết của bạn
        </button>
      </div>
    </section>
  );
}

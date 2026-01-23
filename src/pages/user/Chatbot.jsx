import { useState } from "react";

const Chatbot = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // chọn ảnh
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError("");
    }
  };

  // gửi ảnh lên backend
  const handleAnalyze = async () => {
    if (!file) {
      setError("Vui lòng chọn ảnh rác trước khi phân tích!");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8080/api/v1/ai/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Phản hồi từ backend:", data);

      if (data.status === "success") {
        // Backend đã trả result là object thật rồi, không cần parse
        setResult(data.result);
      } else {
        setError(data.message || "Không nhận diện được loại rác.");
      }

    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối tới hệ thống phân tích AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Trợ lý AI VeChaiTech 
        
      </h2>
      Tính năng này vẫn đang trong giai đoạn thử nghiệm.
      {/* upload */}
      <div className="flex flex-col items-center space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded-lg w-full"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-60 h-60 object-cover rounded-lg border"
          />
        )}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Đang phân tích..." : "Phân tích hình ảnh"}
        </button>
      </div>

      {/* lỗi */}
      {error && (
        <p className="text-red-600 font-semibold text-center mt-4">{error}</p>
      )}

      {/* kết quả */}
      {result && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-green-700 mb-2">
            Kết quả nhận diện:
          </h3>
          <p>
            <strong>Tên loại rác:</strong> {result.name}
          </p>
          <p>
            <strong>Mô tả:</strong> {result.description}
          </p>
          <p>
            <strong>Giá thu mua:</strong> {result.price}
          </p>
          <p>
            <strong>Nhận định:</strong> {result.reason}
          </p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

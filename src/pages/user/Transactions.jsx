import { useState } from "react";

export default function CurrentLocation() {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [address, setAddress] = useState(""); // lưu tên địa điểm
  const [loading, setLoading] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt của bạn không hỗ trợ Geolocation.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({ latitude, longitude });

        try {
          const apiKey = "ac7e477b5cf10839ea4d5334be2ecdd097baa3663ccbd787e59e9f609eb1ad71"; // thay bằng key của bạn
          const res = await fetch(
            `https://serpapi.com/search.json?engine=google_maps&type=reverse_geocode&lat=${latitude}&lng=${longitude}&api_key=${apiKey}`
          );
          const data = await res.json();

          if (data.results && data.results.length > 0) {
            setAddress(data.results[0].formatted_address);
          } else {
            setAddress("Không xác định được địa điểm");
          }
        } catch (err) {
          console.error(err);
          setAddress("Lỗi khi lấy địa chỉ");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        alert("Không thể lấy vị trí. Hãy kiểm tra quyền truy cập GPS.");
        setLoading(false);
      }
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={handleGetLocation} disabled={loading}>
        {loading ? "Đang lấy vị trí..." : "Lấy tọa độ hiện tại"}
      </button>

      {location.latitude && location.longitude && (
        <div style={{ marginTop: "10px" }}>
          <strong>Latitude:</strong> {location.latitude} <br />
          <strong>Longitude:</strong> {location.longitude} <br />
          {address && (
            <>
              <strong>Địa chỉ hiện tại:</strong> {address}
            </>
          )}
        </div>
      )}
    </div>
  );
}

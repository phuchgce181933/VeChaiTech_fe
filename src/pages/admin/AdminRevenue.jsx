import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import PropTypes from "prop-types";

const API_BASE = "http://localhost:8080/api/admin/revenue";
const NGUONG_TANG_GIAM = 0.2; // 20%

export default function AdminRevenue() {
  const [homNay, setHomNay] = useState(null);
  const [tuan, setTuan] = useState(null);
  const [thang, setThang] = useState(null);

  const [soNgay, setSoNgay] = useState(7);
  const [tongDoanhThuNgay, setTongDoanhThuNgay] = useState(0);
  const [chiTietNgay, setChiTietNgay] = useState([]);

  const [loading, setLoading] = useState(true);

  /* ===== DOANH THU TỔNG ===== */
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/today`).then(r => r.json()),
      fetch(`${API_BASE}/week`).then(r => r.json()),
      fetch(`${API_BASE}/month`).then(r => r.json()),
    ])
      .then(([h, t, th]) => {
        setHomNay(h);
        setTuan(t);
        setThang(th);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ===== DOANH THU THEO NGÀY ===== */
  useEffect(() => {
    fetch(`${API_BASE}/last-days?days=${soNgay}`)
      .then(r => r.json())
      .then(res => setTongDoanhThuNgay(res.revenue || 0));

    fetch(`${API_BASE}/last-days-detail?days=${soNgay}`)
      .then(r => r.json())
      .then(res => setChiTietNgay(res || []));
  }, [soNgay]);

  /* ===== PHÂN TÍCH TĂNG / GIẢM MẠNH ===== */
  const nhatKyBienDong = useMemo(() => {
    const logs = [];

    for (let i = 1; i < chiTietNgay.length; i++) {
      const truoc = chiTietNgay[i - 1].revenue;
      const sau = chiTietNgay[i].revenue;

      if (!truoc) continue;

      const tyLe = (sau - truoc) / truoc;

      if (tyLe >= NGUONG_TANG_GIAM) {
        logs.push({
          loai: "TANG",
          ngay: chiTietNgay[i].date,
          phanTram: Math.round(tyLe * 100),
        });
      }

      if (tyLe <= -NGUONG_TANG_GIAM) {
        logs.push({
          loai: "GIAM",
          ngay: chiTietNgay[i].date,
          phanTram: Math.abs(Math.round(tyLe * 100)),
        });
      }
    }

    return logs;
  }, [chiTietNgay]);

  if (loading) {
    return <div className="p-6 text-gray-400">Đang tải dữ liệu…</div>;
  }

  const duLieuTongQuan = [
    { ten: "Hôm nay", doanhThu: homNay?.revenue || 0 },
    { ten: "Tuần này", doanhThu: tuan?.revenue || 0 },
    { ten: "Tháng này", doanhThu: thang?.revenue || 0 },
  ];

  return (
    <div className="p-8 space-y-12 bg-gray-50 min-h-screen">
      {/* ===== TIÊU ĐỀ ===== */}
      <div>
        <h1 className="text-3xl font-semibold">📊 Phân tích Doanh thu</h1>
        <p className="text-gray-500 mt-1">
          Tổng quan & xu hướng hoạt động kinh doanh
        </p>
      </div>

      {/* ===== KPI ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPI title="Hôm nay" value={homNay?.revenue} />
        <KPI title="Tuần này" value={tuan?.revenue} />
        <KPI title="Tháng này" value={thang?.revenue} />
      </div>

      {/* ===== TỔNG QUAN ===== */}
      <Khung title="Tổng quan doanh thu">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={duLieuTongQuan}>
            <XAxis dataKey="ten" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="doanhThu" radius={[8, 8, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </Khung>

      {/* ===== XU HƯỚNG ===== */}
      <Khung
        title={`Doanh thu ${soNgay} ngày gần nhất`}
        right={
          <select
            value={soNgay}
            onChange={(e) => setSoNgay(Number(e.target.value))}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value={7}>7 ngày</option>
            <option value={14}>14 ngày</option>
            <option value={30}>30 ngày</option>
          </select>
        }
      >
        <p className="text-gray-600 mb-2">
          Tổng cộng:{" "}
          <b className="text-gray-900">
            {tongDoanhThuNgay.toLocaleString()} ₫
          </b>
        </p>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chiTietNgay}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Khung>

      {/* ===== NHẬT KÝ BIẾN ĐỘNG ===== */}
      <Khung title="📌 Nhật ký biến động doanh thu">
        {nhatKyBienDong.length === 0 ? (
          <p className="text-gray-500">
            Không phát hiện biến động bất thường.
          </p>
        ) : (
          <ul className="space-y-3">
            {nhatKyBienDong.map((log, i) => (
              <li
                key={i}
                className={`p-4 rounded-xl text-sm font-medium
                  ${log.loai === "TANG"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"}`}
              >
                {log.loai === "TANG" ? "📈" : "📉"} Doanh thu{" "}
                {log.loai === "TANG" ? "tăng mạnh" : "giảm mạnh"}{" "}
                <b>{log.phanTram}%</b> vào ngày{" "}
                <b>{log.ngay}</b>
              </li>
            ))}
          </ul>
        )}
      </Khung>
    </div>
  );
}

/* ================= COMPONENT ================= */

function Khung({ title, right, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function KPI({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-semibold mt-1">
        {value?.toLocaleString()} ₫
      </p>
    </div>
  );
}

/* ================= PROPTYPES ================= */
KPI.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number,
};

Khung.propTypes = {
  title: PropTypes.string.isRequired,
  right: PropTypes.node,
  children: PropTypes.node,
};

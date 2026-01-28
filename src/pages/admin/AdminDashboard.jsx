import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Wallet, ShoppingCart, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================= API ================= */
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const REVENUE_API = `${API_BASE}/api/admin/revenue`;
const USER_API = `${API_BASE}/api/users/v1`;
const ORDERS_STAT_API = `${API_BASE}/api/admin/orders/statistics`;
const ORDERS_API = `${API_BASE}/api/v1/orders`;

/* ================= PAGE ================= */
export default function AdminDashboard() {
  const [today, setToday] = useState(0);
  const [week, setWeek] = useState(0);
  const [month, setMonth] = useState(0);

  const [ordersToday, setOrdersToday] = useState(0);
  const [ordersWeek, setOrdersWeek] = useState(0);
  const [ordersMonth, setOrdersMonth] = useState(0);

  const [orders, setOrders] = useState([]);

  const [userStats, setUserStats] = useState({
    ADMIN: 0,
    CUSTOMER: 0,
    TRADERS: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    Promise.all([
      fetch(`${REVENUE_API}/today`).then(r => r.json()),
      fetch(`${REVENUE_API}/week`).then(r => r.json()),
      fetch(`${REVENUE_API}/month`).then(r => r.json()),

      fetch(`${ORDERS_STAT_API}/today`).then(r => r.json()),
      fetch(`${ORDERS_STAT_API}/week`).then(r => r.json()),
      fetch(`${ORDERS_STAT_API}/month`).then(r => r.json()),

      fetch(USER_API, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json()),

      fetch(ORDERS_API, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json()),
    ])
      .then(([
        todayRes,
        weekRes,
        monthRes,
        oToday,
        oWeek,
        oMonth,
        users,
        ordersRes,
      ]) => {
        /* ===== Revenue ===== */
        setToday(todayRes.revenue || 0);
        setWeek(weekRes.revenue || 0);
        setMonth(monthRes.revenue || 0);

        /* ===== Orders count ===== */
        setOrdersToday(oToday.data || 0);
        setOrdersWeek(oWeek.data || 0);
        setOrdersMonth(oMonth.data || 0);

        /* ===== Orders list (for rate) ===== */
        setOrders(ordersRes.data || []);

        /* ===== Users ===== */
        const stats = { ADMIN: 0, CUSTOMER: 0, TRADERS: 0 };
        users
          .filter(u => u.status)
          .forEach(u => {
            const role = u.roles?.[0]?.roleName?.replace("ROLE_", "");
            if (stats[role] !== undefined) stats[role]++;
          });
        setUserStats(stats);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-400">Loading dashboard...</div>;
  }

  /* ================= ORDER RATES ================= */
  const totalOrders = orders.length;

  const completedOrders = orders.filter(
    o => o.status === "COMPLETED"
  ).length;

  const cancelledOrders = orders.filter(
    o => o.status === "CANCELLED"
  ).length;

  const completionRate = totalOrders
    ? Math.round((completedOrders / totalOrders) * 100)
    : 0;

  const cancellationRate = totalOrders
    ? Math.round((cancelledOrders / totalOrders) * 100)
    : 0;

  /* ================= CHART DATA ================= */
  const revenueData = [
    { name: "Today", value: today },
    { name: "Week", value: week },
    { name: "Month", value: month },
  ];

  const ordersData = [
    { name: "Today", value: ordersToday },
    { name: "Week", value: ordersWeek },
    { name: "Month", value: ordersMonth },
  ];

  return (
    <div className="p-8 space-y-14 bg-gray-50 min-h-screen">
      <Header />

      {/* ===== KPI ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="thống kê doanh thu (Tháng) "
          value={`${month.toLocaleString()} ₫`}
          icon={<Wallet />}
        />
        <KpiCard
          title="Đơn hàng (Tháng)"
          value={ordersMonth}
          icon={<ShoppingCart />}
        />
        <KpiCard
          title="Tổng người dùng"
          value={Object.values(userStats).reduce((a, b) => a + b, 0)}
          icon={<Users />}
        />
      </div>

      {/* ===== ORDER RATES ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RateCard
          title="Tỉ lệ hoàn thành đơn hàng"
          value={completionRate}
          color="bg-green-500"
        />
        <RateCard
          title="Tỉ lệ hủy đơn hàng"
          value={cancellationRate}
          color="bg-red-500"
        />
      </div>

      {/* ===== ANALYTICS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Thu nhập">
          <BarChart data={revenueData} barSize={36}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#22c55e"
              radius={[10, 10, 4, 4]}
            />
          </BarChart>
        </ChartCard>

        <ChartCard title="Tổng đơn hàng">
          <LineChart data={ordersData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ChartCard>
      </div>

      {/* ===== USERS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MiniStat title="Admins" value={userStats.ADMIN} />
        <MiniStat title="Khách hàng" value={userStats.CUSTOMER} />
        <MiniStat title="Người thu mua" value={userStats.TRADERS} />
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Header() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900">
        Dashboard
      </h1>
      <p className="text-gray-500 mt-1">
        System analytics overview
      </p>
    </div>
  );
}

function KpiCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className="p-3 rounded-xl bg-gray-100 text-gray-700">
        {icon}
      </div>
    </div>
  );
}

function RateCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-sm font-semibold">{value}%</p>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <p className="text-sm font-medium text-gray-600 mb-4">
        {title}
      </p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MiniStat({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

/* ================= PROPTYPES ================= */
KpiCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.any,
  icon: PropTypes.node,
};

RateCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

ChartCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

MiniStat.propTypes = {
  title: PropTypes.string,
  value: PropTypes.number,
};

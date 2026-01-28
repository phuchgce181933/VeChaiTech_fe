import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../context/AuthContext";

export default function TradersOverview() {
  const { user } = useContext(AuthContext);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [waitingPayment, setWaitingPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const lastBalanceRef = useRef(0);

  const authHeader = {
    Authorization: `Bearer ${user?.token}`,
  };

  /* ================= INIT ================= */
  useEffect(() => {
    if (user?.token) fetchWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  /* ================= POLLING ================= */
  useEffect(() => {
    if (!waitingPayment) return;

    const interval = setInterval(fetchWalletData, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitingPayment]);

  /* ================= FETCH ================= */
  const fetchWalletData = async () => {
    try {
      setError("");

      const balanceRes = await fetch(
        `${API_BASE}/api/v1/wallet/balance`,
        { headers: authHeader }
      );
      const balanceData = await balanceRes.json();

      if (waitingPayment && balanceData > lastBalanceRef.current) {
        setWaitingPayment(false);
        setDepositAmount("");
        alert("✅ Thanh toán thành công, số dư đã được cập nhật!");
      }

      lastBalanceRef.current = balanceData;
      setBalance(balanceData);

      const transRes = await fetch(
        `${API_BASE}/api/v1/wallet/transactions`,
        { headers: authHeader }
      );
      const transData = await transRes.json();
      if (Array.isArray(transData)) {
        setTransactions(transData.slice(0, 6));
      }
    } catch {
      setError("Không thể tải thông tin ví");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DEPOSIT ================= */
  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) < 10000) {
      alert("Số tiền tối thiểu là 10.000₫");
      return;
    }

    try {
      setDepositLoading(true);

      const res = await fetch(
        `${API_BASE}/api/v1/wallet/deposit?amount=${depositAmount}`,
        { method: "POST", headers: authHeader }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (data.checkoutUrl) {
        setWaitingPayment(true);
        window.location.href = data.checkoutUrl;
      }
    } catch {
      alert("Không thể tạo giao dịch nạp tiền");
    } finally {
      setDepositLoading(false);
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          📊 Tổng quan tài khoản
        </h1>
        <p className="text-gray-500 mt-1">
          Xin chào <b>{user?.username}</b>, quản lý ví của bạn tại đây
        </p>
      </div>

      {/* WALLET STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          label="Số dư hiện tại"
          value={`${balance.toLocaleString()} ₫`}
          color="from-green-500 to-emerald-600"
        />
        <StatCard
          label="Tổng chi tiêu"
          value={`${transactions
            .filter((t) => t.type === "PAYMENT")
            .reduce((s, t) => s + t.amount, 0)
            .toLocaleString()} ₫`}
          color="from-red-500 to-pink-600"
        />
      </div>

      {/* DEPOSIT */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Nạp tiền vào ví</h3>
          <p className="text-sm text-gray-500">
            Số tiền tối thiểu: 10.000₫
          </p>
          <p className="text-sm text-red-500">
            Tính năng đang được phát triển, nếu có trục trặc vui lòng liên hệ qua số 0905087335 hoặc gửi gmail ở trang chủ để được hỗ trợ sớm nhất.
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Nhập số tiền"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            disabled={waitingPayment}
            className="border rounded-lg px-4 py-2 w-52 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleDeposit}
            disabled={depositLoading || waitingPayment}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 transition"
          >
            {depositLoading
              ? "Đang xử lý..."
              : waitingPayment
                ? "Đang chờ thanh toán..."
                : "Nạp tiền"}
          </button>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">💳 Giao dịch gần đây</h2>

        {transactions.length === 0 ? (
          <p className="text-center text-gray-500">
            Chưa có giao dịch nào
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition p-4 rounded-xl"
              >
                <div>
                  <p className="font-semibold">
                    {tx.type === "DEPOSIT" && "📥 Nạp tiền"}
                    {tx.type === "PAYMENT" && "💸 Thanh toán"}
                    {tx.type === "WITHDRAW" && "📤 Rút tiền"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(tx.transactionDate).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`font-bold ${tx.type === "DEPOSIT"
                      ? "text-green-600"
                      : "text-red-600"
                    }`}
                >
                  {tx.type === "DEPOSIT" ? "+" : "-"}
                  {tx.amount.toLocaleString()}₫
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= CARD ================= */
function StatCard({ label, value, color }) {
  return (
    <div
      className={`bg-gradient-to-r ${color} p-6 rounded-2xl text-white shadow`}
    >
      <p className="text-sm opacity-90">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

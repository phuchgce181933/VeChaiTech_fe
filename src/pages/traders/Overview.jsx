import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../context/AuthContext";

export default function TradersOverview() {
  const { user } = useContext(AuthContext);

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [waitingPayment, setWaitingPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
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
      <div className="flex justify-center items-center h-72">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 px-4">{error}</div>;
  }

  return (
    <div className="space-y-6 pb-16">

      {/* HEADER */}
      <div className="px-1">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          📊 Tổng quan tài khoản
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Xin chào <b>{user?.username}</b>
        </p>
      </div>

      {/* WALLET STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">

        <div>
          <h3 className="font-semibold text-base">
            💰 Nạp tiền vào ví
          </h3>
          <p className="text-xs text-gray-500">
            Số tiền tối thiểu: 10.000₫
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="number"
            placeholder="Nhập số tiền (VD: 50000)"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            disabled={waitingPayment}
            className="w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={handleDeposit}
            disabled={depositLoading || waitingPayment}
            className="w-full bg-green-600 active:scale-[0.98] hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {depositLoading
              ? "Đang xử lý..."
              : waitingPayment
                ? "Đang chờ thanh toán..."
                : "Nạp tiền"}
          </button>
        </div>

        <p className="text-xs text-red-500">
          Nếu có trục trặc vui lòng liên hệ 0905087335 hoặc gửi gmail ở trang chủ.
        </p>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-base sm:text-lg font-bold mb-4">
          💳 Giao dịch gần đây
        </h2>

        {transactions.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            Chưa có giao dịch nào
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-4 active:scale-[0.99] transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">
                      {tx.type === "DEPOSIT" && "📥 Nạp tiền"}
                      {tx.type === "PAYMENT" && "💸 Thanh toán"}
                      {tx.type === "WITHDRAW" && "📤 Rút tiền"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(tx.transactionDate).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`font-bold text-sm ${tx.type === "DEPOSIT"
                        ? "text-green-600"
                        : "text-red-600"
                      }`}
                  >
                    {tx.type === "DEPOSIT" ? "+" : "-"}
                    {tx.amount.toLocaleString()}₫
                  </span>
                </div>
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
      className={`bg-gradient-to-r ${color} rounded-2xl p-5 text-white shadow-md`}
    >
      <p className="text-xs opacity-90">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight">
        {value}
      </p>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};
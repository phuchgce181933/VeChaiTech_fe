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

  // lưu balance cũ để so sánh
  const lastBalanceRef = useRef(0);

  const authHeader = {
    Authorization: `Bearer ${user?.token}`,
  };

  /* =================== INIT LOAD =================== */
  useEffect(() => {
    if (user?.token) {
      fetchWalletData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  /* =================== POLLING KHI ĐANG CHỜ THANH TOÁN =================== */
  useEffect(() => {
    if (!waitingPayment) return;

    const interval = setInterval(() => {
      fetchWalletData();
    }, 5000); // 5s

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitingPayment]);

  /* =================== FETCH WALLET =================== */
  const fetchWalletData = async () => {
    try {
      setError("");

      // BALANCE
      const balanceRes = await fetch(
        "http://localhost:8080/api/v1/wallet/balance",
        { headers: authHeader }
      );
      const balanceData = await balanceRes.json();

      // nếu đang chờ thanh toán và balance tăng → xác nhận thành công
      if (waitingPayment && balanceData > lastBalanceRef.current) {
        setWaitingPayment(false);
        setDepositAmount("");
        alert("✅ Thanh toán thành công, tiền đã vào ví!");
      }

      lastBalanceRef.current = balanceData;
      setBalance(balanceData);

      // TRANSACTIONS
      const transRes = await fetch(
        "http://localhost:8080/api/v1/wallet/transactions",
        { headers: authHeader }
      );
      const transData = await transRes.json();
      if (Array.isArray(transData)) {
        setTransactions(transData.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
      setError("Không thể tải thông tin ví");
    } finally {
      setLoading(false);
    }
  };

  /* =================== DEPOSIT =================== */
  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) < 10000) {
      alert("Số tiền tối thiểu là 10.000₫");
      return;
    }

    try {
      setDepositLoading(true);

      const res = await fetch(
        `http://localhost:8080/api/v1/wallet/deposit?amount=${depositAmount}`,
        {
          method: "POST",
          headers: authHeader,
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (data.checkoutUrl) {
        setWaitingPayment(true); // 🔥 chỉ đánh dấu chờ
        window.location.href = data.checkoutUrl;
      } else {
        alert("Không tạo được link thanh toán");
      }
    } catch (err) {
      alert("Lỗi khi tạo giao dịch nạp tiền");
    } finally {
      setDepositLoading(false);
    }
  };

  /* =================== UI =================== */
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        📊 Bảng điều khiển – {user?.username}
      </h1>

      {/* NẠP TIỀN */}
      <div className="bg-white p-6 rounded shadow flex items-center gap-4">
        <input
          type="number"
          placeholder="Nhập số tiền (VND)"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="border px-4 py-2 rounded w-64"
          disabled={waitingPayment}
        />
        <button
          onClick={handleDeposit}
          disabled={depositLoading || waitingPayment}
          className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {depositLoading
            ? "Đang xử lý..."
            : waitingPayment
            ? "Đang chờ thanh toán..."
            : "Nạp tiền"}
        </button>
      </div>

      {/* THỐNG KÊ */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Số dư ví"
          value={`${balance.toLocaleString()}₫`}
          color="bg-green-500"
        />
        <StatCard
          label="Tổng nạp"
          value={`${transactions
            .filter((t) => t.type === "DEPOSIT")
            .reduce((s, t) => s + t.amount, 0)
            .toLocaleString()}₫`}
        />
        <StatCard
          label="Tổng chi"
          value={`${transactions
            .filter((t) => t.type === "PAYMENT")
            .reduce((s, t) => s + t.amount, 0)
            .toLocaleString()}₫`}
          color="bg-red-500"
        />
      </div>

      {/* GIAO DỊCH */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">💳 Giao dịch gần đây</h2>

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center">Chưa có giao dịch</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-50 p-3 rounded"
              >
                <div>
                  <p className="font-semibold">
                    {tx.type === "DEPOSIT" && "📥 Nạp tiền"}
                    {tx.type === "WITHDRAW" && "📤 Rút tiền"}
                    {tx.type === "PAYMENT" && "💸 Thanh toán"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.transactionDate).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`font-bold ${
                    tx.type === "DEPOSIT"
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

/* =================== CARD =================== */
function StatCard({ label, value, color = "bg-blue-500" }) {
  return (
    <div className={`${color} p-6 rounded text-white`}>
      <p className="text-sm">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string,
};

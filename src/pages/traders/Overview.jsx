import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../context/AuthContext";

export default function TradersOverview() {
  const { user } = useContext(AuthContext);
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const recyclerId = user?.id;

  useEffect(() => {
    if (!recyclerId) return;
    fetchWalletData();
  }, [recyclerId]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError("");

      // Lấy thông tin ví
      const walletRes = await fetch(`http://localhost:8080/api/v1/wallet/recycler/${recyclerId}`);
      const walletData = await walletRes.json();
      if (walletData.data) {
        setWallet(walletData.data);
      }

      // Lấy số dư
      const balanceRes = await fetch(`http://localhost:8080/api/v1/wallet/recycler/${recyclerId}/balance`);
      const balanceData = await balanceRes.json();
      if (balanceData.data) {
        setBalance(balanceData.data);
      }

      // Lấy lịch sử giao dịch (mới nhất)
      const transRes = await fetch(`http://localhost:8080/api/v1/wallet/recycler/${recyclerId}/transactions`);
      const transData = await transRes.json();
      if (transData.data) {
        setTransactions(Array.isArray(transData.data) ? transData.data.slice(0, 5) : []);
      }
    } catch (err) {
      console.error("Lỗi lấy dữ liệu ví:", err);
      setError("Không thể tải thông tin ví");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bảng điều khiển...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Bảng điều khiển</h1>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Bảng điều khiển</h1>
        <p className="text-gray-600">Chào mừng, <span className="font-semibold">{user?.username}</span>!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon="�" label="Số dư ví" value={balance ? `${balance.toLocaleString()}₫` : "0₫"} color="bg-green-500" />
        <StatCard icon="📤" label="Tổng rút tiền" value={wallet?.totalWithdrawn ? `${wallet.totalWithdrawn.toLocaleString()}₫` : "0₫"} color="bg-red-500" />
        <StatCard icon="📥" label="Tổng nạp tiền" value={wallet?.totalDeposited ? `${wallet.totalDeposited.toLocaleString()}₫` : "0₫"} color="bg-blue-500" />
      </div>
      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">💳 Giao dịch gần đây</h2>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có giao dịch nào</p>
          ) : (
            transactions.map((trans, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">
                    {trans.type === "DEPOSIT" && "📥 Nạp tiền"}
                    {trans.type === "WITHDRAW" && "📤 Rút tiền"}
                    {trans.type === "PAYMENT" && "💳 Thanh toán"}
                    {trans.type === "REFUND" && "↩️ Hoàn tiền"}
                  </p>
                  <p className="text-sm text-gray-600">{trans.description || new Date(trans.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  trans.type === "DEPOSIT" || trans.type === "REFUND" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {trans.type === "DEPOSIT" || trans.type === "REFUND" ? "+" : "-"}{trans.amount?.toLocaleString() || 0}₫
                </span>
              </div>
            ))
          )}
        </div>
        {transactions.length > 0 && (
          <a href="/traders/transactions" className="text-blue-600 hover:text-blue-800 font-semibold mt-4 inline-block">
            Xem tất cả →
          </a>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`${color} rounded-lg shadow p-6 text-white`}>
      <p className="text-3xl mb-2">{icon}</p>
      <p className="text-sm opacity-90">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

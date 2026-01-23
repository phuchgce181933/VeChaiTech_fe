import { Routes, Route, Navigate  } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import UserLayout from "./layouts/UserLayout";
import About from "./pages/user/About";
import Home from "./pages/user/Home";
import Blog from "./pages/user/Blog";
import Policy from "./pages/user/Policy";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import AdminLayout from "./layouts/AdminLayout";
import TradersLayout from "./layouts/TradersLayout";
import ChatbotPage from "./pages/user/Chatbot";
import WasteListings from "./pages/user/WasteListings";
import CreateOrder from "./pages/user/CreateOrder";
import BannerAdmin from "./pages/admin/BannerAdmin";
import WasteListingsAdmin from "./pages/admin/WasteListingsAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import TradersOverview from "./pages/traders/Overview";
import TradersOrders from "./pages/traders/Orders";
import TradersAccepted from "./pages/traders/Accepted";
import TradersCompleted from "./pages/traders/Completed";
import TradersProfile from "./pages/traders/Profile";
import TradersSettings from "./pages/traders/Settings";
import CurrentLocation from "./pages/user/Transactions";
import MapDirection from "./pages/user/MapDirection";
import RecyclerDemands from "./pages/user/RecyclerDemands";
import BlogAdmin from "./pages/admin/BlogAdmin";
import BlogDetail from "./pages/user/BlogDetail";
import WalletSuccess from "./pages/traders/WalletSuccess";
import Cancelled from "./pages/traders/TradersCancelled";
import Profile from "./pages/user/Profile";
import UsersAdmin from "./pages/admin/UsersAdmin";
import AdminRevenuePage from "./pages/admin/AdminRevenue";
import AdminDashboard from "./pages/admin/AdminDashboard";
function App() {
  return  (
    <Routes>
      {/* Layout dành cho user */}
      <Route path="/" element={<UserLayout />}>
       <Route index element={<Navigate to="trang-chu" replace />} />
        <Route path="trang-chu" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="wastelistings" element={<WasteListings />} />
       
        <Route path="create-collection" element={<CreateOrder />} />       
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetail />} />
        <Route path="policy" element={<Policy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="chatbot" element={<ChatbotPage />} />
        <Route path="recyclerdemands" element={<RecyclerDemands />} />
        <Route path="/map" element={<MapDirection />} />
      </Route>
      <Route path="/transactions" element={<CurrentLocation />} />
      {/* Auth pages */}
      {/* Admin layout */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Route con của admin */}
        <Route index element={<AdminDashboard />} />
        <Route path="banner" element={<BannerAdmin/>} />
        <Route path="chatthaitaiche" element={<WasteListingsAdmin/>} />
        <Route path="thumua" element={<OrdersAdmin/>} />
        <Route path="tintuc" element={<BlogAdmin />} />
        <Route path="users" element={<UsersAdmin />} />
        <Route path="quanlydoanhthu" element={<AdminRevenuePage />} />
        <Route path="caidat" element={<h2>Cài đặt</h2>} />
      </Route>
      <Route path="/wallet/success" element={<WalletSuccess />} />
      {/* Traders layout - Protected by role */}
      <Route
      
        path="/traders"
        element={
          <ProtectedRoute requiredRole="ROLE_TRADERS">
            <TradersLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TradersOverview />} />
        <Route path="orders" element={<TradersOrders />} />        
        <Route path="accepted" element={<TradersAccepted />} />
        <Route path="completed" element={<TradersCompleted />} />
        <Route path="cancelled" element={<Cancelled />} />
        <Route path="profile" element={<TradersProfile />} />
        <Route path="settings" element={<TradersSettings />} />
      </Route>
    </Routes>
  );
}
export default App;



import { Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import About from "./pages/user/About";
import Home from "./pages/user/Home";
import Services from "./pages/user/Services";
import Blog from "./pages/user/Blog";
import Policy from "./pages/user/Policy";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import AdminLayout from "./layouts/AdminLayout";
import ChatbotPage from "./pages/user/Chatbot";
import WasteListings from "./pages/user/WasteListings";
import BannerAdmin from "./pages/admin/BannerAdmin";
import WasteListingsAdmin from "./pages/admin/WasteListingsAdmin";
import CurrentLocation from "./pages/user/Transactions";
import MapDirection from "./pages/user/MapDirection";
import RecyclerDemands from "./pages/user/RecyclerDemands";
function App() {
  return (
    <Routes>
      {/* Layout dành cho user */}
      <Route path="/" element={<UserLayout />}>
        <Route path="trang-chu" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="wastelistings" element={<WasteListings />} />
        <Route path="services" element={<Services />} />
        <Route path="blog" element={<Blog />} />
        <Route path="policy" element={<Policy />} />
        <Route path="/login" element={<Login />} />
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
        <Route index element={<h2>Báo cáo</h2>} />
        <Route path="banner" element={<BannerAdmin/>} />
        <Route path="chatthaitaiche" element={<WasteListingsAdmin/>} />
        <Route path="thumua" element={<h2>Báo cáo</h2>} />
        <Route path="baocao" element={<h2>Báo cáo</h2>} />
        <Route path="quanly" element={<h2>Quản lý</h2>} />
        <Route path="caidat" element={<h2>Cài đặt</h2>} />
      </Route>
    </Routes>
  );
}

export default App;

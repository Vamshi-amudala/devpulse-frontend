import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Ideas from "./pages/Ideas";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ResetPassword from "./pages/ResetPassword";
import Implementation from "./pages/Implementation";
import ImplementationDetail from "./pages/ImplementationDetail";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Trending from "./pages/Trending";
import MyIdeas from "./pages/MyIdeas";

function App() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/trending-ideas" element={<Trending />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/ideas/:ideaId/implementations" element={<Implementation />} />
        <Route path="/ideas/:ideaId/implementations/:implId" element={<ImplementationDetail />} />
        <Route path="/my-ideas" element={<MyIdeas />} />

      </Routes>
    </Router>
  );
}

export default App;
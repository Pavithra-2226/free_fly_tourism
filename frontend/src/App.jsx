import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import EnquiryForm from "./components/EnquiryForm.jsx";
import Benefits from "./components/Benefits.jsx";
import Footer from "./components/Footer.jsx";

import AdminLogin from "./pages/AdminLogin.jsx";
import AdminEnquiries from "./pages/AdminEnquiries.jsx";

function PublicPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Header />
      <Hero />
      <EnquiryForm />
      <Benefits />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/enquiries" element={<AdminEnquiries />} />
      </Routes>
    </BrowserRouter>
  );
}
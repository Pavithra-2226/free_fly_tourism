import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import EnquiryForm from "./components/EnquiryForm.jsx";
import Benefits from "./components/Benefits.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
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
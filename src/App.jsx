import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollManager from "./components/ScrollManager";
import LandingPage from "./pages/LandingPage";
import SetsPage from "./pages/SetsPage";
import BookPage from "./pages/BookPage";
import VideoProductionPage from "./pages/VideoProductionPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sets" element={<SetsPage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/video-production-request" element={<VideoProductionPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

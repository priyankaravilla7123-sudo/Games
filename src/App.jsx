import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Antakshari from "./pages/Antakshari";
import DumbCharades from "./pages/DumbCharades";

function AppContent() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToSection = (section) => {
    navigate("/");

    setTimeout(() => {
      if (section === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(section)?.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <div className="app">
      <Header onNavigate={navigateToSection} />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onPlayAntakshari={() => navigateTo("/antakshari")}
                onPlayCharades={() => navigateTo("/dumb-charades")}
              />
            }
          />

          <Route
            path="/antakshari"
            element={<Antakshari onBack={() => navigateTo("/")} />}
          />

          <Route
            path="/dumb-charades"
            element={<DumbCharades onBack={() => navigateTo("/")} />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer onHome={() => navigateTo("/")} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

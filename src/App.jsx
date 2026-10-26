
import { useState } from "react";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Antakshari from "./pages/Antakshari";
import DumbCharades from "./pages/DumbCharades";

export default function App() {
  const [page, setPage] = useState("home");

  const navigateTo = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToSection = (section) => {
    setPage("home");

    setTimeout(() => {
      if (section === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(section)?.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 50);
  };

  return (
    <div className="app">
      <Header onNavigate={navigateToSection} />

      <main>
        {page === "home" && (
          <Home
            onPlayAntakshari={() => navigateTo("antakshari")}
            onPlayCharades={() => navigateTo("charades")}
          />
        )}

        {page === "antakshari" && (
          <Antakshari onBack={() => navigateTo("home")} />
        )}

        {page === "charades" && (
          <DumbCharades onBack={() => navigateTo("home")} />
        )}
      </main>

      <Footer onHome={() => navigateTo("home")} />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

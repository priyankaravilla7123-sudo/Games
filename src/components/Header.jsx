import "./Header.css";
export default function Header({ onNavigate }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => onNavigate("home")}>
          <span className="brand-icon">♡</span>
          <span className="brand-name">likiyao PLAY</span>
        </button>

        <nav className="navigation">
          <button onClick={() => onNavigate("games")}>Games</button>

          <button onClick={() => onNavigate("about")}>Our vibe</button>
        </nav>
      </div>
    </header>
  );
}

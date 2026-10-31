import "./Footer.css";
export default function Footer({ onHome }) {
  return (
    <footer className="site-footer">
      <button className="footer-brand" onClick={onHome}>
        ♡ likiyao
      </button>

      <p>Play together. Laugh together. ♡</p>

      <span>© 2026 likiyao</span>
    </footer>
  );
}

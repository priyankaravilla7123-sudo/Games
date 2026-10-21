import "./Footer.css";
export default function Footer({ onHome }) {
  return (
    <footer className="site-footer">
      <button className="footer-brand" onClick={onHome}>
        ♡ LIKYAO
      </button>

      <p>Play together. Laugh together. ♡</p>

      <span>© 2026 Likyao</span>
    </footer>
  );
}

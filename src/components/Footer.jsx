export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__brand">Feedback<span>Hub</span></span>
        <span className="footer__copy">© {new Date().getFullYear()} — Built with Spring Boot & React</span>
      </div>
    </footer>
  );
}

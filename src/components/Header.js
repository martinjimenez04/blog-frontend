import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-title">
        <h1>Mi Blog Personal</h1>
      </Link>
      <p className="site-description">Desarrollo web con React y FastAPI</p>
      
      {/* Link al admin */}
      <nav className="header-nav">
        <Link to="/" className="nav-link">Blog</Link>
        <Link to="/admin" className="nav-link">Admin</Link>
      </nav>
    </header>
  );
}

export default Header;
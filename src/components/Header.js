import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-title">
        <h1>Mi Blog Personal</h1>
      </Link>
      <p className="site-description">Desarrollo web con React y FastAPI</p>
    </header>
  );
}

export default Header;
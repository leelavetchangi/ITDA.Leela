import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="topbar">
      <Link className="brand" to="/dashboard" aria-label="Gym home">
        <span className="brand-mark">G</span>
        <span>Forge Gym</span>
      </Link>
      <nav className="nav-actions" aria-label="Account navigation">
        <div className="nav-links">
          <Link to="/gallery">Gallery</Link>
          <Link to="/plans">Plans</Link>
          <Link to="/members">Members</Link>
        </div>
        <span className="welcome">Hi, {user?.name}</span>
        <button className="button button-quiet" type="button" onClick={handleLogout}>
          Log out
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
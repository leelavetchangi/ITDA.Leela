import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main className="fallback-page">
      <p className="eyebrow">404 / Page not found</p>
      <h1>This route is off the map.</h1>
      <p>The page you requested does not exist in this gym workspace.</p>
      <Link className="button button-primary fallback-link" to="/dashboard">Back to dashboard</Link>
    </main>
  );
}

export default NotFound;
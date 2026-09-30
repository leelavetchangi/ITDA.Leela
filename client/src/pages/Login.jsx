import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showRecoveryNotice, setShowRecoveryNotice] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in right now.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel auth-copy-panel">
        <Link className="brand brand-light" to="/login">
          <span className="brand-mark">G</span>
          <span>Forge Gym</span>
        </Link>
        <div className="auth-message">
          <p className="eyebrow">Train with intent</p>
          <h1>Make every session count.</h1>
          <p>One clear view for the people, plans, and progress that keep your gym moving.</p>
        </div>
        <span className="panel-footer">Membership operations / 01</span>
      </section>
      <section className="auth-panel form-panel">
        <div className="form-heading">
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to your workspace</h2>
          <p>Use your gym account to continue.</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="form-error" role="alert">{error}</div>}
          <label htmlFor="name">Full name <span className="optional-field">Optional</span></label>
          <input id="name" name="name" type="text" autoComplete="name" value={form.name} onChange={handleChange} />
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} required />
          <button className="forgot-password-link" type="button" onClick={() => setShowRecoveryNotice((shown) => !shown)}>Forgot Password?</button>
          {showRecoveryNotice && <p className="recovery-notice" role="status">Password recovery is not configured yet. Please contact your gym administrator for help.</p>}
          <button className="button button-primary form-submit" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="form-switch">New to Forge Gym? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  );
}

export default Login;
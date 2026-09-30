import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ErrorMessage, getErrorMessage, LoadingState } from '../components/PageState';
import { useAuth } from '../context/useAuth';
import planService from '../services/planService';

const PROFILE_KEY = 'fitzone-membership-profile';
const CHECKOUT_KEY = 'fitzone-membership-checkout';
const ONBOARDING_KEY = 'fitzone-registration-step';
const durationOptions = [
  { label: '1 Month', days: 30 },
  { label: '3 Months', days: 90 },
  { label: '6 Months', days: 180 },
  { label: '1 Year', days: 365 },
];

function getDurationOption(durationInDays) {
  return durationOptions.find((option) => Math.abs(option.days - Number(durationInDays)) <= (option.days === 365 ? 5 : 2));
}

function getToday() {
  const today = new Date();
  return new Date(today.getTime() - today.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function readProfile() {
  try {
    return JSON.parse(sessionStorage.getItem(PROFILE_KEY) || '{}');
  } catch {
    return {};
  }
}

function formatMoney(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(amount) || 0);
}

function Register() {
  const { register, user, loading } = useAuth();
  const navigate = useNavigate();
  const [accountReady, setAccountReady] = useState(() => sessionStorage.getItem(ONBOARDING_KEY) === 'membership');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', age: '', gender: '', fitnessGoal: '', workoutPlan: '', membershipDuration: '30', paymentMethod: 'UPI', password: '', confirmPassword: '', startDate: getToday() });
  const [plans, setPlans] = useState(null);
  const [planId, setPlanId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return undefined;

    let active = true;
    planService.list({ page: 1, limit: 100 })
      .then((response) => {
        if (active) setPlans(response.data.data || []);
      })
      .catch((requestError) => {
        if (active) {
          setError(getErrorMessage(requestError, 'Unable to load your saved membership plans.'));
          setPlans([]);
        }
      });

    return () => { active = false; };
  }, [user]);

  if (accountReady && loading) {
    return <div className="loading-screen">Restoring your registration...</div>;
  }

  if (accountReady && !user) {
    return <Navigate to="/login" replace />;
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function getCurrentProfile() {
    return {
      ...readProfile(),
      name: (user?.name || form.name).trim(),
      email: (user?.email || form.email).trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      age: Number(form.age),
      gender: form.gender,
      fitnessGoal: form.fitnessGoal,
      workoutPlan: form.workoutPlan,
      startDate: form.startDate,
      paymentMethod: form.paymentMethod,
    };
  }

  async function handleAccountSubmit(event) {
    event.preventDefault();
    setError('');

    if (user) {
      if (selectedPlan) {
        handlePlanSubmit(event);
      } else {
        setError('Choose an available plan and duration to continue.');
      }
      return;
    }

    if (!user && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.phone.trim().length < 7) {
      setError('Enter a valid phone number.');
      return;
    }

    setSubmitting(true);

    try {
      await register({ name: form.name, email: form.email, password: form.password });
      sessionStorage.setItem(PROFILE_KEY, JSON.stringify(getCurrentProfile()));
      sessionStorage.setItem(ONBOARDING_KEY, 'membership');
      setAccountReady(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create your account right now.');
    } finally {
      setSubmitting(false);
    }
  }

  const durationDays = Number(form.membershipDuration);
  const availablePlans = (plans || []).filter((plan) => getDurationOption(plan.durationInDays)?.days === durationDays);
  const selectedPlan = availablePlans.find((plan) => plan._id === planId);

  function handlePlanSubmit(event) {
    event.preventDefault();
    setError('');
    if (!selectedPlan) {
      setError('Select an available plan for this membership duration.');
      return;
    }

    const profile = getCurrentProfile();
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify({ planId: selectedPlan._id, planName: selectedPlan.name, durationInDays: selectedPlan.durationInDays, amount: Number(selectedPlan.price), startDate: form.startDate }));
    sessionStorage.removeItem(ONBOARDING_KEY);
    navigate('/payment');
  }

  return (
    <main className="auth-page registration-page">
      <section className="auth-panel auth-copy-panel register-copy">
        <Link className="brand brand-light" to="/register">
          <span className="brand-mark">G</span>
          <span>Forge Gym</span>
        </Link>
        <div className="auth-message">
          <p className="eyebrow">FITZONE / TRAIN WITH PURPOSE</p>
          <h1>BUILD STRONG.<br /><em>LIVE STRONG.</em></h1>
          <p>Choose your membership and take the next step in your fitness journey.</p>
        </div>
        <span className="panel-footer">Membership operations / 02</span>
      </section>
      <section className="auth-panel form-panel">
        <div className="form-heading">
          <p className="eyebrow">{accountReady ? 'Step 02 / Membership' : 'Step 01 / Your profile'}</p>
          <h2>{accountReady ? 'CHOOSE YOUR PLAN' : 'JOIN FITZONE'}</h2>
          <p>{accountReady ? 'Choose a saved plan and continue to demo payment.' : 'Start your fitness journey today.'}</p>
        </div>
        {!accountReady ? <form className="register-flow-form" onSubmit={handleAccountSubmit}>
          <ErrorMessage message={error} />
          <div className="register-field-grid">
            <label htmlFor="name">Full name</label><input id="name" name="name" type="text" autoComplete="name" value={user?.name || form.name} onChange={handleChange} minLength="2" required readOnly={Boolean(user)} />
            <label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" value={user?.email || form.email} onChange={handleChange} required readOnly={Boolean(user)} />
            <label htmlFor="phone">Phone number</label><input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={handleChange} minLength="7" required />
            <label htmlFor="age">Age</label><input id="age" name="age" type="number" min="13" max="120" value={form.age} onChange={handleChange} required />
            <label htmlFor="gender">Gender</label><select id="gender" name="gender" value={form.gender} onChange={handleChange} required><option value="">Select gender</option><option value="Woman">Woman</option><option value="Man">Man</option><option value="Non-binary">Non-binary</option><option value="Prefer not to say">Prefer not to say</option></select>
            <label htmlFor="fitnessGoal">Fitness goal</label><select id="fitnessGoal" name="fitnessGoal" value={form.fitnessGoal} onChange={handleChange} required><option value="">Select a goal</option><option>Build strength</option><option>Improve fitness</option><option>Lose weight</option><option>Build endurance</option><option>Improve flexibility</option><option>Healthy lifestyle</option></select>
            <label htmlFor="workoutPlan">Workout plan</label><select id="workoutPlan" name="workoutPlan" value={form.workoutPlan} onChange={handleChange} required><option value="">Select a workout</option><option>Strength training</option><option>Cardio</option><option>Weight loss</option><option>Muscle building</option><option>Flexibility</option><option>Yoga</option><option>Functional training</option><option>Beginner workouts</option></select>
            <label htmlFor="membershipDuration">Membership duration</label><select id="membershipDuration" name="membershipDuration" value={form.membershipDuration} onChange={(event) => { handleChange(event); setPlanId(''); }} required>{durationOptions.map((option) => <option key={option.days} value={option.days}>{option.label}</option>)}</select>
            <label htmlFor="membershipPlan">Membership plan</label><select id="membershipPlan" name="membershipPlan" value={planId} onChange={(event) => setPlanId(event.target.value)} disabled={!user || !plans || availablePlans.length === 0}><option value="">{!user ? 'Available after account registration' : !plans ? 'Loading saved plans...' : 'No plan for this duration'}</option>{availablePlans.map((plan) => <option key={plan._id} value={plan._id}>{plan.name} · {plan.durationInDays} days</option>)}</select>
            <label htmlFor="paymentAmount">Payment amount</label><input id="paymentAmount" value={selectedPlan ? formatMoney(selectedPlan.price) : ''} readOnly placeholder={!user ? 'Available after account registration' : 'Select a saved plan'} />
            {user && plans?.length === 0 && <p className="register-flow-hint register-full-width">No plans exist yet. <Link to="/plans">Create a plan</Link> to continue with real pricing.</p>}
            <label htmlFor="paymentMethod">Payment method</label><select id="paymentMethod" name="paymentMethod" value={form.paymentMethod} onChange={handleChange} required><option value="UPI">UPI</option><option value="CARD">Card</option><option value="NET BANKING">Net Banking</option></select>
            <label htmlFor="startDate">Preferred start date</label><input id="startDate" name="startDate" type="date" min={getToday()} value={form.startDate} onChange={handleChange} required />
            <label className="register-full-width" htmlFor="address">Full address</label><textarea className="register-full-width" id="address" name="address" rows="3" autoComplete="street-address" value={form.address} onChange={handleChange} required />
            {!user && <><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} minLength="6" required />
            <label htmlFor="confirmPassword">Confirm password</label><input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} minLength="6" required /></>}
          </div>
          <p className="register-flow-hint">Your account’s existing plans and prices load after registration. Password confirmation is checked before account creation.</p>
          <button className="button button-primary form-submit" type="submit" disabled={submitting || (Boolean(user) && !selectedPlan)}>{submitting ? 'Creating account...' : 'Register Now'}</button>
        </form> : <form className="register-flow-form" onSubmit={handlePlanSubmit}>
          <ErrorMessage message={error} />
          {!plans && <LoadingState label="Loading saved plans..." />}
          {plans?.length === 0 && <div className="flow-empty"><h3>No plans available yet</h3><p>Create a plan first. Its saved duration and price will appear here.</p><Link className="flow-secondary-button" to="/plans">GO TO PLANS <span>↗</span></Link></div>}
          {Boolean(plans?.length) && <>
            <label htmlFor="membershipDuration">Membership duration</label>
            <select id="membershipDuration" name="membershipDuration" value={form.membershipDuration} onChange={(event) => { handleChange(event); setPlanId(''); }} required>{durationOptions.map((option) => <option key={option.days} value={option.days} disabled={!plans.some((plan) => getDurationOption(plan.durationInDays)?.days === option.days)}>{option.label}</option>)}</select>
            <label htmlFor="selectedPlan">Selected plan</label>
            <select id="selectedPlan" name="selectedPlan" value={planId} onChange={(event) => setPlanId(event.target.value)} required><option value="">Select an available plan</option>{availablePlans.map((plan) => <option key={plan._id} value={plan._id}>{plan.name} · {plan.durationInDays} days · {formatMoney(plan.price)}</option>)}</select>
            <label htmlFor="amountToPay">Amount to pay</label>
            <input id="amountToPay" value={selectedPlan ? formatMoney(selectedPlan.price) : ''} readOnly placeholder="Select a plan to see its saved price" />
            <label htmlFor="paymentMethod">Payment method</label>
            <select id="paymentMethod" name="paymentMethod" value={form.paymentMethod} onChange={handleChange} required><option value="UPI">UPI</option><option value="CARD">Card</option><option value="NET BANKING">Net Banking</option></select>
            {plans.length > 0 && availablePlans.length === 0 && <p className="register-flow-hint">No saved plan matches this duration. Create a plan with this duration to continue.</p>}
            <button className="button button-primary form-submit" type="submit" disabled={!selectedPlan}>Register &amp; Continue to Payment</button>
          </>}
        </form>}
        {!accountReady && <p className="form-switch">Already have an account? <Link to="/login">LOGIN</Link></p>}
      </section>
    </main>
  );
}

export default Register;
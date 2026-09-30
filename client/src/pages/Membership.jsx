import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage, getErrorMessage, LoadingState } from '../components/PageState';
import { useAuth } from '../context/useAuth';
import planService from '../services/planService';

const PROFILE_KEY = 'fitzone-membership-profile';
const CHECKOUT_KEY = 'fitzone-membership-checkout';

function getLocalDate() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function readStoredProfile() {
  try {
    return JSON.parse(sessionStorage.getItem(PROFILE_KEY) || '{}');
  } catch {
    return {};
  }
}

function formatMoney(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(amount) || 0);
}

function Membership() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState(null);
  const [planId, setPlanId] = useState('');
  const [phone, setPhone] = useState(() => readStoredProfile().phone || '');
  const [startDate, setStartDate] = useState(() => readStoredProfile().startDate || getLocalDate());
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await planService.list({ page: 1, limit: 100 });
        setPlans(response.data.data || []);
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Unable to load your saved plans.'));
        setPlans([]);
      }
    }

    loadPlans();
  }, []);

  const selectedPlan = plans?.find((plan) => plan._id === planId);

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!selectedPlan) {
      setError('Select an available plan to continue.');
      return;
    }
    if (!phone.trim()) {
      setError('Enter a phone number for the membership.');
      return;
    }
    if (!startDate) {
      setError('Choose a preferred membership start date.');
      return;
    }

    sessionStorage.setItem(PROFILE_KEY, JSON.stringify({ phone: phone.trim(), startDate }));
    sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify({ planId: selectedPlan._id, planName: selectedPlan.name, durationInDays: selectedPlan.durationInDays, amount: Number(selectedPlan.price), startDate }));
    navigate('/payment');
  }

  return (
    <main className="flow-page membership-flow-page">
      <section className="flow-heading">
        <p className="eyebrow">Step 02 / Membership</p>
        <h1>CHOOSE YOUR<br /><em>MEMBERSHIP.</em></h1>
        <p>Choose from the plans already set up in your FITZONE account.</p>
      </section>
      <div className="flow-layout">
        <form className="flow-panel" onSubmit={handleSubmit}>
          <div className="flow-panel-heading"><span>01</span><div><p className="eyebrow">Your membership</p><h2>SELECTED PLAN</h2></div></div>
          <ErrorMessage message={error} />
          {!plans && <LoadingState label="Loading your plans..." />}
          {plans?.length === 0 && <div className="flow-empty"><h3>No plans available yet</h3><p>Create a real plan first, then return here to enroll.</p><Link className="flow-secondary-button" to="/plans">GO TO PLANS <span>↗</span></Link></div>}
          {Boolean(plans?.length) && <>
            <div className="flow-plan-options">{plans.map((plan) => <label className={`flow-plan-option ${planId === plan._id ? 'selected' : ''}`} key={plan._id}>
              <input type="radio" name="planId" value={plan._id} checked={planId === plan._id} onChange={() => setPlanId(plan._id)} required />
              <span className="flow-plan-copy"><strong>{plan.name}</strong><small>{plan.durationInDays} days access</small></span>
              <strong className="flow-plan-price">{formatMoney(plan.price)}</strong>
            </label>)}</div>
            <label htmlFor="membership-phone">Phone number</label>
            <input id="membership-phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />
            <label htmlFor="membership-start">Preferred start date</label>
            <input id="membership-start" type="date" min={getLocalDate()} value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
            <button className="flow-primary-button" type="submit" disabled={!selectedPlan}>PROCEED TO PAYMENT <span>↗</span></button>
          </>}
        </form>
        <aside className="flow-summary-panel">
          <p className="eyebrow">Membership preview</p>
          <h2>{selectedPlan?.name || 'Your plan'}</h2>
          <dl><div><dt>Member</dt><dd>{user?.name || 'Your account'}</dd></div><div><dt>Duration</dt><dd>{selectedPlan ? `${selectedPlan.durationInDays} days` : 'Select a plan'}</dd></div><div><dt>Monthly price</dt><dd>{selectedPlan && selectedPlan.durationInDays <= 31 ? `${formatMoney(selectedPlan.price)} / month` : selectedPlan ? 'See plan amount' : 'Select a plan'}</dd></div><div className="flow-total"><dt>Total amount</dt><dd>{selectedPlan ? formatMoney(selectedPlan.price) : '—'}</dd></div></dl>
          <p className="flow-note">Amounts and durations come directly from your saved plan. Payment in this application is a demo and does not charge you.</p>
        </aside>
      </div>
      <p className="flow-steps">ACCOUNT <span>›</span> <strong>MEMBERSHIP</strong> <span>›</span> PAYMENT <span>›</span> CONFIRMATION</p>
    </main>
  );
}

export default Membership;

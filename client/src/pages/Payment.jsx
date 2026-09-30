import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ErrorMessage, getErrorMessage } from '../components/PageState';
import { useAuth } from '../context/useAuth';
import memberService from '../services/memberService';

const PROFILE_KEY = 'fitzone-membership-profile';
const CHECKOUT_KEY = 'fitzone-membership-checkout';
const CONFIRMATION_KEY = 'fitzone-membership-confirmation';

function readSessionValue(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}

function formatMoney(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(amount) || 0);
}

function Payment() {
  const { user } = useAuth();
  const checkout = readSessionValue(CHECKOUT_KEY);
  const profile = readSessionValue(PROFILE_KEY) || {};
  const [method, setMethod] = useState(() => profile.paymentMethod || 'UPI');
  const [readyToConfirm, setReadyToConfirm] = useState(false);
  const [confirmation, setConfirmation] = useState(() => readSessionValue(CONFIRMATION_KEY));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!checkout) {
    return <Navigate to="/membership" replace />;
  }

  async function confirmDemoPayment() {
    setError('');
    setSubmitting(true);
    try {
      const response = await memberService.create({
        name: user.name,
        phone: profile.phone,
        email: user.email,
        address: profile.address,
        age: profile.age,
        gender: profile.gender,
        fitnessGoal: profile.fitnessGoal,
        workoutPlan: profile.workoutPlan,
        paymentMethod: method,
        planId: checkout.planId,
        joinDate: checkout.startDate,
      });
      const receipt = { memberId: response.data._id, memberName: response.data.name, planName: response.data.planId.name, expiryDate: response.data.expiryDate };
      sessionStorage.setItem(CONFIRMATION_KEY, JSON.stringify(receipt));
      setConfirmation(receipt);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to create this membership. No payment was processed.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <main className="flow-page payment-flow-page">
        <section className="flow-confirmation">
          <span className="flow-success-mark">✓</span>
          <p className="eyebrow">Enrollment complete</p>
          <h1>MEMBERSHIP<br /><em>CONFIRMED</em></h1>
          <p>Welcome to FITZONE, {confirmation.memberName}!</p>
          <p className="flow-note">Your membership record is saved. This was a demo payment flow; no money was charged.</p>
          <div className="flow-confirmation-actions"><Link className="flow-primary-button" to={`/members/${confirmation.memberId}`}>VIEW MEMBERSHIP <span>↗</span></Link><Link className="flow-secondary-button" to="/">GO TO HOME</Link></div>
        </section>
      </main>
    );
  }

  return (
    <main className="flow-page payment-flow-page">
      <section className="flow-heading"><p className="eyebrow">Step 03 / Demo payment</p><h1>MEMBERSHIP<br /><em>PAYMENT.</em></h1><p>Review your membership before confirming the demo flow.</p></section>
      <div className="flow-layout">
        <section className="flow-panel">
          <div className="flow-panel-heading"><span>02</span><div><p className="eyebrow">Payment method</p><h2>SELECT AN OPTION</h2></div></div>
          <ErrorMessage message={error} />
          <div className="flow-payment-options">{['UPI', 'CARD', 'NET BANKING'].map((option) => <label className={`flow-payment-option ${method === option ? 'selected' : ''}`} key={option}><input type="radio" name="paymentMethod" value={option} checked={method === option} onChange={() => setMethod(option)} /><span>{option}</span></label>)}</div>
          <div className="flow-demo-notice"><strong>Demo only</strong><p>No payment gateway is connected. Continuing will not charge a card, UPI account, or bank account.</p></div>
          {!readyToConfirm ? <button className="flow-primary-button" type="button" onClick={() => setReadyToConfirm(true)}>PAY MEMBERSHIP FEE <span>↗</span></button> : <div className="flow-confirm-actions"><p>Review complete. Confirm to create your membership record.</p><button className="flow-primary-button" type="button" onClick={confirmDemoPayment} disabled={submitting}>{submitting ? 'Saving membership...' : 'CONFIRM PAYMENT (DEMO)'} <span>✓</span></button></div>}
          <Link className="flow-back-link" to="/membership">← Back to membership</Link>
        </section>
        <aside className="flow-summary-panel">
          <p className="eyebrow">Membership summary</p>
          <h2>{checkout.planName}</h2>
          <dl><div><dt>Member name</dt><dd>{user?.name}</dd></div><div><dt>Selected plan</dt><dd>{checkout.planName}</dd></div><div><dt>Duration</dt><dd>{checkout.durationInDays} days</dd></div><div><dt>Monthly amount</dt><dd>{checkout.durationInDays <= 31 ? `${formatMoney(checkout.amount)} / month` : 'Plan-specific amount'}</dd></div><div><dt>Payment method</dt><dd>{method}</dd></div><div className="flow-total"><dt>Total amount</dt><dd>{formatMoney(checkout.amount)}</dd></div></dl>
          <p className="flow-note">Amount is read from the selected saved plan. No transaction is submitted.</p>
        </aside>
      </div>
      <p className="flow-steps">ACCOUNT <span>›</span> MEMBERSHIP <span>›</span> <strong>PAYMENT</strong> <span>›</span> CONFIRMATION</p>
    </main>
  );
}

export default Payment;

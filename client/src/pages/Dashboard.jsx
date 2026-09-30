import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import attendanceService from '../services/attendanceService';
import memberService from '../services/memberService';
import planService from '../services/planService';
import { EmptyState, ErrorMessage, getErrorMessage, LoadingState } from '../components/PageState';

function Dashboard() {
  const [days, setDays] = useState(7);
  const [expiring, setExpiring] = useState(null);
  const [members, setMembers] = useState(null);
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkInError, setCheckInError] = useState('');
  const [checkInMessage, setCheckInMessage] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState('');

  async function loadDashboard() {
    setLoading(true);
    setError('');
    try {
      const [expiringResponse, membersResponse] = await Promise.all([
        memberService.expiring(days),
        memberService.list({ page: 1, limit: 100 }),
      ]);
      setExpiring(expiringResponse.data);
      setMembers(membersResponse.data.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to load the dashboard.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [days]);

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await planService.list({ page: 1, limit: 3 });
        setPlans(response.data.data || []);
      } catch {
        setPlans([]);
      }
    }

    loadPlans();
  }, []);

  const matchingMembers = (members || []).filter((member) => {
    const query = search.trim().toLowerCase();
    return !query || member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query) || member.phone.toLowerCase().includes(query);
  });

  async function handleCheckIn(event) {
    event.preventDefault();
    setCheckInError('');
    setCheckInMessage('');
    if (!selectedMember) {
      setCheckInError('Select a member before checking in.');
      return;
    }

    setCheckingIn(true);
    try {
      await attendanceService.checkIn(selectedMember._id);
      setCheckInMessage(`${selectedMember.name} checked in successfully.`);
      setSelectedMember(null);
      setSearch('');
    } catch (requestError) {
      setCheckInError(getErrorMessage(requestError, 'Unable to check in this member.'));
    } finally {
      setCheckingIn(false);
    }
  }

  return (
    <main className="dashboard home-page">
      <section className="dashboard-hero home-hero">
        <div className="home-hero-orbit" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">Forge Gym / performance starts here</p>
          <h1>BUILD STRONG.<br /><em>LIVE STRONG.</em></h1>
          <p className="intro-copy">A sharper way to manage your gym, motivate your members, and make every session count.</p>
          <div className="hero-actions">
            <Link className="button button-lime" to="/members">JOIN NOW <span>↗</span></Link>
            <Link className="button button-outline-light" to="/plans">EXPLORE PLANS <span>→</span></Link>
          </div>
        </div>
        <div className="hero-caption"><span>01</span><span>Train with intent</span><span>Est. 2026</span></div>
      </section>

      <section className="home-stats" aria-label="Gym statistics">
        <div><strong>500<span>+</span></strong><p>Active Members</p></div>
        <div><strong>15<span>+</span></strong><p>Expert Trainers</p></div>
        <div><strong>5<span>+</span></strong><p>Membership Plans</p></div>
        <div><strong>24<span>/7</span></strong><p>Gym Access</p></div>
      </section>

      <section className="home-section home-features">
        <div className="home-section-heading"><div><p className="eyebrow">The Forge standard</p><h2>Everything you need<br /><em>to go further.</em></h2></div><p>Build consistency with a space, a team, and a system designed around your progress.</p></div>
        <div className="feature-grid">
          <article className="feature-card"><img className="feature-image" src="https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=900&q=88" alt="Modern strength equipment in a gym" /><span className="feature-icon" aria-hidden="true">✦</span><span className="feature-index">01</span><h3>Modern Equipment</h3><p>Purpose-built equipment for every phase of your training.</p></article>
          <article className="feature-card feature-card-accent"><img className="feature-image" src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=88" alt="Fitness trainer coaching an athlete" /><span className="feature-icon" aria-hidden="true">↗</span><span className="feature-index">02</span><h3>Expert Trainers</h3><p>Real guidance from coaches who know how to move you forward.</p></article>
          <article className="feature-card"><img className="feature-image" src="https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=88" alt="Athlete training on a rowing machine" /><span className="feature-icon" aria-hidden="true">◌</span><span className="feature-index">03</span><h3>Progress Tracking</h3><p>See the work add up with clear, focused member insights.</p></article>
          <article className="feature-card feature-card-cyan"><img className="feature-image" src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=900&q=88" alt="Members training together in a gym" /><span className="feature-icon" aria-hidden="true">⌁</span><span className="feature-index">04</span><h3>Flexible Membership</h3><p>Choose the rhythm and plan that fits your strongest life.</p></article>
        </div>
      </section>

      <section className="home-visual-mosaic" aria-label="Forge Gym training spaces">
        <figure className="home-visual-feature"><img src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1400&q=88" alt="Modern gym interior with strength equipment" /><figcaption><span>01 / The space</span><strong>Room to do<br /><em>more.</em></strong></figcaption></figure>
        <div className="home-visual-stack">
          <figure><img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=88" alt="Athlete doing strength training with a barbell" /><figcaption><span>02 / Strength</span><strong>Earn it.</strong></figcaption></figure>
          <figure><img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=88" alt="Athlete training on cardio equipment" /><figcaption><span>03 / Endurance</span><strong>Keep moving.</strong></figcaption></figure>
        </div>
        <figure className="home-visual-coach"><img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1100&q=88" alt="Personal trainer coaching an athlete" /><figcaption><span>04 / Coaching</span><strong>Guidance that<br /><em>moves you.</em></strong></figcaption></figure>
      </section>

      <section className="home-journey-visuals" aria-label="The Forge fitness journey">
        <div className="home-journey-heading"><p className="eyebrow">The fitness journey</p><h2>Train with purpose.<br /><em>Transform with time.</em></h2></div>
        <div className="home-journey-grid">
          <figure><img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=88" alt="Athlete training with weights in a gym" /><figcaption><span>01</span><strong>Train</strong><p>Make the first rep count.</p></figcaption></figure>
          <figure><img src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1000&q=88" alt="Runner tracking a fitness workout outdoors" /><figcaption><span>02</span><strong>Track</strong><p>See your momentum clearly.</p></figcaption></figure>
          <figure><img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1000&q=88" alt="Professional gym equipment ready for training" /><figcaption><span>03</span><strong>Transform</strong><p>Become what you came for.</p></figcaption></figure>
          <figure className="home-journey-lifestyle"><img src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=88" alt="Friends training together in a bright modern gym" /><figcaption><span>04 / Community</span><strong>Better together.</strong></figcaption></figure>
        </div>
      </section>

      <section className="home-section membership-preview">
        <div className="home-section-heading"><div><p className="eyebrow">Find your pace</p><h2>Plans built for<br /><em>real progress.</em></h2></div><Link className="home-arrow-link" to="/plans">View all plans <span>↗</span></Link></div>
        <div className="plan-preview-grid">
          {plans.length > 0 ? plans.map((plan, index) => <article className={`plan-preview-card plan-preview-${index}`} key={plan._id}><span className="plan-number">0{index + 1}</span><h3>{plan.name}</h3><p>{plan.durationInDays} days of focused access.</p><strong>${plan.price}<small> / plan</small></strong><Link to="/plans">Choose plan <span>↗</span></Link></article>) : <article className="plan-preview-card plan-preview-empty"><span className="plan-number">01</span><h3>Your next level</h3><p>Explore the membership options built for your goals.</p><Link to="/plans">Explore plans <span>↗</span></Link></article>}
        </div>
      </section>

      <section className="journey-section">
        <div className="journey-heading"><p className="eyebrow">The method</p><h2>Your journey<br /><em>starts here.</em></h2></div>
        <div className="journey-steps"><div><span>01</span><h3>Join</h3><p>Make the decision.</p></div><div><span>02</span><h3>Train</h3><p>Put in the work.</p></div><div><span>03</span><h3>Track</h3><p>Watch it compound.</p></div><div><span>04</span><h3>Transform</h3><p>Become your best.</p></div></div>
      </section>

      <section className="home-final-cta"><p className="eyebrow">Your strongest chapter</p><h2>READY TO <em>TRANSFORM?</em></h2><Link className="button button-lime" to="/members">START YOUR JOURNEY <span>↗</span></Link></section>

      <section className="dashboard-intro-strip"><div><p className="eyebrow">Today at a glance</p><h2>Your floor, in focus.</h2></div><p>Small details compound into a better member experience.</p></section>
      <ErrorMessage message={error} />
      <section className="dashboard-tools">
        <article className="tool-panel expiring-panel">
          <div className="tool-heading"><div><p className="eyebrow">Attention window</p><h2>Expiring soon</h2></div><label className="days-control">Next <input aria-label="Expiring days" type="number" min="1" max="365" value={days} onChange={(event) => setDays(Number(event.target.value) || 1)} /> days</label></div>
          {loading && <LoadingState label="Checking expiry dates..." />}
          {!loading && expiring?.data.length === 0 && <EmptyState>No memberships expire in this window.</EmptyState>}
          {!loading && expiring?.data.length > 0 && <div className="dashboard-list">{expiring.data.map((member) => <Link className="dashboard-row" to={`/members/${member._id}`} key={member._id}><span><strong>{member.name}</strong><small>{member.planId.name}</small></span><span className="expiry-date">{new Date(member.expiryDate).toLocaleDateString()}</span></Link>)}</div>}
        </article>
        <article className="tool-panel checkin-panel">
          <div className="tool-heading"><div><p className="eyebrow">Front desk</p><h2>Quick check-in</h2></div></div>
          <p className="tool-copy">Search for an active member to record today&apos;s visit.</p>
          <form onSubmit={handleCheckIn}>
            <label htmlFor="member-search">Find a member</label>
            <input id="member-search" value={search} onChange={(event) => { setSearch(event.target.value); setSelectedMember(null); setCheckInError(''); setCheckInMessage(''); }} placeholder="Name, email, or phone" />
            {search && <div className="member-picker">{matchingMembers.length === 0 && <span className="picker-empty">No matching members</span>}{matchingMembers.map((member) => <button className={`picker-option ${selectedMember?._id === member._id ? 'selected' : ''}`} type="button" key={member._id} onClick={() => setSelectedMember(member)}><span><strong>{member.name}</strong><small>{member.email}</small></span><span className={`status-badge ${member.status}`}>{member.status}</span></button>)}</div>}
            {selectedMember && <p className="selected-member">Selected: <strong>{selectedMember.name}</strong></p>}
            <ErrorMessage message={checkInError} />
            {checkInMessage && <div className="success-message" role="status">{checkInMessage}</div>}
            <button className="button button-primary" type="submit" disabled={checkingIn || !selectedMember || selectedMember.status === 'expired'}>{checkingIn ? 'Checking in...' : 'Record check-in'}</button>
          </form>
        </article>
      </section>
      <footer className="home-footer"><span className="home-footer-brand">G / FORGE GYM</span><span>Train with intent.</span><span>© 2026 Forge Gym</span></footer>
    </main>
  );
}

export default Dashboard;

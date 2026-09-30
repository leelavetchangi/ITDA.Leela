import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import attendanceService from '../services/attendanceService';
import { EmptyState, ErrorMessage, getErrorMessage, LoadingState } from '../components/PageState';
import memberService from '../services/memberService';

function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [message, setMessage] = useState('');
  const [renewing, setRenewing] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  async function loadMember() {
    try {
      const response = await memberService.get(id);
      setMember(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to load this member.'));
    }
  }

  async function loadAttendance() {
    try {
      const response = await attendanceService.list(id, { page: 1, limit: 10 });
      setAttendance(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to load attendance history.'));
    }
  }

  useEffect(() => {
    loadMember();
    loadAttendance();
  }, [id]);

  async function handleRenew() {
    setRenewing(true);
    setActionError('');
    setMessage('');
    try {
      const response = await memberService.renew(id);
      setMember(response.data);
      setMessage('Membership renewed. The new expiry date is shown below.');
    } catch (requestError) {
      setActionError(getErrorMessage(requestError, 'Unable to renew this membership.'));
    } finally {
      setRenewing(false);
    }
  }

  async function handleCheckIn() {
    setCheckingIn(true);
    setActionError('');
    setMessage('');
    try {
      await attendanceService.checkIn(id);
      await loadAttendance();
      setMessage('Check-in recorded successfully.');
    } catch (requestError) {
      setActionError(getErrorMessage(requestError, 'Unable to check in this member.'));
    } finally {
      setCheckingIn(false);
    }
  }

  if (!member && !error) return <main className="page-wrap"><LoadingState label="Loading member..." /></main>;

  return (
    <main className="page-wrap detail-page">
      <Link className="back-link" to="/members">← Back to members</Link>
      <ErrorMessage message={error} />
      {member && <>
        <section className="detail-heading"><div><p className="eyebrow">Member profile</p><h1>{member.name}</h1><p>{member.email} · {member.phone}</p></div><span className={`status-badge ${member.status}`}>{member.status}</span></section>
        <div className="detail-actions"><button className="button button-primary" type="button" onClick={handleRenew} disabled={renewing}>{renewing ? 'Renewing...' : 'Renew membership'}</button><button className="button button-quiet" type="button" onClick={handleCheckIn} disabled={checkingIn || member.status === 'expired'}>{checkingIn ? 'Checking in...' : 'Record check-in'}</button></div>
        <ErrorMessage message={actionError} />
        {message && <div className="success-message" role="status">{message}</div>}
        <section className="detail-grid"><article className="detail-card"><span className="stat-label">Plan</span><strong>{member.planId.name}</strong><span>{member.planId.durationInDays} days · ${Number(member.planId.price).toFixed(2)}</span></article><article className="detail-card"><span className="stat-label">Joined</span><strong>{new Date(member.joinDate).toLocaleDateString()}</strong><span>Membership start date</span></article><article className="detail-card"><span className="stat-label">Expires</span><strong>{new Date(member.expiryDate).toLocaleDateString()}</strong><span>Current membership end</span></article></section>
        <section className="attendance-panel"><div className="panel-heading"><p className="eyebrow">History</p><h2>Attendance</h2></div>{!attendance && !error && <LoadingState label="Loading attendance..." />}{attendance?.data.length === 0 && <EmptyState>No check-ins recorded yet.</EmptyState>}{attendance?.data.length > 0 && <div className="attendance-list">{attendance.data.map((entry) => <div className="attendance-row" key={entry._id}><span>Check-in</span><strong>{new Date(entry.checkInTime).toLocaleString()}</strong></div>)}</div>}</section>
      </>}
    </main>
  );
}

export default MemberDetail;

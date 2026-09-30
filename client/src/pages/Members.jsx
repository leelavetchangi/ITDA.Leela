import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import memberService from '../services/memberService';
import planService from '../services/planService';
import { ErrorMessage, getErrorMessage, LoadingState } from '../components/PageState';

const emptyForm = { name: '', phone: '', email: '', planId: '', joinDate: '' };

function Members() {
  const [members, setMembers] = useState(null);
  const [plans, setPlans] = useState([]);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [renewingId, setRenewingId] = useState(null);

  async function loadMembers() {
    setError('');
    try {
      const response = await memberService.list({ page, limit: 5 });
      setMembers(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to load members.'));
    }
  }

  useEffect(() => {
    loadMembers();
  }, [page]);

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await planService.list({ page: 1, limit: 100 });
        setPlans(response.data.data);
      } catch (requestError) {
        setFormError(getErrorMessage(requestError, 'Unable to load membership plans.'));
      }
    }

    loadPlans();
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function startEdit(member) {
    setEditingId(member._id);
    setForm({ name: member.name, phone: member.phone, email: member.email, planId: member.planId._id, joinDate: member.joinDate.slice(0, 10) });
    setFormError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.planId || !form.joinDate) {
      setFormError('Complete every member field before saving.');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await memberService.update(editingId, form);
      } else {
        await memberService.create(form);
      }
      cancelEdit();
      await loadMembers();
    } catch (requestError) {
      setFormError(getErrorMessage(requestError, 'Unable to save this member.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this member?')) {
      return;
    }

    try {
      await memberService.remove(id);
      if (members?.data.length === 1 && page > 1) setPage(page - 1);
      else await loadMembers();
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to delete this member.'));
    }
  }

  async function handleRenew(id) {
    setRenewingId(id);
    setError('');
    try {
      await memberService.renew(id);
      await loadMembers();
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to renew this membership.'));
    } finally {
      setRenewingId(null);
    }
  }

  const memberStats = getMemberStats(members?.data || []);

  return (
    <main className="page-wrap management-page members-page">
      <section className="section-heading members-heading">
        <div><p className="eyebrow">People directory / command center</p><h1>MEMBER <em>OVERVIEW</em></h1><p>Manage and monitor your gym members efficiently.</p></div>
        <div className="members-heading-side"><div className="members-heading-banner"><img src="https://images.unsplash.com/photo-1571388208497-71addedc3a3c?auto=format&fit=crop&w=800&q=88" alt="Trainer helping an athlete in a professional gym" /><span>Keep the floor moving.</span></div><div className="members-heading-meta"><span className="members-heading-mark">◌</span><span className="record-count">{members?.total ?? '-'} total members</span></div></div>
      </section>
      <section className="member-stats" aria-label="Member statistics">
        <article><span className="member-stat-icon">◎</span><p>Total Members</p><strong>{members?.total ?? '-'}</strong><small>Across your gym</small></article>
        <article className="member-stat-active"><span className="member-stat-icon">↗</span><p>Active Members</p><strong>{members ? memberStats.active : '-'}</strong><small>In the current view</small></article>
        <article className="member-stat-warning"><span className="member-stat-icon">◷</span><p>Expiring Soon</p><strong>{members ? memberStats.expiring : '-'}</strong><small>Within 7 days</small></article>
        <article className="member-stat-new"><span className="member-stat-icon">✦</span><p>New Members</p><strong>{members ? memberStats.newMembers : '-'}</strong><small>Joined in 30 days</small></article>
      </section>
      <section className="member-actions-bar"><div><p className="eyebrow">Member directory</p><h2>Know your community.</h2></div><div className="member-quick-actions"><button className="button member-add-button" type="button" onClick={() => document.getElementById('member-editor')?.scrollIntoView({ behavior: 'smooth' })}><span>+</span> Add member</button><Link className="button member-plans-button" to="/plans">View plans <span>↗</span></Link></div></section>
      <section className="members-layout">
        <form className="editor-panel members-editor" id="member-editor" onSubmit={handleSubmit}>
          <div className="panel-heading"><p className="eyebrow">{editingId ? 'Edit member' : 'New member'}</p><h2>{editingId ? 'Update member details' : 'Add a member'}</h2></div>
          <ErrorMessage message={formError} />
          <label htmlFor="member-name">Full name</label><input id="member-name" name="name" value={form.name} onChange={handleChange} required />
          <label htmlFor="member-phone">Phone</label><input id="member-phone" name="phone" value={form.phone} onChange={handleChange} required />
          <label htmlFor="member-email">Email</label><input id="member-email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <label htmlFor="member-plan">Membership plan</label>
          <select id="member-plan" name="planId" value={form.planId} onChange={handleChange} required><option value="">Select a plan</option>{plans.map((plan) => <option key={plan._id} value={plan._id}>{plan.name} · {plan.durationInDays} days</option>)}</select>
          <label htmlFor="member-join-date">Join date</label><input id="member-join-date" name="joinDate" type="date" value={form.joinDate} onChange={handleChange} required />
          <div className="form-actions"><button className="button button-primary" type="submit" disabled={saving || plans.length === 0}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Create member'}</button>{editingId && <button className="button button-quiet" type="button" onClick={cancelEdit}>Cancel</button>}</div>
          {plans.length === 0 && <p className="field-note">Create a plan before adding members.</p>}
        </form>
        <section className="list-panel members-directory" aria-label="Gym members">
          <ErrorMessage message={error} />
          {!members && !error && <LoadingState label="Loading members..." />}
          {members?.data.length === 0 && <div className="members-empty-state"><span className="empty-state-icon">✦</span><h2>No Members Yet</h2><p>Start building your gym community by adding your first member.</p><button className="button member-add-button" type="button" onClick={() => document.getElementById('member-editor')?.scrollIntoView({ behavior: 'smooth' })}><span>+</span> Add member</button></div>}
          {members?.data.length > 0 && <><div className="member-table-head"><span>Member</span><span>Membership</span><span>Status</span><span>Actions</span></div><div className="data-list">{members.data.map((member) => <article className="data-row member-row" key={member._id}><div className="member-identity"><span className="member-avatar">{member.name.charAt(0).toUpperCase()}</span><div className="row-main"><Link className="row-link" to={`/members/${member._id}`}>{member.name}</Link><span>{member.email}</span></div></div><div className="member-membership"><strong>{member.planId.name}</strong><span>Joined {new Date(member.joinDate).toLocaleDateString()}</span></div><span className={`status-badge member-status ${getDisplayStatus(member)}`}>{getDisplayStatus(member)}</span><div className="row-actions member-row-actions"><Link className="text-button" to={`/members/${member._id}`}>View</Link><button className="text-button" type="button" onClick={() => startEdit(member)}>Edit</button><button className="text-button" type="button" onClick={() => handleRenew(member._id)} disabled={renewingId === member._id}>{renewingId === member._id ? 'Renewing...' : 'Renew'}</button><button className="text-button danger" type="button" onClick={() => handleDelete(member._id)}>Delete</button></div></article>)}</div><Pagination page={members.page} totalPages={members.totalPages} onChange={setPage} /></>}
        </section>
      </section>
    </main>
  );
}

function getDisplayStatus(member) {
  if (member.status !== 'active') {
    return 'inactive';
  }

  const daysUntilExpiry = (new Date(member.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
  return daysUntilExpiry >= 0 && daysUntilExpiry <= 7 ? 'expiring' : 'active';
}

function getMemberStats(memberList) {
  return memberList.reduce((stats, member) => {
    const displayStatus = getDisplayStatus(member);
    const daysSinceJoin = (new Date() - new Date(member.joinDate)) / (1000 * 60 * 60 * 24);
    return {
      active: stats.active + (displayStatus === 'active' ? 1 : 0),
      expiring: stats.expiring + (displayStatus === 'expiring' ? 1 : 0),
      newMembers: stats.newMembers + (daysSinceJoin >= 0 && daysSinceJoin <= 30 ? 1 : 0),
    };
  }, { active: 0, expiring: 0, newMembers: 0 });
}

function Pagination({ page, totalPages, onChange }) {
  return <div className="pagination"><button className="button button-quiet" type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button><span>Page {page} of {Math.max(totalPages, 1)}</span><button className="button button-quiet" type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button></div>;
}

export default Members;
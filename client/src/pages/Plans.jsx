import { useEffect, useState } from 'react';
import planService from '../services/planService';
import { EmptyState, ErrorMessage, getErrorMessage, LoadingState } from '../components/PageState';

const emptyForm = { name: '', durationInDays: '', price: '' };

function Plans() {
  const [plans, setPlans] = useState(null);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadPlans() {
    setError('');

    try {
      const response = await planService.list({ page, limit: 5 });
      setPlans(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to load plans.'));
    }
  }

  useEffect(() => {
    loadPlans();
  }, [page]);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function startEdit(plan) {
    setEditingId(plan._id);
    setForm({ name: plan.name, durationInDays: plan.durationInDays, price: plan.price });
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

    const durationInDays = Number(form.durationInDays);
    const price = Number(form.price);

    if (!form.name.trim() || !Number.isInteger(durationInDays) || durationInDays < 1 || !Number.isFinite(price) || price < 0) {
      setFormError('Enter a name, a positive whole-number duration, and a non-negative price.');
      return;
    }

    setSaving(true);
    try {
      const payload = { name: form.name, durationInDays, price };
      if (editingId) {
        await planService.update(editingId, payload);
      } else {
        await planService.create(payload);
      }
      cancelEdit();
      await loadPlans();
    } catch (requestError) {
      setFormError(getErrorMessage(requestError, 'Unable to save this plan.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this membership plan?')) {
      return;
    }

    try {
      await planService.remove(id);
      if (plans?.data.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await loadPlans();
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to delete this plan.'));
    }
  }

  return (
    <main className="page-wrap management-page plans-page">
      <section className="section-heading plans-heading">
        <div>
          <p className="eyebrow">Membership, redefined</p>
          <h1>CHOOSE YOUR <em>MEMBERSHIP</em></h1>
          <p>Choose the plan that fits your fitness journey.</p>
        </div>
        <div className="plans-heading-meta"><span className="plans-heading-mark">✦</span><span className="record-count">{plans?.total ?? '-'} active plans</span></div>
      </section>
      <section className="plans-layout">
        <section className="plans-catalog" aria-label="Membership plans">
          <div className="plans-visual-banner"><img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1600&q=88" alt="Premium gym interior with modern training equipment" /><div><p className="eyebrow">Built for the next rep</p><h2>Choose your<br /><em>training ground.</em></h2><span>Premium access. Real momentum.</span></div></div>
          <div className="plans-catalog-top"><p className="eyebrow">Find your level</p><span>01 — {plans?.total ?? '-'} offers</span></div>
          {!plans && !error && <LoadingState label="Loading plans..." />}
          {plans?.data.length === 0 && <EmptyState>No plans yet. Add your first membership offer.</EmptyState>}
          {plans?.data.length > 0 && (
            <div className="plans-card-grid">
              {plans.data.map((plan, index) => {
                const presentation = getPlanPresentation(plan, index);
                return (
                  <article className={`membership-card membership-card-${presentation.tier}`} key={plan._id}>
                    {presentation.popular && <span className="popular-badge">MOST POPULAR</span>}
                    <div className="membership-card-top"><span className="membership-icon" aria-hidden="true">{presentation.icon}</span><span className="membership-number">0{index + 1}</span></div>
                    <p className="membership-tier">{presentation.label}</p>
                    <h2>{plan.name}</h2>
                    <p className="membership-duration">{plan.durationInDays} days of access</p>
                    <div className="membership-price"><strong>${Number(plan.price).toFixed(2)}</strong><span>/ plan</span></div>
                    <ul className="membership-features">{presentation.features.map((feature) => <li key={feature}><span aria-hidden="true">+</span>{feature}</li>)}</ul>
                    <div className="membership-actions"><button className="plan-cta" type="button" onClick={() => startEdit(plan)}>Edit plan <span>↗</span></button><button className="plan-delete" type="button" onClick={() => handleDelete(plan._id)}>Delete</button></div>
                  </article>
                );
              })}
            </div>
          )}
          <ErrorMessage message={error} />
          {plans?.data.length > 0 && <Pagination page={plans.page} totalPages={plans.totalPages} onChange={setPage} />}
        </section>
        <form className="editor-panel plans-editor" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <p className="eyebrow">{editingId ? 'Edit plan' : 'Build your offer'}</p>
            <h2>{editingId ? 'Update the offer' : 'Add a membership plan'}</h2>
            <p className="plans-editor-copy">Create a clear offer your members can commit to.</p>
          </div>
          <ErrorMessage message={formError} />
          <label htmlFor="plan-name">Plan name</label>
          <input id="plan-name" name="name" value={form.name} onChange={handleChange} placeholder="1 Month" required />
          <label htmlFor="plan-duration">Duration in days</label>
          <input id="plan-duration" name="durationInDays" type="number" min="1" step="1" value={form.durationInDays} onChange={handleChange} placeholder="30" required />
          <label htmlFor="plan-price">Price</label>
          <input id="plan-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="49.99" required />
          <div className="form-actions">
            <button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Create plan'}</button>
            {editingId && <button className="button button-quiet" type="button" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
      </section>
    </main>
  );
}

function getPlanPresentation(plan, index) {
  const normalizedName = plan.name.toLowerCase();
  const isPro = normalizedName.includes('pro');
  const isPremium = normalizedName.includes('premium') || normalizedName.includes('elite');
  const tier = isPro ? 'pro' : isPremium ? 'premium' : index === 1 ? 'pro' : 'basic';

  return {
    tier,
    label: tier === 'pro' ? 'Performance' : tier === 'premium' ? 'Peak access' : 'The foundation',
    icon: tier === 'pro' ? '↗' : tier === 'premium' ? '✦' : '◒',
    popular: tier === 'pro',
    features: tier === 'pro' ? ['Full gym floor access', 'Progress tracking', 'Trainer priority'] : tier === 'premium' ? ['Unlimited gym access', '1:1 coaching support', 'Recovery lounge access'] : ['Essential gym access', 'Open training floor', 'Flexible schedule'],
  };
}

function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="pagination">
      <button className="button button-quiet" type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
      <span>Page {page} of {Math.max(totalPages, 1)}</span>
      <button className="button button-quiet" type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}

export default Plans;
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiSend, FiUser, FiMail, FiMessageCircle } from 'react-icons/fi';
import feedbackService from '../services/feedbackService';

const INITIAL = { name: '', email: '', message: '' };

export default function FeedbackForm({ onSuccess }) {
  const [form, setForm]     = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await feedbackService.createFeedback(form);
      toast.success('Feedback submitted — thank you!');
      setForm(INITIAL);
      setErrors({});
      onSuccess?.();
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 style={{ fontSize: '1.1rem' }}>Share your thoughts</h3>
        <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: 4 }}>
          We read every submission carefully
        </p>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">
              <FiUser size={12} style={{ marginRight: 4 }} />
              Your Name
            </label>
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <p className="form-error">⚠ {errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiMail size={12} style={{ marginRight: 4 }} />
              Email Address
            </label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="form-error">⚠ {errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiMessageCircle size={12} style={{ marginRight: 4 }} />
              Message
            </label>
            <textarea
              className="form-control"
              name="message"
              placeholder="Tell us what you think..."
              value={form.message}
              onChange={handleChange}
              rows={4}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {errors.message
                ? <p className="form-error">⚠ {errors.message}</p>
                : <span />}
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                {form.message.length}/1000
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Sending…' : <><FiSend size={14} /> Submit Feedback</>}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import feedbackService from '../services/feedbackService';
import toast from 'react-hot-toast';

const FILTERS = ['ALL', 'PENDING', 'REVIEWED', 'RESOLVED'];

function StatusBadge({ status }) {
  const cls = { PENDING: 'badge-pending', REVIEWED: 'badge-reviewed', RESOLVED: 'badge-resolved' };
  const dot = { PENDING: '●', REVIEWED: '●', RESOLVED: '✓' };
  return <span className={`badge ${cls[status] || 'badge-pending'}`}>{dot[status]} {status}</span>;
}

function formatDate(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function FeedbackList({ refresh }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('ALL');
  const [search,    setSearch]    = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await feedbackService.getAllFeedbacks();
      setFeedbacks(res.data);
    } catch {
      toast.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load, refresh]);

  useEffect(() => {
    let data = feedbacks;
    if (filter !== 'ALL') data = data.filter(f => f.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.message.toLowerCase().includes(q)
      );
    }
    setFiltered(data);
  }, [feedbacks, filter, search]);

  return (
    <section className="feedback-list-section">
      <div className="container">
        <div className="section-label">Community</div>
        <h2 className="section-title">Recent Feedback</h2>
        <p className="section-sub">See what others are saying about us</p>

        <div className="list-controls">
          <div className="search-box">
            <FiSearch className="search-box__icon" />
            <input
              className="form-control"
              placeholder="Search feedbacks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <button className="btn btn-outline btn-sm" onClick={load}>
            <FiRefreshCw size={13} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">💬</div>
            <h3>No feedbacks found</h3>
            <p>Try a different filter or search term</p>
          </div>
        ) : (
          <div className="feedback-grid">
            {filtered.map((fb, i) => (
              <div
                className="feedback-card"
                key={fb.id}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="feedback-card__header">
                  <div>
                    <div className="feedback-card__name">{fb.name}</div>
                    <div className="feedback-card__email">{fb.email}</div>
                  </div>
                  <StatusBadge status={fb.status} />
                </div>
                <p className="feedback-card__message">{fb.message}</p>
                <div className="feedback-card__footer">
                  <span className="feedback-card__date">
                    {formatDate(fb.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

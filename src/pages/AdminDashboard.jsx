import { useState, useEffect, useCallback } from 'react';
import feedbackService from '../services/feedbackService';
import toast from 'react-hot-toast';
import {
  FiBarChart2, FiList, FiTrash2, FiEdit2,
  FiX, FiCheck, FiClock, FiAlertCircle
} from 'react-icons/fi';

const STATUSES = ['PENDING', 'REVIEWED', 'RESOLVED'];

function StatusBadge({ status }) {
  const cls = { PENDING: 'badge-pending', REVIEWED: 'badge-reviewed', RESOLVED: 'badge-resolved' };
  return <span className={`badge ${cls[status] || 'badge-pending'}`}>{status}</span>;
}

function formatDate(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function ConfirmModal({ feedback, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Delete Feedback</h3>
          <button className="btn btn-ghost btn-sm" onClick={onCancel}><FiX /></button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete feedback from <strong>{feedback.name}</strong>? This cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ feedback, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: feedback.name,
    email: feedback.email,
    message: feedback.message,
  });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Feedback</h3>
          <button className="btn btn-ghost btn-sm" onClick={onCancel}><FiX /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-control" name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-control" name="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="form-control" name="message" value={form.message} onChange={handleChange} rows={4} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={() => onSave(form)}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [feedbacks,  setFeedbacks]  = useState([]);
  const [stats,      setStats]      = useState({});
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState('all');
  const [deleteItem, setDeleteItem] = useState(null);
  const [editItem,   setEditItem]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [fbRes, stRes] = await Promise.all([
        feedbackService.getAllFeedbacks(),
        feedbackService.getStats(),
      ]);
      setFeedbacks(fbRes.data);
      setStats(stRes.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id, status) => {
    try {
      await feedbackService.updateStatus(id, status);
      toast.success(`Marked as ${status}`);
      load();
    } catch {
      toast.error('Status update failed');
    }
  };

  const handleDelete = async () => {
    try {
      await feedbackService.deleteFeedback(deleteItem.id);
      toast.success('Feedback deleted');
      setDeleteItem(null);
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleEdit = async (form) => {
    try {
      await feedbackService.updateFeedback(editItem.id, form);
      toast.success('Feedback updated');
      setEditItem(null);
      load();
    } catch {
      toast.error('Update failed');
    }
  };

  const displayed = activeTab === 'all'
    ? feedbacks
    : feedbacks.filter(f => f.status === activeTab.toUpperCase());

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__title">Admin Panel</div>
        <ul className="admin-nav">
          {[
            { key: 'all',      icon: <FiList />,      label: 'All Feedbacks' },
            { key: 'pending',  icon: <FiClock />,     label: 'Pending' },
            { key: 'reviewed', icon: <FiAlertCircle />,label: 'Reviewed' },
            { key: 'resolved', icon: <FiCheck />,     label: 'Resolved' },
            { key: 'stats',    icon: <FiBarChart2 />, label: 'Statistics' },
          ].map(item => (
            <li key={item.key} className={activeTab === item.key ? 'active' : ''}>
              <button onClick={() => setActiveTab(item.key)}>
                {item.icon} {item.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : activeTab === 'stats' ? (
          <>
            <h2 style={{ marginBottom: 28 }}>Statistics</h2>
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-card__label">Total</div>
                <div className="stat-card__value">{stats.total ?? 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__label">Pending</div>
                <div className="stat-card__value warning">{stats.pending ?? 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__label">Reviewed</div>
                <div className="stat-card__value accent">{stats.reviewed ?? 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__label">Resolved</div>
                <div className="stat-card__value success">{stats.resolved ?? 0}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ textTransform: 'capitalize' }}>{activeTab} Feedbacks</h2>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>{displayed.length} records</span>
            </div>

            {displayed.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">📭</div>
                <h3>No feedbacks here</h3>
                <p>Nothing in this category yet</p>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((fb, i) => (
                      <tr key={fb.id}>
                        <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{fb.name}</td>
                        <td className="truncate" style={{ maxWidth: 160 }}>{fb.email}</td>
                        <td className="truncate">{fb.message}</td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{formatDate(fb.createdAt)}</td>
                        <td>
                          <select
                            value={fb.status}
                            onChange={e => handleStatusChange(fb.id, e.target.value)}
                            style={{
                              border: '2px solid var(--border)',
                              borderRadius: 4,
                              padding: '4px 8px',
                              fontSize: '0.75rem',
                              fontFamily: 'var(--font-display)',
                              fontWeight: 700,
                              background: 'var(--paper)',
                              cursor: 'pointer',
                            }}
                          >
                            {STATUSES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              title="Edit"
                              onClick={() => setEditItem(fb)}
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              title="Delete"
                              style={{ color: 'var(--accent)' }}
                              onClick={() => setDeleteItem(fb)}
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {deleteItem && <ConfirmModal feedback={deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} />}
      {editItem   && <EditModal   feedback={editItem}   onSave={handleEdit}     onCancel={() => setEditItem(null)} />}
    </div>
  );
}

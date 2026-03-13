import { useState } from 'react';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';
import { FiCheckCircle, FiEye, FiZap } from 'react-icons/fi';

export default function Home() {
  const [tick, setTick] = useState(0);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero__content">
          <div className="hero__tag">Open Feedback</div>
          <h1 className="hero__title">
            Your voice <em>shapes</em> what we build next
          </h1>
          <p className="hero__sub">
            Drop us a message — whether it's a bug, an idea, or just a compliment.
            Every word counts.
          </p>
        </div>
      </section>

      {/* Form + Perks */}
      <section className="feedback-form-section">
        <div className="container">
          <div className="feedback-form-grid">
            <div>
              <div className="section-label">Submit</div>
              <h2 className="section-title">We're listening</h2>
              <p className="section-sub">Fill out the form and we'll get back to you</p>
              <FeedbackForm onSuccess={() => setTick(t => t + 1)} />
            </div>

            <div className="feedback-perks">
              <div className="perk-item">
                <div className="perk-icon"><FiZap /></div>
                <div className="perk-text">
                  <h4>Instant Submission</h4>
                  <p>Your feedback is captured immediately in real-time</p>
                </div>
              </div>
              <div className="perk-item">
                <div className="perk-icon"><FiEye /></div>
                <div className="perk-text">
                  <h4>Reviewed by Humans</h4>
                  <p>Every message is read and evaluated by our team</p>
                </div>
              </div>
              <div className="perk-item">
                <div className="perk-icon"><FiCheckCircle /></div>
                <div className="perk-text">
                  <h4>Status Tracking</h4>
                  <p>Track whether your feedback is pending, reviewed or resolved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* List */}
      <FeedbackList refresh={tick} />
    </>
  );
}

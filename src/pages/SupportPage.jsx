import { useMemo, useState } from "react";
import "../styles/support.css";
import Header from "../components/layout/Header";

export default function SupportPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  // timestamp: когда страница/форма была открыта (для антиспама на сервере)
  const ts = useMemo(() => Date.now(), []);

  const sendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", text: "" });

    const data = {
      email: e.target.email.value,
      message: e.target.message.value,
      website: e.target.website?.value || "", // honeypot
      ts, // антиспам: слишком быстро = бот
    };

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        // не JSON — бывает при прокси/ошибках
      }

      if (!res.ok || json?.success !== true) {
        throw new Error(
          json?.details ||
            json?.error ||
            `Request failed (${res.status})`
        );
      }

      setSent(true);
      setStatus({ type: "success", text: "Message sent. We’ll reply soon." });
      e.target.reset();
    } catch (err) {
      setStatus({
        type: "error",
        text: err?.message || "Error sending message",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header />

      <div className="support-page">
        <div className="support-page__inner">
          {/* ── Left col: info ── */}
          <div className="support-page__info">
            <p className="support-page__eyebrow">Support</p>

            <h1 className="support-page__title">
              How can we<br />
              <span className="support-page__title-accent">help you?</span>
            </h1>

            <p className="support-page__desc">
              Describe your issue and we'll get back to you as soon as possible.
              We typically respond within one business day.
            </p>

            <div className="support-page__contacts">
              <div className="support-page__contact-item">
                <span
                  className="support-page__contact-dot"
                  style={{ background: "var(--teal)" }}
                />
                <div>
                  <p className="support-page__contact-label">Gmail</p>
                  <p className="support-page__contact-value">
                    axiomandnode@gmail.com
                  </p>
                </div>
              </div>

              <div className="support-page__contact-item">
                <span
                  className="support-page__contact-dot"
                  style={{ background: "#a78bfa" }}
                />
                <div>
                  <p className="support-page__contact-label">Response time</p>
                  <p className="support-page__contact-value">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right col: form ── */}
          <div className="support-page__card">
            {sent ? (
              <div className="support-page__success">
                <div className="support-page__success-icon">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <h3 className="support-page__success-title">Message sent</h3>

                <p className="support-page__success-sub">
                  We've received your request and will respond shortly.
                </p>

                <button
                  className="support-page__btn support-page__btn--ghost"
                  onClick={() => {
                    setSent(false);
                    setStatus({ type: "", text: "" });
                  }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={sendMessage} className="support-page__form">
                <div className="support-page__form-header">
                  <p className="support-page__form-label">SUBMIT A REQUEST</p>
                  <div className="support-page__form-tag">
                    <span className="support-page__form-tag-dot" />
                    Online
                  </div>
                </div>

                {/* Honeypot field (bots fill it, humans never see it) */}
                <input
                  className="support-page__honeypot"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="support-page__field">
                  <label
                    className="support-page__field-label"
                    htmlFor="support-email"
                  >
                    Your email
                  </label>
                  <input
                    id="support-email"
                    className="support-page__input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="support-page__field">
                  <label
                    className="support-page__field-label"
                    htmlFor="support-message"
                  >
                    Message
                  </label>
                  <textarea
                    id="support-message"
                    className="support-page__input support-page__textarea"
                    name="message"
                    placeholder="Describe the issue in detail..."
                    rows={6}
                    required
                    minLength={10}
                  />
                </div>

                <button
                  type="submit"
                  className="support-page__btn support-page__btn--primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="support-page__spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Send message
                    </>
                  )}
                </button>

                {/* Status message */}
                {status.text ? (
                  <div
                    className={[
                      "support-page__status",
                      status.type === "error"
                        ? "support-page__status--error"
                        : "support-page__status--success",
                    ].join(" ")}
                    role="status"
                    aria-live="polite"
                  >
                    {status.text}
                  </div>
                ) : null}

                <p className="support-page__footnote">
                  By submitting you agree to our{" "}
                  <a href="#" className="support-page__footnote-link">
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
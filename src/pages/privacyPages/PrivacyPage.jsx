import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import "./privacy.css";
import "../../styles/layout.css";

const LAST_UPDATED = "April 2026";
const CONTACT_EMAIL = "axiomandnode@gmail.com";

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* ── Data we collect — icon cards ── */
const DATA_CARDS = [
  { icon: "mail",     label: "Email address",        color: "#2a8fa0", desc: "Account auth only. Never shown publicly." },
  { icon: "user",     label: "Display name",         color: "#27ae60", desc: "Shown on profile and public reviews." },
  { icon: "photo",    label: "Profile photo",        color: "#9b59b6", desc: "Stored as compressed image in database." },
  { icon: "brain",    label: "Diagnostic results",   color: "#e74c3c", desc: "Gap profiles, answers, session data. Private." },
  { icon: "practice", label: "Practice results",     color: "#d35400", desc: "Scores, time, performance. Private." },
  { icon: "mastery",  label: "Mastery test results", color: "#f39c12", desc: "Score, XP, time. Stored on your profile." },
  { icon: "notes",    label: "Notes",                color: "#2a8fa0", desc: "Text written during sessions. Private." },
  { icon: "feedback", label: "Reviews",              color: "#27ae60", desc: "Public only if you choose to submit." },
  { icon: "xp",       label: "XP & Streak",          color: "#9b59b6", desc: "Progress system data. Shown on profile." },
];

const ICONS = {
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  photo: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  brain: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  practice: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polyline points="9 11 12 14 22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  mastery: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  notes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  feedback: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  xp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
};

/* ── Storage flow diagram ── */
const StorageFlow = () => (
  <div className="pp-flow">
    {[
      { label: "You", sub: "Tashkent, Uzbekistan", color: "#2a8fa0" },
      { label: "Firebase", sub: "Google LLC · US/EU servers", color: "#e74c3c" },
      { label: "Axioma", sub: "AxiomaNode · Educational use only", color: "#27ae60" },
    ].map((node, i, arr) => (
      <div key={i} className="pp-flow__step">
        <div className="pp-flow__node" style={{ borderColor: node.color + "50", background: node.color + "10" }}>
          <span className="pp-flow__node-label" style={{ color: node.color }}>{node.label}</span>
          <span className="pp-flow__node-sub">{node.sub}</span>
        </div>
        {i < arr.length - 1 && (
          <div className="pp-flow__arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        )}
      </div>
    ))}
  </div>
);

/* ── Security stat pills ── */
const SECURITY_STATS = [
  { label: "Data fields public", value: "3", total: "of 9", color: "#27ae60", note: "Name, photo, XP only" },
  { label: "Data fields private", value: "6", total: "of 9", color: "#2a8fa0", note: "Results, notes, email" },
  { label: "Third parties with data access", value: "0", total: "advertisers", color: "#27ae60", note: "Firebase/Google only for hosting" },
  { label: "Data sold", value: "0", total: "ever", color: "#27ae60", note: "Not now, not ever" },
];

/* ── Rights action cards ── */
const RIGHTS = [
  { action: "Update name or photo", how: "In-app", where: "Profile → Edit Profile", color: "#27ae60", self: true },
  { action: "Delete your review", how: "In-app", where: "Feedback page → your review", color: "#27ae60", self: true },
  { action: "Delete your account", how: "Email us", where: CONTACT_EMAIL, color: "#e74c3c", self: false },
  { action: "Export your data", how: "Email us", where: CONTACT_EMAIL, color: "#d35400", self: false },
  { action: "Correct inaccurate data", how: "Email us", where: CONTACT_EMAIL, color: "#d35400", self: false },
];

const PrivacyPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="pp-page">

          {/* Breadcrumb */}
          <nav className="pp-breadcrumb">
            <Link to="/home" className="pp-breadcrumb__item">Home</Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <span className="pp-breadcrumb__item pp-breadcrumb__item--active">Privacy Policy</span>
          </nav>

          {/* ── HERO ── */}
          <section className="pp-hero">
            <div className="pp-hero__left">
              <div className="pp-hero__eyebrow">
                <span className="pp-hero__dot" />
                AxiomaNode · {LAST_UPDATED}
              </div>
              <h1 className="pp-hero__title">
                Your data.<br />
                <span className="pp-hero__accent">Explained plainly.</span>
              </h1>
              <p className="pp-hero__sub">
                We built Axioma to help students think better — not to harvest their data.
                No advertising. No selling. No fog. Just what we collect, why, and what you can do about it.
              </p>
              <div className="pp-hero__meta">
                <span className="pp-hero__meta-item">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {LAST_UPDATED}
                </span>
                <span className="pp-hero__meta-div" />
                <span className="pp-hero__meta-item">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  Tashkent, Uzbekistan
                </span>
              </div>
            </div>

            {/* Hero right — summary card */}
            <div className="pp-hero__right">
              <div className="pp-summary-card">
                <div className="pp-summary-card__header">
                  <span className="pp-summary-card__label">At a glance</span>
                  <span className="pp-summary-card__tag">TL;DR</span>
                </div>
                {[
                  { text: "Only what the platform needs", good: true },
                  { text: "Diagnostic results are private", good: true },
                  { text: "No advertisers. No data sales.", good: true },
                  { text: "Firebase servers outside Uzbekistan", good: false },
                  { text: "Delete everything anytime", good: true },
                ].map((item, i) => (
                  <div key={i} className="pp-summary-card__row">
                    <span className={`pp-summary-card__icon ${item.good ? "pp-summary-card__icon--good" : "pp-summary-card__icon--warn"}`}>
                      {item.good ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                      )}
                    </span>
                    <span className="pp-summary-card__text">{item.text}</span>
                  </div>
                ))}
                <div className="pp-summary-card__footer">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="pp-summary-card__contact">
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ── 01 WHO WE ARE ── */}
          <section className="pp-section">
            <div className="pp-section__tag">
              <span className="pp-tag-num">01</span>
              Who We Are
            </div>
            <h2 className="pp-section__title">AxiomaNode and this platform</h2>
            <div className="pp-two-col">
              <div>
                <p className="pp-body">
                  AxiomaNode is an independent educational research project based in Tashkent, Uzbekistan. Axioma is a reasoning diagnostic platform for mathematics students — it identifies where thinking breaks down, not just whether answers are right or wrong.
                </p>
                <p className="pp-body">
                  This policy explains what data we collect, why we collect it, how it is stored, and what rights you have. By using the platform, you agree to the practices described here.
                </p>
              </div>
              <div className="pp-who-card">
                <div className="pp-who-card__row">
                  <span className="pp-who-card__key">Project</span>
                  <span className="pp-who-card__val">AxiomaNode</span>
                </div>
                <div className="pp-who-card__row">
                  <span className="pp-who-card__key">Location</span>
                  <span className="pp-who-card__val">Tashkent, Uzbekistan</span>
                </div>
                <div className="pp-who-card__row">
                  <span className="pp-who-card__key">Contact</span>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="pp-who-card__link">{CONTACT_EMAIL}</a>
                </div>
                <div className="pp-who-card__row">
                  <span className="pp-who-card__key">Updated</span>
                  <span className="pp-who-card__val">{LAST_UPDATED}</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── 02 WHAT WE COLLECT ── */}
          <section className="pp-section">
            <div className="pp-section__tag">
              <span className="pp-tag-num">02</span>
              What We Collect
            </div>
            <h2 className="pp-section__title">Data collected when you use Axioma</h2>
            <p className="pp-body pp-body--wide">
              We collect only what is necessary to make the platform function. No location data, no device fingerprinting, no payment details, no behavioral analytics beyond Firebase defaults.
            </p>
            <div className="pp-data-grid">
              {DATA_CARDS.map((card, i) => (
                <div key={i} className="pp-data-card" style={{ "--card-color": card.color }}>
                  <div className="pp-data-card__icon" style={{ color: card.color, background: card.color + "15", borderColor: card.color + "30" }}>
                    {ICONS[card.icon]}
                  </div>
                  <p className="pp-data-card__label">{card.label}</p>
                  <p className="pp-data-card__desc">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── 03 HOW WE USE IT ── */}
          <section className="pp-section">
            <div className="pp-section__tag">
              <span className="pp-tag-num">03</span>
              How We Use It
            </div>
            <h2 className="pp-section__title">Why this data exists</h2>
            <div className="pp-use-grid">
              {[
                { color: "#27ae60", title: "Core function", items: ["Diagnostic results analysed to identify reasoning gaps", "Practice data shows progress over time", "Mastery test data awards XP and unlocks mastery cards"] },
                { color: "#2a8fa0", title: "Profile & community", items: ["Display name and photo appear on your public profile", "Reviews you submit are shown publicly with your name", "XP and level are shown on your profile — not shared externally"] },
                { color: "#e74c3c", title: "Never", items: ["We never sell or rent your data to anyone", "We never use your data for advertising", "We never share your diagnostic results with third parties"] },
              ].map((group, i) => (
                <div key={i} className="pp-use-card" style={{ "--use-color": group.color }}>
                  <div className="pp-use-card__header" style={{ borderColor: group.color + "40" }}>
                    <span className="pp-use-card__dot" style={{ background: group.color }} />
                    <span className="pp-use-card__title" style={{ color: group.color }}>{group.title}</span>
                  </div>
                  <ul className="pp-use-list">
                    {group.items.map((item, j) => (
                      <li key={j} className="pp-use-list__item">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── 04 STORAGE ── */}
          <section className="pp-section">
            <div className="pp-section__tag">
              <span className="pp-tag-num">04</span>
              Storage & Security
            </div>
            <h2 className="pp-section__title">Where your data lives</h2>
            <StorageFlow />
            <div className="pp-storage-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>
                <strong>Uzbekistan server disclosure.</strong> Uzbekistan's Personal Data Law (2019) requires that personal data of Uzbek citizens be stored on servers within Uzbekistan. As an early-stage independent project, we cannot currently meet this requirement. We disclose this transparently. If this is a concern, you may choose not to use the platform.
              </p>
            </div>
            <div className="pp-security-grid">
              {[
                { label: "Auth", value: "Firebase Auth", color: "#27ae60" },
                { label: "Database rules", value: "Own data only", color: "#27ae60" },
                { label: "Public profiles", value: "Safe fields only", color: "#27ae60" },
                { label: "Photos", value: "Base64 in Firestore", color: "#27ae60" },
                { label: "API keys", value: "Env variables", color: "#27ae60" },
                { label: "Server location", value: "Outside Uzbekistan", color: "#e74c3c" },
              ].map((item, i) => (
                <div key={i} className="pp-security-pill">
                  <span className="pp-security-pill__dot" style={{ background: item.color }} />
                  <span className="pp-security-pill__label">{item.label}</span>
                  <span className="pp-security-pill__val" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── 05 PUBLIC VS PRIVATE ── */}
          <section className="pp-section">
            <div className="pp-section__tag">
              <span className="pp-tag-num">05</span>
              Public Data
            </div>
            <h2 className="pp-section__title">What others can see</h2>
            <div className="pp-visibility-grid">
              <div className="pp-vis-col pp-vis-col--public">
                <div className="pp-vis-col__header">
                  <span className="pp-vis-col__dot" style={{ background: "#27ae60" }} />
                  <span className="pp-vis-col__title" style={{ color: "#27ae60" }}>Public</span>
                  <span className="pp-vis-col__sub">Visible to other logged-in users</span>
                </div>
                {["Display name", "Profile photo", "Level, tier and XP", "Public profile page", "Reviews you choose to submit"].map((item, i) => (
                  <div key={i} className="pp-vis-item pp-vis-item--public">{item}</div>
                ))}
              </div>
              <div className="pp-vis-col pp-vis-col--private">
                <div className="pp-vis-col__header">
                  <span className="pp-vis-col__dot" style={{ background: "#2a8fa0" }} />
                  <span className="pp-vis-col__title" style={{ color: "#2a8fa0" }}>Private</span>
                  <span className="pp-vis-col__sub">Only you can see these</span>
                </div>
                {["Diagnostic answers and gap profile", "Practice session results", "Mastery test answers", "Notes written during sessions", "Email address"].map((item, i) => (
                  <div key={i} className="pp-vis-item pp-vis-item--private">{item}</div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 06 YOUR RIGHTS ── */}
          <section className="pp-section">
            <div className="pp-section__tag">
              <span className="pp-tag-num">06</span>
              Your Rights
            </div>
            <h2 className="pp-section__title">What you can do with your data</h2>
            <div className="pp-rights-list">
              {RIGHTS.map((right, i) => (
                <div key={i} className="pp-right-row">
                  <div className="pp-right-row__left">
                    <span className="pp-right-row__action">{right.action}</span>
                  </div>
                  <div className="pp-right-row__how" style={{ color: right.color, borderColor: right.color + "30", background: right.color + "0e" }}>
                    {right.how}
                  </div>
                  <div className="pp-right-row__where">
                    {right.self ? (
                      <span>{right.where}</span>
                    ) : (
                      <a href={`mailto:${CONTACT_EMAIL}`} className="pp-right-row__link">{right.where}</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="pp-body pp-body--note">
              Account deletion is permanent. All data — diagnostic results, practice history, notes, XP — will be removed and cannot be recovered. We process deletion requests within 14 days.
            </p>
          </section>

          {/* ── 07 COOKIES ── */}
          <section className="pp-section">
            <div className="pp-section__tag">
              <span className="pp-tag-num">07</span>
              Cookies & Third Parties
            </div>
            <h2 className="pp-section__title">Cookies and services we use</h2>
            <div className="pp-two-col">
              <p className="pp-body">
                Axioma does not use advertising cookies, tracking pixels, or third-party analytics. Firebase uses session tokens stored in your browser to keep you logged in. Google Fonts loads typography from Google's CDN — this is a standard practice and does not involve personal data collection on our end.
              </p>
              <div className="pp-services">
                {[
                  { name: "Google Firebase", role: "Auth, database, hosting", color: "#e74c3c" },
                  { name: "Google Fonts", role: "Typography — CDN only", color: "#d35400" },
                  { name: "Vercel", role: "Platform hosting", color: "#9b59b6" },
                ].map((s, i) => (
                  <div key={i} className="pp-service-row">
                    <span className="pp-service-dot" style={{ background: s.color }} />
                    <span className="pp-service-name">{s.name}</span>
                    <span className="pp-service-role">{s.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 08 CHANGES ── */}
          <section className="pp-section pp-section--last">
            <div className="pp-section__tag">
              <span className="pp-tag-num">08</span>
              Changes
            </div>
            <h2 className="pp-section__title">Updates to this policy</h2>
            <p className="pp-body">
              We may update this Privacy Policy as the platform evolves. When we make significant changes, we will update the date above. Continued use of Axioma after changes are posted means you accept the updated policy.
            </p>
          </section>

          {/* Footer CTA */}
          <div className="pp-footer-cta">
            <div className="pp-footer-cta__glow" />
            <div className="pp-footer-cta__grid" />
            <div className="pp-footer-cta__body">
              <p className="pp-footer-cta__title">Questions about your data?</p>
              <p className="pp-footer-cta__sub">We are a small independent team. We will respond as quickly as we can.</p>
              <div className="pp-footer-cta__actions">
                <a href={`mailto:${CONTACT_EMAIL}`} className="pp-btn pp-btn--primary">
                  Email us <ChevronRight />
                </a>
                <Link to="/home" className="pp-btn pp-btn--ghost">
                  Back to Axioma
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;
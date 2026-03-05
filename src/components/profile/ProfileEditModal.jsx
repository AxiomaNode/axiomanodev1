// src/components/profile/ProfileEditModal.jsx
import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const nameChangeLockUntil = (profile) => {
  const last = profile?.profileMeta?.lastNameChange;
  if (!last) return null;
  const lastMs =
    last?.toDate?.()?.getTime?.() ??
    (typeof last === "string" ? new Date(last).getTime() : null);
  if (!lastMs || isNaN(lastMs)) return null;
  const unlockMs = lastMs + SEVEN_DAYS_MS;
  return Date.now() < unlockMs ? new Date(unlockMs) : null;
};

const formatUnlock = (date) =>
  date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const ProfileEditModal = ({ user, profile, onClose, onSaved }) => {
  const [name,    setName]    = useState(user?.displayName || "");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const lockUntil   = nameChangeLockUntil(profile);
  const isLocked    = lockUntil !== null;
  const nameChanged = name.trim() !== (user?.displayName || "").trim();
  const canSave     = nameChanged && !isLocked && name.trim().length >= 2 && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setError("");
    setSaving(true);
    try {
      await updateProfile(user, { displayName: name.trim() });
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          displayName: name.trim(),
          updatedAt: new Date().toISOString(),
          profileMeta: { lastNameChange: new Date().toISOString() },
        },
        { merge: true }
      );
      const snap = await getDoc(userRef);
      const updated = snap.exists() ? snap.data() : null;
      setSuccess(true);
      setTimeout(() => { onSaved?.(updated); onClose(); }, 900);
    } catch (err) {
      console.error(err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="pedit-backdrop" onClick={handleBackdrop} role="dialog" aria-modal="true">
      <div className="pedit-modal">

        {/* Header */}
        <div className="pedit-modal__header">
          <div className="pedit-modal__title-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <h2 className="pedit-modal__title">Edit Profile</h2>
          </div>
          <button className="pedit-modal__close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6"  x2="6"  y2="18"/>
              <line x1="6"  y1="6"  x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="pedit-modal__body">

          <div className="pedit-field">
            <label className="pedit-field__label" htmlFor="pedit-name">
              Display name
              {isLocked && (
                <span className="pedit-field__locked-badge">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  locked
                </span>
              )}
            </label>
            <input
              id="pedit-name"
              type="text"
              className={`pedit-field__input${isLocked ? " pedit-field__input--locked" : ""}`}
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              disabled={isLocked || saving}
              placeholder="Your display name"
              maxLength={48}
              autoFocus={!isLocked}
            />
            {isLocked ? (
              <p className="pedit-field__hint pedit-field__hint--warn">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8"  x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Available again on <strong>{formatUnlock(lockUntil)}</strong>
              </p>
            ) : (
              <p className="pedit-field__hint">Name can be changed once every 7 days.</p>
            )}
          </div>

          <div className="pedit-field">
            <label className="pedit-field__label">Email address</label>
            <div className="pedit-field__readonly">{user?.email}</div>
          </div>

          {error && !success && (
            <div className="pedit-feedback pedit-feedback--error">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8"  x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="pedit-feedback pedit-feedback--success">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Profile updated.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pedit-modal__footer">
          <button className="pedit-btn pedit-btn--ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="pedit-btn pedit-btn--primary" onClick={handleSave} disabled={!canSave}>
            {saving ? <><span className="pedit-spinner" /> Saving…</> : "Save changes"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileEditModal;
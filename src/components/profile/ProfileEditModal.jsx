import { useState, useRef, useCallback, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { savePublicProfile } from "../../services/db";
import { auth, db } from "../../firebase/firebaseConfig";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const AVATAR_SIZE = 400;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms)
    ),
  ]);

const getLockUntil = (isoOrTimestamp) => {
  if (!isoOrTimestamp) return null;
  const ms =
    isoOrTimestamp?.toDate?.()?.getTime?.() ??
    (typeof isoOrTimestamp === "string" ? new Date(isoOrTimestamp).getTime() : null);
  if (!ms || Number.isNaN(ms)) return null;
  const unlockMs = ms + SEVEN_DAYS_MS;
  return Date.now() < unlockMs ? new Date(unlockMs) : null;
};

const nameChangeLockUntil = (profile) => getLockUntil(profile?.profileMeta?.lastNameChange);
const photoChangeLockUntil = (profile) => getLockUntil(profile?.profileMeta?.lastPhotoChange);

const formatUnlock = (date) =>
  date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const resizeToSquare = (file, size = AVATAR_SIZE) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d");

      const short = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - short) / 2;
      const sy = (img.naturalHeight - short) / 2;

      ctx.drawImage(img, sx, sy, short, short, 0, 0, size, size);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
        "image/webp",
        0.88
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };

    img.src = url;
  });

const uploadPhotoWithProgress = (photoRef, file, onProgress) =>
  new Promise((resolve, reject) => {
    const task = uploadBytesResumable(photoRef, file, { contentType: "image/webp" });

    task.on(
      "state_changed",
      (snapshot) => {
        const total = snapshot.totalBytes || 1;
        const progress = Math.round((snapshot.bytesTransferred / total) * 100);
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (error) {
          reject(error);
        }
      }
    );
  });

const AvatarPreview = ({ name, photoURL, previewURL, size = 72 }) => {
  const src = previewURL || photoURL;
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  }

  return (
    <div
      className="profile-avatar__initials"
      style={{ width: size, height: size, fontSize: size * 0.34, borderRadius: "50%" }}
    >
      {initials}
    </div>
  );
};

const ProfileEditModal = ({ user, profile, onClose, onSaved }) => {
  const [name, setName] = useState(user?.displayName || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  const nameLockUntil = nameChangeLockUntil(profile);
  const photoLockUntil = photoChangeLockUntil(profile);
  const nameIsLocked = nameLockUntil !== null;
  const photoIsLocked = photoLockUntil !== null;

  const nameChanged = name.trim() !== (user?.displayName || "").trim();
  const photoChanged = photoFile !== null;
  const anythingChanged = nameChanged || photoChanged;

  const canSave =
    anythingChanged &&
    !saving &&
    (!nameChanged || (!nameIsLocked && name.trim().length >= 2)) &&
    (!photoChanged || !photoIsLocked);

  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Only JPEG, PNG, or WebP images are supported.");
        return;
      }

      if (file.size > MAX_FILE_BYTES) {
        setError("Image must be under 2 MB.");
        return;
      }

      setError("");
      try {
        const blob = await resizeToSquare(file, AVATAR_SIZE);

        if (previewURL) URL.revokeObjectURL(previewURL);

        setPreviewURL(URL.createObjectURL(blob));
        setPhotoFile(blob);
        setUploadProgress(0);
      } catch (err) {
        console.error(err);
        setError("Could not process image. Please try another file.");
      }
    },
    [previewURL]
  );

  const handleClearPhoto = () => {
    if (previewURL) URL.revokeObjectURL(previewURL);
    setPreviewURL(null);
    setPhotoFile(null);
    setUploadProgress(0);
    setError("");
  };

  const handleSave = async () => {
    if (!canSave) return;

    setError("");
    setSuccess(false);
    setSaving(true);
    setUploadProgress(0);

    try {
      const now = new Date().toISOString();
      const trimmed = name.trim();
      let newPhotoURL = user?.photoURL || "";

      console.log("[profile] save started");

      if (photoChanged) {
        console.log("[profile] photo upload started");

        const storage = getStorage();
        const photoRef = storageRef(storage, `profilePhotos/${user.uid}/avatar.webp`);

        newPhotoURL = await withTimeout(
          uploadPhotoWithProgress(photoRef, photoFile, setUploadProgress),
          30000,
          "photo upload"
        );

        console.log("[profile] photo upload finished", newPhotoURL);
      }

      const authUpdates = {};
      if (nameChanged) authUpdates.displayName = trimmed;
      if (photoChanged) authUpdates.photoURL = newPhotoURL;

      if (Object.keys(authUpdates).length) {
        console.log("[profile] updateProfile started");
        await withTimeout(updateProfile(user, authUpdates), 10000, "updateProfile");
        console.log("[profile] updateProfile done");
      }

      const metaPatch = {};
      if (nameChanged) metaPatch.lastNameChange = now;
      if (photoChanged) metaPatch.lastPhotoChange = now;

      const userRef = doc(db, "users", user.uid);
      const userPatch = {
        updatedAt: now,
        profileMeta: metaPatch,
      };

      if (nameChanged) userPatch.displayName = trimmed;
      if (photoChanged) userPatch.photoURL = newPhotoURL;

      console.log("[profile] users doc update started");
      await withTimeout(setDoc(userRef, userPatch, { merge: true }), 10000, "users setDoc");
      console.log("[profile] users doc update done");

      if (nameChanged) {
        const feedbackRef = doc(db, "feedback", user.uid);
        const feedbackSnap = await withTimeout(getDoc(feedbackRef), 10000, "feedback getDoc");

        if (feedbackSnap.exists()) {
          await withTimeout(
            setDoc(feedbackRef, { displayName: trimmed }, { merge: true }),
            10000,
            "feedback setDoc"
          );
        }
      }

      console.log("[profile] public profile sync started");
      await withTimeout(
        savePublicProfile(user.uid, {
          displayName: nameChanged
            ? trimmed
            : profile?.displayName || user?.displayName || "Anonymous",
          photoURL: photoChanged ? newPhotoURL : user?.photoURL || "",
          ratingPoints: profile?.ratingPoints || 0,
          createdAt: profile?.createdAt || now,
          stats: {
            diagnosticsCompleted: profile?.stats?.diagnosticsCompleted || 0,
            practiceCompleted: profile?.stats?.practiceCompleted || 0,
            avgScore: profile?.stats?.avgScore ?? null,
          },
        }),
        10000,
        "savePublicProfile"
      );
      console.log("[profile] public profile sync done");

      const snap = await withTimeout(getDoc(userRef), 10000, "final getDoc");
      const updated = snap.exists() ? snap.data() : null;

      setSuccess(true);

      setTimeout(() => {
        onSaved?.(updated, photoChanged ? newPhotoURL : null);
        onClose();
      }, 700);
    } catch (err) {
      console.error("[profile] save failed:", err);

      if (err?.code === "storage/unauthorized") {
        setError("Storage rules denied the upload.");
      } else if (err?.code === "storage/canceled") {
        setError("Upload was canceled.");
      } else if (err?.code === "storage/retry-limit-exceeded") {
        setError("Upload took too long. Please try again.");
      } else {
        setError(err?.message || "Failed to save changes. Please try again.");
      }
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
        <div className="pedit-modal__header">
          <div className="pedit-modal__title-row">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <h2 className="pedit-modal__title">Edit Profile</h2>
          </div>

          <button className="pedit-modal__close" onClick={onClose} aria-label="Close">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="pedit-modal__body">
          <div className="pedit-field pedit-field--photo">
            <label className="pedit-field__label">
              Profile photo
              {photoIsLocked && (
                <span className="pedit-field__locked-badge">
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  locked
                </span>
              )}
            </label>

            <div className="pedit-photo-row">
              <div
                className={`pedit-photo-avatar${photoIsLocked || saving ? " pedit-photo-avatar--locked" : ""}`}
                onClick={() => !photoIsLocked && !saving && fileRef.current?.click()}
                role={!photoIsLocked && !saving ? "button" : undefined}
                aria-label={!photoIsLocked && !saving ? "Change profile photo" : undefined}
                tabIndex={!photoIsLocked && !saving ? 0 : undefined}
                onKeyDown={(e) =>
                  e.key === "Enter" && !photoIsLocked && !saving && fileRef.current?.click()
                }
              >
                <AvatarPreview
                  name={profile?.displayName || user?.displayName}
                  photoURL={user?.photoURL}
                  previewURL={previewURL}
                  size={72}
                />
                {!photoIsLocked && !saving && (
                  <div className="pedit-photo-avatar__overlay" aria-hidden="true">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="pedit-photo-actions">
                {!photoIsLocked ? (
                  <>
                    <button
                      className="pedit-btn pedit-btn--ghost pedit-btn--sm"
                      onClick={() => fileRef.current?.click()}
                      disabled={saving}
                      type="button"
                    >
                      {photoChanged ? "Change again" : "Upload photo"}
                    </button>

                    {photoChanged && (
                      <button
                        className="pedit-btn pedit-btn--ghost pedit-btn--sm pedit-btn--danger"
                        onClick={handleClearPhoto}
                        disabled={saving}
                        type="button"
                      >
                        Remove
                      </button>
                    )}

                    <p className="pedit-field__hint">
                      JPG, PNG or WebP · max 2 MB · cropped to square
                    </p>

                    {saving && photoChanged && (
                      <p className="pedit-field__hint">
                        Uploading photo… {uploadProgress}%
                      </p>
                    )}
                  </>
                ) : (
                  <p className="pedit-field__hint pedit-field__hint--warn">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Available again on <strong>{formatUnlock(photoLockUntil)}</strong>
                  </p>
                )}
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={handleFileChange}
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>

          <div className="pedit-field">
            <label className="pedit-field__label" htmlFor="pedit-name">
              Display name
              {nameIsLocked && (
                <span className="pedit-field__locked-badge">
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  locked
                </span>
              )}
            </label>

            <input
              id="pedit-name"
              type="text"
              className={`pedit-field__input${nameIsLocked ? " pedit-field__input--locked" : ""}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              disabled={nameIsLocked || saving}
              placeholder="Your display name"
              maxLength={48}
              autoFocus={!nameIsLocked && !photoIsLocked}
            />

            {nameIsLocked ? (
              <p className="pedit-field__hint pedit-field__hint--warn">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Available again on <strong>{formatUnlock(nameLockUntil)}</strong>
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
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="pedit-feedback pedit-feedback--success">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Profile updated.
            </div>
          )}
        </div>

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
import { useEffect, useState } from "react";
import { getProfile } from "../api/client";

export default function About() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then(({ data }) => setProfile(data));
  }, []);

  if (!profile) return null;

  return (
    <div className="container" style={{ padding: "3rem 0 5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 320px) 1fr", gap: "3rem" }}>
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt={profile.name}
            style={{ width: "100%", borderRadius: "var(--radius-md)", aspectRatio: "4/5", objectFit: "cover" }}
          />
        )}
        <div>
          <span className="eyebrow">About</span>
          <h1 style={{ fontSize: "var(--text-h1)", margin: "0.5rem 0 1.5rem" }}>{profile.name}</h1>
          {profile.tagline && (
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "1.5rem" }}>
              {profile.tagline}
            </p>
          )}
          <p style={{ whiteSpace: "pre-line", color: "var(--color-ink-soft)", maxWidth: "62ch" }}>
            {profile.bio}
          </p>

          {profile.skills?.length > 0 && (
            <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {profile.skills.map((s) => (
                <span
                  key={s.id}
                  className="eyebrow"
                  style={{
                    padding: "0.5rem 0.9rem",
                    border: "1px solid var(--color-hairline)",
                    borderRadius: "100px",
                  }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          )}

          {profile.resume && (
            <a href={profile.resume} className="btn btn-accent" style={{ marginTop: "2.5rem" }} download>
              Download Résumé
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

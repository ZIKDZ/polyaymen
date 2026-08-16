import { useEffect, useState } from "react";
import { getInbox } from "../../api/client";

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInbox()
      .then(({ data }) => setMessages(data.results ?? data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-h2)", marginBottom: "2rem" }}>Inbox</h1>
      {loading ? (
        <p>Loading…</p>
      ) : messages.length === 0 ? (
        <p style={{ color: "var(--color-ink-soft)" }}>No messages yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {messages.map((m) => (
            <div key={m.id} style={{ borderBottom: "1px solid var(--color-hairline)", paddingBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{m.name}</strong>
                <span className="eyebrow">{new Date(m.created_at).toLocaleDateString()}</span>
              </div>
              <p style={{ color: "var(--color-ink-soft)", fontSize: "0.85rem", margin: "0.25rem 0 0.75rem" }}>
                {m.email} {m.subject && `· ${m.subject}`}
              </p>
              <p>{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

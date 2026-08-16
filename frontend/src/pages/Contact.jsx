import { useState } from "react";
import { sendContactMessage } from "../api/client";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendContactMessage(form);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="container" style={{ padding: "3rem 0 5rem", maxWidth: "640px" }}>
      <span className="eyebrow">Contact</span>
      <h1 style={{ fontSize: "var(--text-h1)", margin: "0.5rem 0 2.5rem" }}>Let's talk about your project.</h1>

      {status === "sent" ? (
        <p>Message sent. I'll get back to you shortly.</p>
      ) : (
        <form onSubmit={onSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={onChange} required />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" value={form.subject} onChange={onChange} />
          </div>
          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={6} value={form.message} onChange={onChange} required />
          </div>
          <button type="submit" className="btn btn-accent" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send Message"}
          </button>
          {status === "error" && (
            <p style={{ color: "#a33", marginTop: "1rem" }}>
              Something went wrong sending that — try again in a moment.
            </p>
          )}
        </form>
      )}
    </div>
  );
}

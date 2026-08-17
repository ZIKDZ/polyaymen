import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, createProject, updateProject } from "../../api/client";

const emptyForm = {
  title: "", summary: "", description: "",
  is_featured: false, published: true,
};

export default function ProjectForm() {
  const { slug } = useParams();
  const isEditing = Boolean(slug);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [glbFile, setGlbFile] = useState(null);
  const [thumbnailDragging, setThumbnailDragging] = useState(false);
  const [glbDragging, setGlbDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    api.get(`/dashboard/projects/${slug}/`).then(({ data }) => {
      setForm({
        title: data.title ?? "",
        summary: data.summary ?? "",
        description: data.description ?? "",
        is_featured: data.is_featured ?? false,
        published: data.published ?? true,
      });
      if (data.thumbnail) setThumbnailPreview(data.thumbnail);
    });
  }, [slug, isEditing]);

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const onThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const onGlbChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGlbFile(file);
  };

  const onDrop = (e, type) => {
    e.preventDefault();
    if (type === "thumbnail") {
      setThumbnailDragging(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setGlbDragging(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      setGlbFile(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (thumbnail) payload.append("thumbnail", thumbnail);
    if (glbFile) payload.append("glb_file", glbFile);
    try {
      if (isEditing) {
        await updateProject(slug, payload);
      } else {
        await createProject(payload);
      }
      navigate("/dashboard/projects");
    } catch (err) {
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Something went wrong saving this project."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "620px" }}>
      <h1 style={{ fontSize: "var(--text-h2)", marginBottom: "2rem" }}>
        {isEditing ? "Edit project" : "New project"}
      </h1>

      <form onSubmit={onSubmit}>

        {/* ── Text fields ── */}
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={form.title} onChange={onChange} required />
        </div>

        <div className="form-field">
          <label htmlFor="summary">
            Summary{" "}
            <span style={{ opacity: 0.4, fontWeight: 400, fontSize: "0.78rem" }}>
              — one line shown on cards
            </span>
          </label>
          <input id="summary" name="summary" value={form.summary} onChange={onChange} maxLength={240} />
        </div>

        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={5} value={form.description} onChange={onChange} />
        </div>

        {/* ── Thumbnail ── */}
        <div className="form-field">
          <label>
            Thumbnail image{" "}
            {isEditing && (
              <span style={{ opacity: 0.4, fontWeight: 400, fontSize: "0.78rem" }}>
                — leave empty to keep current
              </span>
            )}
          </label>

          <label
            htmlFor="thumbnail"
            onDrop={(e) => onDrop(e, "thumbnail")}
            onDragOver={(e) => { e.preventDefault(); setThumbnailDragging(true); }}
            onDragLeave={() => setThumbnailDragging(false)}
            style={{
              display: "block",
              position: "relative",
              cursor: "pointer",
              border: `1px dashed ${thumbnailDragging ? "var(--accent)" : "rgba(255,255,255,0.15)"}`,
              background: thumbnailDragging ? "rgba(255,255,255,0.03)" : "transparent",
              transition: "border-color 0.2s, background 0.2s",
              overflow: "hidden",
            }}
          >
            {thumbnailPreview ? (
              /* ── has preview ── */
              <div style={{ position: "relative" }}>
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  style={{
                    width: "100%",
                    maxHeight: "280px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {/* dark overlay on hover handled via CSS trick with a sibling */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.55)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
                  className="thumb-overlay"
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}>
                    Replace image
                  </span>
                </div>
              </div>
            ) : (
              /* ── empty state ── */
              <div style={{
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                padding: "2.5rem 1rem",
              }}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ opacity: 0.3 }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <div style={{ textAlign: "center" }}>
                  <p style={{
                    margin: 0,
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    opacity: 0.45,
                    lineHeight: 1.9,
                  }}>
                    Drag &amp; drop an image here<br />
                    or click to browse
                  </p>
                </div>
              </div>
            )}

            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={onThumbnailChange}
              required={!isEditing}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {/* ── GLB upload ── */}
        <div className="form-field">
          <label>
            3D model{" "}
            <span style={{ opacity: 0.4, fontWeight: 400, fontSize: "0.78rem" }}>
              — .glb, optional
            </span>
          </label>

          <label
            htmlFor="glb_file"
            onDrop={(e) => onDrop(e, "glb")}
            onDragOver={(e) => { e.preventDefault(); setGlbDragging(true); }}
            onDragLeave={() => setGlbDragging(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              padding: "1.25rem 1.5rem",
              cursor: "pointer",
              border: `1px dashed ${glbDragging ? "var(--accent)" : "rgba(255,255,255,0.15)"}`,
              background: glbDragging ? "rgba(255,255,255,0.03)" : "transparent",
              transition: "border-color 0.2s, background 0.2s",
            }}
          >
            {/* icon block */}
            <span style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "42px",
              height: "42px",
              background: "rgba(255,255,255,0.05)",
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke={glbFile ? "var(--accent, #6c63ff)" : "currentColor"}
                strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
                style={{ opacity: glbFile ? 1 : 0.4, transition: "opacity 0.2s" }}>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </span>

            {/* text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {glbFile ? (
                <>
                  <p style={{
                    margin: 0,
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {glbFile.name}
                  </p>
                  <p style={{
                    margin: "0.2rem 0 0",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    opacity: 0.4,
                  }}>
                    {(glbFile.size / 1024 / 1024).toFixed(2)} MB — click to replace
                  </p>
                </>
              ) : (
                <>
                  <p style={{
                    margin: 0,
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    opacity: 0.45,
                  }}>
                    Drag &amp; drop a{" "}
                    <span style={{ color: "var(--accent, #6c63ff)", opacity: 1 }}>.glb</span>
                    {" "}file here
                  </p>
                  <p style={{
                    margin: "0.2rem 0 0",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    opacity: 0.3,
                  }}>
                    or click to browse
                  </p>
                </>
              )}
            </div>

            {/* clear button */}
            {glbFile && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setGlbFile(null); }}
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.12)",
                  cursor: "pointer",
                  padding: "0.3rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  opacity: 0.5,
                  color: "inherit",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.5)}
                title="Remove file"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}

            <input
              id="glb_file"
              type="file"
              accept=".glb"
              onChange={onGlbChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {/* ── Toggles ── */}
        <div style={{ display: "flex", gap: "2rem", margin: "1.75rem 0 1.75rem" }}>
          {[
            { name: "is_featured", label: "Featured", sub: "shown in hero" },
            { name: "published", label: "Published", sub: "visible on site" },
          ].map(({ name, label, sub }) => (
            <label
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {/* toggle track */}
              <span style={{ position: "relative", width: "40px", height: "22px", flexShrink: 0 }}>
                <input
                  type="checkbox"
                  name={name}
                  checked={form[name]}
                  onChange={onChange}
                  style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                />
                <span style={{
                  position: "absolute", inset: 0,
                  background: form[name] ? "var(--accent, #6c63ff)" : "rgba(255,255,255,0.08)",
                  border: `1px solid ${form[name] ? "var(--accent, #6c63ff)" : "rgba(255,255,255,0.15)"}`,
                  transition: "background 0.2s, border-color 0.2s",
                }} />
                <span style={{
                  position: "absolute",
                  top: "3px",
                  left: form[name] ? "21px" : "3px",
                  width: "14px", height: "14px",
                  background: "#fff",
                  transition: "left 0.2s",
                }} />
              </span>

              <span>
                <span style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}>
                  {label}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.06em",
                  opacity: 0.35,
                  marginLeft: "0.5rem",
                  textTransform: "lowercase",
                }}>
                  {sub}
                </span>
              </span>
            </label>
          ))}
        </div>

        {/* ── Error ── */}
        {error && (
          <p style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.75rem",
            letterSpacing: "0.06em",
            color: "#c0392b",
            border: "1px solid rgba(192,57,43,0.3)",
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
          }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-accent" disabled={saving}>
          {saving ? "Saving…" : isEditing ? "Save changes" : "Create project"}
        </button>

      </form>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, createProject, updateProject } from "../../api/client";

const emptyForm = {
  title: "", summary: "", description: "",
  poly_count: "", texture_resolution: "",
  is_featured: false, published: true,
};

export default function ProjectForm() {
  const { slug } = useParams(); // undefined => "new"
  const isEditing = Boolean(slug);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [thumbnail, setThumbnail] = useState(null);
  const [glbFile, setGlbFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    api.get(`/dashboard/projects/${slug}/`).then(({ data }) => {
      setForm({
        title: data.title ?? "",
        summary: data.summary ?? "",
        description: data.description ?? "",
        poly_count: data.poly_count ?? "",
        texture_resolution: data.texture_resolution ?? "",
        is_featured: data.is_featured ?? false,
        published: data.published ?? true,
      });
    });
  }, [slug, isEditing]);

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
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
    <div style={{ maxWidth: "560px" }}>
      <h1 style={{ fontSize: "var(--text-h2)", marginBottom: "2rem" }}>
        {isEditing ? "Edit project" : "New project"}
      </h1>
      <form onSubmit={onSubmit}>
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={form.title} onChange={onChange} required />
        </div>
        <div className="form-field">
          <label htmlFor="summary">Summary (one line, shown on cards)</label>
          <input id="summary" name="summary" value={form.summary} onChange={onChange} maxLength={240} />
        </div>
        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={5} value={form.description} onChange={onChange} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-field">
            <label htmlFor="poly_count">Poly count</label>
            <input id="poly_count" name="poly_count" type="number" value={form.poly_count} onChange={onChange} />
          </div>
          <div className="form-field">
            <label htmlFor="texture_resolution">Texture resolution</label>
            <input id="texture_resolution" name="texture_resolution" placeholder="4096×4096" value={form.texture_resolution} onChange={onChange} />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="thumbnail">Thumbnail image {isEditing && "(leave empty to keep current)"}</label>
          <input id="thumbnail" type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} required={!isEditing} />
        </div>
        <div className="form-field">
          <label htmlFor="glb_file">3D model (.glb) — optional</label>
          <input id="glb_file" type="file" accept=".glb" onChange={(e) => setGlbFile(e.target.files[0])} />
        </div>

        <div style={{ display: "flex", gap: "1.5rem", margin: "1.5rem 0" }}>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.9rem" }}>
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={onChange} />
            Featured (shown in hero)
          </label>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.9rem" }}>
            <input type="checkbox" name="published" checked={form.published} onChange={onChange} />
            Published
          </label>
        </div>

        {error && <p style={{ color: "#a33", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}

        <button type="submit" className="btn btn-accent" disabled={saving}>
          {saving ? "Saving…" : isEditing ? "Save changes" : "Create project"}
        </button>
      </form>
    </div>
  );
}

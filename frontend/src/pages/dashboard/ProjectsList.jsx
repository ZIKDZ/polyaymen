import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardProjects, deleteProject } from "../../api/client";

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getDashboardProjects()
      .then(({ data }) => setProjects(data.results ?? data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onDelete = async (slug) => {
    if (!confirm("Delete this project? This can't be undone.")) return;
    await deleteProject(slug);
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "var(--text-h2)" }}>Projects</h1>
        <Link to="/dashboard/projects/new" className="btn btn-accent">+ New Project</Link>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="dash-table" style={{ marginTop: "2rem" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Published</th>
              <th>3D Model</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.category ? p.category : "—"}</td>
                <td>{p.published ? "Yes" : "Draft"}</td>
                <td>{p.glb_file ? "Yes" : "—"}</td>
                <td style={{ display: "flex", gap: "0.75rem" }}>
                  <Link to={`/dashboard/projects/${p.slug}`}>Edit</Link>
                  <button
                    onClick={() => onDelete(p.slug)}
                    style={{ background: "none", border: "none", color: "#a33", cursor: "pointer", padding: 0 }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={5} style={{ color: "var(--color-ink-soft)" }}>No projects yet.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

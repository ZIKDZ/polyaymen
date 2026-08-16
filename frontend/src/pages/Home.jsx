import { useEffect, useState } from "react";
import ModelViewer from "../components/ModelViewer";
import ModelErrorBoundary from "../components/ModelErrorBoundary";
import ProjectCard from "../components/ProjectCard";
import { getProjects } from "../api/client";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(({ data }) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];
        setProjects(list);
      })
      .catch((err) => {
        console.error("Failed to load projects:", err);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const featured = projects.find((p) => p.is_featured && p.has_3d_model) ??
    projects.find((p) => p.has_3d_model);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">3D Artist — Characters / Hard Surface / Environments</span>
          <h1>Polyaymen</h1>
          <p>Sculpted, textured, and lit for real-time. Every piece on this page is the actual model — rotate it, inspect it, get close.</p>
        </div>
        <div className="hero-stage">
          {featured && (
            <ModelErrorBoundary>
              <ModelViewer glbUrl={featured.glb_file} interactive autoRotate />
            </ModelErrorBoundary>
          )}
        </div>
      </section>

      <div className="container">
        <span className="eyebrow">Selected Work</span>
        {loading ? (
          <p style={{ marginTop: "1.5rem", color: "var(--color-ink-soft)" }}>Loading projects…</p>
        ) : projects.length === 0 ? (
          <p style={{ marginTop: "1.5rem", color: "var(--color-ink-soft)" }}>
            No published projects yet — add one from the dashboard.
          </p>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
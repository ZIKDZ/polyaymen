import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ModelViewer from "../components/ModelViewer";
import { getProject } from "../api/client";
import ModelErrorBoundary from "../components/ModelErrorBoundary";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setProject(null);
    getProject(slug)
      .then(({ data }) => setProject(data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="container" style={{ padding: "6rem 0", textAlign: "center" }}>
        <h2>This piece isn't here.</h2>
        <p style={{ color: "var(--color-ink-soft)" }}>
          It may have been unpublished or the link is out of date.
        </p>
        <Link to="/" className="btn" style={{ marginTop: "1.5rem" }}>Back to work</Link>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="container" style={{ padding: "3rem 0 4rem" }}>
      <span className="eyebrow">{project.category?.name || "Study"}</span>
      <h1 style={{ fontSize: "var(--text-h1)", marginTop: "0.5rem" }}>{project.title}</h1>
      {project.summary && (
        <p style={{ color: "var(--color-ink-soft)", maxWidth: "60ch", marginTop: "0.75rem" }}>
          {project.summary}
        </p>
      )}

      {project.glb_file ? (
        <div className="project-detail-stage">
          <ModelErrorBoundary>
            <ModelViewer glbUrl={project.glb_file} interactive autoRotate={false} />
          </ModelErrorBoundary>
        </div>
      ) : project.gallery?.length > 0 ? (
        <div className="gallery-strip" style={{ marginTop: "2rem" }}>
          {project.gallery.map((img) => (
            <img key={img.id} src={img.image} alt={img.caption || project.title} />
          ))}
        </div>
      ) : null}

      <dl className="project-meta-grid">
        {project.poly_count && (
          <div>
            <dt>Poly Count</dt>
            <dd style={{ fontFamily: "var(--font-mono)" }}>{project.poly_count.toLocaleString()}</dd>
          </div>
        )}
        {project.texture_resolution && (
          <div>
            <dt>Texture Res</dt>
            <dd style={{ fontFamily: "var(--font-mono)" }}>{project.texture_resolution}</dd>
          </div>
        )}
        {project.tools?.length > 0 && (
          <div>
            <dt>Software</dt>
            <dd>{project.tools.map((t) => t.name).join(", ")}</dd>
          </div>
        )}
        <div>
          <dt>Interaction</dt>
          <dd>Drag to orbit · Scroll to zoom</dd>
        </div>
      </dl>

      {project.description && (
        <div style={{ maxWidth: "68ch" }}>
          <p style={{ whiteSpace: "pre-line" }}>{project.description}</p>
        </div>
      )}

      {project.glb_file && project.gallery?.length > 0 && (
        <>
          <span className="eyebrow" style={{ display: "block", marginTop: "3rem" }}>Renders</span>
          <div className="gallery-strip">
            {project.gallery.map((img) => (
              <img key={img.id} src={img.image} alt={img.caption || project.title} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

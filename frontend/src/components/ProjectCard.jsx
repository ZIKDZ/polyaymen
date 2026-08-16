import { useState } from "react";
import { Link } from "react-router-dom";
import ModelViewer, { preloadModel } from "./ModelViewer";

export default function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/work/${project.slug}`}
      className="project-card"
      onMouseEnter={() => {
        setHovered(true);
        if (project.has_3d_model) preloadModel(project.glb_file);
      }}
      onMouseLeave={() => setHovered(false)}
    >
      {project.has_3d_model && <span className="badge-3d">360°</span>}
      <div className="project-card-media">
        <img className="project-card-thumb" src={project.thumbnail} alt={project.title} loading="lazy" />
        {project.has_3d_model && hovered && (
          <div className="project-card-3d">
            <ModelViewer
              glbUrl={project.glb_file}
              interactive={false}
              autoRotate
            />
          </div>
        )}
      </div>
      <div className="project-card-info">
        <span className="eyebrow">{project.category?.name || "Study"}</span>
        <h3>{project.title}</h3>
      </div>
    </Link>
  );
}

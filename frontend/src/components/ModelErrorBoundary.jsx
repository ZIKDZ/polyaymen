import { Component } from "react";

/**
 * Real error boundary for the 3D viewer. Three.js/GLTF loading can throw
 * (corrupt file, network failure, unsupported extension, WebGL context
 * loss, etc.) — those errors happen inside <Canvas>/<Suspense> and would
 * otherwise crash the whole page. This catches them and renders a small
 * inline fallback instead, without touching the rest of the page.
 *
 * IMPORTANT: this must render `this.props.children` — it does not load
 * the model itself. The actual <ModelViewer glbUrl={...} /> is passed in
 * as a child by the caller (ProjectCard, ProjectDetail, Home).
 */
export default class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("3D viewer failed to load:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="viewer-loader">
          <span>Couldn't load this 3D model.</span>
        </div>
      );
    }
    return this.props.children;
  }
}
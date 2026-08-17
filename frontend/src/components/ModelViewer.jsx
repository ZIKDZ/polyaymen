import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Center,
  ContactShadows,
  Environment,
  Bounds,
} from "@react-three/drei";
import * as THREE from "three";

/**
 * Loads and centers a GLB model, auto-fitting it to the viewport via <Bounds>.
 * Kept as its own component so Suspense can catch the async GLTF load.
 */
function Model({ url, autoRotate }) {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useFrame((_, delta) => {
    if (autoRotate && ref.current) {
      ref.current.rotation.y += delta * 0.25;
    }
  });

  useEffect(() => {
    // Make sure materials read light the way a "studio render" should —
    // some artist-exported GLBs come in flat/unlit.
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // IMPORTANT: <Center> must be INSIDE the rotating group, not outside it.
  // Some artist-exported GLBs bake a large translation into their root
  // node (the mesh sits far from the file's own local origin — e.g. one
  // real export had a mesh ~3 units across sitting ~13 units away from
  // its node's local (0,0,0)). If we rotate first and center second, the
  // rotation pivots around that raw node origin — which can be nowhere
  // near the visible geometry — so the model appears to orbit around a
  // "hidden anchor" instead of spinning in place. It can also sweep
  // through the camera's near/far clip planes (set once by
  // <Bounds fit clip> from a static snapshot), which shows up as
  // flicker as the mesh clips in and out. Centering first means the
  // group's own local origin (the thing `ref` rotates) IS the mesh's
  // actual visual center, regardless of whatever offset is baked into
  // the file, and it stays inside the bounds Bounds fit the camera to.
  // `bottom` keeps X/Z horizontally centered (so the rotation above still
  // pivots through the model's actual middle) but aligns the bounding
  // box's LOWEST point to y=0 instead of the box's vertical center.
  // Without this, <Center> puts the model's geometric center at y=0,
  // which for a tall/asymmetric mesh (e.g. a headband arching well above
  // its earcups) leaves the earcups hanging below y=0 — right where the
  // <ContactShadows> plane sits. The shadow then intersects the earcup
  // geometry instead of sitting beneath it, which reads as a duplicate/
  // ghosted shadow. Grounding the model's bottom at y=0 makes it actually
  // rest on the shadow catcher instead of poking through it.
  return (
    <group ref={ref}>
      <Center bottom>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

function LuxLoader() {
  return (
    <div className="viewer-loader">
      <div className="viewer-loader-ring" />
      <span>Loading model…</span>
    </div>
  );
}

/**
 * Interactive 3D viewer, styled to sit inside a "gallery pedestal" card
 * rather than look like a bolted-on embed. Pass `interactive={false}` for
 * the small ambient hover-preview used on project grid cards.
 */
export default function ModelViewer({
  glbUrl,
  interactive = true,
  autoRotate = true,
  background = "transparent",
  className = "",
}) {
  const [loaded, setLoaded] = useState(false);

  if (!glbUrl) return null;

  return (
    <div className={`model-viewer ${className}`} style={{ background }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 35, position: [3, 1.6, 4] }}
        onCreated={() => setLoaded(true)}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <Bounds fit clip observe margin={1.3}>
            <Model url={glbUrl} autoRotate={autoRotate} />
          </Bounds>
          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.35}
            scale={10}
            blur={2.4}
            far={4}
            color="#14130F"
          />
        </Suspense>
        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minDistance={1.5}
            maxDistance={9}
            autoRotate={false}
            makeDefault
          />
        )}
      </Canvas>
      {!loaded && <LuxLoader />}
    </div>
  );
}

// Pre-warm the GLTF loader/decoder for a URL — call from a project card's
// onMouseEnter so the hover-preview doesn't stutter on first load.
export function preloadModel(url) {
  if (url) useGLTF.preload(url);
}
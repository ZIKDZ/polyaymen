import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Center,
  ContactShadows,
  Bounds,
} from "@react-three/drei";

function Model({ url, autoRotate }) {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useFrame((_, delta) => {
    if (autoRotate && ref.current) {
      ref.current.rotation.y += delta * 0.25;
    }
  });

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <group ref={ref}>
      <primitive object={scene} />
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
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-4, 2, -4]} intensity={0.4} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.3}>
            <Center>
              <Model url={glbUrl} autoRotate={autoRotate} />
            </Center>
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

export function preloadModel(url) {
  if (url) useGLTF.preload(url);
}
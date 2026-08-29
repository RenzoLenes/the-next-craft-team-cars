"use client";

import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import type { CarMetrics } from "./metrics";
import { ProceduralCar } from "./procedural-car";

type SimulatorSceneProps = {
  metrics: CarMetrics;
  reducedMotion: boolean;
};

export function SimulatorScene({ metrics, reducedMotion }: SimulatorSceneProps) {
  return (
    <Canvas
      camera={{ position: [4.2, 2.4, 4.2], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full touch-none"
    >
      <color attach="background" args={["#e8eef5"]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        position={[5, 8, 4]}
        intensity={1.15}
        shadow-mapSize={[1024, 1024]}
      />
      <ProceduralCar metrics={metrics} reducedMotion={reducedMotion} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#dbe4ef" />
      </mesh>
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.45}
        scale={10}
        blur={2.2}
        far={4}
      />
      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        minDistance={3.5}
        maxDistance={8}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.6}
      />
    </Canvas>
  );
}

"use client";

import { useFrame } from "@react-three/fiber";
import { forwardRef, useRef } from "react";
import type { Group, Mesh } from "three";

import type { CarMetrics, SignalLevel } from "./metrics";

type ProceduralCarProps = {
  metrics: CarMetrics;
  reducedMotion: boolean;
};

function signalEmissive(signal: SignalLevel): string {
  if (signal === "alerta") return "#d97706";
  if (signal === "limite") return "#dc2626";
  return "#059669";
}

const Wheel = forwardRef<Mesh, { position: [number, number, number] }>(
  function Wheel({ position }, ref) {
    return (
      <mesh ref={ref} position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.22, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
    );
  }
);

export function ProceduralCar({ metrics, reducedMotion }: ProceduralCarProps) {
  const group = useRef<Group>(null);
  const w0 = useRef<Mesh>(null);
  const w1 = useRef<Mesh>(null);
  const w2 = useRef<Mesh>(null);
  const w3 = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (reducedMotion) return;

    const spin = (metrics.speed / 40) * delta;
    for (const wheel of [w0, w1, w2, w3]) {
      if (wheel.current) wheel.current.rotation.x += spin;
    }

    if (group.current) {
      group.current.position.y =
        0.35 + Math.sin(performance.now() / 280) * 0.02;
      group.current.rotation.y = Math.sin(performance.now() / 4200) * 0.12;
    }
  });

  const glow = signalEmissive(metrics.signal);

  return (
    <group ref={group} position={[0, 0.35, 0]}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[2.4, 0.45, 1.1]} />
        <meshStandardMaterial color="#1e293b" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.72, -0.05]} castShadow>
        <boxGeometry args={[1.35, 0.42, 0.95]} />
        <meshStandardMaterial color="#334155" metalness={0.2} roughness={0.5} />
      </mesh>
      <mesh position={[0.95, 0.42, 0]} castShadow>
        <boxGeometry args={[0.35, 0.18, 1.05]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive={glow}
          emissiveIntensity={metrics.signal === "ok" ? 0.25 : 0.85}
        />
      </mesh>
      <mesh position={[-1.05, 0.38, 0]}>
        <boxGeometry args={[0.2, 0.12, 0.9]} />
        <meshStandardMaterial
          color="#f8fafc"
          emissive="#f8fafc"
          emissiveIntensity={0.4}
        />
      </mesh>

      <Wheel ref={w0} position={[-0.75, 0, 0.58]} />
      <Wheel ref={w1} position={[-0.75, 0, -0.58]} />
      <Wheel ref={w2} position={[0.85, 0, 0.58]} />
      <Wheel ref={w3} position={[0.85, 0, -0.58]} />
    </group>
  );
}

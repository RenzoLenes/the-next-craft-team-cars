"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";

const MODEL_URL = "/models/ToyCar.glb";
useGLTF.preload(MODEL_URL);

// Rangos de referencia — deben calzar con web/convex/telemetry.ts y simulator/src/generator.ts
const COOLANT_NORMAL_C = 90;
const COOLANT_CRITICAL_C = 125;
const BATTERY_NORMAL_LOW_V = 13.2;
const BATTERY_NORMAL_HIGH_V = 15.0;

export interface VehicleSceneProps {
  coolantTempC?: number;
  batteryVoltage?: number;
  engineRpm?: number;
  faultActive?: boolean;
  className?: string;
}

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

function CarModel({ coolantTempC, batteryVoltage, engineRpm, faultActive }: VehicleSceneProps) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // Clon profundo: cada instancia (Corolla / Hilux) necesita su propia
  // geometría de escena y materiales independientes para poder teñirlos por separado.
  const { clonedScene, originalColors } = useMemo(() => {
    const clone = scene.clone(true);
    const colors = new Map<THREE.Mesh, THREE.Color>();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        child.material = materials.map((m) => m.clone());
        const first = Array.isArray(child.material) ? child.material[0] : child.material;
        if ("color" in first && first.color instanceof THREE.Color) {
          colors.set(child, first.color.clone());
        }
      }
    });
    return { clonedScene: clone, originalColors: colors };
  }, [scene]);

  const { camera } = useThree();

  // El glTF puede venir en cualquier escala/origen (ToyCar.glb, por ejemplo, mide ~7cm
  // real por un scale de 0.0001 en sus nodos raíz). En vez de adivinar una cámara fija,
  // centramos el modelo y encuadramos la cámara según su bounding box real.
  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    clonedScene.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const persCamera = camera as THREE.PerspectiveCamera;
    /* eslint-disable react-hooks/immutability -- mutating the THREE.Camera instance
       from useThree() imperatively is the standard r3f pattern, not React state. */
    persCamera.near = maxDim / 100;
    persCamera.far = maxDim * 50;
    persCamera.position.set(maxDim * 1.1, maxDim * 0.9, maxDim * 1.6);
    persCamera.lookAt(0, 0, 0);
    persCamera.updateProjectionMatrix();
    /* eslint-enable react-hooks/immutability */
  }, [clonedScene, camera]);

  useFrame((_state, delta) => {
    timeRef.current += delta;

    // rotación tipo turntable — velocidad proporcional al RPM (motor "vivo")
    if (groupRef.current) {
      const rpm = engineRpm ?? 800;
      const rotSpeed = 0.15 + (rpm / 4500) * 1.2;
      groupRef.current.rotation.y += delta * rotSpeed;
    }

    const overheatT = clamp01(((coolantTempC ?? COOLANT_NORMAL_C) - COOLANT_NORMAL_C) / (COOLANT_CRITICAL_C - COOLANT_NORMAL_C));
    const batteryOut =
      batteryVoltage !== undefined &&
      (batteryVoltage < BATTERY_NORMAL_LOW_V || batteryVoltage > BATTERY_NORMAL_HIGH_V);
    const flicker = batteryOut ? (Math.sin(timeRef.current * 10) + 1) / 2 : 0;

    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.material) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      const base = originalColors.get(child);
      if (!base) return;
      for (const mat of materials) {
        if (!("color" in mat) || !(mat.color instanceof THREE.Color)) continue;
        const target = base.clone().lerp(new THREE.Color("#ff2b2b"), overheatT * 0.7);
        if (batteryOut) target.lerp(new THREE.Color("#ffd200"), flicker * 0.5);
        mat.color.copy(target);
        if ("emissive" in mat && mat.emissive instanceof THREE.Color) {
          mat.emissive.setRGB(overheatT * 0.6, batteryOut ? flicker * 0.4 : 0, 0);
        }
      }
    });

    if (groupRef.current && faultActive) {
      const pulse = 1 + Math.sin(timeRef.current * 6) * 0.02;
      groupRef.current.scale.setScalar(pulse);
    } else if (groupRef.current) {
      groupRef.current.scale.setScalar(1);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

export default function VehicleScene({ className, ...telemetry }: VehicleSceneProps) {
  return (
    <div className={className ?? "h-64 w-full rounded-lg overflow-hidden bg-neutral-900"}>
      <Canvas
        camera={{ position: [0.6, 0.5, 0.9], fov: 35 }}
        gl={async (props) => {
          const renderer = new WebGPURenderer(props as ConstructorParameters<typeof WebGPURenderer>[0]);
          await renderer.init();
          return renderer;
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 2]} intensity={2.2} />
        <directionalLight position={[-3, 2, -2]} intensity={0.6} />
        <Suspense fallback={null}>
          <CarModel {...telemetry} />
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}

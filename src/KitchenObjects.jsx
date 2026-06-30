import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { GAME_STATES, TARGETS } from './gameState.js';
import { near } from './utils.js';

function Box({ position, scale, color, ...props }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow {...props}>
      <boxGeometry />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
}

function Cylinder({ position, args, color, ...props }) {
  return (
    <mesh position={position} castShadow receiveShadow {...props}>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  );
}

function TileFloor() {
  const tiles = useMemo(() => {
    const items = [];
    for (let x = -5.5; x <= 5.5; x += 1) {
      for (let z = -3.5; z <= 3.5; z += 1) {
        items.push({
          x: x + ((Math.round(z * 2) % 2) * 0.08),
          z,
          h: 0.045 + ((Math.abs(x * 7 + z * 11) % 3) * 0.006),
          color: (Math.round(x + z) % 3 === 0) ? '#b89a6c' : (Math.round(x - z) % 2 === 0) ? '#c5aa78' : '#a9875b',
        });
      }
    }
    return items;
  }, []);

  return (
    <group>
      <Box position={[0, -0.08, 0]} scale={[12.2, 0.08, 7.8]} color="#7c6548" />
      {tiles.map((tile, i) => (
        <Box
          key={i}
          position={[tile.x, -0.015, tile.z]}
          scale={[0.94, tile.h, 0.94]}
          color={tile.color}
        />
      ))}
    </group>
  );
}

function WallBlocks() {
  const blocks = useMemo(() => {
    const items = [];
    for (let x = -5.4; x <= 5.4; x += 1.2) {
      for (let y = 0.55; y <= 2.85; y += 0.55) {
        items.push({ position: [x + (Math.round(y * 10) % 2) * 0.55, y, -3.92], scale: [1.04, 0.42, 0.06] });
      }
    }
    for (let z = -3.1; z <= 3.1; z += 1.05) {
      for (let y = 0.55; y <= 2.85; y += 0.55) {
        items.push({ position: [-6.03, y, z + (Math.round(y * 10) % 2) * 0.48], scale: [0.06, 0.42, 0.9] });
        items.push({ position: [6.03, y, z + (Math.round(y * 10) % 2) * 0.48], scale: [0.06, 0.42, 0.9] });
      }
    }
    return items;
  }, []);

  return (
    <group>
      <Box position={[0, 1.65, -4]} scale={[12.1, 3.4, 0.18]} color="#bd9462" />
      <Box position={[-6.1, 1.65, 0]} scale={[0.18, 3.4, 7.8]} color="#aa7d4d" />
      <Box position={[6.1, 1.65, 0]} scale={[0.18, 3.4, 7.8]} color="#aa7d4d" />
      {blocks.map((block, i) => (
        <Box key={i} position={block.position} scale={block.scale} color={i % 4 === 0 ? '#d1ad78' : '#c39a68'} />
      ))}
      <Box position={[-4.45, 2.05, -4.12]} scale={[1.05, 1.05, 0.08]} color="#5e3823" />
      <Box position={[-4.45, 2.05, -4.18]} scale={[0.72, 0.72, 0.04]} color="#7ed1ff" />
      <Box position={[-4.45, 2.05, -4.22]} scale={[0.08, 0.78, 0.05]} color="#f5d398" />
      <Box position={[-4.45, 2.05, -4.22]} scale={[0.78, 0.08, 0.05]} color="#f5d398" />
      <Cylinder position={[2.8, 3.15, -3.78]} args={[0.25, 0.38, 0.16, 18]} color="#ffdf8c" />
      <Cylinder position={[2.8, 3.02, -3.78]} args={[0.04, 0.04, 0.35, 12]} color="#5b3a23" />
      <pointLight position={[2.8, 2.95, -3.4]} intensity={1.3} color="#ffbf57" distance={4.2} />
    </group>
  );
}

function WorkTable({ position, scale = [1, 1, 1] }) {
  return (
    <group position={position} scale={scale}>
      <Box position={[0, 0.52, 0]} scale={[3.1, 0.16, 1.2]} color="#a9662b" />
      <Box position={[0, 0.42, 0]} scale={[2.9, 0.72, 0.98]} color="#76451f" />
      <Box position={[-1.32, 0.2, -0.42]} scale={[0.16, 0.55, 0.16]} color="#5d3519" />
      <Box position={[1.32, 0.2, -0.42]} scale={[0.16, 0.55, 0.16]} color="#5d3519" />
      <Box position={[-1.32, 0.2, 0.42]} scale={[0.16, 0.55, 0.16]} color="#5d3519" />
      <Box position={[1.32, 0.2, 0.42]} scale={[0.16, 0.55, 0.16]} color="#5d3519" />
      {[-0.9, 0, 0.9].map((x) => (
        <Box key={x} position={[x, 0.62, 0]} scale={[0.04, 0.025, 1.16]} color="#cf843c" />
      ))}
    </group>
  );
}

function CuttingBoard() {
  return (
    <group position={[-1.7, 1.14, -1.15]}>
      <Box position={[0, 0, 0]} scale={[1.34, 0.08, 0.82]} color="#8a4c21" />
      <Box position={[0, 0.052, 0]} scale={[1.18, 0.03, 0.66]} color="#dfa453" />
      <Box position={[0, 0.084, -0.34]} scale={[1.18, 0.018, 0.035]} color="#744018" />
      <Box position={[0, 0.084, 0.34]} scale={[1.18, 0.018, 0.035]} color="#744018" />
      <Box position={[-0.6, 0.084, 0]} scale={[0.035, 0.018, 0.64]} color="#744018" />
      <Box position={[0.6, 0.084, 0]} scale={[0.035, 0.018, 0.64]} color="#744018" />
      {[-0.38, -0.12, 0.18, 0.4].map((x, i) => (
        <Box key={x} position={[x, 0.072, -0.02 + i * 0.02]} scale={[0.018, 0.008, 0.5]} color={i % 2 ? '#a85f29' : '#f0ba65'} rotation={[0, 0.08 * i, 0]} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <Box key={i} position={[-0.38 + i * 0.18, 0.08, -0.22 + (i % 2) * 0.1]} scale={[0.12, 0.006, 0.012]} color="#7e431e" rotation={[0, i * 0.8, 0]} />
      ))}
      <Cylinder position={[0.43, 0.09, 0.22]} args={[0.045, 0.045, 0.03, 14]} color="#8b5528" rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

function Cabbage({ position, scale = 1, wobble = 0 }) {
  return (
    <group position={position} scale={[scale * (1 + wobble * 0.04), scale * (1 - wobble * 0.03), scale]} rotation={[0.03 * wobble, 0, -0.04 * wobble]}>
      <mesh castShadow receiveShadow scale={[1.08, 0.82, 0.94]}>
        <sphereGeometry args={[0.3, 14, 10]} />
        <meshStandardMaterial color="#91ca39" roughness={0.82} />
      </mesh>
      <mesh castShadow position={[-0.06, 0.04, 0.05]} scale={[0.9, 0.68, 0.78]}>
        <sphereGeometry args={[0.29, 10, 8]} />
        <meshStandardMaterial color="#b8db5b" roughness={0.86} />
      </mesh>
      <mesh castShadow position={[0.08, -0.02, -0.04]} scale={[0.86, 0.64, 0.72]}>
        <sphereGeometry args={[0.28, 10, 8]} />
        <meshStandardMaterial color="#6ba92d" roughness={0.88} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        return (
          <Cylinder
            key={i}
            position={[Math.cos(angle) * 0.05, 0.04 + (i % 3) * 0.015, Math.sin(angle) * 0.04]}
            args={[0.006, 0.012, 0.55, 5]}
            color={i % 2 ? '#d8ec79' : '#4f8f25'}
            rotation={[1.08, angle, 0.25]}
          />
        );
      })}
      {Array.from({ length: 6 }, (_, i) => (
        <Box
          key={i}
          position={[Math.sin(i * 1.3) * 0.16, 0.15 + (i % 2) * 0.025, Math.cos(i * 1.3) * 0.12]}
          scale={[0.012, 0.006, 0.16]}
          color="#eef29a"
          rotation={[0.35, i * 1.1, 0.15]}
        />
      ))}
    </group>
  );
}

function Knife({ y = 0 }) {
  const down = y < 0.05;
  return (
    <group position={[-1.83, 1.33 + y, -1.18]} rotation={[0, 0.15, -0.6]}>
      <mesh position={[0.18, 0, 0]} scale={[0.11, 0.045, 0.78]} castShadow receiveShadow>
        <boxGeometry />
        <meshStandardMaterial color="#c6d0d2" metalness={0.75} roughness={0.26} />
      </mesh>
      <Box position={[0.24, 0.018, 0.1]} scale={[0.026, 0.012, 0.58]} color="#ffffff" />
      <Box position={[0.12, -0.018, -0.18]} scale={[0.026, 0.012, 0.5]} color="#728083" />
      <Box position={[0.2, -0.045, 0.34]} scale={[0.13, 0.012, 0.11]} color="#e9f0f2" rotation={[0, 0.35, 0]} />
      <Box position={[-0.27, -0.02, -0.37]} scale={[0.16, 0.09, 0.38]} color="#2c1710" />
      <Cylinder position={[-0.24, 0.03, -0.48]} args={[0.018, 0.018, 0.012, 10]} color="#e8d7a8" rotation={[Math.PI / 2, 0, 0]} />
      <Cylinder position={[-0.24, 0.03, -0.28]} args={[0.018, 0.018, 0.012, 10]} color="#e8d7a8" rotation={[Math.PI / 2, 0, 0]} />
      {down && <pointLight position={[0.12, 0.16, 0.1]} color="#fff2a6" intensity={0.7} distance={0.9} />}
    </group>
  );
}

function PitObject({ isFalling, fallProgress, tunnelRows, tunnelSpeed }) {
  return (
    <group>
      <Cylinder position={[TARGETS.pit[0], 0.02, TARGETS.pit[2]]} args={[1.34, 1.34, 0.04, 48]} color="#040406" />
      <mesh position={[TARGETS.pit[0], 0.09, TARGETS.pit[2]]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <torusGeometry args={[1.5, 0.18, 12, 48]} />
        <meshStandardMaterial color="#4a3828" roughness={0.68} />
      </mesh>
      {Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        return (
          <Box
            key={i}
            position={[TARGETS.pit[0] + Math.cos(angle) * 1.5, 0.18, TARGETS.pit[2] + Math.sin(angle) * 1.5]}
            scale={[0.33, 0.08, 0.2]}
            color={i % 2 ? '#f2bf26' : '#24211e'}
            rotation={[0, -angle, 0]}
          />
        );
      })}
      {isFalling &&
        tunnelRows.map((i) => (
          <Cylinder
            key={i}
            position={[TARGETS.pit[0], -i * 1.2 + fallProgress * tunnelSpeed, TARGETS.pit[2]]}
            args={[1.62, 1.62, 0.08, 36, 1, true]}
            color={i % 2 ? '#2b2830' : '#17171f'}
          />
        ))}
    </group>
  );
}

function Sparkles({ active }) {
  if (!active) return null;
  return (
    <group>
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const radius = 0.55 + (i % 3) * 0.18;
        return (
          <mesh key={i} position={[1.75 + Math.cos(angle) * radius, 1.5 + (i % 4) * 0.12, -1.42 + Math.sin(angle) * radius]} rotation={[0, angle, 0]} castShadow>
            <octahedronGeometry args={[0.055 + (i % 2) * 0.03]} />
            <meshStandardMaterial color={i % 2 ? '#ffd84a' : '#fff5a8'} emissive="#f6b500" emissiveIntensity={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

function CuttingBits({ active, knifeTick }) {
  if (!active) return null;
  return (
    <group>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh
          key={i}
          position={[
            -1.72 + Math.sin(i * 1.8 + knifeTick) * 0.26,
            1.3 + ((i + knifeTick) % 2) * 0.035,
            -1.18 + Math.cos(i * 1.4 + knifeTick) * 0.17,
          ]}
          castShadow
        >
          <octahedronGeometry args={[0.025]} />
          <meshStandardMaterial color={i % 2 ? '#d7ff77' : '#fff0a8'} emissive="#90b832" emissiveIntensity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function ContactShadow({ position, scale }) {
  return (
    <mesh position={position} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1, 24]} />
      <meshBasicMaterial color="#3d2110" transparent opacity={0.22} depthWrite={false} />
    </mesh>
  );
}

function ShredPiece({ piece, index }) {
  return (
    <group position={[piece.x, 1.228 + piece.y, piece.z]} rotation={[0, piece.r, 0]}>
      <Box
        position={[0, 0, 0]}
        scale={[0.022 + piece.w, 0.012, 0.17 + piece.l]}
        color={index % 3 ? '#c9ef72' : '#eef7a5'}
      />
      <Box
        position={[0.004, 0.009, -0.01]}
        scale={[0.006, 0.004, 0.12 + piece.l * 0.6]}
        color="#fff8b5"
      />
    </group>
  );
}

function CabbagePile({ position }) {
  const pile = useMemo(() => (
    Array.from({ length: 58 }, (_, i) => ({
      x: (Math.random() - 0.5) * 0.64,
      z: (Math.random() - 0.5) * 0.44,
      y: (i / 58) * 0.24 + Math.random() * 0.035,
      r: Math.random() * Math.PI,
      l: Math.random() * 0.12,
    }))
  ), []);

  return (
    <group position={position}>
      {pile.map((piece, i) => (
        <Box
          key={i}
          position={[piece.x, 0.12 + piece.y, piece.z]}
          scale={[0.018, 0.011, 0.16 + piece.l]}
          color={i % 4 === 0 ? '#eef7a5' : '#bce76b'}
          rotation={[0.1, piece.r, 0.08]}
        />
      ))}
    </group>
  );
}

function SwitchObject({ gameState, playerPosition, switchPressed }) {
  const button = useRef();
  const aura = useRef();
  const isReady = gameState === GAME_STATES.DISH_COMPLETE || gameState === GAME_STATES.GO_TO_SWITCH;
  const isNear = isReady && near(playerPosition, TARGETS.switch, 1.35);
  const isDown = switchPressed || gameState === GAME_STATES.FALLING;

  useFrame((state) => {
    const pulse = isNear ? 1 + Math.sin(state.clock.elapsedTime * 10) * 0.08 : 1;
    if (button.current) {
      button.current.scale.set(pulse, isDown ? 0.48 : 1, pulse);
      button.current.position.y = isDown ? 0.73 : 0.83 + (isNear ? Math.sin(state.clock.elapsedTime * 10) * 0.025 : 0);
    }
    if (aura.current) {
      aura.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 5) * 0.08);
      aura.current.visible = isReady;
    }
  });

  return (
    <group>
      <Box position={[TARGETS.switch[0], 0.38, TARGETS.switch[2]]} scale={[0.75, 0.72, 0.75]} color="#8f876c" />
      {isReady && (
        <>
          <pointLight position={[TARGETS.switch[0], 1.25, TARGETS.switch[2]]} color="#ff3b2f" intensity={isNear ? 2.6 : 1.35} distance={3.8} />
          <mesh ref={aura} position={[TARGETS.switch[0], 0.84, TARGETS.switch[2]]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.43, 0.58, 36]} />
            <meshBasicMaterial color="#ff3b2f" transparent opacity={isNear ? 0.42 : 0.22} />
          </mesh>
        </>
      )}
      <mesh ref={button} position={[TARGETS.switch[0], isDown ? 0.73 : 0.83, TARGETS.switch[2]]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.26, 0.18, 28]} />
        <meshStandardMaterial
          color="#fa342c"
          roughness={0.38}
          emissive={isReady ? '#8d100b' : '#000000'}
          emissiveIntensity={isNear ? 1.3 : isReady ? 0.65 : 0}
        />
      </mesh>
    </group>
  );
}

export default function KitchenObjects({
  gameState,
  hasIngredient,
  dishReady,
  cutProgress,
  knifeTick,
  fallProgress,
  playerPosition,
  switchPressed,
}) {
  const shreds = useMemo(() => {
    return Array.from({ length: 34 }, (_, i) => ({
      x: -1.72 + (Math.random() - 0.5) * 0.78,
      z: -1.16 + (Math.random() - 0.5) * 0.44,
      r: Math.random() * 3.14,
      y: Math.random() * 0.018,
      l: Math.random() * 0.13,
      w: Math.random() * 0.012,
      showAt: i * 3,
    }));
  }, []);

  const tunnelRows = Array.from({ length: 22 }, (_, i) => i);
  const isFalling = gameState === GAME_STATES.FALLING;
  const fallDrop = Math.max(0, (fallProgress - 0.24) / 0.76);
  const tunnelSpeed = 5 + fallDrop * fallDrop * 24;

  return (
    <group>
      <TileFloor />
      <WallBlocks />
      <WorkTable position={[-2.7, 0.5, -1.35]} />
      <CuttingBoard />
      {(gameState === GAME_STATES.CUTTING || cutProgress > 0) && (
        <>
          <spotLight
            position={[-2.25, 3.35, 0.65]}
            target-position={[-1.7, 1.2, -1.15]}
            angle={0.55}
            penumbra={0.45}
            intensity={2.4}
            color="#ffd98d"
            castShadow
          />
          <pointLight position={[-1.9, 1.9, -0.65]} color="#fff1a6" intensity={0.8} distance={2.2} />
        </>
      )}
      <WorkTable position={[-3.95, 0.36, 1.88]} scale={[0.48, 0.85, 0.82]} />
      <WorkTable position={[1.75, 0.45, -1.45]} scale={[0.55, 0.9, 0.9]} />
      <Box position={[-4.6, 1.55, -3.8]} scale={[1.4, 0.12, 0.38]} color="#7b4b24" />
      <Box position={[-4.6, 2.1, -3.8]} scale={[1.4, 0.12, 0.38]} color="#7b4b24" />
      {[-5.05, -4.55, -4.05].map((x, i) => (
        <Cylinder key={x} position={[x, 1.82, -3.62]} args={[0.13, 0.11, 0.32, 12]} color={i % 2 ? '#d9e6db' : '#f6dca4'} />
      ))}
      <PitObject isFalling={isFalling} fallProgress={fallProgress} tunnelRows={tunnelRows} tunnelSpeed={tunnelSpeed} />

      <SwitchObject gameState={gameState} playerPosition={playerPosition} switchPressed={switchPressed} />

      {!hasIngredient && (
        <group>
          <Cabbage position={[-4.28, 0.95, 1.72]} scale={0.9} />
          <Cylinder position={[-3.9, 1.1, 2.05]} args={[0.13, 0.18, 0.7, 14]} color="#f19122" rotation={[1.1, 0, 0.7]} />
          <Cylinder position={[-3.67, 1.12, 1.78]} args={[0.11, 0.15, 0.58, 12]} color="#f6a13a" rotation={[0.9, 0.1, -0.4]} />
        </group>
      )}

      {(gameState === GAME_STATES.CUTTING || cutProgress > 0) && (
        <group>
          <ContactShadow position={[-1.63, 1.205, -1.18]} scale={[0.42, 0.2, 1]} />
          <ContactShadow position={[-1.8, 1.207, -1.04]} scale={[0.48, 0.16, 1]} />
          {cutProgress < 65 && <Cabbage position={[-1.63, 1.26, -1.18]} scale={0.62} wobble={knifeTick % 2} />}
          <Knife y={(knifeTick % 2) * 0.18} />
          <CuttingBits active={gameState === GAME_STATES.CUTTING && knifeTick > 0} knifeTick={knifeTick} />
          {shreds.map((piece, i) =>
            cutProgress >= piece.showAt ? (
              <ShredPiece key={i} piece={piece} index={i} />
            ) : null,
          )}
        </group>
      )}

      {dishReady && (
        <group position={[1.75, 1.12, -1.42]}>
          <Cylinder position={[0, 0, 0]} args={[0.6, 0.48, 0.13, 32]} color="#fff6dd" />
          <Cylinder position={[0, 0.08, 0]} args={[0.43, 0.36, 0.04, 32]} color="#e7d9bb" />
          <CabbagePile position={[0, 0.02, 0]} />
        </group>
      )}
      <Sparkles active={gameState === GAME_STATES.DISH_COMPLETE} />

      <Cylinder position={[-4.6, 0.07, -3.25]} args={[0.18, 0.18, 0.05, 16]} color="#795a39" />
      <Box position={[0, 2.9, -3.93]} scale={[1, 0.58, 0.04]} color="#b62824" />
      <Cylinder position={[0, 3.0, -3.98]} args={[0.16, 0.16, 0.03, 18]} color="#ffd15a" />
    </group>
  );
}

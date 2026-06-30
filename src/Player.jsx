import { forwardRef } from 'react';
import { GAME_STATES } from './gameState.js';

const Player = forwardRef(function Player({ hasIngredient, gameState, fallProgress = 0 }, ref) {
  const falling = gameState === GAME_STATES.FALLING;
  const tumble = falling ? Math.min(1, Math.max(0, (fallProgress - 0.24) / 0.76)) : 0;

  return (
    <group ref={ref} rotation={[falling ? -0.35 - tumble * 1.65 : 0, falling ? tumble * 2.2 : 0, falling ? tumble * 0.7 : 0]}>
      <mesh castShadow position={[0, 0.88, 0]}>
        <sphereGeometry args={[0.31, 24, 18]} />
        <meshStandardMaterial color="#fff7e6" roughness={0.45} />
      </mesh>
      <mesh castShadow position={[0, 0.44, 0]}>
        <capsuleGeometry args={[0.24, 0.48, 8, 18]} />
        <meshStandardMaterial color="#fff7e6" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[-0.34, 0.48, 0]} rotation={[0, 0, 0.35]}>
        <capsuleGeometry args={[0.07, 0.38, 6, 10]} />
        <meshStandardMaterial color="#fff7e6" />
      </mesh>
      <mesh castShadow position={[0.34, 0.48, 0]} rotation={[0, 0, -0.35]}>
        <capsuleGeometry args={[0.07, 0.38, 6, 10]} />
        <meshStandardMaterial color="#fff7e6" />
      </mesh>
      <mesh castShadow position={[-0.12, 0.02, 0]} rotation={[0.1, 0, 0]}>
        <capsuleGeometry args={[0.07, 0.4, 6, 10]} />
        <meshStandardMaterial color="#fff7e6" />
      </mesh>
      <mesh castShadow position={[0.12, 0.02, 0]} rotation={[0.1, 0, 0]}>
        <capsuleGeometry args={[0.07, 0.4, 6, 10]} />
        <meshStandardMaterial color="#fff7e6" />
      </mesh>
      {hasIngredient && gameState !== GAME_STATES.FALLING && (
        <mesh castShadow position={[0.43, 0.52, 0.16]}>
          <sphereGeometry args={[0.13, 12, 8]} />
          <meshStandardMaterial color="#65cf42" />
        </mesh>
      )}
    </group>
  );
});

export default Player;

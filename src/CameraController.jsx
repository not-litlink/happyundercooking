import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GAME_STATES, TARGETS } from './gameState.js';
import { easeInQuad, easeOutCubic, smoothstep } from './utils.js';

const boardLook = new THREE.Vector3(TARGETS.board[0], 1.1, TARGETS.board[2]);
const dishLook = new THREE.Vector3(1.75, 1.24, -1.42);
const switchLook = new THREE.Vector3(TARGETS.switch[0], 0.8, TARGETS.switch[2]);
const pitLook = new THREE.Vector3(TARGETS.pit[0], 0.1, TARGETS.pit[2]);

function getNormalShot(playerPosition) {
  return {
    position: new THREE.Vector3(playerPosition[0] * 0.1, 8.15, 8.65),
    lookAt: new THREE.Vector3(playerPosition[0] * 0.06, 0.25, playerPosition[2] * 0.08),
    fov: 48,
    speed: 0.055,
  };
}

function getCameraShot({ gameState, playerPosition, fallProgress, switchPressed, stateAge }) {
  if (gameState === GAME_STATES.CUTTING) {
    return {
      position: new THREE.Vector3(-2.65, 2.95, 0.55),
      lookAt: boardLook,
      fov: 44,
      speed: 0.12,
    };
  }

  if (gameState === GAME_STATES.DISH_COMPLETE) {
    return {
      position: new THREE.Vector3(0.65, 2.15, 1.0),
      lookAt: dishLook,
      fov: 43,
      speed: 0.16,
    };
  }

  if (switchPressed) {
    return {
      position: new THREE.Vector3(3.15, 3.0, 3.65),
      lookAt: switchLook.clone().lerp(pitLook, 0.35),
      fov: 46,
      speed: 0.2,
    };
  }

  if (gameState === GAME_STATES.GO_TO_SWITCH && stateAge < 1.25) {
    return {
      position: new THREE.Vector3(2.2, 3.35, 3.2),
      lookAt: switchLook,
      fov: 45,
      speed: 0.13,
    };
  }

  if (gameState === GAME_STATES.FALLING) {
    const player = new THREE.Vector3(...playerPosition);
    const drop = smoothstep(0.03, 1, fallProgress);
    const accel = easeInQuad(drop);
    const behind = new THREE.Vector3(0, 2.45 - accel * 0.8, 5.25 - accel * 1.45);
    return {
      position: player.clone().add(behind),
      lookAt: player.clone().add(new THREE.Vector3(0, 0.2 - accel * 0.5, -0.25)),
      fov: 50 + easeOutCubic(drop) * 18,
      speed: 0.035 + accel * 0.045,
    };
  }

  return getNormalShot(playerPosition);
}

export default function CameraController({ gameState, playerPosition, fallProgress, switchPressed }) {
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  const prevState = useRef(gameState);
  const stateStartedAt = useRef(0);
  const resultPosition = useRef(null);
  const resultLookAt = useRef(null);

  useFrame((state) => {
    if (prevState.current !== gameState) {
      prevState.current = gameState;
      stateStartedAt.current = state.clock.elapsedTime;
      if (gameState === GAME_STATES.RESULT) {
        resultPosition.current = state.camera.position.clone();
        resultLookAt.current = lookAt.current.clone();
      }
    }

    if (gameState === GAME_STATES.RESULT && resultPosition.current && resultLookAt.current) {
      state.camera.position.copy(resultPosition.current);
      lookAt.current.copy(resultLookAt.current);
      state.camera.fov += (46 - state.camera.fov) * 0.06;
      state.camera.updateProjectionMatrix();
      state.camera.lookAt(lookAt.current);
      return;
    }

    const stateAge = state.clock.elapsedTime - stateStartedAt.current;
    const shot = getCameraShot({ gameState, playerPosition, fallProgress, switchPressed, stateAge });
    const drop = gameState === GAME_STATES.FALLING ? smoothstep(0.03, 1, fallProgress) : 0;
    const shakePower = gameState === GAME_STATES.FALLING ? 0.03 + easeInQuad(drop) * 0.26 : 0;
    const wobble = new THREE.Vector3(
      Math.sin(state.clock.elapsedTime * 59) * shakePower,
      Math.cos(state.clock.elapsedTime * 43) * shakePower,
      Math.sin(state.clock.elapsedTime * 37) * shakePower,
    );

    state.camera.position.lerp(shot.position.clone().add(wobble), shot.speed);
    lookAt.current.lerp(shot.lookAt, Math.min(0.22, shot.speed * 1.9));
    state.camera.fov += (shot.fov - state.camera.fov) * 0.08;
    state.camera.updateProjectionMatrix();
    state.camera.lookAt(lookAt.current);
  });

  return null;
}

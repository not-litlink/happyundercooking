import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Player from './Player.jsx';
import KitchenObjects from './KitchenObjects.jsx';
import CameraController from './CameraController.jsx';
import { GAME_STATES, TARGETS } from './gameState.js';
import { clamp, easeInQuad, easeOutCubic, smoothstep } from './utils.js';

const FALL_SECONDS = 4.35;
const FALL_DROP_START = 0.03;

export default function Scene(props) {
  const keys = useRef(new Set());
  const player = useRef();
  const interactRef = useRef(props.onInteract);
  const cutRef = useRef(props.onCut);

  useEffect(() => {
    interactRef.current = props.onInteract;
    cutRef.current = props.onCut;
  }, [props.onInteract, props.onCut]);

  useEffect(() => {
    const down = (event) => {
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'Space'].includes(event.code)) {
        event.preventDefault();
      }
      keys.current.add(event.code);
      if (event.code === 'KeyE') interactRef.current();
      if (event.code === 'Space') cutRef.current();
    };
    const up = (event) => keys.current.delete(event.code);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useFrame((state, delta) => {
    const next = [...props.playerPosition];

    if (props.gameState === GAME_STATES.FALLING) {
      props.setFallProgress((value) => {
        const done = Math.min(1, value + delta / FALL_SECONDS);
        if (value < 1 && done >= 1) props.setGameState(GAME_STATES.RESULT);
        return done;
      });
      const t = props.fallProgress;
      const pull = easeOutCubic(smoothstep(0.08, 0.38, t));
      const drop = smoothstep(FALL_DROP_START, 1, t);
      const accel = easeInQuad(drop);
      next[0] += (TARGETS.pit[0] - next[0]) * (0.035 + pull * 0.16);
      next[2] += (TARGETS.pit[2] - next[2]) * (0.035 + pull * 0.16);
      next[1] = drop <= 0 ? Math.sin(t * Math.PI * 10) * 0.05 : -0.35 - accel * 42;
    } else if (props.gameState !== GAME_STATES.RESULT) {
      const speed = 3.6 * delta;
      const vx = (keys.current.has('KeyD') ? 1 : 0) - (keys.current.has('KeyA') ? 1 : 0);
      const vz = (keys.current.has('KeyS') ? 1 : 0) - (keys.current.has('KeyW') ? 1 : 0);
      const len = Math.hypot(vx, vz) || 1;
      next[0] = clamp(next[0] + (vx / len) * speed, -5.25, 5.25);
      next[2] = clamp(next[2] + (vz / len) * speed, -3.15, 3.15);
      next[1] = 0;
    }

    props.setPlayerPosition(next);
    if (player.current) {
      player.current.position.set(next[0], next[1], next[2]);
    }
  });

  const fallingDeep = props.gameState === GAME_STATES.FALLING && props.fallProgress > FALL_DROP_START;

  return (
    <>
      <color attach="background" args={[fallingDeep ? '#05060a' : '#f6c970']} />
      <fog attach="fog" args={[fallingDeep ? '#05060a' : '#f6c970', 7, 32]} />
      <hemisphereLight args={['#ffe7ae', '#7b5a34', 1.15]} />
      <ambientLight intensity={0.38} />
      <directionalLight position={[-3, 8, 6]} intensity={2.15} color="#ffd98f" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4.2, 2.8, -2.8]} intensity={1.1} color="#ffb34d" distance={5.5} />
      <pointLight position={[2.8, 3.2, -2.6]} intensity={0.85} color="#ffc36a" distance={5} />
      <CameraController
        gameState={props.gameState}
        playerPosition={props.playerPosition}
        fallProgress={props.fallProgress}
        switchPressed={props.switchPressed}
      />
      <KitchenObjects {...props} />
      <Player
        ref={player}
        hasIngredient={props.hasIngredient}
        gameState={props.gameState}
        fallProgress={props.fallProgress}
      />
    </>
  );
}

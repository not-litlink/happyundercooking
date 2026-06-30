import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene.jsx';
import UI from './UI.jsx';
import { GAME_STATES, TARGETS, stateGoals } from './gameState.js';
import { near } from './utils.js';
import { playSwitchClick } from './sound.js';

const startPosition = [-4.5, 0, -1.4];

export default function Game() {
  const [gameState, setGameState] = useState(GAME_STATES.GET_INGREDIENT);
  const [playerPosition, setPlayerPosition] = useState(startPosition);
  const [cutProgress, setCutProgress] = useState(0);
  const [knifeTick, setKnifeTick] = useState(0);
  const [fallProgress, setFallProgress] = useState(0);
  const [hasIngredient, setHasIngredient] = useState(false);
  const [dishReady, setDishReady] = useState(false);
  const [switchPressed, setSwitchPressed] = useState(false);
  const switchTimer = useRef();

  useEffect(() => {
    return () => clearTimeout(switchTimer.current);
  }, []);

  const interaction = useMemo(() => {
    if (gameState === GAME_STATES.GET_INGREDIENT && near(playerPosition, TARGETS.ingredient)) {
      return 'E：キャベツを取る';
    }
    if (gameState === GAME_STATES.GO_TO_CUTTING_BOARD && near(playerPosition, TARGETS.board)) {
      return 'E：まな板に置く';
    }
    if (gameState === GAME_STATES.CUTTING && near(playerPosition, TARGETS.board)) {
      return 'Space：千切り';
    }
    if (gameState === GAME_STATES.GO_TO_SWITCH && near(playerPosition, TARGETS.switch)) {
      return 'E：スイッチを押す';
    }
    return '';
  }, [gameState, playerPosition]);

  const interact = useCallback(() => {
    if (gameState === GAME_STATES.GET_INGREDIENT && near(playerPosition, TARGETS.ingredient)) {
      setHasIngredient(true);
      setGameState(GAME_STATES.GO_TO_CUTTING_BOARD);
    }

    if (gameState === GAME_STATES.GO_TO_CUTTING_BOARD && near(playerPosition, TARGETS.board)) {
      setGameState(GAME_STATES.CUTTING);
    }

    if (gameState === GAME_STATES.GO_TO_SWITCH && near(playerPosition, TARGETS.switch) && !switchPressed) {
      setSwitchPressed(true);
      playSwitchClick();
      setFallProgress(0);
      switchTimer.current = setTimeout(() => {
        setGameState(GAME_STATES.FALLING);
      }, 360);
    }
  }, [gameState, playerPosition, switchPressed]);

  const cut = useCallback(() => {
    if (gameState !== GAME_STATES.CUTTING || !near(playerPosition, TARGETS.board)) return;

    setKnifeTick((value) => value + 1);
    setCutProgress((value) => {
      const next = Math.min(100, value + 12);
      if (next >= 100) {
        setDishReady(true);
        setTimeout(() => setGameState(GAME_STATES.DISH_COMPLETE), 120);
        setTimeout(() => setGameState(GAME_STATES.GO_TO_SWITCH), 1250);
      }
      return next;
    });
  }, [gameState, playerPosition]);

  const reset = useCallback(() => {
    setGameState(GAME_STATES.GET_INGREDIENT);
    setPlayerPosition(startPosition);
    setCutProgress(0);
    setKnifeTick(0);
    setFallProgress(0);
    setHasIngredient(false);
    setDishReady(false);
    setSwitchPressed(false);
    clearTimeout(switchTimer.current);
  }, []);

  return (
    <main className="gameShell">
      <Canvas shadows camera={{ position: [0, 7.2, 7.8], fov: 46 }}>
        <Scene
          gameState={gameState}
          playerPosition={playerPosition}
          setPlayerPosition={setPlayerPosition}
          hasIngredient={hasIngredient}
          dishReady={dishReady}
          cutProgress={cutProgress}
          knifeTick={knifeTick}
          fallProgress={fallProgress}
          switchPressed={switchPressed}
          setFallProgress={setFallProgress}
          setGameState={setGameState}
          onInteract={interact}
          onCut={cut}
        />
      </Canvas>
      <UI
        gameState={gameState}
        goal={stateGoals[gameState]}
        interaction={interaction}
        cutProgress={cutProgress}
        fallProgress={fallProgress}
        switchPressed={switchPressed}
        onReset={reset}
      />
    </main>
  );
}

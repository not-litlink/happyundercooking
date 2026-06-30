export const GAME_STATES = {
  START: 'start',
  GET_INGREDIENT: 'getIngredient',
  GO_TO_CUTTING_BOARD: 'goToCuttingBoard',
  CUTTING: 'cutting',
  DISH_COMPLETE: 'dishComplete',
  GO_TO_SWITCH: 'goToSwitch',
  FALLING: 'falling',
  RESULT: 'result',
};

export const TARGETS = {
  ingredient: [-4.4, 0, 1.9],
  board: [-1.7, 0, -1.15],
  switch: [3.95, 0, -0.75],
  pit: [3.35, 0, 1.8],
};

export const stateGoals = {
  [GAME_STATES.START]: '目標：食材箱へ行く',
  [GAME_STATES.GET_INGREDIENT]: '目標：食材を取る',
  [GAME_STATES.GO_TO_CUTTING_BOARD]: '目標：まな板に置く',
  [GAME_STATES.CUTTING]: '目標：Spaceで千切り',
  [GAME_STATES.DISH_COMPLETE]: '完成！',
  [GAME_STATES.GO_TO_SWITCH]: '目標：赤いスイッチを押す',
  [GAME_STATES.FALLING]: '落ちる！',
  [GAME_STATES.RESULT]: '結果',
};

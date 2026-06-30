import { GAME_STATES } from './gameState.js';

export default function UI({ gameState, goal, interaction, cutProgress, fallProgress, switchPressed, onReset }) {
  const falling = gameState === GAME_STATES.FALLING;
  const result = gameState === GAME_STATES.RESULT;
  const isSwitchPrompt = interaction.includes('スイッチ') || switchPressed;
  const fallDrop = Math.max(0, (fallProgress - 0.24) / 0.76);
  const fallMessage = fallProgress < 0.08 ? '床、開く！' : fallProgress < 0.24 ? 'ズドン！' : 'うおおおおおお！';

  return (
    <div className={`ui ${falling ? 'falling' : ''}`}>
      <section className="topPanel">
        <h1>Happy Under Cooking</h1>
        <p>{goal}</p>
        <div className="controls">WASD 移動 / E 調べる / Space 千切り</div>
      </section>

      <section className={`hintPanel ${isSwitchPrompt ? 'switchPrompt' : ''}`}>
        {switchPressed ? (
          <strong><span className="keycap">E</span> ガコン！</strong>
        ) : interaction ? (
          <strong>{isSwitchPrompt ? <span className="keycap">E</span> : null}{interaction.replace('E：', '')}</strong>
        ) : (
          <span>近づけ。何か起きる。</span>
        )}
      </section>

      {(gameState === GAME_STATES.CUTTING || cutProgress > 0) && !falling && gameState !== GAME_STATES.RESULT && (
        <section className="gaugePanel">
          <div className="gaugeLabel">
            <span>千切り</span>
            <span>{cutProgress}%</span>
          </div>
          <div className="gauge">
            <div style={{ width: `${cutProgress}%` }} />
          </div>
        </section>
      )}

      {gameState === GAME_STATES.DISH_COMPLETE && <div className="completePop">完成！</div>}

      {falling && (
        <div
          className={`fallOverlay ${fallProgress > 0.82 ? 'fadeToResult' : ''}`}
          style={{
            '--fall-speed': `${Math.max(0.07, 0.22 - fallDrop * 0.15)}s`,
            '--fall-power': fallDrop,
          }}
        >
          <div className="speedLines" />
          <div className="fallVignette" />
          <strong>{fallMessage}</strong>
          <span>落下 {Math.round(fallProgress * 128)}m</span>
        </div>
      )}

      {result && (
        <div className="resultScreen">
          <div className="resultBox">
            <h2>リザルト</h2>
            <p>本日の料理：千切りキャベツ</p>
            <p>落下距離：128m</p>
            <p>気持ちよさ：S</p>
            <button onClick={onReset}>もう一度</button>
          </div>
        </div>
      )}
    </div>
  );
}

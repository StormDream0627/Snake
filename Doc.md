# Snake Game Specification

## 0. Requirement Checklist (Requested Items)
- [x] 資料結構
- [x] 地圖繪製
- [x] 讓貪食蛇可以用方向鍵在地圖上移動
- [x] 產生貪食蛇的食物
- [x] 貪食蛇吃到食物會變長
- [x] 貪食蛇吃到自己會死
- [x] 重新開始按鈕（目前以 `Start` 重新初始化達成）
- [x] 暫停遊戲

## 1. Document Info
- Project Name: Snake-114
- Version: 1.0 (Current Implementation)
- Last Updated: 2026-04-01
- Scope: Single-page browser Snake game implemented with HTML, CSS, and vanilla JavaScript.

## 2. Purpose
This document defines the functional and UI specifications for the current Snake game implementation in this repository. It is intended to support maintenance, testing, and future enhancements.

## 3. Technology Stack
- Markup: HTML5
- Styling: CSS3
- Logic: JavaScript (ES6)
- Runtime: Modern web browser
- Build/Tooling: None (no framework, no bundler)

## 4. System Overview
The system renders a 30x30 grid game board in the browser. A snake moves continuously, can wrap around board edges, consumes food to gain score and speed, and ends when it collides with itself.

## 5. UI Specification

### 5.1 Layout
- Game board element: `#gameBoard`
- Controls container: `#controls`
- Start button: `#startBtn`
- Pause button: `#pauseBtn`
- Score display: `#score`

### 5.2 Board
- Visual size: 600px x 600px
- Grid size: 30 columns x 30 rows
- Cell model: each cell is represented by a DOM node with data attributes (`data-x`, `data-y`).

### 5.3 Visual States
- Empty cell: default background from board
- Snake cell: `.snake` class
- Food cell: `.food` class

### 5.4 Theme
- Dark background overall
- White snake and primary text
- Red food marker

## 6. Functional Specification

### 6.1 Initialization
On page load:
1. Board is generated once (`initBoard`).
2. Event listeners are registered:
   - Click `Start` -> start game
   - Click `Pause` -> pause/resume
   - Arrow keys -> direction control

### 6.2 Start Game
When `Start` is clicked:
1. Any previous game loop is cleared.
2. Board is re-initialized.
3. Snake resets to 3 segments at top-left area:
   - Head: (2,0)
   - Body: (1,0), (0,0)
4. Initial direction: right `(1,0)`.
5. Food is generated at random coordinates.
6. Score resets to 0.
7. Speed resets to 200 ms per tick.
8. Main loop timer starts.

Restart behavior:
- In current implementation, clicking `Start` during or after a game acts as restart.
- It clears previous loop, resets snake/score/speed, and starts a new game.

### 6.3 Game Loop
Each tick (`gameLoop`):
1. Compute next head position from current direction.
2. Apply edge wrapping:
   - Moving out of left re-enters at right
   - Moving out of right re-enters at left
   - Moving out of top re-enters at bottom
   - Moving out of bottom re-enters at top
3. Check self-collision:
   - If true, stop loop, set not running, show `Game Over` alert.
4. Move snake forward:
   - Add new head to front
   - If food was not eaten, remove tail
5. Redraw board (clear old snake/food classes, then draw food and snake).

### 6.4 Food and Score
When snake head reaches food position:
1. Score increases by 1.
2. Score display updates to `Score: <value>`.
3. New food position is randomized.
4. Game speed increases by reducing interval by 2 ms.
5. Minimum interval clamp: 10 ms.
6. Timer is restarted with updated speed.

Growth rule:
- When food is eaten, tail is not removed in that tick, so snake length increases by 1.

### 6.5 Pause/Resume
When `Pause` is clicked while game is running:
- If loop timer is active -> clear timer (paused).
- If loop timer is inactive -> restart timer with current speed (resumed).

### 6.6 Keyboard Control
- Supported keys: `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`.
- Rule: direct 180-degree reversal is blocked.
  - Example: moving right cannot immediately move left.
- Direction change is buffered via `nextDirection` and applied on next update tick.

### 6.7 Requested Feature Mapping
- 資料結構:
   - `snake`: 座標陣列，儲存蛇身每一節。
   - `food`: 單一座標物件。
   - `direction`/`nextDirection`: 移動向量。
   - `score`/`speed`/`gameInterval`/`isRunning`: 遊戲狀態。
- 地圖繪製:
   - 以 30x30 DOM Grid 建立地圖。
   - 每格使用 `data-x`、`data-y` 定位。
   - 透過 `.snake`、`.food` class 進行重繪。
- 方向鍵移動:
   - 監聽 `keydown`，支援四方向。
   - 禁止立即反向。
- 產生食物:
   - `randomFood()` 產生隨機座標。
- 吃到食物變長:
   - 當頭座標等於食物座標，該 tick 不移除尾巴。
- 吃到自己會死:
   - 新蛇頭與身體任一節重疊即結束遊戲。
- 重新開始按鈕:
   - 目前由 `Start` 承擔「重新開始」語意。
   - 若需獨立 `Restart` 按鈕，屬於 UI 擴充，不影響核心規格。
- 暫停遊戲:
   - `Pause` 透過清除/重建 timer 完成暫停與繼續。

## 7. State Model
Core runtime state variables:
- `snake`: array of coordinate segments
- `direction`: current applied movement vector
- `nextDirection`: pending movement vector
- `food`: current food coordinate
- `score`: integer score
- `speed`: tick interval in milliseconds
- `gameInterval`: timer handle or null
- `isRunning`: boolean running flag

## 8. Constraints and Known Behaviors
- Food is generated randomly without explicit exclusion of snake body cells.
- `Pause` has no effect if game is not running.
- No touch controls currently implemented.
- No sound, levels, or persistent high score in current version.

## 9. Non-Functional Requirements (Current)
- Works as a static local webpage.
- No external dependencies.
- Expected responsive behavior is limited; board dimensions are fixed at 600px.

## 10. Acceptance Criteria
A build is considered compliant with this specification when:
1. Start button initializes and starts snake movement.
2. Arrow key control works and prevents immediate reverse direction.
3. Snake wraps at all 4 board edges.
4. Eating food increments score and increases speed.
5. Self-collision ends game with `Game Over` alert.
6. Pause button can pause and resume during active game.
7. Clicking `Start` at any time can reinitialize the game as restart behavior.

## 11. Suggested Future Enhancements
- Prevent food spawn on snake body.
- Add restart button and game-over overlay.
- Add mobile touch controls (swipe/buttons).
- Add high-score persistence via localStorage.
- Add difficulty modes and board size options.

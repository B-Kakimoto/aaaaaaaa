const button = document.querySelector("#reactionButton");
const message = document.querySelector("#buttonMessage");
const hint = document.querySelector("#buttonHint");
const status = document.querySelector("#status");
const lastScore = document.querySelector("#lastScore");
const bestScore = document.querySelector("#bestScore");

let state = "idle";
let startedAt = 0;
let timer;
let best = Number(localStorage.getItem("color-reaction-best")) || 0;

bestScore.textContent = best ? `${best} ms` : "--";

function setButton(nextState, label, subLabel) {
  state = nextState;
  button.className = `reaction-button ${nextState}`;
  message.textContent = label;
  hint.textContent = subLabel;
}

function startRound() {
  clearTimeout(timer);
  setButton("waiting", "WAIT", "色が変わるまで待つ");
  status.textContent = "フライングに注意…";
  timer = setTimeout(() => {
    startedAt = performance.now();
    setButton("go", "NOW!", "今すぐクリック");
    status.textContent = "GO!";
  }, 1200 + Math.random() * 2800);
}

function finishRound() {
  const score = Math.round(performance.now() - startedAt);
  lastScore.textContent = `${score} ms`;
  if (!best || score < best) {
    best = score;
    localStorage.setItem("color-reaction-best", String(best));
    bestScore.textContent = `${best} ms`;
    status.textContent = "新記録です！もう一度挑戦できます。";
  } else {
    status.textContent = `${score} ms。もう一度挑戦！`;
  }
  setButton("idle", "RETRY", "クリックして再挑戦");
}

button.addEventListener("click", () => {
  if (state === "idle") startRound();
  else if (state === "waiting") {
    clearTimeout(timer);
    setButton("too-soon", "TOO SOON", "フライングです");
    status.textContent = "早すぎ！もう一度挑戦してください。";
    setTimeout(() => setButton("idle", "RETRY", "クリックして再挑戦"), 700);
  } else if (state === "go") finishRound();
});

const STORAGE_KEY = "minna-yosou-v1";

const seedTopics = [
  {
    id: "mayor-2026",
    title: "架空市長選 2026 の当選者は？",
    category: "選挙",
    deadline: "2026-09-20",
    description: "公開討論会、支持率、投票率の変化を見ながら当選者を予想します。",
    options: ["現職候補", "新人候補", "無所属候補"],
    predictions: [
      { name: "akari", choice: "現職候補", confidence: 70, reason: "組織票がまだ強いと思う。" },
      { name: "sota", choice: "新人候補", confidence: 55, reason: "若年層の投票率が上がりそう。" },
      { name: "mika", choice: "現職候補", confidence: 65, reason: "現時点の争点では守りが有利。" },
      { name: "ren", choice: "無所属候補", confidence: 35, reason: "終盤の一本化があれば可能性あり。" },
    ],
  },
  {
    id: "turnout-national",
    title: "次の国政選挙の投票率は 55% を超える？",
    category: "選挙",
    deadline: "2026-10-01",
    description: "争点の強さ、天候、期日前投票の伸びから投票率を予想します。",
    options: ["55%を超える", "55%以下", "判断保留"],
    predictions: [
      { name: "kei", choice: "55%を超える", confidence: 60, reason: "物価関連の関心が高い。" },
      { name: "nana", choice: "55%以下", confidence: 58, reason: "無党派層の熱量が読みにくい。" },
    ],
  },
  {
    id: "league-final",
    title: "今年の決勝戦で優勝するチームは？",
    category: "スポーツ",
    deadline: "2026-07-12",
    description: "直近の調子、故障者、相性をもとに優勝チームを予想します。",
    options: ["東クラブ", "西クラブ", "北クラブ", "南クラブ"],
    predictions: [
      { name: "taku", choice: "東クラブ", confidence: 80, reason: "守備の安定感が抜けている。" },
      { name: "emi", choice: "西クラブ", confidence: 50, reason: "短期決戦に強い選手が多い。" },
      { name: "jun", choice: "東クラブ", confidence: 68, reason: "控え選手の層が厚い。" },
    ],
  },
  {
    id: "yen-range",
    title: "年末の為替レートはどの範囲？",
    category: "経済",
    deadline: "2026-12-20",
    description: "金利、景気指標、リスクイベントを見ながらレンジを予想します。",
    options: ["140円未満", "140円台", "150円台", "160円以上"],
    predictions: [
      { name: "hiro", choice: "150円台", confidence: 45, reason: "金利差が急には縮まらない。" },
      { name: "mai", choice: "140円台", confidence: 52, reason: "政策変更の余地がある。" },
    ],
  },
  {
    id: "award-winner",
    title: "今年の話題賞を取る作品ジャンルは？",
    category: "エンタメ",
    deadline: "2026-11-30",
    description: "配信の反応、口コミ、公開規模から受賞ジャンルを予想します。",
    options: ["映画", "アニメ", "ゲーム", "音楽"],
    predictions: [
      { name: "rio", choice: "アニメ", confidence: 66, reason: "海外反応が強い。" },
      { name: "yui", choice: "ゲーム", confidence: 48, reason: "大型タイトルの発売が続く。" },
    ],
  },
];

let topics = loadTopics();
let activeFilter = "all";

const topicGrid = document.querySelector("#topicGrid");
const activityList = document.querySelector("#activityList");
const predictionDialog = document.querySelector("#predictionDialog");
const predictionForm = document.querySelector("#predictionForm");
const topicForm = document.querySelector("#topicForm");
const confidenceInput = predictionForm.elements.confidence;
const confidenceValue = document.querySelector("#confidenceValue");

function loadTopics() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(seedTopics);

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : structuredClone(seedTopics);
  } catch {
    return structuredClone(seedTopics);
  }
}

function saveTopics() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function isClosed(topic) {
  const today = new Date();
  const deadline = new Date(`${topic.deadline}T23:59:59`);
  return deadline < today;
}

function summarize(topic) {
  const total = topic.predictions.length;
  const counts = Object.fromEntries(topic.options.map((option) => [option, 0]));
  topic.predictions.forEach((prediction) => {
    counts[prediction.choice] = (counts[prediction.choice] || 0) + 1;
  });

  return topic.options.map((option) => ({
    option,
    count: counts[option] || 0,
    pct: total ? Math.round(((counts[option] || 0) / total) * 100) : 0,
  }));
}

function renderTopics() {
  const filtered =
    activeFilter === "all"
      ? topics
      : topics.filter((topic) => topic.category === activeFilter);

  topicGrid.innerHTML = filtered
    .map((topic) => {
      const rows = summarize(topic)
        .map(
          (item) => `
            <div class="result-row">
              <div class="result-label">
                <span>${escapeHtml(item.option)}</span>
                <span>${item.pct}%</span>
              </div>
              <div class="meter"><span style="--pct: ${item.pct}%"></span></div>
            </div>
          `,
        )
        .join("");

      const closed = isClosed(topic);
      return `
        <article class="topic-card">
          <div class="topic-meta">
            <span class="pill ${topic.category === "選挙" ? "election" : ""}">${escapeHtml(topic.category)}</span>
            <span class="pill ${closed ? "closed" : ""}">${closed ? "締切済み" : `${formatDate(topic.deadline)} 締切`}</span>
          </div>
          <h3>${escapeHtml(topic.title)}</h3>
          <p>${escapeHtml(topic.description || "説明はまだありません。")}</p>
          <div class="result-list">${rows}</div>
          <div class="topic-footer">
            <small>${topic.predictions.length}件の予想</small>
            <button class="button primary" type="button" data-predict="${topic.id}" ${closed ? "disabled" : ""}>予想する</button>
          </div>
        </article>
      `;
    })
    .join("");

  topicGrid.querySelectorAll("[data-predict]").forEach((button) => {
    button.addEventListener("click", () => openPrediction(button.dataset.predict));
  });
}

function renderStats() {
  const predictions = topics.flatMap((topic) => topic.predictions);
  const average = predictions.length
    ? Math.round(predictions.reduce((sum, item) => sum + Number(item.confidence), 0) / predictions.length)
    : 0;

  document.querySelector("#statTopics").textContent = topics.length;
  document.querySelector("#statPredictions").textContent = predictions.length;
  document.querySelector("#statAverage").textContent = `${average}%`;
}

function renderActivity() {
  const entries = topics
    .flatMap((topic) =>
      topic.predictions.map((prediction) => ({
        ...prediction,
        topicTitle: topic.title,
        topicId: topic.id,
      })),
    )
    .slice(-8)
    .reverse();

  activityList.innerHTML = entries.length
    ? entries
        .map(
          (entry) => `
            <article class="activity-item">
              <div>
                <h3>${escapeHtml(entry.name)} さんが「${escapeHtml(entry.choice)}」と予想</h3>
                <p>${escapeHtml(entry.topicTitle)} / ${escapeHtml(entry.reason || "理由は未記入です。")}</p>
              </div>
              <span class="confidence">${Number(entry.confidence)}%</span>
            </article>
          `,
        )
        .join("")
    : `<article class="activity-item"><p>まだ予想はありません。</p></article>`;
}

function renderAll() {
  renderStats();
  renderTopics();
  renderActivity();
  drawTrend();
}

function openPrediction(topicId) {
  const topic = topics.find((item) => item.id === topicId);
  if (!topic) return;

  predictionForm.elements.topicId.value = topic.id;
  document.querySelector("#dialogTitle").textContent = topic.title;
  predictionForm.elements.choice.innerHTML = topic.options
    .map((option) => `<option>${escapeHtml(option)}</option>`)
    .join("");
  confidenceInput.value = 60;
  confidenceValue.textContent = "60%";
  predictionDialog.showModal();
}

predictionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(predictionForm);
  const topic = topics.find((item) => item.id === formData.get("topicId"));
  if (!topic) return;

  topic.predictions.push({
    name: String(formData.get("name")).trim(),
    choice: String(formData.get("choice")),
    confidence: Number(formData.get("confidence")),
    reason: String(formData.get("reason")).trim(),
  });

  saveTopics();
  predictionDialog.close();
  predictionForm.reset();
  renderAll();
});

topicForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(topicForm);
  const options = String(formData.get("options"))
    .split(",")
    .map((option) => option.trim())
    .filter(Boolean)
    .slice(0, 6);

  if (options.length < 2) {
    topicForm.elements.options.setCustomValidity("選択肢を2つ以上入力してください。");
    topicForm.elements.options.reportValidity();
    return;
  }

  topicForm.elements.options.setCustomValidity("");
  topics.unshift({
    id: `topic-${Date.now()}`,
    title: String(formData.get("title")).trim(),
    category: String(formData.get("category")),
    deadline: String(formData.get("deadline")),
    description: String(formData.get("description")).trim(),
    options,
    predictions: [],
  });

  saveTopics();
  topicForm.reset();
  renderAll();
  document.querySelector("#topics").scrollIntoView({ behavior: "smooth" });
});

topicForm.elements.options.addEventListener("input", () => {
  topicForm.elements.options.setCustomValidity("");
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderTopics();
  });
});

document.querySelector("#closeDialog").addEventListener("click", () => predictionDialog.close());

document.querySelector("#resetButton").addEventListener("click", () => {
  topics = structuredClone(seedTopics);
  saveTopics();
  activeFilter = "all";
  document.querySelectorAll(".filter").forEach((item) => {
    item.classList.toggle("active", item.dataset.filter === "all");
  });
  renderAll();
});

confidenceInput.addEventListener("input", () => {
  confidenceValue.textContent = `${confidenceInput.value}%`;
});

function drawTrend() {
  const canvas = document.querySelector("#trendCanvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfcff";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#d8dde6";
  ctx.lineWidth = 1;
  for (let y = 44; y < height; y += 44) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const lines = [
    { color: "#2154d8", values: [30, 34, 33, 39, 42, 46] },
    { color: "#168765", values: [38, 37, 40, 36, 35, 34] },
    { color: "#c47b18", values: [32, 29, 27, 25, 23, 20] },
  ];

  lines.forEach((line) => {
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    line.values.forEach((value, index) => {
      const x = 32 + index * ((width - 64) / (line.values.length - 1));
      const y = height - 28 - (value / 60) * (height - 58);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });

  ctx.fillStyle = "#5f6570";
  ctx.font = "700 20px system-ui, sans-serif";
  ctx.fillText("予想推移", 24, 34);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

renderAll();

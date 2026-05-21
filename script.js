const STORAGE_KEY = "yosou-markets-demo-v2";
const config = window.YOSOUBOX_CONFIG || {};
const hasSupabaseConfig = Boolean(config.supabaseUrl && config.supabaseAnonKey && window.supabase);
const db = hasSupabaseConfig ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey) : null;
const STARTING_POINTS = 100;
const WIN_PAYOUT_MULTIPLIER = 2;

const seedData = {
  markets: [
    {
      id: "m-election",
      title: "次の国政選挙の投票率は55%を超える？",
      category: "選挙",
      description: "争点、天候、期日前投票の伸びを見ながら投票率を予想するテーマ。",
      deadline: "2026-10-01",
      status: "open",
      created_at: "2026-05-20T10:00:00Z",
    },
    {
      id: "m-mayor",
      title: "架空市長選 2026 の当選者は？",
      category: "選挙",
      description: "公開討論会後の支持率と地元組織の動きが焦点。",
      deadline: "2026-09-20",
      status: "open",
      created_at: "2026-05-19T10:00:00Z",
    },
    {
      id: "m-cup",
      title: "今年の決勝戦で優勝するチームは？",
      category: "スポーツ",
      description: "直近の故障者、守備指標、対戦相性をもとに予想。",
      deadline: "2026-07-12",
      status: "open",
      created_at: "2026-05-18T10:00:00Z",
    },
    {
      id: "m-yen",
      title: "年末の為替レートは150円台で終わる？",
      category: "経済",
      description: "金利差、物価指標、政策変更のタイミングを見ます。",
      deadline: "2026-12-20",
      status: "open",
      created_at: "2026-05-17T10:00:00Z",
    },
    {
      id: "m-award",
      title: "今年の話題賞を取る作品ジャンルは？",
      category: "エンタメ",
      description: "配信の反応、SNS波及、公開規模から予想。",
      deadline: "2026-11-30",
      status: "resolved",
      created_at: "2026-05-16T10:00:00Z",
    },
  ],
  options: [
    { id: "o-election-yes", market_id: "m-election", label: "55%を超える", sort_order: 0 },
    { id: "o-election-no", market_id: "m-election", label: "55%以下", sort_order: 1 },
    { id: "o-mayor-a", market_id: "m-mayor", label: "現職候補", sort_order: 0 },
    { id: "o-mayor-b", market_id: "m-mayor", label: "新人候補", sort_order: 1 },
    { id: "o-mayor-c", market_id: "m-mayor", label: "無所属候補", sort_order: 2 },
    { id: "o-cup-east", market_id: "m-cup", label: "東クラブ", sort_order: 0 },
    { id: "o-cup-west", market_id: "m-cup", label: "西クラブ", sort_order: 1 },
    { id: "o-cup-north", market_id: "m-cup", label: "北クラブ", sort_order: 2 },
    { id: "o-yen-yes", market_id: "m-yen", label: "150円台", sort_order: 0 },
    { id: "o-yen-no", market_id: "m-yen", label: "それ以外", sort_order: 1 },
    { id: "o-award-anime", market_id: "m-award", label: "アニメ", sort_order: 0 },
    { id: "o-award-game", market_id: "m-award", label: "ゲーム", sort_order: 1 },
    { id: "o-award-movie", market_id: "m-award", label: "映画", sort_order: 2 },
  ],
  predictions: [
    { id: "p1", market_id: "m-election", option_id: "o-election-yes", user_name: "akari", confidence: 62, stake: 12, reason: "物価と社会保障が争点化して関心が高い。", created_at: "2026-05-20T11:00:00Z" },
    { id: "p2", market_id: "m-election", option_id: "o-election-no", user_name: "ren", confidence: 55, stake: 10, reason: "無党派層の熱量がまだ弱い。", created_at: "2026-05-20T12:00:00Z" },
    { id: "p3", market_id: "m-mayor", option_id: "o-mayor-a", user_name: "mika", confidence: 70, stake: 18, reason: "現職の地盤が崩れていない。", created_at: "2026-05-20T13:00:00Z" },
    { id: "p4", market_id: "m-mayor", option_id: "o-mayor-b", user_name: "sota", confidence: 58, stake: 8, reason: "討論会後に新人の認知が伸びた。", created_at: "2026-05-20T14:00:00Z" },
    { id: "p5", market_id: "m-cup", option_id: "o-cup-east", user_name: "taku", confidence: 80, stake: 20, reason: "守備の安定感が抜けている。", created_at: "2026-05-20T15:00:00Z" },
    { id: "p6", market_id: "m-yen", option_id: "o-yen-yes", user_name: "hiro", confidence: 48, stake: 7, reason: "金利差が急には縮まらない。", created_at: "2026-05-20T16:00:00Z" },
    { id: "p7", market_id: "m-award", option_id: "o-award-anime", user_name: "rio", confidence: 72, stake: 16, reason: "海外での拡散が大きい。", created_at: "2026-05-20T17:00:00Z" },
    { id: "p8", market_id: "m-award", option_id: "o-award-game", user_name: "yui", confidence: 45, stake: 12, reason: "大型タイトルの発売が続く。", created_at: "2026-05-20T18:00:00Z" },
  ],
  comments: [
    { id: "c1", market_id: "m-election", user_name: "kei", body: "期日前投票の数字が出たらかなり動きそう。", created_at: "2026-05-20T19:00:00Z" },
    { id: "c2", market_id: "m-mayor", user_name: "nana", body: "争点が交通政策に寄るなら新人候補もある。", created_at: "2026-05-20T20:00:00Z" },
    { id: "c3", market_id: "m-award", user_name: "rio", body: "公式発表後にアニメで確定。", created_at: "2026-05-20T21:00:00Z" },
  ],
  results: [
    { market_id: "m-award", winning_option_id: "o-award-anime", note: "デモ用の確定結果", resolved_at: "2026-05-20T22:00:00Z" },
  ],
};

const state = {
  markets: [],
  options: [],
  predictions: [],
  comments: [],
  results: [],
  category: "all",
  query: "",
  selectedMarketId: null,
  user: null,
  profile: null,
  mode: hasSupabaseConfig ? "supabase" : "demo",
};

const els = {
  marketList: document.querySelector("#marketList"),
  marketDetail: document.querySelector("#marketDetail"),
  leaderboardList: document.querySelector("#leaderboardList"),
  searchInput: document.querySelector("#searchInput"),
  connectionBadge: document.querySelector("#connectionBadge"),
  pointBadge: document.querySelector("#pointBadge"),
  loginButton: document.querySelector("#loginButton"),
  authDialog: document.querySelector("#authDialog"),
  authForm: document.querySelector("#authForm"),
  createDialog: document.querySelector("#createDialog"),
  marketForm: document.querySelector("#marketForm"),
  quickMarketForm: document.querySelector("#quickMarketForm"),
  predictDialog: document.querySelector("#predictDialog"),
  predictionForm: document.querySelector("#predictionForm"),
  resolveDialog: document.querySelector("#resolveDialog"),
  resolveForm: document.querySelector("#resolveForm"),
  confidenceValue: document.querySelector("#confidenceValue"),
  stakeHelp: document.querySelector("#stakeHelp"),
};

init();

async function init() {
  bindEvents();
  await loadSession();
  await loadData();
  render();
}

function bindEvents() {
  document.querySelector("#createMarketButton").addEventListener("click", () => {
    els.createDialog.showModal();
  });

  els.loginButton.addEventListener("click", async () => {
    if (state.user || state.profile) {
      await signOut();
      return;
    }
    els.authDialog.showModal();
  });

  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => document.querySelector(`#${button.dataset.close}`).close());
  });

  document.querySelectorAll(".topic-tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".topic-tab").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.category = button.dataset.category;
      render();
    });
  });

  els.searchInput.addEventListener("input", () => {
    state.query = els.searchInput.value.trim().toLowerCase();
    renderMarkets();
  });

  els.authForm.addEventListener("submit", handleAuth);
  els.marketForm.addEventListener("submit", handleMarketCreate);
  els.quickMarketForm.addEventListener("submit", handleMarketCreate);
  [els.marketForm, els.quickMarketForm].forEach((form) => {
    form.elements.options.addEventListener("input", () => {
      form.elements.options.setCustomValidity("");
    });
  });
  els.predictionForm.addEventListener("submit", handlePredictionCreate);
  els.resolveForm.addEventListener("submit", handleResolve);

  els.predictionForm.elements.confidence.addEventListener("input", () => {
    els.confidenceValue.textContent = `${els.predictionForm.elements.confidence.value}%`;
  });
  els.predictionForm.elements.stake.addEventListener("input", () => {
    els.predictionForm.elements.stake.setCustomValidity("");
  });
}

async function loadSession() {
  if (!db) {
    const localProfile = JSON.parse(localStorage.getItem("yosou-demo-profile") || "null");
    state.profile = localProfile ? normalizeProfile(localProfile) : null;
    return;
  }

  const { data } = await db.auth.getSession();
  state.user = data.session?.user || null;
  if (!state.user) return;

  const { data: profile } = await db.from("profiles").select("*").eq("id", state.user.id).maybeSingle();
  if (profile) {
    state.profile = normalizeProfile(profile);
    return;
  }

  const displayName =
    state.user.user_metadata?.display_name ||
    state.user.email?.split("@")[0] ||
    "ユーザー";
  const { data: createdProfile } = await db
    .from("profiles")
    .insert({ id: state.user.id, display_name: displayName, starting_points: STARTING_POINTS })
    .select("*")
    .single();
  state.profile = normalizeProfile(createdProfile || { id: state.user.id, display_name: displayName });
}

async function loadData() {
  if (!db) {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    Object.assign(state, saved || structuredClone(seedData));
    normalizeStateData();
    state.selectedMarketId ||= state.markets[0]?.id || null;
    return;
  }

  const [markets, options, predictions, comments, results] = await Promise.all([
    db.from("markets").select("*").order("created_at", { ascending: false }),
    db.from("market_options").select("*").order("sort_order", { ascending: true }),
    db.from("predictions").select("*").order("created_at", { ascending: true }),
    db.from("comments").select("*").order("created_at", { ascending: true }),
    db.from("market_results").select("*"),
  ]);

  const failed = [markets, options, predictions, comments, results].find((response) => response.error);
  if (failed) {
    console.error(failed.error);
    alert("共有データベースから読み込めませんでした。SQLとアクセス権設定を確認してください。");
    Object.assign(state, structuredClone(seedData));
    state.mode = "demo";
    return;
  }

  state.markets = markets.data;
  state.options = options.data;
  state.predictions = predictions.data;
  state.comments = comments.data;
  state.results = results.data;
  normalizeStateData();
  state.selectedMarketId ||= state.markets[0]?.id || null;
}

function saveDemoData() {
  if (db) return;
  const payload = {
    markets: state.markets,
    options: state.options,
    predictions: state.predictions,
    comments: state.comments,
    results: state.results,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function render() {
  els.connectionBadge.textContent = state.mode === "supabase" ? "共有保存" : "デモ保存";
  els.connectionBadge.classList.toggle("muted", state.mode !== "supabase");
  els.pointBadge.textContent = state.profile ? `${getCurrentPointBalance()} pt` : `${STARTING_POINTS} pt`;
  els.loginButton.textContent = state.profile ? `${state.profile.display_name} / ログアウト` : "ログイン";
  renderStats();
  renderMarkets();
  renderDetail();
  renderLeaderboard();
}

function renderStats() {
  document.querySelector("#statMarkets").textContent = state.markets.length;
  document.querySelector("#statPredictions").textContent = state.predictions.length;
  document.querySelector("#statResolved").textContent = state.results.length;
}

function getVisibleMarkets() {
  return state.markets.filter((market) => {
    const categoryMatch = state.category === "all" || market.category === state.category;
    const text = `${market.title} ${market.description || ""} ${market.category}`.toLowerCase();
    return categoryMatch && (!state.query || text.includes(state.query));
  });
}

function renderMarkets() {
  const visible = getVisibleMarkets();
  if (!visible.length) {
    els.marketList.innerHTML = `<div class="empty">該当する予想テーマはありません。</div>`;
    return;
  }

  els.marketList.innerHTML = visible
    .map((market) => {
      const options = getOptions(market.id);
      const statusTag = getStatusTag(market);
      return `
        <article class="market-card" data-market="${market.id}">
          <div>
            <div class="market-meta">
              <span class="tag">${escapeHtml(market.category)}</span>
              ${statusTag}
              <span class="tag">${getPredictionCount(market.id)}件の予想</span>
            </div>
            <h2 class="market-title">${escapeHtml(market.title)}</h2>
            <p class="market-desc">${escapeHtml(market.description || "説明はありません。")}</p>
          </div>
          <div class="price-stack">
            ${options
              .slice(0, 3)
              .map((option) => {
                const pct = getOptionPct(market.id, option.id);
                return `
                  <button class="price-row" type="button" style="--pct: ${pct}%;" data-predict="${market.id}" data-option="${option.id}">
                    <span>${escapeHtml(option.label)}</span>
                    <b>${pct}%</b>
                  </button>
                `;
              })
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");

  els.marketList.querySelectorAll("[data-market]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("[data-predict]")) return;
      state.selectedMarketId = card.dataset.market;
      renderDetail();
    });
  });

  els.marketList.querySelectorAll("[data-predict]").forEach((button) => {
    button.addEventListener("click", () => openPredict(button.dataset.predict, button.dataset.option));
  });
}

function renderDetail() {
  const market = getSelectedMarket();
  if (!market) {
    els.marketDetail.innerHTML = `<div class="detail-main"><p>予想テーマを選択してください。</p></div>`;
    return;
  }

  const options = getOptions(market.id);
  const result = getResult(market.id);
  const resolved = market.status === "resolved" || Boolean(result);
  const closed = isMarketClosed(market);
  els.marketDetail.innerHTML = `
    <div class="detail-main">
      <div class="market-meta">
        <span class="tag">${escapeHtml(market.category)}</span>
        ${getStatusTag(market)}
        <span class="tag">締切 ${formatDate(market.deadline)}</span>
      </div>
      <h2>${escapeHtml(market.title)}</h2>
      <p>${escapeHtml(market.description || "説明はありません。")}</p>
      <div class="point-summary">
        <strong>${state.profile ? `${getCurrentPointBalance()} pt` : `${STARTING_POINTS} pt`}</strong>
        <span>保有ポイント。予想が当たると賭けたポイントの${WIN_PAYOUT_MULTIPLIER}倍が戻ります。</span>
      </div>
      <div class="price-stack">
        ${options
          .map((option) => {
            const pct = getOptionPct(market.id, option.id);
            const winner = result?.winning_option_id === option.id ? " 正解" : "";
            return `
              <button class="price-row" type="button" style="--pct: ${pct}%;" data-detail-predict="${option.id}">
                <span>${escapeHtml(option.label)}${winner}</span>
                <b>${pct}%</b>
              </button>
            `;
          })
          .join("")}
      </div>
      <div class="action-grid">
        <button class="button green" type="button" data-open-predict="${market.id}" ${closed || resolved ? "disabled" : ""}>予想する</button>
        <button class="button ghost" type="button" data-open-resolve="${market.id}" ${resolved ? "disabled" : ""}>結果確定</button>
      </div>
      ${result ? `<p class="help-text">確定: ${escapeHtml(getOptionLabel(result.winning_option_id))} / ${escapeHtml(result.note || "メモなし")}</p>` : ""}
    </div>
    <div class="comments">
      <div class="card-head">
        <h2>コメント</h2>
        <span>${getComments(market.id).length}</span>
      </div>
      <div class="comment-list">
        ${renderComments(market.id)}
      </div>
      <form class="comment-form" data-comment-form="${market.id}">
        <textarea name="body" rows="3" maxlength="220" placeholder="この予想テーマについてコメント"></textarea>
        <button class="button dark" type="submit">投稿</button>
      </form>
    </div>
  `;

  els.marketDetail.querySelectorAll("[data-detail-predict]").forEach((button) => {
    button.addEventListener("click", () => openPredict(market.id, button.dataset.detailPredict));
  });
  els.marketDetail.querySelector("[data-open-predict]")?.addEventListener("click", () => openPredict(market.id));
  els.marketDetail.querySelector("[data-open-resolve]")?.addEventListener("click", () => openResolve(market.id));
  els.marketDetail.querySelector("[data-comment-form]")?.addEventListener("submit", handleCommentCreate);
}

function renderComments(marketId) {
  const comments = getComments(marketId).slice(-12).reverse();
  if (!comments.length) return `<div class="empty">まだコメントはありません。</div>`;

  return comments
    .map(
      (comment) => `
        <article class="comment">
          <div class="comment-meta">
            <strong>${escapeHtml(comment.user_name)}</strong>
            <span>${formatDateTime(comment.created_at)}</span>
          </div>
          <p>${escapeHtml(comment.body)}</p>
        </article>
      `,
    )
    .join("");
}

function renderLeaderboard() {
  const rows = buildLeaderboard();
  if (!rows.length) {
    els.leaderboardList.innerHTML = `<div class="empty">ポイントを持つ参加者がまだいません。</div>`;
    return;
  }

  els.leaderboardList.innerHTML = rows
    .map(
      (row, index) => `
        <div class="leaderboard-row">
          <strong>${index + 1}. ${escapeHtml(row.name)}</strong>
          <span>${row.points} pt / 的中 ${row.correct}/${row.resolved}</span>
        </div>
      `,
    )
    .join("");
}

async function handleAuth(event) {
  event.preventDefault();
  const formData = new FormData(els.authForm);
  const displayName = String(formData.get("displayName") || "").trim() || "ゲスト";
  const email = String(formData.get("email") || "").trim();

  if (!db) {
    state.profile = { id: `demo-${Date.now()}`, display_name: displayName, starting_points: STARTING_POINTS };
    localStorage.setItem("yosou-demo-profile", JSON.stringify(state.profile));
    els.authDialog.close();
    render();
    return;
  }

  if (!email) {
    els.authForm.elements.email.setCustomValidity("メールアドレスを入力してください。");
    els.authForm.elements.email.reportValidity();
    return;
  }

  const { error } = await db.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.href,
      data: { display_name: displayName },
    },
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("ログイン用リンクをメールで送信しました。");
  els.authDialog.close();
}

async function signOut() {
  if (db) await db.auth.signOut();
  localStorage.removeItem("yosou-demo-profile");
  state.user = null;
  state.profile = null;
  render();
}

async function handleMarketCreate(event) {
  event.preventDefault();
  if (db && !requireLogin()) return;
  if (!db && !state.profile) {
    state.profile = { id: `demo-${Date.now()}`, display_name: "ゲスト", starting_points: STARTING_POINTS };
    localStorage.setItem("yosou-demo-profile", JSON.stringify(state.profile));
  }

  const form = event.currentTarget;
  const formData = new FormData(form);
  const options = String(formData.get("options"))
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);

  if (options.length < 2) {
    form.elements.options.setCustomValidity("選択肢を2つ以上入力してください。");
    form.elements.options.reportValidity();
    return;
  }
  form.elements.options.setCustomValidity("");

  const market = {
    id: crypto.randomUUID(),
    title: String(formData.get("title")).trim(),
    category: String(formData.get("category")),
    description: String(formData.get("description")).trim(),
    deadline: String(formData.get("deadline")),
    status: "open",
    created_by: state.user?.id || null,
    created_at: new Date().toISOString(),
  };
  const optionRows = options.map((label, index) => ({
    id: crypto.randomUUID(),
    market_id: market.id,
    label,
    sort_order: index,
  }));

  if (db) {
    const { data: createdMarket, error: marketError } = await db
      .from("markets")
      .insert({
        title: market.title,
        category: market.category,
        description: market.description,
        deadline: market.deadline,
        status: "open",
        created_by: state.user.id,
      })
      .select("id")
      .single();
    if (marketError) return alert(marketError.message);

    const remoteOptions = optionRows.map((option) => ({
      market_id: createdMarket.id,
      label: option.label,
      sort_order: option.sort_order,
    }));
    const { error: optionError } = await db.from("market_options").insert(remoteOptions);
    if (optionError) return alert(optionError.message);
    await loadData();
    state.selectedMarketId = createdMarket.id;
  } else {
    state.markets.unshift(market);
    state.options.push(...optionRows);
    saveDemoData();
    state.selectedMarketId = market.id;
  }

  state.category = "all";
  document.querySelectorAll(".topic-tab").forEach((item) => {
    item.classList.toggle("active", item.dataset.category === "all");
  });
  form.reset();
  if (form === els.marketForm) els.createDialog.close();
  render();
}

async function handlePredictionCreate(event) {
  event.preventDefault();
  if (!requireLogin()) return;

  const formData = new FormData(els.predictionForm);
  const stake = Math.floor(Number(formData.get("stake")));
  const balance = getCurrentPointBalance();
  if (!Number.isFinite(stake) || stake < 1) {
    els.predictionForm.elements.stake.setCustomValidity("1ポイント以上を入力してください。");
    els.predictionForm.elements.stake.reportValidity();
    return;
  }
  if (stake > balance) {
    els.predictionForm.elements.stake.setCustomValidity(`保有ポイントは${balance}ポイントです。`);
    els.predictionForm.elements.stake.reportValidity();
    return;
  }
  els.predictionForm.elements.stake.setCustomValidity("");

  const prediction = {
    id: crypto.randomUUID(),
    market_id: String(formData.get("marketId")),
    option_id: String(formData.get("optionId")),
    user_id: state.user?.id || state.profile?.id || null,
    user_name: currentName(),
    confidence: Number(formData.get("confidence")),
    stake,
    reason: String(formData.get("reason")).trim(),
    created_at: new Date().toISOString(),
  };

  if (db) {
    const { error } = await db.from("predictions").insert({
      market_id: prediction.market_id,
      option_id: prediction.option_id,
      user_id: state.user.id,
      user_name: prediction.user_name,
      confidence: prediction.confidence,
      stake: prediction.stake,
      reason: prediction.reason,
    });
    if (error) return alert(error.message);
    await loadData();
  } else {
    state.predictions.push(prediction);
    saveDemoData();
  }

  els.predictDialog.close();
  els.predictionForm.reset();
  render();
}

async function handleCommentCreate(event) {
  event.preventDefault();
  if (!requireLogin()) return;
  const form = event.currentTarget;
  const body = form.elements.body.value.trim();
  if (!body) return;

  const comment = {
    id: crypto.randomUUID(),
    market_id: form.dataset.commentForm,
    user_id: state.user?.id || null,
    user_name: currentName(),
    body,
    created_at: new Date().toISOString(),
  };

  if (db) {
    const { error } = await db.from("comments").insert({
      market_id: comment.market_id,
      user_id: state.user.id,
      user_name: comment.user_name,
      body: comment.body,
    });
    if (error) return alert(error.message);
    await loadData();
  } else {
    state.comments.push(comment);
    saveDemoData();
  }

  render();
}

async function handleResolve(event) {
  event.preventDefault();
  if (!requireLogin()) return;

  const formData = new FormData(els.resolveForm);
  const result = {
    market_id: String(formData.get("marketId")),
    winning_option_id: String(formData.get("optionId")),
    resolved_by: state.user?.id || null,
    note: String(formData.get("note")).trim(),
    resolved_at: new Date().toISOString(),
  };

  if (db) {
    const { error } = await db.from("market_results").insert(result);
    if (error) return alert(error.message);
    await loadData();
  } else {
    state.results = state.results.filter((item) => item.market_id !== result.market_id);
    state.results.push(result);
    state.markets = state.markets.map((market) =>
      market.id === result.market_id ? { ...market, status: "resolved" } : market,
    );
    saveDemoData();
  }

  els.resolveDialog.close();
  render();
}

function openPredict(marketId, optionId = null) {
  if (!requireLogin()) return;
  const market = getMarket(marketId);
  if (!market || market.status === "resolved" || isMarketClosed(market)) return;

  els.predictionForm.elements.marketId.value = market.id;
  document.querySelector("#predictionTitle").textContent = market.title;
  els.predictionForm.elements.optionId.innerHTML = getOptions(market.id)
    .map((option) => `<option value="${option.id}">${escapeHtml(option.label)}</option>`)
    .join("");
  if (optionId) els.predictionForm.elements.optionId.value = optionId;
  els.predictionForm.elements.confidence.value = 65;
  els.confidenceValue.textContent = "65%";
  const balance = getCurrentPointBalance();
  els.predictionForm.elements.stake.max = Math.max(balance, 1);
  els.predictionForm.elements.stake.value = Math.min(10, Math.max(balance, 1));
  els.stakeHelp.textContent =
    balance > 0
      ? `保有ポイントは${balance}ptです。当たると賭けたポイントの${WIN_PAYOUT_MULTIPLIER}倍が戻ります。`
      : "保有ポイントがないため、いまは予想できません。";
  els.predictionForm.querySelector('button[type="submit"]').disabled = balance < 1;
  els.predictDialog.showModal();
}

function openResolve(marketId) {
  if (!requireLogin()) return;
  const market = getMarket(marketId);
  if (!market) return;

  els.resolveForm.elements.marketId.value = market.id;
  els.resolveForm.elements.optionId.innerHTML = getOptions(market.id)
    .map((option) => `<option value="${option.id}">${escapeHtml(option.label)}</option>`)
    .join("");
  els.resolveDialog.showModal();
}

function requireLogin() {
  if (state.user || state.profile) return true;
  els.authDialog.showModal();
  return false;
}

function currentName() {
  return state.profile?.display_name || state.user?.email || "ゲスト";
}

function getSelectedMarket() {
  return getMarket(state.selectedMarketId) || getVisibleMarkets()[0] || state.markets[0] || null;
}

function getMarket(id) {
  return state.markets.find((market) => market.id === id);
}

function getOptions(marketId) {
  return state.options
    .filter((option) => option.market_id === marketId)
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
}

function getPredictionCount(marketId) {
  return state.predictions.filter((prediction) => prediction.market_id === marketId).length;
}

function getOptionPct(marketId, optionId) {
  const predictions = state.predictions.filter((prediction) => prediction.market_id === marketId);
  if (!predictions.length) return 0;
  const count = predictions.filter((prediction) => prediction.option_id === optionId).length;
  return Math.round((count / predictions.length) * 100);
}

function getComments(marketId) {
  return state.comments.filter((comment) => comment.market_id === marketId);
}

function getResult(marketId) {
  return state.results.find((result) => result.market_id === marketId);
}

function getOptionLabel(optionId) {
  return state.options.find((option) => option.id === optionId)?.label || "不明";
}

function getStatusTag(market) {
  if (market.status === "resolved" || getResult(market.id)) {
    return `<span class="tag resolved">結果確定</span>`;
  }
  if (isMarketClosed(market)) {
    return `<span class="tag closed">締切済み</span>`;
  }
  return `<span class="tag">受付中</span>`;
}

function isMarketClosed(market) {
  return new Date(`${market.deadline}T23:59:59`) < new Date();
}

function buildLeaderboard() {
  const scores = new Map();

  state.predictions.forEach((prediction) => {
    const key = prediction.user_id || prediction.user_name;
    const current = scores.get(key) || {
      key,
      name: prediction.user_name,
      total: 0,
      resolved: 0,
      correct: 0,
      points: STARTING_POINTS,
    };
    const stake = getStake(prediction);
    const result = getResult(prediction.market_id);

    current.total += 1;
    current.points -= stake;
    if (result) {
      current.resolved += 1;
      if (prediction.option_id === result.winning_option_id) {
        current.correct += 1;
        current.points += stake * WIN_PAYOUT_MULTIPLIER;
      }
    }
    scores.set(key, current);
  });

  return [...scores.values()]
    .sort((a, b) => b.points - a.points || b.correct - a.correct || a.name.localeCompare(b.name))
    .slice(0, 10);
}

function getCurrentPointBalance() {
  if (!state.profile && !state.user) return STARTING_POINTS;
  return getUserPointBalance(getCurrentUserKey(), currentName(), state.profile?.starting_points);
}

function getUserPointBalance(userKey, userName, startingPoints = STARTING_POINTS) {
  let points = Number(startingPoints) || STARTING_POINTS;
  getUserPredictions(userKey, userName).forEach((prediction) => {
    const stake = getStake(prediction);
    const result = getResult(prediction.market_id);
    points -= stake;
    if (result && prediction.option_id === result.winning_option_id) {
      points += stake * WIN_PAYOUT_MULTIPLIER;
    }
  });
  return Math.max(0, points);
}

function getUserPredictions(userKey, userName) {
  return state.predictions.filter((prediction) => {
    if (prediction.user_id && userKey) return prediction.user_id === userKey;
    return prediction.user_name === userName;
  });
}

function getCurrentUserKey() {
  return state.user?.id || state.profile?.id || null;
}

function getStake(prediction) {
  const stake = Math.floor(Number(prediction.stake || 0));
  return Number.isFinite(stake) && stake > 0 ? stake : 0;
}

function normalizeProfile(profile) {
  return {
    ...profile,
    starting_points: Number(profile.starting_points || STARTING_POINTS),
  };
}

function normalizeStateData() {
  state.predictions = state.predictions.map((prediction) => ({
    ...prediction,
    stake: getStake(prediction),
  }));
  if (state.profile) state.profile = normalizeProfile(state.profile);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
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

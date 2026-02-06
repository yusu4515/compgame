const AppState = {
  view: 'loading',
  employeeId: localStorage.getItem('employeeId') || null,
  profile: null,
  stats: null,
  story: null,
  town: null,
  avatars: [],
  chapters: [],
  ranking: null,
  selectedDomain: 'legal',
  currentQuestion: null,
  quizStartTime: null,
  lastResult: null,
  currentStory: null,
  adminQuestions: [],
  adminTotal: 0,
  adminPage: 0,
  adminDomain: '',
};

const AssetUrls = {
  keyVisual: '/static/assets/visuals/key-visual.png',
  worldMap: '/static/assets/visuals/world-map.png',
  monsters: '/static/assets/visuals/monster-compendium.png',
  uiAssets: '/static/assets/visuals/ui-assets.png',
  avatarLineup: '/static/assets/visuals/avatar-lineup.png',
};

const DomainLabels = {
  legal: 'ほうむ（げんえいぞく）',
  finance: 'けいり（よくばりぞく）',
  hr: 'じんじ（どくぎりぞく）',
  labor: 'ろうむ（たいだぞく）',
  infosec: 'じょうしす（みっていぞく）',
  mixed: 'こんせい（いにしえの しんぱん）',
};

const TermMap = {
  コンプライアンス: 'エシカルの ちかい',
  情報漏洩: 'しろの ひみつを もらす',
  ハラスメント: 'こころを きずつける わるい じゅもん',
  経費精算の不正: 'おうこくの きんこから きんかを くすねる',
  王国: 'おうこく',
  守護者: 'しゅごしゃ',
  魔王: 'まおう',
  賢者: 'けんじゃ',
  霧: 'きり',
  旅: 'たび',
  章: 'しょう',
  砂漠: 'さばく',
  迷宮: 'めいきゅう',
  森: 'もり',
  城: 'しろ',
  塔: 'とう',
  聖域: 'せいいき',
  解説: 'けんじゃの おしえ',
  正解: 'せいかい',
  不正解: 'ちがうぞ',
};

const CommandLabels = ['こうげき', 'じゅもん', 'ぼうぎょ', 'アイテム'];

function softenText(text) {
  if (!text) return '';
  let output = text.replace(/\*\*/g, '');
  Object.entries(TermMap).forEach(([key, value]) => {
    output = output.split(key).join(value);
  });
  output = output
    .replace(/。/g, '。 ')
    .replace(/、/g, '、 ')
    .replace(/！/g, '！ ')
    .replace(/\?/g, '? ')
    .replace(/!/g, '! ');
  return output;
}

function getCommandLabel(index) {
  return CommandLabels[index % CommandLabels.length];
}

function showToast(message, type = 'info') {
  const app = document.getElementById('app');
  const colors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
  };
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg fade-in z-50`;
  toast.textContent = message;
  app.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

async function fetchAvatars() {
  const response = await axios.get('/api/avatars');
  AppState.avatars = response.data.avatars;
}

async function fetchChapters() {
  const response = await axios.get('/api/chapters');
  AppState.chapters = response.data.chapters;
}

async function login(employeeId, nickname, avatarId) {
  const response = await axios.post('/api/auth/login', { employeeId, nickname, avatarId });
  AppState.profile = response.data.profile;
  AppState.stats = response.data.stats;
  AppState.story = response.data.story;
  AppState.town = response.data.town;
  localStorage.setItem('employeeId', employeeId);
  AppState.employeeId = employeeId;

  if (response.data.loginBonus?.coins) {
    showToast(`デイリーボーナス: +${response.data.loginBonus.coins}コイン / +${response.data.loginBonus.xp}XP`, 'success');
  }
}

async function fetchProfile() {
  if (!AppState.employeeId) return;
  const response = await axios.get(`/api/profile/${AppState.employeeId}`);
  AppState.profile = response.data.profile;
  AppState.stats = response.data.stats;
  AppState.story = response.data.story;
  AppState.town = response.data.town;
}

async function fetchRanking() {
  const response = await axios.get('/api/ranking/weekly');
  AppState.ranking = response.data;
}

async function fetchAdminQuestions() {
  const response = await axios.get('/api/admin/questions', {
    params: {
      limit: 10,
      offset: AppState.adminPage * 10,
      domain: AppState.adminDomain || undefined,
    },
  });
  AppState.adminQuestions = response.data.questions;
  AppState.adminTotal = response.data.total;
}

async function updateQuestion(questionId, payload) {
  await axios.put(`/api/admin/questions/${questionId}`, payload);
}

async function fetchNextQuestion(domain) {
  const response = await axios.get('/api/questions/next', {
    params: { employeeId: AppState.employeeId, domain },
  });
  AppState.currentQuestion = response.data.question;
  AppState.quizStartTime = performance.now();
}

async function submitAnswer(choiceIndex) {
  const timeMs = Math.round(performance.now() - AppState.quizStartTime);
  const response = await axios.post('/api/questions/answer', {
    employeeId: AppState.employeeId,
    questionId: AppState.currentQuestion.id,
    choiceIndex,
    timeMs,
  });
  AppState.lastResult = response.data.result;
  await fetchProfile();
}

function renderLogin() {
  const app = document.getElementById('app');
  const avatarOptions = AppState.avatars
    .map(
      (avatar, index) => `
        <label class="flex flex-col items-center gap-2 cursor-pointer">
          <input type="radio" name="avatar" value="${avatar.id}" class="hidden" ${index === 0 ? 'checked' : ''}>
          <img src="${avatar.image}" alt="${avatar.name}" class="w-24 h-24 rounded-xl border-2 border-transparent hover:border-purple-400 transition" />
          <span class="text-xs text-slate-200">${avatar.name}</span>
        </label>
      `
    )
    .join('');

  app.innerHTML = `
    <div class="min-h-screen bg-hero flex items-center justify-center p-8" style="background-image: linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.85)), url('${AssetUrls.keyVisual}'); background-size: cover; background-position: center;">
      <div class="max-w-5xl w-full glass rounded-3xl p-10 shadow-2xl fade-in">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h1 class="text-4xl font-bold">Compliance Quest</h1>
            <p class="text-purple-200 mt-2">エシカル王国の守護者</p>
            <p class="text-sm text-slate-300 mt-4">長期運用型コンプライアンスRPG</p>
            <img src="${AssetUrls.avatarLineup}" alt="avatar lineup" class="mt-6 rounded-xl shadow-xl" />
          </div>
          <div>
            <p class="text-sm text-slate-300">SSO想定の従業員IDでログインしてください</p>
            <label class="block text-sm text-slate-200 mt-4 mb-2">従業員ID</label>
            <input id="employeeId" type="text" class="w-full px-4 py-3 rounded-lg text-slate-900" placeholder="例: EMP-1024" />
            <label class="block text-sm text-slate-200 mt-4 mb-2">ニックネーム</label>
            <input id="nickname" type="text" class="w-full px-4 py-3 rounded-lg text-slate-900" placeholder="守護者名" />
            <p class="text-sm text-slate-200 mt-4">アバターを選択</p>
            <div class="grid grid-cols-3 gap-3 mt-2">${avatarOptions}</div>
            <button onclick="handleLogin()" class="mt-8 w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold">
              守護者として旅立つ
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDashboard() {
  const app = document.getElementById('app');
  const profile = AppState.profile;
  const stats = AppState.stats;
  const avatar = AppState.avatars.find((item) => item.id === profile.avatarId);
  const xpToNext = profile.level * 120 + profile.level * 120;

  app.innerHTML = `
    <div class="min-h-screen bg-slate-950 p-8">
      <div class="max-w-6xl mx-auto space-y-8">
        <div class="glass rounded-3xl p-6 flex flex-col lg:flex-row gap-6" style="background-image: linear-gradient(rgba(15,23,42,0.9), rgba(15,23,42,0.9)), url('${AssetUrls.keyVisual}'); background-size: cover; background-position: center;">
          <div class="flex items-center gap-4">
            <img src="${avatar?.image}" alt="avatar" class="w-24 h-24 rounded-2xl" />
            <div>
              <p class="text-sm text-purple-200">守護者</p>
              <h2 class="text-2xl font-bold">${profile.nickname}</h2>
              <p class="text-xs text-slate-300">従業員ID: ${profile.employeeId}</p>
              <p class="text-xs text-slate-300">称号: ${profile.titlePrimary || '未取得'}</p>
            </div>
          </div>
          <div class="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-slate-900/70 p-4 rounded-xl">
              <p class="text-xs text-slate-300">レベル</p>
              <p class="text-xl font-bold">Lv.${profile.level}</p>
            </div>
            <div class="bg-slate-900/70 p-4 rounded-xl">
              <p class="text-xs text-slate-300">経験値</p>
              <p class="text-xl font-bold">${profile.xp} XP</p>
              <p class="text-xs text-slate-400">次Lv目安: ${xpToNext}</p>
            </div>
            <div class="bg-slate-900/70 p-4 rounded-xl">
              <p class="text-xs text-slate-300">コイン</p>
              <p class="text-xl font-bold">${profile.coins} 枚</p>
            </div>
            <div class="bg-slate-900/70 p-4 rounded-xl">
              <p class="text-xs text-slate-300">連続ログイン</p>
              <p class="text-xl font-bold">${stats.streakDays} 日</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div class="glass rounded-2xl p-6">
            <h3 class="font-semibold mb-4">こんしゅうの スコア</h3>
            <p class="text-3xl font-bold text-yellow-300">${stats.weeklyScore}</p>
            <p class="text-xs text-slate-400">まいしゅう げつよう りせっと</p>
          </div>
          <div class="glass rounded-2xl p-6">
            <h3 class="font-semibold mb-4">とうばつ サマリ</h3>
            <div class="grid grid-cols-2 gap-2 text-sm text-slate-200">
              <span>ほうむ: ${stats.legalKills}</span>
              <span>けいり: ${stats.financeKills}</span>
              <span>じんじ: ${stats.hrKills}</span>
              <span>ろうむ: ${stats.laborKills}</span>
              <span>じょうしす: ${stats.infosecKills}</span>
              <span>こんせい: ${stats.mixedKills}</span>
            </div>
          </div>
          <div class="glass rounded-2xl p-6">
            <h3 class="font-semibold mb-4">ものがたり しんこう</h3>
            <p class="text-sm text-slate-200">いま: ${softenText(getChapterTitle(AppState.story.currentChapter))}</p>
            <p class="text-xs text-slate-400">クリア すう: ${AppState.story.clearedChapters.length}</p>
            <button onclick="renderStorySelect()" class="mt-4 w-full bg-purple-500/80 hover:bg-purple-500 text-white py-2 rounded-lg">ものがたりへ</button>
          </div>
          <div class="glass rounded-2xl p-6">
            <h3 class="font-semibold mb-4">じょうか じょうきょう</h3>
            <p class="text-sm text-slate-200">ふっこう レベル: ${AppState.town?.townLevel ?? 0}</p>
            <div class="text-xs text-slate-300 mt-2 space-y-1">
              <p>${AppState.town?.fogCleared ? 'きりが はれた' : 'きりが のこっている'}</p>
              <p>${AppState.town?.innRebuilt ? 'やどやが もどった' : 'やどやは まだ'}</p>
              <p>${AppState.town?.bankRebuilt ? 'ぎんこうが ふっかつ' : 'ぎんこうは まいそう'}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <button onclick="showRanking()" class="bg-slate-800 text-white py-4 rounded-xl font-bold">
            週次ランキング
          </button>
          <button onclick="renderAdmin()" class="bg-slate-700 text-white py-4 rounded-xl font-bold">
            管理画面
          </button>
          <button onclick="logout()" class="bg-slate-600 text-white py-4 rounded-xl font-bold">
            ログアウト
          </button>
        </div>
      </div>
    </div>
  `;
}

function getChapterTitle(chapterId) {
  const chapter = AppState.chapters.find((item) => item.id === chapterId);
  return chapter ? `${chapter.title} ${chapter.subtitle}` : 'プロローグ';
}

function renderStorySelect() {
  const app = document.getElementById('app');
  const progress = AppState.story;

  app.innerHTML = `
    <div class="min-h-screen bg-slate-950 p-8" style="background-image: linear-gradient(rgba(15,23,42,0.92), rgba(15,23,42,0.92)), url('${AssetUrls.worldMap}'); background-size: cover; background-position: center;">
      <div class="max-w-5xl mx-auto glass rounded-3xl p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">ストーリー章選択</h2>
          <button onclick="renderDashboard()" class="text-sm text-slate-300">戻る</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${AppState.chapters
            .filter((chapter) => chapter.id !== 'bonus' || progress.isBonusUnlocked)
            .map((chapter) => {
              const locked = chapter.id === 'final' && progress.clearedChapters.length < 5;
              return `
              <div class="bg-slate-900/70 p-4 rounded-xl ${locked ? 'opacity-50' : 'cursor-pointer'}" ${
                locked ? '' : `onclick="openStory('${chapter.id}')"`
              }>
                <h3 class="font-semibold">${softenText(`${chapter.title} ${chapter.subtitle}`)}</h3>
                <p class="text-xs text-slate-400">${softenText(chapter.category)}</p>
              </div>`;
            })
            .join('')}
        </div>
      </div>
    </div>
  `;
}

function getStoryDomain(chapterId) {
  const mapping = {
    chapter1: 'legal',
    chapter2: 'finance',
    chapter3: 'hr',
    chapter4: 'infosec',
    chapter5: 'labor',
    final: 'mixed',
    bonus: 'mixed',
  };
  return mapping[chapterId] || 'legal';
}

function getStorySpeaker(index, chapter) {
  const domain = getStoryDomain(chapter.id);
  const domainLabel = DomainLabels[domain] || 'しゅごしゃ';
  if (chapter.id === 'prologue') {
    return index % 2 === 0 ? 'おうこくの かたりべ' : 'だいけんじゃ アウレリア';
  }
  return index % 2 === 0 ? 'かたりべ' : `${domainLabel}の ししゃ`;
}

function buildQuizTriggers(chapter) {
  const totalTriggers = chapter.id === 'bonus' || chapter.id === 'final' ? 3 : 2;
  const triggers = [];
  for (let i = 1; i <= totalTriggers; i += 1) {
    const idx = Math.max(1, Math.floor((chapter.narration.length * i) / (totalTriggers + 1)) - 1);
    triggers.push(idx);
  }
  return triggers;
}

function openStory(chapterId) {
  const chapter = AppState.chapters.find((item) => item.id === chapterId);
  if (!chapter) return;

  AppState.currentStory = {
    chapter,
    index: 0,
    quizTriggers: buildQuizTriggers(chapter),
    quizPointer: 0,
    waitingQuiz: false,
    quizResult: null,
    battle: {
      playerHp: 6,
      enemyHp: 6,
      maxPlayerHp: 6,
      maxEnemyHp: 6,
      timeLimit: 12,
      timeLeft: 12,
      timerId: null,
      lastEffect: '',
    },
  };
  renderStoryScene();
}

async function handleStoryAdvance() {
  const story = AppState.currentStory;
  if (!story) return;
  if (story.waitingQuiz || story.quizResult) return;

  const nextIndex = Math.min(story.index + 1, story.chapter.narration.length - 1);
  story.index = nextIndex;

  const trigger = story.quizTriggers[story.quizPointer];
  if (trigger !== undefined && nextIndex >= trigger) {
    story.waitingQuiz = true;
    story.quizPointer += 1;
    await fetchNextQuestion(getStoryDomain(story.chapter.id));
    startStoryTimer();
  }

  renderStoryScene();
}

function startStoryTimer() {
  const story = AppState.currentStory;
  if (!story?.battle) return;
  stopStoryTimer();
  story.battle.timeLeft = story.battle.timeLimit;

  story.battle.timerId = setInterval(() => {
    story.battle.timeLeft = Math.max(0, story.battle.timeLeft - 1);
    if (story.battle.timeLeft <= 0) {
      stopStoryTimer();
      handleStoryTimeout();
      return;
    }
    renderStoryScene();
  }, 1000);
}

function stopStoryTimer() {
  const story = AppState.currentStory;
  if (story?.battle?.timerId) {
    clearInterval(story.battle.timerId);
    story.battle.timerId = null;
  }
}

async function handleStoryTimeout() {
  const story = AppState.currentStory;
  if (!story?.battle) return;
  story.waitingQuiz = false;
  story.quizResult = true;
  story.battle.playerHp = Math.max(0, story.battle.playerHp - 2);
  story.battle.lastEffect = 'じかんぎれ! まものの こうげき!';
  AppState.lastResult = {
    isCorrect: false,
    correctIndex: AppState.currentQuestion?.correctIndex ?? 0,
    explanation: 'じかんぎれに きをつけよう。',
    score: 0,
    xpGained: 0,
    coinsGained: 0,
    levelUp: false,
  };
  renderStoryScene();
}

function renderStoryScene() {
  const app = document.getElementById('app');
  const story = AppState.currentStory;
  const chapter = story.chapter;
  const line = softenText(chapter.narration[story.index]);
  const isLast = story.index >= chapter.narration.length - 1;
  const speaker = softenText(getStorySpeaker(story.index, chapter));
  const nextHint = story.waitingQuiz || story.quizResult ? 'クイズに こたえよう' : 'クリックで つぎへ';
  const avatar = AppState.avatars.find((item) => item.id === AppState.profile?.avatarId);

  app.innerHTML = `
    <div class="min-h-screen bg-slate-950 p-8" style="background-image: linear-gradient(rgba(15,23,42,0.6), rgba(12,18,34,0.85)), url('${AssetUrls.keyVisual}'); background-size: cover; background-position: center;">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-4">
            <div class="glass rounded-3xl p-6">
              <h2 class="text-2xl font-bold">${softenText(`${chapter.title} ${chapter.subtitle}`)}</h2>
              <p class="text-sm text-slate-300">${softenText(chapter.category)}</p>
            </div>
            <div class="dq-dialog" onclick="handleStoryAdvance()">
              <p class="dq-speaker">${speaker}</p>
              <p class="text-lg text-slate-100 mt-2">${line || ''}</p>
              <p class="dq-next mt-2">${nextHint}</p>
            </div>
            ${story.waitingQuiz ? renderStoryQuizPanel() : ''}
            ${story.quizResult ? renderStoryResultPanel() : ''}
            <div class="flex gap-3 mt-2">
              ${isLast && !story.waitingQuiz && !story.quizResult ? `<button onclick="clearStory('${chapter.id}')" class="dq-button">章をクリア</button>` : ''}
              <button onclick="renderStorySelect()" class="dq-button-secondary">章選択へ</button>
            </div>
          </div>
          <div class="space-y-4">
            <div class="glass rounded-3xl p-6">
              <h3 class="font-semibold mb-4">登場人物</h3>
              <div class="grid grid-cols-2 gap-3 text-center text-xs text-slate-200">
                <div>
                  <img src="${avatar?.image || AssetUrls.avatarLineup}" alt="guardian" class="dq-portrait w-full h-28 object-cover" />
                  <p class="mt-2">しゅごしゃ</p>
                </div>
                <div>
                  <img src="${AssetUrls.monsters}" alt="enemy" class="dq-portrait w-full h-28 object-cover object-left" />
                  <p class="mt-2">てき せいりょく</p>
                </div>
              </div>
            </div>
            <div class="glass rounded-3xl p-6">
              <h3 class="font-semibold mb-4">敵勢力レポート</h3>
              <img src="${AssetUrls.monsters}" alt="monsters" class="rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStoryQuizPanel() {
  const question = AppState.currentQuestion;
  const battle = AppState.currentStory?.battle;
  const timeRatio = battle ? Math.round((battle.timeLeft / battle.timeLimit) * 100) : 0;
  return `
    <div class="dq-quiz" onclick="event.stopPropagation()">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-purple-200">${DomainLabels[question.domain]}</span>
        <span class="text-sm text-yellow-300">たたかい じかん: ${battle?.timeLeft ?? 0}びょう</span>
      </div>
      <div class="dq-hp mb-4">
        <div>
          <p class="text-xs text-slate-300">しゅごしゃ HP</p>
          <div class="dq-hp-bar"><span style="width:${battle ? (battle.playerHp / battle.maxPlayerHp) * 100 : 0}%"></span></div>
        </div>
        <div>
          <p class="text-xs text-slate-300">まもの HP</p>
          <div class="dq-hp-bar dq-hp-enemy"><span style="width:${battle ? (battle.enemyHp / battle.maxEnemyHp) * 100 : 0}%"></span></div>
        </div>
      </div>
      <div class="dq-timer">
        <span style="width:${timeRatio}%"></span>
      </div>
      <h3 class="text-xl font-semibold mb-4">${softenText(question.questionText)}</h3>
      <div class="space-y-3">
        ${question.choices
          .map(
            (choice, index) => `
          <button onclick="answerStoryQuestion(${index}); event.stopPropagation();" class="dq-choice">
            <span class="dq-command">${getCommandLabel(index)}</span>
            <span>${softenText(choice)}</span>
          </button>`
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderStoryResultPanel() {
  const result = AppState.lastResult;
  const question = AppState.currentQuestion;
  const battle = AppState.currentStory?.battle;
  const isDefeated = battle && battle.playerHp <= 0;
  return `
    <div class="dq-quiz" onclick="event.stopPropagation()">
      <h3 class="text-xl font-semibold mb-2">${result.isCorrect ? 'せいかい' : 'ちがうぞ'}</h3>
      <p class="text-slate-200 mb-3">こたえ: ${softenText(question.choices[result.correctIndex])}</p>
      ${battle?.lastEffect ? `<p class="text-yellow-200 mb-3">${battle.lastEffect}</p>` : ''}
      ${isDefeated ? '<p class="text-red-300 mb-3">しゅごしゃは たおれた...</p>' : ''}
      <div class="bg-slate-900/70 rounded-xl p-4">
        <h4 class="font-semibold mb-2">けんじゃの おしえ</h4>
        <p class="text-slate-200">${softenText(result.explanation)}</p>
      </div>
      <div class="flex gap-2 mt-4">
        <button onclick="closeStoryResult()" class="dq-button">${isDefeated ? 'もういちど たちあがる' : 'ぼうけんを つづける'}</button>
      </div>
    </div>
  `;
}

async function answerStoryQuestion(choiceIndex) {
  stopStoryTimer();
  await submitAnswer(choiceIndex);
  const story = AppState.currentStory;
  const battle = story?.battle;
  story.waitingQuiz = false;
  story.quizResult = true;

  if (battle) {
    const timeMs = Math.round(performance.now() - AppState.quizStartTime);
    const isFast = timeMs <= 4000;
    if (AppState.lastResult?.isCorrect) {
      const damage = isFast ? 3 : 2;
      battle.enemyHp = Math.max(0, battle.enemyHp - damage);
      battle.lastEffect = isFast ? 'かいしんの いちげき!' : 'こうげきが きまった!';
      if (battle.enemyHp <= 0) {
        battle.lastEffect += ' まものを たおした!';
      }
    } else {
      battle.playerHp = Math.max(0, battle.playerHp - 2);
      battle.lastEffect = 'まものの こうげき!';
    }
  }

  renderStoryScene();
}

function closeStoryResult() {
  const story = AppState.currentStory;
  const battle = story?.battle;
  story.quizResult = null;

  if (battle && battle.playerHp <= 0) {
    battle.playerHp = battle.maxPlayerHp;
    battle.enemyHp = battle.maxEnemyHp;
    battle.lastEffect = 'たちなおした!';
  }

  renderStoryScene();
}

async function clearStory(chapterId) {
  const response = await axios.post('/api/story/clear', {
    employeeId: AppState.employeeId,
    chapterId,
  });
  AppState.story = {
    currentChapter: response.data.currentChapter,
    clearedChapters: response.data.clearedChapters,
    isFinalBossDefeated: response.data.isFinalBossDefeated,
    isBonusUnlocked: response.data.isBonusUnlocked,
  };
  AppState.town = response.data.town || AppState.town;
  showToast('チャプターを クリアした!', 'success');
  renderStorySelect();
}

async function showRanking() {
  await fetchRanking();
  const app = document.getElementById('app');
  const ranking = AppState.ranking;

  app.innerHTML = `
    <div class="min-h-screen bg-slate-950 p-8">
      <div class="max-w-4xl mx-auto glass rounded-3xl p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">週次ランキング</h2>
          <button onclick="renderDashboard()" class="text-sm text-slate-300">戻る</button>
        </div>
        <div class="mb-6">
          <img src="${AssetUrls.uiAssets}" alt="ui assets" class="rounded-xl" />
        </div>
        <p class="text-xs text-slate-400 mb-4">週開始日: ${ranking.weekStart}</p>
        <div class="space-y-3">
          ${ranking.ranking
            .map(
              (item) => `
            <div class="flex items-center justify-between bg-slate-900/70 p-3 rounded-xl">
              <div class="flex items-center gap-3">
                <span class="text-lg font-bold">#${item.rank}</span>
                <div>
                  <p>${item.nickname}</p>
                  <p class="text-xs text-slate-400">Lv.${item.level} ${item.titlePrimary || ''}</p>
                </div>
              </div>
              <div class="text-yellow-300 font-semibold">${item.weeklyScore}</div>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </div>
  `;
}

async function renderAdmin() {
  await fetchAdminQuestions();
  const app = document.getElementById('app');
  const totalPages = Math.ceil(AppState.adminTotal / 10);

  app.innerHTML = `
    <div class="min-h-screen bg-slate-950 p-8">
      <div class="max-w-5xl mx-auto glass rounded-3xl p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">問題エディタ</h2>
          <button onclick="renderDashboard()" class="text-sm text-slate-300">戻る</button>
        </div>
        <div class="flex flex-wrap gap-2 mb-4">
          ${['', 'legal', 'finance', 'hr', 'labor', 'infosec', 'mixed']
            .map(
              (domain) => `
            <button onclick="setAdminDomain('${domain}')" class="px-3 py-1 rounded-lg ${
                AppState.adminDomain === domain ? 'bg-purple-500' : 'bg-slate-700'
              }">
              ${domain ? DomainLabels[domain] : '全領域'}
            </button>`
            )
            .join('')}
        </div>
        <div class="space-y-3">
          ${AppState.adminQuestions
            .map(
              (question) => `
            <div class="bg-slate-900/70 p-4 rounded-xl">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm text-slate-300">ID ${question.id} | ${DomainLabels[question.domain]} | Lv.${question.difficulty}</p>
                <button onclick="openEditQuestion(${question.id})" class="text-sm text-yellow-300">編集</button>
              </div>
              <p class="font-semibold">${question.questionText}</p>
              <p class="text-xs text-slate-400 mt-2">正解: ${question.choices[question.correctIndex]}</p>
            </div>`
            )
            .join('')}
        </div>
        <div class="flex items-center justify-between mt-6">
          <button onclick="prevAdminPage()" class="px-4 py-2 rounded-lg bg-slate-700" ${
            AppState.adminPage === 0 ? 'disabled' : ''
          }>前へ</button>
          <span class="text-sm text-slate-300">${AppState.adminPage + 1} / ${totalPages || 1}</span>
          <button onclick="nextAdminPage()" class="px-4 py-2 rounded-lg bg-slate-700" ${
            AppState.adminPage + 1 >= totalPages ? 'disabled' : ''
          }>次へ</button>
        </div>
      </div>
    </div>
  `;
}

function setAdminDomain(domain) {
  AppState.adminDomain = domain;
  AppState.adminPage = 0;
  renderAdmin();
}

function prevAdminPage() {
  AppState.adminPage = Math.max(0, AppState.adminPage - 1);
  renderAdmin();
}

function nextAdminPage() {
  AppState.adminPage += 1;
  renderAdmin();
}

function openEditQuestion(id) {
  const question = AppState.adminQuestions.find((item) => item.id === id);
  if (!question) return;
  const app = document.getElementById('app');
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl">
      <h3 class="text-lg font-semibold mb-4">問題編集 ID ${question.id}</h3>
      <label class="text-sm text-slate-300">問題文</label>
      <textarea id="editQuestion" class="w-full mt-1 p-2 rounded-lg text-slate-900" rows="3">${question.questionText}</textarea>
      <label class="text-sm text-slate-300 mt-3 block">選択肢（改行区切り）</label>
      <textarea id="editChoices" class="w-full mt-1 p-2 rounded-lg text-slate-900" rows="4">${question.choices.join('\n')}</textarea>
      <label class="text-sm text-slate-300 mt-3 block">正解インデックス（0始まり）</label>
      <input id="editCorrect" type="number" class="w-full mt-1 p-2 rounded-lg text-slate-900" value="${question.correctIndex}" />
      <label class="text-sm text-slate-300 mt-3 block">解説</label>
      <textarea id="editExplanation" class="w-full mt-1 p-2 rounded-lg text-slate-900" rows="3">${question.explanation}</textarea>
      <div class="flex gap-2 mt-4">
        <button onclick="saveQuestion(${question.id})" class="flex-1 bg-purple-500 py-2 rounded-lg">保存</button>
        <button onclick="closeModal()" class="flex-1 bg-slate-700 py-2 rounded-lg">キャンセル</button>
      </div>
    </div>
  `;
  app.appendChild(modal);
  window.closeModal = () => modal.remove();
}

async function saveQuestion(id) {
  const questionText = document.getElementById('editQuestion').value.trim();
  const choices = document.getElementById('editChoices').value.split('\n').map((c) => c.trim()).filter(Boolean);
  const correctIndex = Number(document.getElementById('editCorrect').value);
  const explanation = document.getElementById('editExplanation').value.trim();
  const question = AppState.adminQuestions.find((item) => item.id === id);

  if (!questionText || choices.length < 2 || Number.isNaN(correctIndex) || !explanation) {
    showToast('入力内容を確認してください', 'error');
    return;
  }

  await updateQuestion(id, {
    questionText,
    choices,
    correctIndex,
    explanation,
    difficulty: question.difficulty,
    domain: question.domain,
  });

  showToast('問題を更新しました', 'success');
  document.querySelector('.fixed.inset-0').remove();
  renderAdmin();
}

function logout() {
  localStorage.removeItem('employeeId');
  AppState.employeeId = null;
  AppState.profile = null;
  AppState.stats = null;
  renderLogin();
}

async function handleLogin() {
  const employeeId = document.getElementById('employeeId').value.trim();
  const nickname = document.getElementById('nickname').value.trim();
  const avatarInput = document.querySelector('input[name="avatar"]:checked');

  if (!employeeId || !nickname || !avatarInput) {
    showToast('従業員ID・ニックネーム・アバターを入力してください', 'error');
    return;
  }

  await login(employeeId, nickname, avatarInput.value);
  renderDashboard();
}

async function init() {
  await fetchAvatars();
  await fetchChapters();

  if (AppState.employeeId) {
    try {
      await fetchProfile();
      renderDashboard();
      return;
    } catch (error) {
      localStorage.removeItem('employeeId');
      AppState.employeeId = null;
    }
  }

  renderLogin();
}

init();

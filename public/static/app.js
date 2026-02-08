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
  adminEmployeeId: null,
  adminUsers: [],
  adminUserTotal: 0,
  adminUserPage: 0,
  adminView: 'questions',
  characterCatalog: [],
  encounteredCharacters: new Set(),
  history: [],
  practiceQuestion: null,
  practiceResult: null,
};

const AssetUrls = {
  keyVisual: '/static/assets/visuals/key-visual.png',
  worldMap: '/static/assets/visuals/world-map.png',
  monsters: '/static/assets/visuals/monster-compendium.png',
  uiAssets: '/static/assets/visuals/ui-assets.png',
  avatarLineup: '/static/assets/visuals/avatar-lineup.png',
};

const CharacterImages = {
  大賢者アウレリア: '大賢者アウレリア.png',
  乾いた村の長老: '乾いた村の長老.png',
  村の治療師: '村の治療師.png',
  旅の商人: '旅の商人.png',
  若き旅人: '若き旅人.png',
  市場の番人: '市場の番人.png',
  村の若者: '村の若者.png',
  砂漠の契約魔導師: '砂漠の契約魔導士.png',
  密約の仲介人: '密約の仲介人.png',
  幻影族の首領: '幻影族の首領.png',
  王国の会計官: '王国の会計官.png',
  監査役の騎士: '監査役の騎士.png',
  迷宮の主の手下: '迷宮の主の手下.png',
  予言者の商人: '預言者の商人.png',
  黄金の暴君: '黄金の暴君.png',
  若き騎士団員: '若き騎士団員.png',
  絶対君主の隊長: '絶対君主の隊長.png',
  森の妖精: '森の妖精.png',
  毒霧族の策士: '毒霧族の策士.png',
  新任の騎士: '新任の騎士.png',
  通報を担う騎士: '通報を担う騎士.png',
  霧の支配者: '霧の支配者.png',
  情報守護官: '情報守護官.png',
  なりすましの密偵: 'なりすましの密偵.png',
  酒場の主人: '酒場の主人.png',
  影の解析者: '影の解析者.png',
  影の参謀: '影の参謀.png',
  時計塔の職人: '時計塔の職人.png',
  現場監督: '現場監督.png',
  怠惰族の幻聴: '怠惰族の幻聴.png',
  時を奪う魔: '時を奪う魔.png',
  魔王コンプラ・ブレイカー: '魔王コンプラ・ブレイカー.png',
  五つの聖域の仲間: '五つの聖域の仲間.png',
};

const CharacterDescriptions = {
  大賢者アウレリア: '王国を導く大賢者。守護者に使命を授ける。',
  乾いた村の長老: '水不足の村を守る慎重な長老。',
  村の治療師: '村の健康を支える薬師。',
  旅の商人: '砂漠を巡る情報通の商人。',
  若き旅人: '純朴で契約に惑う旅人。',
  市場の番人: '市場秩序を守る衛兵。',
  村の若者: '村の未来を案じる若者。',
  砂漠の契約魔導師: '不当契約を操る砂漠の魔導師。',
  密約の仲介人: '闇取引を取り仕切る黒幕。',
  幻影族の首領: '虚偽表示を操る幻影族の首領。',
  王国の会計官: '実直で誠実な会計官。',
  監査役の騎士: '不正を見抜く監査役の騎士。',
  迷宮の主の手下: '公私混同に加担する手下。',
  予言者の商人: '未公表情報を利用する商人。',
  黄金の暴君: '富と権力に溺れる暴君。',
  若き騎士団員: '恐怖に沈黙する騎士団員。',
  絶対君主の隊長: '恐怖で統率する隊長。',
  森の妖精: '差別に傷つく森の住人。',
  毒霧族の策士: '仲間を貶める策略家。',
  新任の騎士: '偏見に苦しむ新人騎士。',
  通報を担う騎士: '内部通報の笛を守る騎士。',
  霧の支配者: '恐怖と沈黙を操る支配者。',
  情報守護官: '王国の機密を守る情報官。',
  なりすましの密偵: '偽装と詐欺で侵入する密偵。',
  酒場の主人: '不用意な発言の危険を伝える。',
  影の解析者: 'サイバー侵入を担う解析者。',
  影の参謀: '情報戦を指揮する参謀。',
  時計塔の職人: '過重労働で疲弊する職人。',
  現場監督: '現場を支える責任者。',
  怠惰族の幻聴: '休む者を責め立てる幻聴。',
  時を奪う魔: '時間搾取を象徴する魔物。',
  魔王コンプラ・ブレイカー: '成果至上主義を掲げる魔王。',
  五つの聖域の仲間: '各章で助ける仲間たちの象徴。',
};

function getCharacterImagePath(name) {
  const file = CharacterImages[name];
  return file ? `/static/assets/characters/${encodeURIComponent(file)}` : AssetUrls.avatarLineup;
}

function getEncounterStorageKey() {
  return AppState.employeeId ? `encounteredCharacters:${AppState.employeeId}` : 'encounteredCharacters:guest';
}

function loadEncounteredCharacters() {
  const key = getEncounterStorageKey();
  const stored = localStorage.getItem(key);
  AppState.encounteredCharacters = new Set(stored ? JSON.parse(stored) : []);
}

function saveEncounteredCharacters() {
  const key = getEncounterStorageKey();
  localStorage.setItem(key, JSON.stringify(Array.from(AppState.encounteredCharacters)));
}

function markEncounteredCharacter(name) {
  if (!name || name === getHeroName() || name === '語り部') return;
  if (!AppState.encounteredCharacters.has(name)) {
    AppState.encounteredCharacters.add(name);
    saveEncounteredCharacters();
  }
}

function parseEpisodeMeta(text) {
  if (!text) return null;
  const match = text.match(/第(\d+)話「([^」]+)」/);
  return match ? { no: match[1], title: match[2] } : null;
}

function buildEpisodeList(chapter) {
  const episodes = [];
  chapter.narration.forEach((line, index) => {
    const meta = parseEpisodeMeta(line.text || '');
    if (meta) {
      episodes.push({
        no: meta.no,
        title: meta.title,
        startIndex: index,
        endIndex: chapter.narration.length - 1,
      });
    }
  });
  if (episodes.length === 0) {
    return [
      {
        no: '1',
        title: chapter.subtitle,
        startIndex: 0,
        endIndex: chapter.narration.length - 1,
      },
    ];
  }
  episodes.forEach((episode, idx) => {
    const next = episodes[idx + 1];
    episode.endIndex = next ? next.startIndex - 1 : chapter.narration.length - 1;
  });
  return episodes;
}

function resolveEpisode(chapter, index) {
  const episodes = buildEpisodeList(chapter);
  return (
    episodes.find((episode) => index >= episode.startIndex && index <= episode.endIndex) || episodes[0]
  );
}

function getEpisodeIndex(episode, chapter) {
  const episodes = buildEpisodeList(chapter);
  return episodes.findIndex((item) => item.no === episode.no && item.startIndex === episode.startIndex);
}

function buildCharacterCatalog(chapters) {
  const entries = new Map();
  chapters.forEach((chapter) => {
    let currentEpisode = { no: '', title: '' };
    let firstEpisode = null;

    chapter.narration.forEach((line) => {
      const meta = parseEpisodeMeta(line.text || '');
      if (meta) {
        currentEpisode = meta;
        if (!firstEpisode) firstEpisode = meta;
      }
      const speaker = line.speakerName;
      if (speaker && speaker !== '語り部' && !entries.has(speaker)) {
        entries.set(speaker, {
          name: speaker,
          description: CharacterDescriptions[speaker] || `${chapter.title}で出会う人物。`,
          chapterId: chapter.id,
          chapterTitle: `${chapter.title} ${chapter.subtitle}`,
          episodeNo: currentEpisode.no,
          episodeTitle: currentEpisode.title,
        });
      }
    });

    const fallbackEpisode = firstEpisode || currentEpisode;
    [chapter.ally?.name, chapter.enemy?.name].filter(Boolean).forEach((name) => {
      if (!entries.has(name)) {
        entries.set(name, {
          name,
          description: CharacterDescriptions[name] || `${chapter.title}で出会う人物。`,
          chapterId: chapter.id,
          chapterTitle: `${chapter.title} ${chapter.subtitle}`,
          episodeNo: fallbackEpisode.no,
          episodeTitle: fallbackEpisode.title,
        });
      }
    });
  });
  return Array.from(entries.values());
}

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
  AppState.characterCatalog = buildCharacterCatalog(AppState.chapters);
}

function applyLoginResponse(data) {
  AppState.profile = data.profile;
  AppState.stats = data.stats;
  AppState.story = data.story;
  AppState.town = data.town;

  if (data.profile?.employeeId) {
    localStorage.setItem('employeeId', data.profile.employeeId);
    AppState.employeeId = data.profile.employeeId;
    loadEncounteredCharacters();
  }

  if (data.loginBonus?.coins) {
    showToast(`デイリーボーナス: +${data.loginBonus.coins}コイン / +${data.loginBonus.xp}XP`, 'success');
  }
}

async function login(employeeId) {
  const response = await axios.post('/api/auth/login', { employeeId });
  applyLoginResponse(response.data);
}

async function registerUser(employeeId, nickname, avatarId) {
  const response = await axios.post('/api/auth/register', { employeeId, nickname, avatarId });
  applyLoginResponse(response.data);
}

async function adminLogin(employeeId, password) {
  await axios.post('/api/admin/login', { employeeId, password });
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

async function fetchAdminUsers() {
  const response = await axios.get('/api/admin/users', {
    params: {
      adminEmployeeId: AppState.adminEmployeeId,
      limit: 10,
      offset: AppState.adminUserPage * 10,
    },
  });
  AppState.adminUsers = response.data.users;
  AppState.adminUserTotal = response.data.total;
}

async function updateQuestion(questionId, payload) {
  if (!AppState.adminEmployeeId) {
    throw new Error('admin login required');
  }
  await axios.put(`/api/admin/questions/${questionId}`, {
    ...payload,
    adminEmployeeId: AppState.adminEmployeeId,
  });
}

async function fetchNextQuestion(domain) {
  const response = await axios.get('/api/questions/next', {
    params: { employeeId: AppState.employeeId, domain },
  });
  AppState.currentQuestion = response.data.question;
  AppState.quizStartTime = performance.now();
}

async function fetchHistory() {
  const response = await axios.get('/api/questions/history', {
    params: { employeeId: AppState.employeeId, limit: 30 },
  });
  AppState.history = response.data.history || [];
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

async function updateNickname(nickname) {
  const response = await axios.post('/api/profile/nickname', {
    employeeId: AppState.employeeId,
    nickname,
  });
  AppState.profile = response.data.profile;
  AppState.stats = response.data.stats;
  AppState.story = response.data.story;
  AppState.town = response.data.town;
}

function renderLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="min-h-screen bg-hero flex items-center justify-center p-8" style="background-image: linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.85)), url('${AssetUrls.keyVisual}'); background-size: cover; background-position: center;">
      <div class="max-w-4xl w-full glass rounded-3xl p-10 shadow-2xl fade-in">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h1 class="text-4xl font-bold">Compliance Quest</h1>
            <p class="text-purple-200 mt-2">エシカル王国の守護者</p>
            <p class="text-sm text-slate-300 mt-4">長期運用型コンプライアンスRPG</p>
            <img src="${AssetUrls.avatarLineup}" alt="avatar lineup" class="mt-6 rounded-xl shadow-xl" />
          </div>
          <div>
            <p class="text-sm text-slate-300">従業員IDでログインしてください</p>
            <label class="block text-sm text-slate-200 mt-4 mb-2">従業員ID</label>
            <input id="employeeId" type="text" class="w-full px-4 py-3 rounded-lg text-slate-900" placeholder="例: EMP-1024" />
            <button onclick="handleLogin()" class="mt-6 w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold">
              ログイン
            </button>
            <div class="mt-4 flex flex-col sm:flex-row gap-2">
              <button onclick="renderRegister()" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg">新規登録</button>
              <button onclick="renderAdminLogin()" class="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg">管理者画面</button>
            </div>
          </div>
        </div>
        ${renderAdminFab()}
      </div>
    </div>
  `;
}

function renderRegister() {
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
    <div class="min-h-screen bg-hero flex items-center justify-center p-8" style="background-image: linear-gradient(rgba(15,23,42,0.9), rgba(12,18,34,0.92)), url('${AssetUrls.keyVisual}'); background-size: cover; background-position: center;">
      <div class="max-w-4xl w-full glass rounded-3xl p-10 shadow-2xl fade-in">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 class="text-3xl font-bold">新規登録</h2>
            <p class="text-sm text-slate-300 mt-2">従業員IDとニックネームで守護者登録</p>
            <img src="${AssetUrls.keyVisual}" alt="key visual" class="mt-6 rounded-xl shadow-xl" />
          </div>
          <div>
            <label class="block text-sm text-slate-200 mt-2 mb-2">従業員ID</label>
            <input id="registerEmployeeId" type="text" class="w-full px-4 py-3 rounded-lg text-slate-900" placeholder="例: EMP-1024" />
            <label class="block text-sm text-slate-200 mt-4 mb-2">ニックネーム</label>
            <input id="registerNickname" type="text" class="w-full px-4 py-3 rounded-lg text-slate-900" placeholder="守護者名" />
            <p class="text-sm text-slate-200 mt-4">アバター (任意)</p>
            <div class="grid grid-cols-3 gap-3 mt-2">${avatarOptions}</div>
            <button onclick="handleRegister()" class="mt-6 w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold">
              登録する
            </button>
            <button onclick="renderLogin()" class="mt-3 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg">戻る</button>
          </div>
        </div>
        ${renderAdminFab()}
      </div>
    </div>
  `;
}

function renderAdminLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="min-h-screen bg-hero flex items-center justify-center p-8" style="background-image: linear-gradient(rgba(15,23,42,0.9), rgba(12,18,34,0.92)), url('${AssetUrls.keyVisual}'); background-size: cover; background-position: center;">
      <div class="max-w-3xl w-full glass rounded-3xl p-10 shadow-2xl fade-in">
        <h2 class="text-3xl font-bold">管理者ログイン</h2>
        <p class="text-sm text-slate-300 mt-2">従業員IDと管理者パスワードを入力</p>
        <label class="block text-sm text-slate-200 mt-6 mb-2">従業員ID</label>
        <input id="adminEmployeeId" type="text" class="w-full px-4 py-3 rounded-lg text-slate-900" placeholder="例: EMP-0001" />
        <label class="block text-sm text-slate-200 mt-4 mb-2">管理者パスワード</label>
        <input id="adminPassword" type="password" class="w-full px-4 py-3 rounded-lg text-slate-900" placeholder="acrovekanri" />
        <button onclick="handleAdminLogin()" class="mt-6 w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold">
          管理画面へ
        </button>
        <button onclick="renderLogin()" class="mt-3 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg">戻る</button>
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
            <h3 class="font-semibold mb-4">こんしゅうの コイン</h3>
            <p class="text-3xl font-bold text-yellow-300">${stats.weeklyCoins}</p>
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
          <div class="glass rounded-2xl p-6 dq-story-card">
            <h3 class="font-semibold mb-2">ものがたり しんこう</h3>
            <p class="text-sm text-slate-200">いま: ${softenText(getChapterTitle(AppState.story.currentChapter))}</p>
            <p class="text-xs text-slate-400">クリア すう: ${AppState.story.clearedChapters.length}</p>
            <button onclick="renderStorySelect()" class="mt-4 w-full dq-story-cta">ものがたりへ</button>
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

        <div class="glass rounded-2xl p-6">
          <h3 class="font-semibold mb-3">いままでの はなし</h3>
          <p class="text-sm text-slate-200">${softenText(getStoryRecap().title)}</p>
          <p class="text-sm text-slate-300 mt-2">${softenText(getStoryRecap().summary)}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <button onclick="renderStorySelect()" class="bg-purple-500/90 hover:bg-purple-500 text-white py-4 rounded-xl font-bold">
            ものがたり
          </button>
          <button onclick="renderCharacterCompendium()" class="bg-slate-800 text-white py-4 rounded-xl font-bold">
            キャラ図鑑
          </button>
          <button onclick="renderHistory()" class="bg-slate-800 text-white py-4 rounded-xl font-bold">
            たたかいのれきし
          </button>
          <button onclick="showRanking()" class="bg-slate-800 text-white py-4 rounded-xl font-bold">
            週次ランキング
          </button>
          <button onclick="renderSettings()" class="bg-slate-800 text-white py-4 rounded-xl font-bold">
            せってい
          </button>
          <button onclick="logout()" class="bg-slate-600 text-white py-4 rounded-xl font-bold">
            ログアウト
          </button>
        </div>
        ${renderAdminFab()}
      </div>
    </div>
  `;
}

function getChapterTitle(chapterId) {
  const chapter = AppState.chapters.find((item) => item.id === chapterId);
  return chapter ? `${chapter.title} ${chapter.subtitle}` : 'プロローグ';
}

function getStoryRecap() {
  const currentChapterId = AppState.story?.currentChapter;
  const cleared = AppState.story?.clearedChapters || [];
  const lastClearedId = cleared.length ? cleared[cleared.length - 1] : currentChapterId;
  const chapter = AppState.chapters.find((item) => item.id === (lastClearedId || currentChapterId));
  if (!chapter) {
    return { title: 'プロローグ', summary: '旅のはじまり。' };
  }
  return {
    title: `${chapter.title} ${chapter.subtitle}`,
    summary: chapter.scenario || chapter.playerRole || '物語が進行中。',
  };
}

function renderStorySelect() {
  const app = document.getElementById('app');
  const progress = AppState.story;
  const clearedSet = new Set(progress.clearedChapters);
  const unlockedOrder = progress.clearedChapters.length;

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
              const isCleared = clearedSet.has(chapter.id);
              const baseLocked = chapter.order > unlockedOrder;
              const locked = !isCleared && (chapter.id === 'bonus'
                ? !progress.isBonusUnlocked
                : chapter.id === 'final'
                ? progress.clearedChapters.length < 5
                : baseLocked);
              const statusBadge = isCleared
                ? '<span class="dq-status dq-status-clear">CLEAR</span>'
                : locked
                ? '<span class="dq-status dq-status-lock">LOCK</span>'
                : '';
              return `
              <div class="bg-slate-900/70 p-4 rounded-xl ${locked ? 'opacity-50' : 'cursor-pointer'}" ${
                locked ? '' : `onclick="renderEpisodeSelect('${chapter.id}')"`
              }>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold">${softenText(`${chapter.title} ${chapter.subtitle}`)}</h3>
                  ${statusBadge}
                </div>
                <p class="text-xs text-slate-400">${softenText(chapter.category)}</p>
              </div>`;
            })
            .join('')}
        </div>
        ${renderAdminFab()}
      </div>
    </div>
  `;
}

function renderEpisodeSelect(chapterId) {
  const app = document.getElementById('app');
  const chapter = AppState.chapters.find((item) => item.id === chapterId);
  if (!chapter) return;
  const episodes = buildEpisodeList(chapter);

  app.innerHTML = `
    <div class="min-h-screen bg-slate-950 p-8" style="background-image: linear-gradient(rgba(15,23,42,0.92), rgba(15,23,42,0.92)), url('${AssetUrls.worldMap}'); background-size: cover; background-position: center;">
      <div class="max-w-5xl mx-auto glass rounded-3xl p-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold">${softenText(`${chapter.title} ${chapter.subtitle}`)}</h2>
            <p class="text-sm text-slate-300">${softenText(chapter.category)}</p>
          </div>
          <button onclick="renderStorySelect()" class="text-sm text-slate-300">戻る</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${episodes
            .map((episode) => `
              <div class="bg-slate-900/70 p-4 rounded-xl cursor-pointer" onclick="openStory('${chapter.id}', ${episode.startIndex})">
                <h3 class="font-semibold">第${episode.no}話「${softenText(episode.title)}」</h3>
                <p class="text-xs text-slate-400">${softenText(chapter.stage)}</p>
              </div>
            `)
            .join('')}
        </div>
        ${renderAdminFab()}
      </div>
    </div>
  `;
}

function renderCharacterCompendium() {
  const app = document.getElementById('app');
  const entries = AppState.characterCatalog || [];
  const encountered = AppState.encounteredCharacters || new Set();

  app.innerHTML = `
    <div class="min-h-screen bg-slate-950 p-8" style="background-image: linear-gradient(rgba(15,23,42,0.92), rgba(15,23,42,0.92)), url('${AssetUrls.uiAssets}'); background-size: cover; background-position: center;">
      <div class="max-w-6xl mx-auto glass rounded-3xl p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">キャラ図鑑</h2>
          <button onclick="renderDashboard()" class="text-sm text-slate-300">戻る</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${entries
            .map((entry) => {
              const unlocked = encountered.has(entry.name);
              const image = getCharacterImagePath(entry.name);
              const episodeLabel = entry.episodeNo
                ? `第${entry.episodeNo}話「${entry.episodeTitle}」`
                : '';
              const encounterLabel = entry.chapterTitle
                ? `${entry.chapterTitle} ${episodeLabel}`.trim()
                : '';
              return `
                <div class="dq-compendium-card ${unlocked ? '' : 'dq-compendium-locked'}">
                  <img src="${image}" alt="${entry.name}" />
                  <div>
                    <h3 class="font-semibold">${entry.name}</h3>
                    <p class="dq-compendium-desc text-sm mt-1">${unlocked ? entry.description : 'まだ出会っていない。'}</p>
                    <p class="dq-compendium-meta text-xs mt-2">${unlocked ? `出会い: ${encounterLabel}` : ''}</p>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
        ${renderAdminFab()}
      </div>
    </div>
  `;
}

async function renderHistory() {
  await fetchHistory();
  const app = document.getElementById('app');
  const history = AppState.history || [];

  app.innerHTML = `
    <div class="min-h-screen bg-slate-950 p-8">
      <div class="max-w-5xl mx-auto glass rounded-3xl p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">たたかいのれきし</h2>
          <button onclick="renderDashboard()" class="text-sm text-slate-300">戻る</button>
        </div>
        <div class="space-y-3">
          ${history
            .map((entry) => {
              const question = entry.question;
              return `
                <div class="bg-slate-900/70 p-4 rounded-xl">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-xs text-slate-400">${DomainLabels[question.domain] || ''} Lv.${question.difficulty}</p>
                      <p class="font-semibold mt-1">${softenText(question.questionText)}</p>
                      <p class="text-xs text-slate-400 mt-1">${entry.isCorrect ? 'せいかい' : 'ちがうぞ'} / ${new Date(entry.createdAt).toLocaleString('ja-JP')}</p>
                    </div>
                    <button onclick="startPractice(${entry.questionId})" class="dq-button">もういちど</button>
                  </div>
                </div>
              `;
            })
            .join('')}
          ${history.length === 0 ? '<p class="text-sm text-slate-300">まだ たたかいの れきしが ありません。</p>' : ''}
        </div>
        ${renderAdminFab()}
      </div>
    </div>
  `;
}

function startPractice(questionId) {
  const entry = (AppState.history || []).find((item) => item.questionId === questionId);
  if (!entry) return;
  AppState.practiceQuestion = entry.question;
  AppState.practiceResult = null;
  renderPracticeQuiz();
}

function renderPracticeQuiz() {
  const app = document.getElementById('app');
  const question = AppState.practiceQuestion;
  if (!question) return;

  app.innerHTML = `
    <div class="min-h-screen bg-slate-950 p-8">
      <div class="max-w-4xl mx-auto">
        <div class="dq-quiz">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-purple-200">${DomainLabels[question.domain]}</span>
            <button onclick="renderHistory()" class="text-sm text-slate-300">戻る</button>
          </div>
          <h3 class="text-xl font-semibold mb-4">${softenText(question.questionText)}</h3>
          <div class="space-y-3">
            ${question.choices
              .map(
                (choice, index) => `
              <button onclick="answerPractice(${index})" class="dq-choice">
                <span class="dq-command">${getCommandLabel(index)}</span>
                <span>${softenText(choice)}</span>
              </button>`
              )
              .join('')}
          </div>
          ${AppState.practiceResult ? renderPracticeResultPanel() : ''}
        </div>
        ${renderAdminFab()}
      </div>
    </div>
  `;
}

function answerPractice(choiceIndex) {
  const question = AppState.practiceQuestion;
  if (!question) return;
  const isCorrect = question.correctIndex === choiceIndex;
  AppState.practiceResult = {
    isCorrect,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
  };
  renderPracticeQuiz();
}

function renderPracticeResultPanel() {
  const result = AppState.practiceResult;
  const question = AppState.practiceQuestion;
  if (!result || !question) return '';
  return `
    <div class="bg-slate-900/70 rounded-xl p-4 mt-4">
      <p class="font-semibold">${result.isCorrect ? 'せいかい' : 'ちがうぞ'}</p>
      <p class="text-sm text-slate-200 mt-1">こたえ: ${softenText(question.choices[result.correctIndex])}</p>
      <p class="text-sm text-slate-200 mt-2">${softenText(result.explanation)}</p>
    </div>
  `;
}

function renderSettings() {
  const app = document.getElementById('app');
  const nickname = AppState.profile?.nickname || '';

  app.innerHTML = `
    <div class="min-h-screen bg-slate-950 p-8">
      <div class="max-w-3xl mx-auto glass rounded-3xl p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">せってい</h2>
          <button onclick="renderDashboard()" class="text-sm text-slate-300">戻る</button>
        </div>
        <label class="block text-sm text-slate-200">ニックネーム</label>
        <input id="settingsNickname" type="text" class="w-full px-4 py-3 rounded-lg text-slate-900 mt-2" value="${nickname}" />
        <button onclick="handleUpdateNickname()" class="mt-4 dq-button">変更を保存</button>
        <p class="text-xs text-slate-400 mt-3">従業員IDの変更は管理画面からのみ行えます。</p>
        ${renderAdminFab()}
      </div>
    </div>
  `;
}

async function handleUpdateNickname() {
  const nickname = document.getElementById('settingsNickname').value.trim();
  if (!nickname) {
    showToast('ニックネームを入力してください', 'error');
    return;
  }
  await updateNickname(nickname);
  showToast('ニックネームを更新しました', 'success');
  renderDashboard();
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
  if (chapter.quizTriggers && chapter.quizTriggers.length) {
    return chapter.quizTriggers;
  }

  const totalTriggers = chapter.id === 'bonus' || chapter.id === 'final' ? 3 : 2;
  const triggers = [];
  for (let i = 1; i <= totalTriggers; i += 1) {
    const idx = Math.max(1, Math.floor((chapter.narration.length * i) / (totalTriggers + 1)) - 1);
    triggers.push(idx);
  }
  return triggers;
}

function getQuizPointerForIndex(triggers, index) {
  return triggers.filter((trigger) => trigger <= index).length;
}

function openStory(chapterId, startIndex = 0) {
  const chapter = AppState.chapters.find((item) => item.id === chapterId);
  if (!chapter) return;
  const episodes = buildEpisodeList(chapter);
  const episode = resolveEpisode(chapter, startIndex);

  AppState.currentStory = {
    chapter,
    index: episode.startIndex,
    quizTriggers: buildQuizTriggers(chapter),
    quizPointer: getQuizPointerForIndex(buildQuizTriggers(chapter), episode.startIndex),
    pendingQuiz: false,
    waitingQuiz: false,
    quizResult: null,
    episode,
    episodes,
    episodeEndReached: false,
    battle: {
      playerHp: 6,
      enemyHp: 6,
      maxPlayerHp: 6,
      maxEnemyHp: 6,
      timeLimit: 60,
      timeLeft: 60,
      timerId: null,
      lastEffect: '',
    },
  };
  renderStoryScene();
}

async function handleStoryAdvance() {
  const story = AppState.currentStory;
  if (!story) return;
  if (story.pendingQuiz || story.waitingQuiz || story.quizResult) return;

  if (story.episode && story.index >= story.episode.endIndex && story.battle?.enemyHp <= 0) {
    story.episodeEndReached = true;
    renderStoryScene();
    return;
  }

  const nextIndex = Math.min(story.index + 1, story.chapter.narration.length - 1);
  story.index = nextIndex;
  story.episode = resolveEpisode(story.chapter, story.index);

  const trigger = story.quizTriggers[story.quizPointer];
  if (trigger !== undefined && nextIndex >= trigger) {
    story.pendingQuiz = true;
    story.quizPointer += 1;
  }

  renderStoryScene();
}

async function startStoryQuiz() {
  const story = AppState.currentStory;
  if (!story) return;
  story.pendingQuiz = false;
  story.waitingQuiz = true;
  story.episodeEndReached = false;
  await fetchNextQuestion(getStoryDomain(story.chapter.id));
  startStoryTimer();
  renderStoryScene();
}

function renderStoryIntroPanel() {
  const story = AppState.currentStory;
  if (!story) return '';
  const chapter = story.chapter;
  const enemy = getChapterEnemy(chapter);
  return `
    <div class="dq-quiz" onclick="event.stopPropagation()">
      <div class="flex items-center gap-4">
        <img src="${enemy.image}" alt="${enemy.name}" class="dq-portrait w-28 h-28 object-cover" />
        <div>
          <p class="text-sm text-slate-300">${enemy.name}</p>
          <p class="text-xs text-slate-400">まものが あらわれた! たたかいの じゅんびを しよう。</p>
        </div>
      </div>
      <button onclick="startStoryQuiz()" class="dq-button mt-4">たたかいを はじめる</button>
    </div>
  `;
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
  story.pendingQuiz = false;
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

function getHeroName() {
  return AppState.profile?.nickname || '守護者';
}

function getChapterAlly(chapter) {
  return {
    name: chapter.ally?.name || '仲間',
    image: chapter.ally?.image || AssetUrls.avatarLineup,
  };
}

function getChapterEnemy(chapter) {
  return {
    name: chapter.enemy?.name || chapter.monster || 'まもの',
    image: chapter.enemy?.image || AssetUrls.monsters,
  };
}

function resolveStoryLine(line, chapter, heroName, heroPortrait) {
  const ally = getChapterAlly(chapter);
  const enemy = getChapterEnemy(chapter);
  const role = line?.role || 'narrator';
  const text = softenText((line?.text || '').replace(/\{hero\}/g, heroName));
  let speakerName = line?.speakerName;
  let portrait = line?.portrait;
  if (role === 'hero') {
    speakerName = heroName;
    portrait = heroPortrait;
  } else if (role === 'ally') {
    speakerName = speakerName || ally.name;
    portrait = portrait || ally.image;
  } else if (role === 'enemy') {
    speakerName = speakerName || enemy.name;
    portrait = portrait || enemy.image;
  } else {
    speakerName = speakerName || '語り部';
    portrait = portrait || AssetUrls.avatarLineup;
  }
  const partnerRole = line?.partnerRole || (role === 'hero' ? 'ally' : 'hero');
  return { text, speakerName, portrait, role, partnerRole };
}

function resolveRoleMeta(role, chapter, heroName, heroPortrait) {
  const ally = getChapterAlly(chapter);
  const enemy = getChapterEnemy(chapter);
  if (role === 'hero') {
    return { name: heroName, image: heroPortrait, role };
  }
  if (role === 'enemy') {
    return { name: enemy.name, image: enemy.image, role };
  }
  return { name: ally.name, image: ally.image, role: 'ally' };
}

function renderStoryScene() {
  const app = document.getElementById('app');
  const story = AppState.currentStory;
  const chapter = story.chapter;
  const avatar = AppState.avatars.find((item) => item.id === AppState.profile?.avatarId);
  const heroName = getHeroName();
  const heroPortrait = avatar?.image || AssetUrls.avatarLineup;
  const ally = getChapterAlly(chapter);
  const enemy = getChapterEnemy(chapter);
  const lineMeta = resolveStoryLine(chapter.narration[story.index], chapter, heroName, heroPortrait);
  const line = lineMeta.text;
  const isLast = story.index >= chapter.narration.length - 1;
  const speaker = softenText(lineMeta.speakerName);
  const episode = story.episode || resolveEpisode(chapter, story.index);
  story.episode = episode;
  const episodeLabel = episode ? `第${episode.no}話「${episode.title}」` : '';
  const showEpisodeChoice = Boolean(story.episodeEndReached && story.battle?.enemyHp <= 0);
  const nextHint = story.pendingQuiz
    ? 'たたかい じゅんび'
    : story.waitingQuiz || story.quizResult
    ? 'クイズに こたえよう'
    : 'クリックで つぎへ';
  const leftMeta = resolveRoleMeta('hero', chapter, heroName, heroPortrait);
  const rightMeta = resolveRoleMeta(lineMeta.partnerRole === 'enemy' ? 'enemy' : 'ally', chapter, heroName, heroPortrait);
  const activeRole = lineMeta.role;

  markEncounteredCharacter(leftMeta.name);
  markEncounteredCharacter(rightMeta.name);

  app.innerHTML = `
    <div class="min-h-screen bg-slate-950 p-8 dq-story-layout" style="background-image: linear-gradient(rgba(15,23,42,0.6), rgba(12,18,34,0.85)), url('${AssetUrls.keyVisual}'); background-size: cover; background-position: center;">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-4">
            <div class="glass rounded-3xl p-6">
              <h2 class="text-2xl font-bold">${softenText(`${chapter.title} ${chapter.subtitle}`)}</h2>
              <p class="text-sm text-slate-300">${softenText(chapter.category)}</p>
              <p class="text-sm text-purple-200 mt-2">${softenText(episodeLabel)}</p>
            </div>
            <div class="dq-dialog" onclick="handleStoryAdvance()">
              <div class="dq-dialog-portraits">
                <div class="dq-dialog-portrait ${activeRole === leftMeta.role ? 'active' : ''}">
                  <img src="${leftMeta.image}" alt="${leftMeta.name}" />
                  <span>${softenText(leftMeta.name)}</span>
                </div>
                <div class="dq-dialog-portrait ${activeRole === rightMeta.role ? 'active' : ''}">
                  <img src="${rightMeta.image}" alt="${rightMeta.name}" />
                  <span>${softenText(rightMeta.name)}</span>
                </div>
              </div>
              <p class="dq-speaker">${speaker}</p>
              <p class="text-lg text-slate-100 mt-2">${line || ''}</p>
              <p class="dq-next mt-2">${nextHint}</p>
            </div>
            ${story.pendingQuiz ? renderStoryIntroPanel() : ''}
            ${story.waitingQuiz ? renderStoryQuizPanel() : ''}
            ${story.quizResult ? renderStoryResultPanel() : ''}
            ${showEpisodeChoice ? renderEpisodeChoicePanel() : ''}
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
                  <img src="${heroPortrait}" alt="guardian" class="dq-portrait w-full h-28 object-cover" />
                  <p class="mt-2">${softenText(heroName)}</p>
                </div>
                <div>
                  <img src="${enemy.image}" alt="enemy" class="dq-portrait w-full h-28 object-cover object-left" />
                  <p class="mt-2">${softenText(enemy.name)}</p>
                </div>
              </div>
            </div>
            <div class="glass rounded-3xl p-6">
              <h3 class="font-semibold mb-4">敵勢力レポート</h3>
              <img src="${enemy.image}" alt="monsters" class="rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
        ${renderAdminFab()}
      </div>
    </div>
  `;
}

function renderEpisodeChoicePanel() {
  const story = AppState.currentStory;
  if (!story?.episode) return '';
  const episodes = story.episodes || buildEpisodeList(story.chapter);
  const currentIndex = getEpisodeIndex(story.episode, story.chapter);
  const hasNext = currentIndex >= 0 && currentIndex < episodes.length - 1;
  return `
    <div class="dq-quiz" onclick="event.stopPropagation()">
      <h4 class="font-semibold mb-2">つぎは どうする?</h4>
      <div class="flex flex-wrap gap-2">
        ${hasNext ? '<button onclick="goToNextEpisode()" class="dq-button">つぎの はなしへ</button>' : ''}
        <button onclick="renderDashboard()" class="dq-button-secondary">ホームへ もどる</button>
      </div>
    </div>
  `;
}

function goToNextEpisode() {
  const story = AppState.currentStory;
  if (!story?.episode) return;
  const episodes = story.episodes || buildEpisodeList(story.chapter);
  const currentIndex = getEpisodeIndex(story.episode, story.chapter);
  const nextEpisode = episodes[currentIndex + 1];
  if (!nextEpisode) {
    renderDashboard();
    return;
  }
  story.index = nextEpisode.startIndex;
  story.episode = nextEpisode;
  story.episodeEndReached = false;
  story.pendingQuiz = false;
  story.waitingQuiz = false;
  story.quizResult = null;
  story.quizPointer = getQuizPointerForIndex(story.quizTriggers, nextEpisode.startIndex);
  if (story.battle) {
    story.battle.enemyHp = story.battle.maxEnemyHp;
    story.battle.playerHp = story.battle.maxPlayerHp;
    story.battle.lastEffect = '';
  }
  renderStoryScene();
}
function renderStoryQuizPanel() {
  const question = AppState.currentQuestion;
  const battle = AppState.currentStory?.battle;
  const chapter = AppState.currentStory?.chapter;
  const enemy = chapter ? getChapterEnemy(chapter) : { name: 'まもの', image: AssetUrls.monsters };
  const timeRatio = battle ? Math.round((battle.timeLeft / battle.timeLimit) * 100) : 0;
  return `
    <div class="dq-quiz" onclick="event.stopPropagation()">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-purple-200">${DomainLabels[question.domain]}</span>
        <span class="text-sm text-yellow-300">たたかい じかん: ${battle?.timeLeft ?? 0}びょう</span>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <img src="${enemy.image}" alt="${enemy.name}" class="dq-portrait w-24 h-24 object-cover" />
        <div>
          <p class="text-sm text-slate-200">${softenText(enemy.name)}</p>
          <p class="text-xs text-slate-400">Lv.${question.difficulty} まもの</p>
        </div>
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
  story.pendingQuiz = false;
  story.waitingQuiz = false;
  story.quizResult = true;

  if (battle) {
    const timeMs = Math.round(performance.now() - AppState.quizStartTime);
    const isFast = timeMs <= 30000;
    const difficulty = AppState.currentQuestion?.difficulty || 1;
    const clearedCount = AppState.story?.clearedChapters?.length || 0;
    const storyBoost = Math.min(1, Math.floor(clearedCount / 2));
    if (AppState.lastResult?.isCorrect) {
      const baseDamage = 2 + Math.floor((difficulty - 1) / 2);
      const damage = Math.min(4, baseDamage + (isFast ? 1 : 0) + storyBoost);
      battle.enemyHp = Math.max(0, battle.enemyHp - damage);
      battle.lastEffect = isFast ? 'はやわざが きまった!' : 'こうげきが きまった!';
      if (battle.enemyHp <= 0) {
        battle.lastEffect += ' まものを たおした!';
      }
    } else {
      const penalty = 2 + Math.floor((difficulty - 1) / 4);
      battle.playerHp = Math.max(0, battle.playerHp - penalty);
      battle.lastEffect = penalty > 2 ? 'つよい こうげき!' : 'まものの こうげき!';
    }
  }

  renderStoryScene();
}

function closeStoryResult() {
  const story = AppState.currentStory;
  const battle = story?.battle;
  story.quizResult = null;
  story.episodeEndReached = false;

  if (battle && battle.playerHp <= 0) {
    battle.playerHp = battle.maxPlayerHp;
    battle.enemyHp = battle.maxEnemyHp;
    battle.lastEffect = 'たちなおした!';
    story.index = 0;
    story.quizPointer = 0;
    story.pendingQuiz = false;
    story.waitingQuiz = false;
    story.episode = resolveEpisode(story.chapter, story.index);
    story.episodeEndReached = false;
    showToast('ダンジョンの ふりだしに もどった', 'error');
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
          <h2 class="text-2xl font-bold">週次ランキング（週間コイン）</h2>
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
              <div class="text-yellow-300 font-semibold">${item.weeklyCoins}枚</div>
            </div>`
            )
            .join('')}
        </div>
        ${renderAdminFab()}
      </div>
    </div>
  `;
}

function renderAdminFab() {
  return `
    <button onclick="renderAdmin()" class="dq-admin-fab" title="管理画面">
      <i class="fa-solid fa-gear"></i>
    </button>
  `;
}

async function renderAdmin() {
  if (!AppState.adminEmployeeId) {
    renderAdminLogin();
    return;
  }

  const isUsersView = AppState.adminView === 'users';
  if (isUsersView) {
    await fetchAdminUsers();
  } else {
    await fetchAdminQuestions();
  }

  const app = document.getElementById('app');
  const totalPages = isUsersView
    ? Math.ceil(AppState.adminUserTotal / 10)
    : Math.ceil(AppState.adminTotal / 10);

  const questionFilters = `
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
  `;

  const questionsPanel = `
    ${questionFilters}
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
  `;

  const usersPanel = `
    <div class="space-y-3">
      ${AppState.adminUsers
        .map(
          (user) => `
        <div class="bg-slate-900/70 p-4 rounded-xl">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p class="font-semibold">${user.nickname} <span class="text-xs text-slate-400">(${user.employeeId})</span></p>
              <p class="text-xs text-slate-400">Lv.${user.level} / XP ${user.xp} / コイン ${user.coins}</p>
              <p class="text-xs text-slate-400">進行: ${softenText(getChapterTitle(user.currentChapter))} / クリア ${user.clearedCount}</p>
            </div>
            <div class="text-xs text-slate-300">
              <p>週間コイン: ${user.weeklyCoins}</p>
              <p>最終ログイン: ${user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('ja-JP') : '記録なし'}</p>
            </div>
          </div>
        </div>`
        )
        .join('')}
    </div>
  `;

  app.innerHTML = `
    <div class="min-h-screen bg-slate-950 p-8">
      <div class="max-w-5xl mx-auto glass rounded-3xl p-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold">管理ダッシュボード</h2>
            <p class="text-xs text-slate-400">管理者: ${AppState.adminEmployeeId}</p>
          </div>
          <button onclick="renderDashboard()" class="text-sm text-slate-300">戻る</button>
        </div>
        <div class="flex gap-2 mb-6">
          <button onclick="setAdminView('questions')" class="px-4 py-2 rounded-lg ${
            AppState.adminView === 'questions' ? 'bg-purple-500' : 'bg-slate-700'
          }">問題管理</button>
          <button onclick="setAdminView('users')" class="px-4 py-2 rounded-lg ${
            AppState.adminView === 'users' ? 'bg-purple-500' : 'bg-slate-700'
          }">ユーザー管理</button>
        </div>
        ${isUsersView ? usersPanel : questionsPanel}
        <div class="flex items-center justify-between mt-6">
          <button onclick="${isUsersView ? 'prevAdminUserPage()' : 'prevAdminPage()'}" class="px-4 py-2 rounded-lg bg-slate-700" ${
            (isUsersView ? AppState.adminUserPage : AppState.adminPage) === 0 ? 'disabled' : ''
          }>前へ</button>
          <span class="text-sm text-slate-300">${(isUsersView ? AppState.adminUserPage : AppState.adminPage) + 1} / ${totalPages || 1}</span>
          <button onclick="${isUsersView ? 'nextAdminUserPage()' : 'nextAdminPage()'}" class="px-4 py-2 rounded-lg bg-slate-700" ${
            (isUsersView ? AppState.adminUserPage + 1 : AppState.adminPage + 1) >= totalPages ? 'disabled' : ''
          }>次へ</button>
        </div>
        ${renderAdminFab()}
      </div>
    </div>
  `;
}

function setAdminView(view) {
  AppState.adminView = view;
  if (view === 'users') {
    AppState.adminUserPage = 0;
  } else {
    AppState.adminPage = 0;
  }
  renderAdmin();
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

function prevAdminUserPage() {
  AppState.adminUserPage = Math.max(0, AppState.adminUserPage - 1);
  renderAdmin();
}

function nextAdminUserPage() {
  AppState.adminUserPage += 1;
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

  try {
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
  } catch (error) {
    showToast('管理者ログインが必要です', 'error');
  }
}

function logout() {
  localStorage.removeItem('employeeId');
  AppState.employeeId = null;
  AppState.profile = null;
  AppState.stats = null;
  AppState.adminEmployeeId = null;
  AppState.encounteredCharacters = new Set();
  AppState.history = [];
  AppState.practiceQuestion = null;
  AppState.practiceResult = null;
  renderLogin();
}

async function handleLogin() {
  const employeeId = document.getElementById('employeeId').value.trim();

  if (!employeeId) {
    showToast('従業員IDを入力してください', 'error');
    return;
  }

  try {
    await login(employeeId);
    renderDashboard();
  } catch (error) {
    const message = error?.response?.data?.error || 'ログインに失敗しました';
    showToast(message, 'error');
  }
}

async function handleRegister() {
  const employeeId = document.getElementById('registerEmployeeId').value.trim();
  const nickname = document.getElementById('registerNickname').value.trim();
  const avatarInput = document.querySelector('input[name="avatar"]:checked');
  const avatarId = avatarInput ? avatarInput.value : null;

  if (!employeeId || !nickname) {
    showToast('従業員IDとニックネームを入力してください', 'error');
    return;
  }

  try {
    await registerUser(employeeId, nickname, avatarId);
    renderDashboard();
  } catch (error) {
    const message = error?.response?.data?.error || '登録に失敗しました';
    showToast(message, 'error');
  }
}

async function handleAdminLogin() {
  const employeeId = document.getElementById('adminEmployeeId').value.trim();
  const password = document.getElementById('adminPassword').value.trim();

  if (!employeeId || !password) {
    showToast('従業員IDとパスワードを入力してください', 'error');
    return;
  }

  try {
    await adminLogin(employeeId, password);
    AppState.adminEmployeeId = employeeId;
    renderAdmin();
  } catch (error) {
    const message = error?.response?.data?.error || '管理者ログインに失敗しました';
    showToast(message, 'error');
  }
}

async function init() {
  await fetchAvatars();
  await fetchChapters();

  if (AppState.employeeId) {
    try {
      await fetchProfile();
      loadEncounteredCharacters();
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

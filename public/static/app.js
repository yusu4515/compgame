// =========================================
// グローバル状態管理
// =========================================
const AppState = {
  currentView: 'home', // 'home', 'story', 'chapters'
  playerId: localStorage.getItem('playerId') || null,
  playerProgress: null,
  chapters: [],
  currentChapter: null,
  currentNarrationIndex: 0,
};

// =========================================
// ユーティリティ関数
// =========================================

function savePlayerId(playerId) {
  localStorage.setItem('playerId', playerId);
  AppState.playerId = playerId;
}

function clearPlayerId() {
  localStorage.removeItem('playerId');
  AppState.playerId = null;
  AppState.playerProgress = null;
}

// =========================================
// API呼び出し
// =========================================

async function fetchChapters() {
  try {
    const response = await axios.get('/api/chapters');
    AppState.chapters = response.data.chapters;
  } catch (error) {
    console.error('Failed to fetch chapters:', error);
    showError('チャプター情報の取得に失敗しました');
  }
}

async function fetchProgress(playerId) {
  try {
    const response = await axios.get(`/api/progress/${playerId}`);
    AppState.playerProgress = response.data.progress;
    return response.data.progress;
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return null;
  }
}

async function createPlayer(nickname) {
  try {
    const response = await axios.post('/api/progress', { nickname });
    const progress = response.data.progress;
    savePlayerId(progress.playerId);
    AppState.playerProgress = progress;
    return progress;
  } catch (error) {
    console.error('Failed to create player:', error);
    showError('プレイヤー作成に失敗しました');
    return null;
  }
}

async function clearChapter(playerId, chapterId) {
  try {
    const response = await axios.post(`/api/progress/${playerId}/clear/${chapterId}`);
    AppState.playerProgress = response.data.progress;
    return response.data;
  } catch (error) {
    console.error('Failed to clear chapter:', error);
    showError('チャプタークリアの記録に失敗しました');
    return null;
  }
}

async function resetProgress(playerId) {
  try {
    await axios.delete(`/api/progress/${playerId}`);
    clearPlayerId();
    return true;
  } catch (error) {
    console.error('Failed to reset progress:', error);
    showError('進行状況のリセットに失敗しました');
    return false;
  }
}

// =========================================
// UI表示関数
// =========================================

function showError(message) {
  const app = document.getElementById('app');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg fade-in z-50';
  errorDiv.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-exclamation-circle mr-2"></i>
      <span>${message}</span>
    </div>
  `;
  app.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 3000);
}

function showSuccess(message) {
  const app = document.getElementById('app');
  const successDiv = document.createElement('div');
  successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg fade-in z-50';
  successDiv.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-check-circle mr-2"></i>
      <span>${message}</span>
    </div>
  `;
  app.appendChild(successDiv);
  setTimeout(() => successDiv.remove(), 3000);
}

function getChapterGradientClass(chapterId) {
  const gradients = {
    'prologue': 'bg-gradient-prologue',
    'chapter1': 'bg-gradient-chapter1',
    'chapter2': 'bg-gradient-chapter2',
    'chapter3': 'bg-gradient-chapter3',
    'chapter4': 'bg-gradient-chapter4',
    'chapter5': 'bg-gradient-chapter5',
    'final': 'bg-gradient-final',
    'bonus': 'bg-gradient-bonus',
  };
  return gradients[chapterId] || 'bg-gradient-fantasy';
}

function getCategoryIcon(category) {
  const icons = {
    '導入': 'fa-book-open',
    '法務分野': 'fa-balance-scale',
    '経理分野': 'fa-coins',
    '人事分野': 'fa-users',
    '情シス分野': 'fa-shield-alt',
    '労務分野': 'fa-clock',
    '最終決戦': 'fa-dragon',
    '究極の試練': 'fa-crown',
  };
  return icons[category] || 'fa-star';
}

// =========================================
// ビュー: ホーム画面
// =========================================

function renderHome() {
  const app = document.getElementById('app');
  
  const isReturningPlayer = AppState.playerId && AppState.playerProgress;
  
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-fantasy flex items-center justify-center p-8">
      <div class="max-w-2xl w-full fade-in">
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold mb-4 text-white drop-shadow-lg">
            <i class="fas fa-shield-alt mr-3"></i>
            Compliance Quest
          </h1>
          <p class="text-2xl text-purple-100 mb-2">〜エシカル王国の守護者〜</p>
          <p class="text-lg text-purple-200 mt-4">コンプライアンスを学ぶRPG冒険</p>
        </div>

        <div class="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          ${isReturningPlayer ? `
            <div class="text-center mb-6">
              <p class="text-xl text-white mb-4">
                おかえりなさい、<span class="font-bold text-yellow-300">${AppState.playerProgress.nickname}</span>様
              </p>
              <p class="text-purple-100">
                現在の進行状況: ${getChapterTitle(AppState.playerProgress.currentChapter)}
              </p>
            </div>
            <button onclick="continueGame()" class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-6 rounded-lg mb-4 transition transform hover:scale-105">
              <i class="fas fa-play mr-2"></i>
              冒険を続ける
            </button>
            <button onclick="showNewGameConfirm()" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition">
              <i class="fas fa-redo mr-2"></i>
              最初からやり直す
            </button>
          ` : `
            <div class="mb-6">
              <label class="block text-white text-lg font-semibold mb-3">
                <i class="fas fa-user mr-2"></i>
                守護者の名前を入力してください
              </label>
              <input 
                type="text" 
                id="nicknameInput" 
                placeholder="あなたのニックネーム"
                class="w-full px-4 py-3 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
                maxlength="20"
              />
            </div>
            <button onclick="startNewGame()" class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-6 rounded-lg transition transform hover:scale-105">
              <i class="fas fa-play mr-2"></i>
              冒険を始める
            </button>
          `}
        </div>

        <div class="text-center mt-8 text-purple-100">
          <p class="text-sm">
            <i class="fas fa-info-circle mr-1"></i>
            王国を救い、コンプライアンスの真髄を学びましょう
          </p>
        </div>
      </div>
    </div>
  `;
  
  // エンターキーでゲーム開始
  const input = document.getElementById('nicknameInput');
  if (input) {
    input.focus();
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') startNewGame();
    });
  }
}

function getChapterTitle(chapterId) {
  const chapter = AppState.chapters.find(c => c.id === chapterId);
  return chapter ? `${chapter.title}: ${chapter.subtitle}` : 'プロローグ';
}

async function startNewGame() {
  const input = document.getElementById('nicknameInput');
  const nickname = input.value.trim();
  
  if (!nickname) {
    showError('名前を入力してください');
    input.focus();
    return;
  }
  
  const progress = await createPlayer(nickname);
  if (progress) {
    showSuccess(`ようこそ、${nickname}様!`);
    setTimeout(() => showChapterSelect(), 1000);
  }
}

async function continueGame() {
  await fetchProgress(AppState.playerId);
  showChapterSelect();
}

function showNewGameConfirm() {
  const app = document.getElementById('app');
  const confirmDiv = document.createElement('div');
  confirmDiv.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 fade-in';
  confirmDiv.innerHTML = `
    <div class="bg-white rounded-xl p-8 max-w-md w-full">
      <h3 class="text-2xl font-bold text-gray-900 mb-4">
        <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
        進行状況をリセット
      </h3>
      <p class="text-gray-700 mb-6">現在の進行状況が削除されます。本当によろしいですか?</p>
      <div class="flex gap-4">
        <button onclick="confirmReset()" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition">
          <i class="fas fa-trash mr-2"></i>
          リセットする
        </button>
        <button onclick="closeConfirm()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition">
          キャンセル
        </button>
      </div>
    </div>
  `;
  app.appendChild(confirmDiv);
  
  window.closeConfirm = () => confirmDiv.remove();
  window.confirmReset = async () => {
    const success = await resetProgress(AppState.playerId);
    if (success) {
      confirmDiv.remove();
      showSuccess('進行状況をリセットしました');
      renderHome();
    }
  };
}

// =========================================
// ビュー: チャプター選択画面
// =========================================

function showChapterSelect() {
  const app = document.getElementById('app');
  const progress = AppState.playerProgress;
  
  app.innerHTML = `
    <div class="min-h-screen bg-gray-900 p-8">
      <div class="max-w-6xl mx-auto">
        <!-- ヘッダー -->
        <div class="bg-gradient-fantasy rounded-2xl p-6 mb-8 shadow-2xl fade-in">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-white mb-2">
                <i class="fas fa-map mr-2"></i>
                チャプター選択
              </h1>
              <p class="text-purple-100">守護者: ${progress.nickname}</p>
            </div>
            <div class="text-right">
              <p class="text-yellow-300 font-bold text-lg">
                <i class="fas fa-trophy mr-2"></i>
                ${progress.clearedChapters.length} / ${AppState.chapters.length - 1} クリア
              </p>
              ${progress.isBonusUnlocked ? `
                <p class="text-green-300 text-sm mt-1">
                  <i class="fas fa-unlock mr-1"></i>
                  ボーナスステージ解放済み
                </p>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- チャプター一覧 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${AppState.chapters.filter(ch => ch.id !== 'bonus' || progress.isBonusUnlocked).map(chapter => {
            const isCleared = progress.clearedChapters.includes(chapter.id);
            const isCurrent = progress.currentChapter === chapter.id;
            const isLocked = chapter.id === 'final' && progress.clearedChapters.length < 5;
            const isBonus = chapter.id === 'bonus';
            
            return `
              <div class="chapter-card ${getChapterGradientClass(chapter.id)} rounded-xl p-6 shadow-lg ${isLocked ? 'opacity-50' : 'cursor-pointer'} fade-in"
                   ${isLocked ? '' : `onclick="showStory('${chapter.id}')"`}>
                <div class="flex items-start justify-between mb-4">
                  <div class="bg-white bg-opacity-30 rounded-lg p-3">
                    <i class="fas ${getCategoryIcon(chapter.category)} text-3xl text-white"></i>
                  </div>
                  ${isCleared ? '<div class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold"><i class="fas fa-check mr-1"></i>クリア</div>' : ''}
                  ${isCurrent ? '<div class="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold"><i class="fas fa-star mr-1"></i>現在</div>' : ''}
                  ${isLocked ? '<div class="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-bold"><i class="fas fa-lock mr-1"></i>ロック</div>' : ''}
                </div>
                
                <h3 class="text-2xl font-bold text-white mb-2">${chapter.title}</h3>
                <p class="text-white text-opacity-90 font-semibold mb-3">${chapter.subtitle}</p>
                <p class="text-white text-opacity-80 text-sm mb-4">
                  <i class="fas fa-tag mr-1"></i>
                  ${chapter.category}
                </p>
                
                ${isBonus ? `
                  <div class="bg-white bg-opacity-20 rounded-lg p-3 mt-4">
                    <p class="text-white text-sm">
                      <i class="fas fa-gem mr-2"></i>
                      究極の試練に挑戦しよう
                    </p>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// =========================================
// ビュー: ストーリー表示
// =========================================

function showStory(chapterId) {
  const chapter = AppState.chapters.find(c => c.id === chapterId);
  if (!chapter) return;
  
  AppState.currentChapter = chapter;
  AppState.currentNarrationIndex = 0;
  
  renderStoryNarration();
}

function renderStoryNarration() {
  const app = document.getElementById('app');
  const chapter = AppState.currentChapter;
  const narrationLines = chapter.narration;
  const currentIndex = AppState.currentNarrationIndex;
  
  const isLastNarration = currentIndex >= narrationLines.length - 1;
  
  app.innerHTML = `
    <div class="min-h-screen ${getChapterGradientClass(chapter.id)} flex items-center justify-center p-8">
      <div class="max-w-4xl w-full fade-in">
        <!-- チャプタータイトル -->
        <div class="text-center mb-8">
          <div class="bg-white bg-opacity-30 backdrop-blur-lg rounded-full px-6 py-2 inline-block mb-4">
            <span class="text-white font-semibold">
              <i class="fas ${getCategoryIcon(chapter.category)} mr-2"></i>
              ${chapter.category}
            </span>
          </div>
          <h2 class="text-4xl font-bold text-white mb-2">${chapter.title}</h2>
          <p class="text-2xl text-white text-opacity-90">${chapter.subtitle}</p>
        </div>

        <!-- ナレーションボックス -->
        <div class="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 shadow-2xl mb-6">
          <div class="narration-text text-white text-lg leading-relaxed">
            ${narrationLines.slice(0, currentIndex + 1).map((line, idx) => {
              if (line === '') return '<br/>';
              const isNew = idx === currentIndex;
              return `<p class="${isNew ? 'fade-in' : ''} mb-4">${line}</p>`;
            }).join('')}
          </div>
        </div>

        <!-- 進行度インジケーター -->
        <div class="flex items-center justify-center gap-2 mb-6">
          ${narrationLines.map((_, idx) => `
            <div class="w-3 h-3 rounded-full ${idx <= currentIndex ? 'bg-yellow-400' : 'bg-white bg-opacity-30'}"></div>
          `).join('')}
        </div>

        <!-- アクションボタン -->
        <div class="flex gap-4 justify-center">
          ${!isLastNarration ? `
            <button onclick="nextNarration()" class="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-lg transition transform hover:scale-105">
              <i class="fas fa-arrow-right mr-2"></i>
              続きを読む
            </button>
          ` : `
            <button onclick="completeChapter()" class="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition transform hover:scale-105">
              <i class="fas fa-check mr-2"></i>
              チャプタークリア
            </button>
          `}
          <button onclick="showChapterSelect()" class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-lg transition">
            <i class="fas fa-arrow-left mr-2"></i>
            戻る
          </button>
        </div>
      </div>
    </div>
  `;
}

function nextNarration() {
  AppState.currentNarrationIndex++;
  renderStoryNarration();
}

async function completeChapter() {
  const chapter = AppState.currentChapter;
  const result = await clearChapter(AppState.playerId, chapter.id);
  
  if (result) {
    showSuccess(`${chapter.title}をクリアしました!`);
    
    // ボーナスステージ解放演出
    if (chapter.id === 'final') {
      setTimeout(() => {
        showBonusUnlockedAnimation();
      }, 1500);
    } else {
      setTimeout(() => {
        showChapterSelect();
      }, 1500);
    }
  }
}

function showBonusUnlockedAnimation() {
  const app = document.getElementById('app');
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 fade-in';
  overlay.innerHTML = `
    <div class="text-center fade-in">
      <div class="mb-6">
        <i class="fas fa-crown text-yellow-400 text-8xl animate-pulse"></i>
      </div>
      <h2 class="text-5xl font-bold text-white mb-4">ボーナスステージ解放!</h2>
      <p class="text-2xl text-purple-300 mb-8">「古の審判所」への扉が開かれました</p>
      <button onclick="closeBonusAnimation()" class="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-lg transition transform hover:scale-105">
        <i class="fas fa-check mr-2"></i>
        了解
      </button>
    </div>
  `;
  app.appendChild(overlay);
  
  window.closeBonusAnimation = () => {
    overlay.remove();
    showChapterSelect();
  };
}

// =========================================
// 初期化
// =========================================

async function init() {
  await fetchChapters();
  
  if (AppState.playerId) {
    const progress = await fetchProgress(AppState.playerId);
    if (!progress) {
      clearPlayerId();
    }
  }
  
  renderHome();
}

// アプリ起動
init();

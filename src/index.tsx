import { Hono } from 'hono'
import { raw } from 'hono/html'
import { jsx } from 'hono/jsx'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

const avatars = [
  {
    id: 'avatar-heroine-knight',
    name: 'ヒロインナイト',
    image: '/static/assets/avatars/avatar-heroine-knight.png'
  },
  {
    id: 'avatar-male-knight',
    name: 'ナイト',
    image: '/static/assets/avatars/avatar-male-knight.png'
  },
  {
    id: 'avatar-queen-mage',
    name: 'クイーンメイジ',
    image: '/static/assets/avatars/avatar-queen-mage.png'
  },
  {
    id: 'avatar-fox-mage',
    name: 'フォックスメイジ',
    image: '/static/assets/avatars/avatar-fox-mage.png'
  },
  {
    id: 'avatar-rabbit-paladin',
    name: 'ラビットパラディン',
    image: '/static/assets/avatars/avatar-rabbit-paladin.png'
  },
  {
    id: 'avatar-wolf-guardian',
    name: 'ウルフガーディアン',
    image: '/static/assets/avatars/avatar-wolf-guardian.png'
  },
  {
    id: 'avatar-knight-cat',
    name: 'キャットナイト',
    image: '/static/assets/avatars/avatar-knight-cat.png'
  }
]

app.get('/api/avatars', (c) => {
  return c.json({ success: true, avatars })
})

app.post('/api/auth/register', async (c) => {
  const { employeeId, nickname, avatarId } = await c.req.json()

  if (!employeeId || !nickname || !avatarId) {
    return c.json({ success: false, message: 'IDと なまえと アバターを えらんでください！' }, 400)
  }

  if (!avatars.some((avatar) => avatar.id === avatarId)) {
    return c.json({ success: false, message: 'アバターを もういちど えらんでください！' }, 400)
  }

  const existing = await c.env.DB.prepare(
    'SELECT employee_id FROM users WHERE employee_id = ?'
  ).bind(employeeId).first()

  if (existing) {
    return c.json({ success: false, message: 'このIDは もう つかわれている！' }, 409)
  }

  await c.env.DB.batch([
    c.env.DB.prepare(
      'INSERT INTO users (employee_id, nickname, avatar_id) VALUES (?, ?, ?)'
    ).bind(employeeId, nickname, avatarId),
    c.env.DB.prepare('INSERT INTO user_stats (employee_id) VALUES (?)').bind(employeeId),
    c.env.DB.prepare('INSERT INTO story_progress (employee_id) VALUES (?)').bind(employeeId)
  ])

  return c.json({
    success: true,
    user: {
      employeeId,
      nickname,
      avatarId,
      level: 1,
      xp: 0,
      coins: 0,
      currentArea: 'prologue',
      titlePrimary: null
    }
  })
})

// --- 1. ログインチェックAPI ---
app.post('/api/auth/login', async (c) => {
  const { employeeId } = await c.req.json()
  if (!employeeId) {
    return c.json({ success: false, message: 'じゅうぎょういんIDを いれてください！' }, 400)
  }

  const user = await c.env.DB.prepare(
    `SELECT
      employee_id as employeeId,
      nickname,
      avatar_id as avatarId,
      level,
      xp,
      coins,
      current_area as currentArea,
      title_primary as titlePrimary
    FROM users
    WHERE employee_id = ?`
  ).bind(employeeId).first()

  if (user) {
    return c.json({ success: true, user })
  }
  return c.json({ success: false, message: '勇者（ゆうしゃ）が 見つかりません！' }, 401)
})

// --- 2. メイン画面（HTML/JavaScript） ---
app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        <title>Compliance Quest</title>
        <style>{`
          body { background: #000; color: #fff; font-family: monospace; text-align: center; padding: 40px 20px; }
          .window { border: 4px solid #fff; padding: 20px; display: inline-block; min-width: 300px; max-width: 760px; }
          .landing { border: none; padding: 0; background: transparent; }
          .landing-image { width: 760px; max-width: 92vw; border: 4px solid #fff; display: block; margin: 0 auto 20px; }
          input { background: #000; border: 2px solid #fff; color: #fff; padding: 10px; margin: 10px; text-align: center; width: 220px; }
          button { background: #fff; color: #000; border: none; padding: 10px 20px; cursor: pointer; font-weight: bold; margin: 6px; }
          button.secondary { background: #000; color: #fff; border: 2px solid #fff; }
          .status-box { text-align: left; margin-top: 20px; display: none; }
          .avatar-picker { display: flex; gap: 20px; justify-content: center; align-items: flex-start; flex-wrap: wrap; }
          .avatar-grid { display: grid; grid-template-columns: repeat(3, 72px); gap: 10px; }
          .avatar-button { background: #000; border: 2px solid #fff; padding: 0; width: 72px; height: 72px; cursor: pointer; }
          .avatar-button.selected { border-color: #f7d51d; box-shadow: 0 0 10px #f7d51d; }
          .avatar-button img { width: 100%; height: 100%; object-fit: cover; }
          .avatar-preview img { width: 180px; height: 180px; border: 2px solid #fff; object-fit: cover; }
        `}</style>
      </head>
      <body>
        <div id="landing-screen" class="window landing">
          <img
            class="landing-image"
            src="/static/assets/visuals/key-visual.png"
            alt="Compliance Quest"
          />
          <button id="start-button">ゲームスタート</button>
        </div>

        <div id="menu-screen" class="window" style="display: none;">
          <h1>コンプライアンス クエスト</h1>
          <button id="menu-login">ログイン</button>
          <button id="menu-register">しんきとうろく</button>
          <button class="secondary" id="menu-admin">かんりがめん</button>
          <button class="secondary" id="menu-back">もどる</button>
        </div>

        <div id="login-screen" class="window" style="display: none;">
          <h1>ログイン</h1>
          <p>じゅうぎょういんIDを いれよ</p>
          <input type="text" id="employeeId" placeholder="TEST001" />
          <br />
          <button id="login-submit">ぼうけんを はじめる</button>
          <button class="secondary" id="login-back">もどる</button>
          <p id="error" style="color: red;"></p>
        </div>

        <div id="register-screen" class="window" style="display: none;">
          <h1>しんきとうろく</h1>
          <p>じゅうぎょういんIDと なまえを いれよ</p>
          <input type="text" id="registerEmployeeId" placeholder="TEST001" />
          <input type="text" id="registerNickname" placeholder="ゆうしゃ" />
          <p>アバターを えらべ</p>
          <div class="avatar-picker">
            <div id="avatar-grid" class="avatar-grid"></div>
            <div class="avatar-preview">
              <img id="avatar-preview" src="" alt="avatar preview" />
            </div>
          </div>
          <button id="register-submit">とうろくする</button>
          <button class="secondary" id="register-back">もどる</button>
          <p id="register-error" style="color: red;"></p>
        </div>

        <div id="admin-screen" class="window" style="display: none;">
          <h1>かんりがめん</h1>
          <p>※かんりがめんは じゅんびちゅうです</p>
          <button class="secondary" id="admin-back">もどる</button>
        </div>

        <div id="main-screen" class="window" style="display: none;">
          <h2>ステータス</h2>
          <div class="status-box" id="status" style="display: block;"></div>
          <hr />
          <p>これから ぼうけんが はじまる……</p>
        </div>

        <script>{raw(`
          const avatars = ${JSON.stringify(avatars)};
          const screens = [
            'landing-screen',
            'menu-screen',
            'login-screen',
            'register-screen',
            'admin-screen',
            'main-screen'
          ];
          let selectedAvatarId = avatars.length ? avatars[0].id : null;

          function hideAllScreens() {
            screens.forEach((id) => {
              const el = document.getElementById(id);
              if (el) {
                el.style.display = 'none';
              }
            });
          }

          function showLanding() {
            hideAllScreens();
            document.getElementById('landing-screen').style.display = 'inline-block';
          }

          function showMenu() {
            hideAllScreens();
            document.getElementById('menu-screen').style.display = 'inline-block';
          }

          function showMain(user) {
            hideAllScreens();
            document.getElementById('main-screen').style.display = 'inline-block';
            document.getElementById('status').innerHTML =
              '<p>なまえ：' + user.nickname + '</p>' +
              '<p>レベル：' + user.level + '</p>' +
              '<p>ゴールド：' + user.coins + ' G</p>';
          }

          function showRegister() {
            hideAllScreens();
            document.getElementById('register-screen').style.display = 'inline-block';
            document.getElementById('error').innerText = '';
          }

          function showLogin() {
            hideAllScreens();
            document.getElementById('login-screen').style.display = 'inline-block';
            document.getElementById('register-error').innerText = '';
          }

          function showAdmin() {
            hideAllScreens();
            document.getElementById('admin-screen').style.display = 'inline-block';
          }

          window.showLanding = showLanding;
          window.showMenu = showMenu;
          window.showLogin = showLogin;
          window.showRegister = showRegister;
          window.showAdmin = showAdmin;

          function selectAvatar(id) {
            selectedAvatarId = id;
            document.querySelectorAll('.avatar-button').forEach((button) => {
              if (button.dataset.avatarId === id) {
                button.classList.add('selected');
              } else {
                button.classList.remove('selected');
              }
            });
            const selected = avatars.find((avatar) => avatar.id === id);
            const preview = document.getElementById('avatar-preview');
            preview.src = selected ? selected.image : '';
          }

          function renderAvatarOptions() {
            const grid = document.getElementById('avatar-grid');
            if (!grid) return;
            grid.innerHTML = '';
            avatars.forEach((avatar) => {
              const button = document.createElement('button');
              button.type = 'button';
              button.className = 'avatar-button';
              button.dataset.avatarId = avatar.id;
              const img = document.createElement('img');
              img.src = avatar.image;
              img.alt = avatar.name;
              button.appendChild(img);
              button.onclick = () => selectAvatar(avatar.id);
              grid.appendChild(button);
            });
            if (selectedAvatarId) {
              selectAvatar(selectedAvatarId);
            }
          }

          async function login() {
            const id = document.getElementById('employeeId').value.trim();
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ employeeId: id })
            });
            const data = await res.json();
            if (data.success) {
              showMain(data.user);
            } else {
              document.getElementById('error').innerText = data.message;
            }
          }

          async function registerUser() {
            const employeeId = document.getElementById('registerEmployeeId').value.trim();
            const nickname = document.getElementById('registerNickname').value.trim();
            const res = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ employeeId, nickname, avatarId: selectedAvatarId })
            });
            const data = await res.json();
            if (data.success) {
              showMain(data.user);
            } else {
              document.getElementById('register-error').innerText = data.message;
            }
          }

          window.login = login;
          window.registerUser = registerUser;

          function bindNavigation() {
            const startButton = document.getElementById('start-button');
            if (startButton) startButton.addEventListener('click', showMenu);

            const menuLogin = document.getElementById('menu-login');
            if (menuLogin) menuLogin.addEventListener('click', showLogin);

            const menuRegister = document.getElementById('menu-register');
            if (menuRegister) menuRegister.addEventListener('click', showRegister);

            const menuAdmin = document.getElementById('menu-admin');
            if (menuAdmin) menuAdmin.addEventListener('click', showAdmin);

            const menuBack = document.getElementById('menu-back');
            if (menuBack) menuBack.addEventListener('click', showLanding);

            const loginSubmit = document.getElementById('login-submit');
            if (loginSubmit) loginSubmit.addEventListener('click', login);

            const loginBack = document.getElementById('login-back');
            if (loginBack) loginBack.addEventListener('click', showMenu);

            const registerSubmit = document.getElementById('register-submit');
            if (registerSubmit) registerSubmit.addEventListener('click', registerUser);

            const registerBack = document.getElementById('register-back');
            if (registerBack) registerBack.addEventListener('click', showMenu);

            const adminBack = document.getElementById('admin-back');
            if (adminBack) adminBack.addEventListener('click', showMenu);
          }

          function init() {
            bindNavigation();
            renderAvatarOptions();
            showLanding();
          }

          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
          } else {
            init();
          }
        `)}</script>
      </body>
    </html>
  )
})

export default app
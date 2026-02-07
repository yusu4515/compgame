import { Hono } from 'hono'
import { jsx } from 'hono/jsx'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// --- 1. ログインチェックAPI ---
app.post('/api/auth/login', async (c) => {
  const { employeeId } = await c.req.json()
  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE employeeId = ?'
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
          body { background: #000; color: #fff; font-family: monospace; text-align: center; padding-top: 50px; }
          .window { border: 4px solid #fff; padding: 20px; display: inline-block; min-width: 300px; }
          input { background: #000; border: 2px solid #fff; color: #fff; padding: 10px; margin: 10px; text-align: center; }
          button { background: #fff; color: #000; border: none; padding: 10px 20px; cursor: pointer; font-weight: bold; }
          .status-box { text-align: left; margin-top: 20px; display: none; }
        `}</style>
      </head>
      <body>
        <div id="login-screen" class="window">
          <h1>コンプライアンス クエスト</h1>
          <p>じゅうぎょういんIDを いれよ</p>
          <input type="text" id="employeeId" placeholder="TEST001" />
          <br />
          <button onclick="login()">ぼうけんを はじめる</button>
          <p id="error" style="color: red;"></p>
        </div>

        <div id="main-screen" class="window" style="display: none;">
          <h2>ステータス</h2>
          <div class="status-box" id="status" style="display: block;"></div>
          <hr />
          <p>これから ぼうけんが はじまる……</p>
        </div>

        <script>{`
          async function login() {
            const id = document.getElementById('employeeId').value;
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ employeeId: id })
            });
            const data = await res.json();
            if (data.success) {
              document.getElementById('login-screen').style.display = 'none';
              document.getElementById('main-screen').style.display = 'inline-block';
              document.getElementById('status').innerHTML = \`
                <p>なまえ：\${data.user.nickname}</p>
                <p>レベル：\${data.user.level}</p>
                <p>ゴールド：\${data.user.coins} G</p>
              \`;
            } else {
              document.getElementById('error').innerText = data.message;
            }
          }
        `}</script>
      </body>
    </html>
  )
})

export default app
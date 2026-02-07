-- 管理画面の編集ログ
CREATE TABLE IF NOT EXISTS admin_edit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  payload TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_edit_logs_employee ON admin_edit_logs(employee_id);
CREATE INDEX IF NOT EXISTS idx_admin_edit_logs_question ON admin_edit_logs(question_id);

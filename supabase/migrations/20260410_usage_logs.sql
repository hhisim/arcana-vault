-- Usage tracking for sanctum experience tools
-- Enables tracking of tool usage, generation counts, session data

CREATE TABLE IF NOT EXISTS usage_logs (
  id          BIGSERIAL PRIMARY KEY,
  tool        TEXT NOT NULL,
  action      TEXT NOT NULL,
  meta        JSONB,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS usage_logs_tool_action_idx ON usage_logs(tool, action);
CREATE INDEX IF NOT EXISTS usage_logs_user_id_idx     ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS usage_logs_created_at_idx  ON usage_logs(created_at DESC);

-- Row-level security
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Everyone can insert their own logs
CREATE POLICY "Users can insert their own usage logs"
  ON usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can read all
CREATE POLICY "Service role can read all usage logs"
  ON usage_logs FOR SELECT
  USING (auth.role() = 'service_role');

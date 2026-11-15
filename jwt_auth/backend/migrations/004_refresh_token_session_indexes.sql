CREATE INDEX idx_refresh_token_user_id
ON refresh_token_sessions(user_id);

CREATE INDEX idx_refresh_token_expires_at
ON refresh_token_sessions(expires_at);
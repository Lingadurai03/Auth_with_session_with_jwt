CREATE TABLE refresh_token_history(
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    token_hash TEXT UNIQUE NOT NULL,
    revoked_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_session
    FOREIGN KEY(session_id)
    references refresh_token_sessions(id)
    on delete cascade
);
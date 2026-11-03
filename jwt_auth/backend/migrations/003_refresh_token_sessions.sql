create table refresh_token_sessions(
    id serial primary key,
    user_id integer not null,
    token_hash text unique not null,
    expires_at timestamptz not null,
    created_at timestamptz not null default current_timestamp,
    revoked_at timestamptz,
    last_used_at timestamptz,
    constraint fk_user
    foreign key (user_id)
    references users(id)
    on delete cascade
)
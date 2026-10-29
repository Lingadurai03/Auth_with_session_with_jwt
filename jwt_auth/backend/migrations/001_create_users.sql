create type user_role as enum('admin', 'user');

create table users(
    id serial primary key,
    full_name varchar not null,
    email text unique not null,
    role user_role default 'user' not null,
    password_hash varchar not null,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    disabled_at TIMESTAMP
)
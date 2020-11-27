create table if not exists users (
    id serial not null primary key,
    first_name VARCHAR not null,
    last_name VARCHAR not null,
    email varchar not null,
    password_hash VARCHAR NOT NULL,
    
    constraint unique_email unique(email)
);
-- https://stackoverflow.com/a/38721951
alter table users add column if not exists password_reset_token varchar;
alter table users add column if not exists profile_pic varchar;
alter table users add column if not exists bio varchar;

-- friendships table has TWO rows for a single, accepted friendship.
-- If there exists only a single row (from_id, to_id) and no 
-- (to_id, from_id) the other side has not yet accepted.
create table if not exists friendships (
    from_id int not null,
    to_id int not null,
    primary key (from_id, to_id)
);
create unique index idx_friendships on friendships (to_id, from_id);


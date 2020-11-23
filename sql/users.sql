create table  if not exists users (
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
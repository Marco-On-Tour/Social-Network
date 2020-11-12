create table users (
    id serial not null primary key,
    first_name VARCHAR not null,
    last_name VARCHAR not null,
    email varchar not null,
    password_hash VARCHAR NOT NULL,
    constraint unique_email unique(email)
);

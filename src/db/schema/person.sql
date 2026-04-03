CREATE TABLE IF NOT EXISTS person (
    SSN         INTEGER     PRIMARY KEY,
    first_name  VARCHAR,
    middle_name VARCHAR,
    last_name   VARCHAR,
    address     UUID,
    FOREIGN KEY (address) REFERENCES address(address_id)
);

CREATE TABLE IF NOT EXISTS employee (
    SSN                 INTEGER     PRIMARY KEY,
    education_level     education,
    FOREIGN KEY (SSN) REFERENCES person(SSN) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS customer (
    SSN                 INTEGER     PRIMARY KEY,
    registration_date   DATE        DEFAULT CURRENT_DATE,
    FOREIGN KEY (SSN) REFERENCES person(SSN) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
    session_token   TEXT PRIMARY KEY,
    SSN             INTEGER NOT NULL,
    expires_at      TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (SSN) REFERENCES person(SSN) ON DELETE CASCADE
);
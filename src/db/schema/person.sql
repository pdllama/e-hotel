CREATE TABLE IF NOT EXISTS person (
    SSN         INTEGER     PRIMARY KEY,
    first_name  VARCHAR,
    middle_name VARCHAR,
    last_name   VARCHAR,
    address     UUID,
    FOREIGN KEY (address) REFERENCES address(address_id)
);

CREATE TABLE IF NOT EXISTS employee (
    SSN     INTEGER     PRIMARY KEY,
    FOREIGN KEY (SSN) REFERENCES person(SSN)
);

CREATE TABLE IF NOT EXISTS customer (
    SSN                 INTEGER     PRIMARY KEY,
    registration_date   DATE,
    FOREIGN KEY (SSN) REFERENCES person(SSN)
);

CREATE TABLE IF NOT EXISTS works_in (
    SSN         INTEGER     PRIMARY KEY,
    address_id  UUID,
    role        VARCHAR,
    FOREIGN KEY (SSN) REFERENCES employee(SSN),
    FOREIGN KEY (address_id) REFERENCES address(address_id)
);
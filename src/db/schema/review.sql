CREATE TABLE IF NOT EXISTS review (
    review_id   UUID    PRIMARY KEY,
    author_id   INTEGER NOT NULL,
    address_id  UUID    NOT NULL,
    rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
    contents    TEXT,
    FOREIGN KEY (author_id) REFERENCES customer(SSN),
    FOREIGN KEY (address_id) REFERENCES hotel(address_id)
);

CREATE TABLE IF NOT EXISTS review_vote (
    review_id   UUID,
    voter       INTEGER,
    is_like     BOOLEAN NOT NULL,
    PRIMARY KEY (review_id, voter),
    FOREIGN KEY (review_id) REFERENCES review(review_id),
    FOREIGN KEY (voter) REFERENCES customer(SSN)
);
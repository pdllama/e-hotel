CREATE TABLE IF NOT EXISTS photo (
    url         VARCHAR     PRIMARY KEY,
    description TEXT
);

CREATE TABLE IF NOT EXISTS hotel_photo (
    url         VARCHAR     PRIMARY KEY,
    address_id  UUID,
    FOREIGN KEY (url) REFERENCES photo(url),
    FOREIGN KEY (address_id) REFERENCES hotel(address_id)
);

CREATE TABLE IF NOT EXISTS review_photo (
    url         VARCHAR     PRIMARY KEY,
    review_id   UUID,
    FOREIGN KEY (url) REFERENCES photo(url),
    FOREIGN KEY (review_id) REFERENCES review(review_id)
);

CREATE TABLE IF NOT EXISTS room_problem_photo (
    url         VARCHAR     PRIMARY KEY,
    problem_id  UUID,
    FOREIGN KEY (url) REFERENCES photo(url),
    FOREIGN KEY (problem_id) REFERENCES room_problem(problem_id)
);

CREATE TABLE IF NOT EXISTS profile_picture (
    url     VARCHAR     PRIMARY KEY,
    SSN     INTEGER,
    FOREIGN KEY (url) REFERENCES photo(url),
    FOREIGN KEY (SSN) REFERENCES person(SSN)
)



/* View on the search page */
CREATE VIEW hotel_search_table as 
SELECT address_id, avg_rating, num_rooms, avg_price, country, state, city, postal_code, street_name, street_number, chain_name, amenities
FROM address 
    JOIN hotel using (address_id) /* Hotel Info */
    JOIN hotel_chain using (chain_name) /* hotel_chain for chain_name */
    JOIN ( /* total number of rooms and average price of the rooms */
		SELECT address_id, COUNT(*) as num_rooms, AVG(price) as avg_price 
    FROM room 
    GROUP BY address_id
	) using (address_id) 
    JOIN ( /* average rating */
		SELECT address_id, AVG(rating) as avg_rating FROM review GROUP BY address_id 
	) using (address_id)
    JOIN ( /* All amenities */
    SELECT address_id, json_agg(amenity_name) AS amenities 
    FROM (
      SELECT DISTINCT h.address_id, rha.amenity_name
      FROM hotel h LEFT JOIN room_has_amenity rha ON (h.address_id = rha.address_id)
    )
    GROUP BY address_id
  ) using (address_id);
        
/* View on the show hotel page */
CREATE VIEW hotel_show_view AS
SELECT address_id, avg_rating, num_rooms, total_capacity, avg_price, country, state, city, postal_code, street_name, street_number, chain_name, amenities, phone_numbers, emails
FROM hotel_search_table
  JOIN (
    SELECT address_id, json_agg(phone_number) AS phone_numbers
    FROM hotel_phone_number
	  GROUP BY (address_id)
  ) using (address_id)
  JOIN (
    SELECT address_id, json_agg(e_mail) AS emails
    FROM hotel_email
	  GROUP BY (address_id)
  ) using (address_id)
  JOIN (
    SELECT address_id, SUM(capacity) AS total_capacity
    FROM room
    GROUP BY (address_id)
  ) using (address_id);

CREATE VIEW chain_view AS
SELECT co_address, chain_name, street_name, street_number, postal_code, city, state, country, phone_numbers, emails, num_hotels
FROM hotel_chain
  JOIN address ON (co_address = address_id)
  JOIN (
    SELECT chain_name, json_agg(phone_number) AS phone_numbers
    FROM chain_phone_number
    GROUP BY (chain_name)
  ) USING (chain_name)
  JOIN (
    SELECT chain_name, json_agg(e_mail) AS emails
    FROM chain_email
    GROUP BY (chain_name)
  ) USING (chain_name)
  JOIN (
    SELECT chain_name, COUNT(*) AS num_hotels
    FROM hotel
    GROUP BY (chain_name)
  ) USING (chain_name);

/* For cards in home page, and assignment instructions */
CREATE VIEW rooms_by_area as
SELECT DISTINCT city, avg_price, num_hotels, num_avail_rooms
FROM address
    JOIN (
      SELECT city, state, country, AVG(price) AS avg_price
      FROM address NATURAL JOIN room
      GROUP BY (city, state, country)
    ) using (city, state, country)
    JOIN (
      SELECT city, state, country, COUNT(*) AS num_avail_rooms
      FROM address NATURAL JOIN room r
      WHERE NOT EXISTS (
        SELECT 1
        FROM archive ar
        WHERE (r.address_id = ar.address_id) AND (r.room_number = ar.room_number) AND ar.status IN ('booked', 'renting')
      )
      GROUP BY (city, state, country)
    ) using (city, state, country)
    JOIN (
      SELECT city, state, country, COUNT(*) AS num_hotels
      FROM address NATURAL JOIN hotel
      GROUP BY (city, state, country)
    ) using (city, state, country);
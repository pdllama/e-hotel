


/* Improve this view */
CREATE VIEW hotel_search_table as 
SELECT address_id, AVG(rating) as avg_rating, COUNT(*) as num_rooms, country, state, city, postal_code, street_name, street_number, chain_name
FROM address 
    JOIN hotel using (address_id) 
    JOIN hotel_chain using (chain_name) 
    JOIN room using (address_id) 
    JOIN review using (address_id)
        
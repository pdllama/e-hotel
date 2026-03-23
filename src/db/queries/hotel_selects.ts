export function hotel_avg_rating_table() {
    return `
            SELECT address_id, AVG(rating) as avg_rating
            FROM hotel NATURAL JOIN review
            GROUP BY address_id
            `
}

export function hotel_num_rooms_table() {
    return `
            SELECT address_id, COUNT(*) as num_rooms
            FROM hotel NATURAL JOIN room
            GROUP BY address_id
            `
}
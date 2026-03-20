


export interface RoomProblem {
    problem_id: string,
    hotel_address: string,
    room_number: number,
    type: string,
    description: string,
    status: string,
    log_date: string,
    resolved_date: string
}

export function generateRoomProblem(

) {
    // 5% for a room to have a problem in the first place.
    //  1% chance for this problem to be ongoing
    //  if ongoing - the log date is any time 1-2 days before 
    //  if not: the resolved date will be any time 1-7 days after its log date
}
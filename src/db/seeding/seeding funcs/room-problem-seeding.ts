import { get_rand_arr_item, get_rand_date, get_rand_date_after, get_rand_date_before, get_rand_time, type Hotel_Stats } from "../seedingutils.ts";
import {v4 as uuidv4} from "uuid"
import {default as room_problems} from "./../seeding data/hotel/room-problem.json" with {type:"json"}


export interface RoomProblem {
    problem_id: string,
    hotel_address: string,
    room_number: number,
    type: string,
    description: string,
    status: string,
    log_date: string,
    resolved_date?: string
}

type RoomPDataType = typeof room_problems
const problemTypes:string[] = Object.keys(room_problems)

export function generateRoomProblem(
    address_id: string,
    room_number: number,
    status: string // will match the db enum type
) {
    // 5% for a room to have a problem in the first place (rolled in room seeding).
    //  1% chance for this problem to be ongoing (rolled in room seeding)
    //  if ongoing - the log date is any time 1-2 days before 
    //  if not: the resolved date will be any time 1-7 days after its log date
    // Note that rooms can only seed with one problem, not multiple. And problems seed before archives.
    // Meaning we don't need to check for any date conflicts with archives/problems

    const problem_id = uuidv4()
    const problem_type = get_rand_arr_item(problemTypes)

    const poolOfDescriptions = room_problems[problem_type as keyof RoomPDataType]
    const desc = get_rand_arr_item(poolOfDescriptions)

    let log_date = ""
    let resolved_date = status == "ongoing" ? undefined : "";

    if (status == "resolved") {
        const reportDate = get_rand_date()
        log_date = `${reportDate} ${get_rand_time()}`
        resolved_date = `${get_rand_date_after(reportDate, 3, 1)} ${get_rand_time()}` //get random date within 1-3 days after the report date.
    } else {
        const currDate = new Date()
        const day = currDate.getDate()
        const month = currDate.getMonth()+1
        const year = currDate.getFullYear()

        log_date = `${get_rand_date_before(`${year}-${month}-${day}`, 2, 1)} ${get_rand_time()}`
    }

    const RoomProblem:RoomProblem = {
        problem_id,
        hotel_address: address_id,
        room_number,
        type: problem_type,
        description: desc,
        status,
        log_date,
        resolved_date
    }

    return RoomProblem
}
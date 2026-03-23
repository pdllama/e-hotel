import { get_rand_arr_item, get_rand_date_after, get_rand_date_before, get_rand_time, getCurrDateComponents, getYearDiff, parse_date, roll_chance_binary, roll_chance_multi, type ProblemMapping} from "../seedingutils.ts";
import { monthDays } from "../seedingutils.ts";
import {v4 as uuidv4} from "uuid"

const stayYears = [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]
const stayMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export function generateArchive(
    SSN: number,
    customer_registration_date: string,
    hotel_address_id: string,
    room_number: number,
    is_booking:boolean,
    is_current_rental:boolean,
    problemMap:ProblemMapping,
    e_SSN_check_in:number,
    e_SSN_check_out:number
) {
    // 4 archive statuses: booked, renting, completed, cancelled
    // is_future_booking and is_current_rental is decided before the archive is created.
    // odds:
    //      40% chance to be a "booked" archive (has a booking, no rental.). This means the booking is for a future date.
    //      20% chance to be a "renting" archive (25% chance to be a renting without a prior booking) (can be just a rental, or booking with rental)
    //      30% chance to be a completed archive (25% chance to be an archive without a prior booking) (can be just a rental, or booking with rental)
    //      10% chance to be a cancelled archive (has a booking, no rental.)
    // 

    const archive_status = is_booking ? "booked" : is_current_rental ? "rental" : roll_chance_multi([90, 10], ["completed", "cancelled"]);
    let create_booking = archive_status == "booked" || archive_status == "cancelled"

    if (archive_status == "renting" || archive_status == "completed") {
        create_booking = roll_chance_binary(25);
    }

    const {year, month, day} = parse_date(customer_registration_date)

    // Note for non-booking non-curr rental archives (if 3): the only thing that can conflict with an archive stay_date is the following:
    //      1. customer registration date
    //      2. room problem dates, which can only span 2 years/2 months at most (logged xxxx-dec-30 resolved xxxx+1-jan-01). 
    // Any room in a hotel only has one possible archive as iterated in the main.ts seeding, and a current-rental will never be assigned
    //  to a room with an ongoing room problem, of which there can only be one room problem
    // the highest registration year is 2022, meaning the possible stay years for a customer registered in 2022 is 2022, 2023, 2024, 2025, and 2026. 
    // Therefore there will ALWAYS be a valid stay year. 
    // Note: we will also filter registration year out as a valid year if they registered in october or later, because of the 2-month thing above to avoid a potential conflict.
    
    const filterRegYear = month >= 10
    const roomproblemmap = problemMap[hotel_address_id][room_number]
    const problemYears = roomproblemmap === undefined ? [] : Object.keys(roomproblemmap)

    let stayYear;
    let stayMonth;
    let stayDay;

    if (is_booking) {
        const currDate = new Date()
        const currDateISO = currDate.toISOString()
        const currDateFormatted = currDateISO.slice(0, currDateISO.indexOf("T"))
        const startDate = get_rand_date_after(currDateFormatted, 180, 30);
        const endDate = get_rand_date_after(startDate, 7, 1) // stay for 1-7 days

        const bookingCreatedDate = get_rand_date_before(startDate, 270, 180) // booking created anywhere from 0-240 days before today

        const archive = generateArchiveDetails(SSN, hotel_address_id, room_number, "booked", startDate, endDate);

        return {
            archive,
            booking: generateBookingDetails(archive.archive_id, bookingCreatedDate)
        }
    } else if (is_current_rental) {
        const currDate = new Date()
        const currDateISO = currDate.toISOString()
        const currDateFormatted = currDateISO.slice(0, currDateISO.indexOf("T"))
        const startDate = get_rand_date_before(currDateFormatted, 3, 1);
        const endDate = get_rand_date_after(currDateFormatted, 4, 1) //min- 2 days. max-7 days
        const yearDiff = getYearDiff(endDate, currDateFormatted)

        const archive = generateArchiveDetails(SSN, hotel_address_id, room_number, "renting", startDate, endDate);

        const bookingData:any = {}
        if (create_booking) {
            const bookingCreatedDate = get_rand_date_before(currDateFormatted, 180, 4) // booking created anywhere from 4-180 days before today
            bookingData.booking = generateBookingDetails(archive.archive_id, bookingCreatedDate)
        }
        const rental = generateRentalDetails(archive.archive_id, startDate, e_SSN_check_in, yearDiff, true)
        return {
            archive,
            rental,
            ...bookingData
        }
    } else if (archive_status == "completed") {
        const currDate = new Date(); 
        const currYear = currDate.getFullYear();
        const currMonth = currDate.getMonth()+1
        const validYears = stayYears.filter(sy => (filterRegYear ? sy > year : sy >= year) && !problemYears.includes(sy.toString()))
        stayYear = get_rand_arr_item(validYears);
        const validMonths = currYear == stayYear ? stayMonths.filter(sm => sm < currMonth) : stayMonths;
        stayMonth = get_rand_arr_item(validMonths);
        stayDay = Math.floor(Math.random()*(((stayYear == currYear && stayMonth == currMonth) ? monthDays[stayMonth-1]-7 : monthDays[stayMonth-1]))+1)

        const startDate = `${stayYear}-${stayMonth < 10 ? `0${stayMonth}` : stayMonth}-${stayDay < 10 ? `0${stayDay}` : stayDay}`
        const endDate = get_rand_date_after(startDate, 7, 2); // 2-7 day stays

        const archive = generateArchiveDetails(SSN, hotel_address_id, room_number, "completed", startDate, endDate);
        const yearDiff = currYear - stayYear

        const bookingData:any = {}
        if (create_booking) {
            const bookingCreatedDate = get_rand_date_before(startDate, 180, 1) // booking created anywhere from 1-180 days before start date
            bookingData.booking = generateBookingDetails(archive.archive_id, bookingCreatedDate)
        }
        const rental = generateRentalDetails(archive.archive_id, startDate, e_SSN_check_in, yearDiff, false, endDate, e_SSN_check_out)
        return {
            archive,
            rental,
            ...bookingData
        }
    } else {
        const currDate = new Date(); 
        const currYear = currDate.getFullYear();
        const currMonth = currDate.getMonth()+1
        const validYears = stayYears.filter(sy => (filterRegYear ? sy > year : sy >= year) && !problemYears.includes(sy.toString()))
        stayYear = get_rand_arr_item(validYears);
        const validMonths = currYear == stayYear ? stayMonths.filter(sm => sm < currMonth) : stayMonths;
        stayMonth = get_rand_arr_item(validMonths);
        stayDay = Math.floor(Math.random()*(((stayYear == currYear && stayMonth == currMonth) ? monthDays[stayMonth-1]-7 : monthDays[stayMonth-1]))+1)

        const startDate = `${stayYear}-${stayMonth < 10 ? `0${stayMonth}` : stayMonth}-${stayDay < 10 ? `0${stayDay}` : stayDay}`
        const endDate = get_rand_date_after(startDate, 7, 2); // 2-7 day stays

        const archive = generateArchiveDetails(SSN, hotel_address_id, room_number, "cancelled", startDate, endDate);

        const bookingCreatedDate = get_rand_date_before(startDate, 180, 1) // booking created anywhere from 1-180 days before start date
        return {
            archive,
            booking: generateBookingDetails(archive.archive_id, bookingCreatedDate)
        }
    }
}

function generateArchiveDetails(
    SSN: number,
    hotel_address_id: string,
    room_number: number,
    status:string,
    stay_start_date:string,
    stay_end_date:string
) {
    // archive_id      UUID    PRIMARY KEY,
    // guest_id        INTEGER,
    // address_id      UUID,
    // room_number     INTEGER,
    // status          archive_status,
    // stay_start_date DATE,
    // stay_end_date   DATE,
    const aId = uuidv4();
    return {
        archive_id: aId,
        guest_id: SSN,
        address_id: hotel_address_id,
        room_number,
        status,
        stay_start_date,
        stay_end_date
    }
}

function generateBookingDetails(aId:string, created_at_date:string) {
    return {
        archive_id: aId,
        created_at: `${created_at_date} ${get_rand_time()}`,
        paid_for: roll_chance_binary(50)
    }
}

function generateRentalDetails(
    aId:string, 
    start_date:string, 
    e_SSN_check_in:number,
    year_diff:number, //(currYear - (minus) year of rental date) (end or start). used for nulling
    ongoing:boolean,
    end_date?:string, 
    e_SSN_check_out?:number
) {
    const null_check_in = roll_chance_binary(1+year_diff)
    const null_check_out = roll_chance_binary(1+year_diff)
    const outData = ongoing ? {} : {
        check_out_time: `${end_date} ${get_rand_time()}`,
        checked_out_by: null_check_out ? null : e_SSN_check_out
    }
    return {
        archive_id: aId,
        check_in_time: `${start_date} ${get_rand_time()}`,
        checked_in_by: null_check_in ? null : e_SSN_check_in,
        ...outData
    }
}

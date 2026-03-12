import db from '../../index.ts'
import { hotel } from '../schema/hotel.ts'

export const getAllHotels = async() => {
    return await db.select().from(hotel)
}


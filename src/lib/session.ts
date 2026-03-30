import { dbPool } from "../db/pool";
import { get_user_data_from_session } from "../db/queries/user-management";

export async function getUserFromSession(token:string) {
    if (!token) return null;

    const res = await dbPool.query(get_user_data_from_session(token));
    return res.rows[0] || null
}
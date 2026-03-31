

import { dbPool } from "../../../../../db/pool";
import { addNotification } from "$lib/notificationStore";

export async function PUT({params, request}:any) {
    const aid = params.archive_id

    await dbPool.query(`UPDATE archive SET status = 'cancelled' WHERE archive_id = '${aid}'`)

    addNotification({body: 'Cancelled the booking!', success: true, errorStatus: 201})
    return new Response(JSON.stringify({ success: true, status: 201 }));
}
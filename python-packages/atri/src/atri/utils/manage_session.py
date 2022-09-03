from datetime import datetime
import asyncio
from ..stats import collect_session_duration, connect
import uuid

session_start_time = datetime.now()

async def manage_session(virt_type: str):
    session_id = str(uuid.uuid4())
    stats_collection = connect()
    while True:
        await asyncio.sleep(60)

        # one attempt to connect if not already connected
        if stats_collection == None:
            stats_collection = connect()

        # send data only if connection success
        if stats_collection != None:
            collect_session_duration(
                stats_collection, session_id, session_start_time, datetime.now(), virt_type)
import requests
import asyncio

async def wait_till_file_server_ready(file_server_port: int):
    while True:
        try:
            requests.get("http://localhost:" + str(file_server_port))
            break
        except:
            print("file server not ready")
            await asyncio.sleep(0.2)
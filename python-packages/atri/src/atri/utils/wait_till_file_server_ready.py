import requests
import asyncio
import sys

async def wait_till_file_server_ready(file_server_port: int):
    while True:
        try:
            requests.get("http://localhost:" + str(file_server_port))
            sys.stdout.write("\n")
            break
        except:
            sys.stdout.write("\33[2K\rPlease wait while we get the server ready...")
            await asyncio.sleep(0.2)
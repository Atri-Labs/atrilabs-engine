import pymongo
import datetime
import uuid, re
from multiprocessing import Process
from pymongo.collection import Collection

mac_addr = ':'.join(re.findall('..', '%012x' % uuid.getnode()))

def create_stat(stat: dict):
    return {**{"timestamp": datetime.datetime.now(), "mac_addr": mac_addr}, **stat}

def connect():
    try:
        client = pymongo.MongoClient("mongodb+srv://statscollector:plainpassword1234@cluster0.wkz64ti.mongodb.net/?retryWrites=true&w=majority")
        statsdb = client.get_database("statsdb")
        stats_collection = statsdb.get_collection("stats")
        return stats_collection
    except:
        return None

def _collect_post_install_script():
    try:
        stats_collection = connect()
        if stats_collection != None:
            stats_collection.insert_one(create_stat({"activity": "install"}))
    except:
        pass

def collect_post_install_script():
    p = Process(target=_collect_post_install_script)
    p.start()

def _collect_atri_start(virt_type: str):
    try:
        stats_collection = connect()
        if stats_collection != None:
            stats_collection.insert_one(create_stat({
                "activity": "atri_start",
                "virt_type": virt_type
                }))
    except:
        pass

def collect_atri_start(virt_type: str):
    p = Process(target=_collect_atri_start, args=(virt_type,))
    p.start()

def _collect_create_dockerfile(virt_type: str):
    try:
        stats_collection = connect()
        if stats_collection != None:
            stats_collection.insert_one(create_stat({
                "activity": "create_dockerfile",
                "virt_type": virt_type
                }))
    except:
        pass

def collect_create_dockerfile(virt_type: str):
    p = Process(target=_collect_create_dockerfile, args=(virt_type,))
    p.start()

def _collect_download_exe():
    try:
        stats_collection = connect()
        if stats_collection != None:
            stats_collection.insert_one(create_stat({
                "activity": "download_exe",
                }))
    except:
        pass

def collect_download_exe():
    p = Process(target=_collect_download_exe)
    p.start()

def collect_session_duration(stats_collection: Collection, session_id: str, start: datetime.datetime, end: datetime.datetime, virt_type: str):
    try:
        if stats_collection != None:
            stats_collection.insert_one(create_stat({
                "activity": "session_duration",
                "session_id": session_id,
                "start": start,
                "end": end,
                "virt_type": virt_type
                }))
    except:
        pass
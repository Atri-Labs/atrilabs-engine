import { MongoClient } from "mongodb";
import getmac from "getmac";

const mac_addr = getmac();

const client = new MongoClient(
  "mongodb+srv://statscollector:plainpassword1234@cluster0.wkz64ti.mongodb.net/?retryWrites=true&w=majority"
);

function createStat(stat: any) {
  return { timestamp: new Date(), mac_addr, ...stat };
}

export async function connect() {
  try {
    await client.connect();
    const db = client.db("statsdb");
    return db.collection("stats");
  } catch (err) {
    throw err;
  }
}

export function collectCreatePage() {
  connect()
    .then((col) => {
      col.insertOne(createStat({ activity: "create_page" }));
    })
    .catch(() => {});
}

export function collectCreateTemplate() {
  connect()
    .then((col) => {
      col.insertOne(createStat({ activity: "create_template" }));
    })
    .catch(() => {});
}

export function collectPublish() {
  connect()
    .then((col) => {
      col.insertOne(createStat({ activity: "publish" }));
    })
    .catch(() => {});
}

export function collectImportResources(resource: string) {
  connect()
    .then((col) => {
      col.insertOne(createStat({ activity: "import_resource", resource }));
    })
    .catch(() => {});
}

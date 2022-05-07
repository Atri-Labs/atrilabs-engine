# `websocket`

This server-client uses event manager from `implementation/lowdb`. This server-client also arranges pages inside folders. It's able to achieve this by storing the hierarchy of folders/pages using the Meta File API exposed by `implementation/lowdb`.

# Schema for meta.json

`{ folders: { folderId: { name: "", id: "", parentId: "" } }, pages: {pageId: "folderId"} }`

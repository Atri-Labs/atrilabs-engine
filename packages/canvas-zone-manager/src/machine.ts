// page loaded (send page loaded message to parent)
// page-live-reloaded
// processing event request
// drag in progress (gets this message from parent) -> no zones active -> zone active
// zone active -> mouse up -> event captured by some parent component (send drag success message to parent)
// zone inactive -> mouse up (send drag failed message to parent)
export {};

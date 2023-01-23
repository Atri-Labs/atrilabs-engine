export class ServerState {
  // Server is in ready state only after watchers have loaded initial directory
  // Tracks state of both the compilers
  // Saves triplet of req, res, next
  // Does not process and respond to any request while any of the compiler
  // is not ready.
  // Responds quickly if none of the compilers are in processing mode and the page is ready
  // Once the compilers are not in processing mode, call watching.invalidate for requests for new page
}

// Conditionally forwards the target of an HTML event to the handler.
// Use this for any HTML event where:
//  1. You only need access to the target
//  2. You don't want to do anything if, for some reason, there is no target on the event
//  3. Uhhhh I think there was something else I can't remember.

function forwardTarget(e: Event, handler: Function, ...args:any[]) {
    if (e.target != null) {handler(e.target, ...args)}
}

export default forwardTarget
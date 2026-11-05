/**
 * Starts the entries of `list` that apply to `root`.
 * @param {PageControllerEntry[]} list
 * @param {Document | Element} [root]
 * @param {PageControllerOptions} [options]
 * @returns {Promise<void>} Settles when every entry has started, except the entries that wait for a quiet page.
 */
export function runPageControllers(list: PageControllerEntry[], root?: Document | Element, options?: PageControllerOptions): Promise<void>;
export default runPageControllers;
/**
 * A value read when it is used: the `property` of the first element that matches `selector`, or
 * `fallback` when there is none.
 */
export type LiveValue = {
    live: {
        selector: string;
        property: string;
        fallback?: unknown;
    };
};
/**
 * One controller of an entry. `module` is a path relative to the list file; `export` is the name
 * of the export that holds the class, or "default". `call` is "init" (construct, then `init()`),
 * "constructor" (the constructor does the work) or a method called once for each element that
 * matches the entry's selector.
 */
export type ControllerSpec = {
    module: string;
    export: string;
    call?: 'init' | 'constructor' | {
        method: string;
        per: 'match';
    };
};
/**
 * How an entry starts only once. `on: "document"` sets `attribute` on the document element;
 * `on: "match"` sets it on the first match of the selector. "controller": the controller marks
 * its own root and does nothing when it finds the mark.
 */
export type StartOnce = {
    on: 'document' | 'match';
    attribute: string;
} | 'controller';
/**
 * An event dispatched on the document after the entry started. `when` is a selector that must
 * match for the event to be dispatched. A value of `detail` may be a LiveValue.
 */
export type AfterStart = {
    event: string;
    detail?: Record<string, unknown>;
    when?: string;
};
export type PageControllerEntry = {
    /**
     * Used in warnings.
     */
    name: string;
    /**
     * The entry applies when the root contains a match.
     */
    selector: string;
    /**
     * Started in this order.
     */
    controllers: ControllerSpec[];
    /**
     * The constructor argument of each controller. A value may be a LiveValue.
     */
    options?: Record<string, unknown>;
    /**
     * Option sets: one controller of each spec for each set.
     */
    instances?: Record<string, unknown>[];
    /**
     * True only where the controller does not rearrange or hide what an author edits.
     */
    inEditor?: boolean;
    startOnce?: StartOnce;
    /**
     * `quiet`: start once nothing has been added to or removed from the page for 250 ms (3 s at most), without holding back the other entries. `waitFor`: selectors that must match inside the entry's first match, else nothing starts this run.
     */
    startWhen?: {
        quiet?: boolean;
        waitFor?: string[];
    };
    /**
     * Make the topmost hidden ancestor of the match visible for the synchronous start.
     */
    showWhileStarting?: boolean;
    afterStart?: AfterStart;
    hook?: 'maskStartedCarousels' | 'teasersWithFilterStructure';
};
export type PageControllerProblem = {
    element: Element;
    message: string;
    source: string;
};
export type PageControllerOptions = {
    /**
     * True while the page is open in an editor.
     */
    inEditor?: boolean;
    /**
     * Called once for each run with every problem the page has now.
     */
    onWarning?: (problems: PageControllerProblem[]) => void;
};

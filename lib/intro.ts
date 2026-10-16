// The homepage arrives with its navbar and hero already painted: scripts/prerender.mjs
// renders them into #pf-shell, so a phone shows the headline before any JavaScript
// has run. When React mounts it replaces that markup, and the first render must start
// from the finished state (no entrance animation) or the hero would vanish and fade back
// in. After the hero's first mount the flag clears, so returning to the homepage from
// another page plays the entrance as before. The prerender sets it too: server markup
// is rendered in its final, visible state.

let shell = false;

/** True until the hero has mounted once over the prerendered shell. */
export const shellActive = () => shell;
export const setShellActive = (on: boolean) => {
  shell = on;
};

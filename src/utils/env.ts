export enum ENV {
  browser,
  node,
  worker,
}

let env = ENV.browser;

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
  env = ENV.worker;
} else if (global) {
  env = ENV.node;
} else if (window) {
  env = ENV.browser;
}

export default env;

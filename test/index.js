import { WorkerBridge } from '../src/worker/bridge';

const canvas = document.querySelector('#canvas');
const bridge = new WorkerBridge('../dist/worker.js', {
  wrapper: canvas,
});

bridge.render();
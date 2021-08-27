const script = document.createElement('script');
script.type = 'text/javascript';
script.src =
  'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/selfie_segmentation.js';
script.crossOrigin = 'anonymous';

document.getElementsByTagName('head')[0].appendChild(script);

const foregroundCanvasElement = document.createElement('canvas');
const backgroundCanvasElement = document.createElement('canvas');
const backgroundCanvasCtx = backgroundCanvasElement.getContext('2d');

let outputCanvasCtx = null;

export async function segmentBackground(
  inputVideoElement,
  outputCanvasElement,
  modelSelection = 1
) {
  foregroundCanvasElement.width = backgroundCanvasElement.width =
    outputCanvasElement.width;
  foregroundCanvasElement.height = backgroundCanvasElement.height =
    outputCanvasElement.height;
  outputCanvasCtx = outputCanvasElement.getContext('2d');

  let selfieSegmentation = new SelfieSegmentation({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
    },
  });
  selfieSegmentation.setOptions({
    modelSelection: modelSelection,
  });
  selfieSegmentation.onResults((results) => {
    mergeForegroundBackground(
      foregroundCanvasElement,
      backgroundCanvasElement,
      results
    );
  });

  inputVideoElement.addEventListener('play', () => {
    async function step() {
      await selfieSegmentation.send({ image: inputVideoElement });
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
  inputVideoElement.addEventListener('pause', async () => {});
}

function mergeForegroundBackground(
  foregroundCanvasElement,
  backgroundCanvasElement,
  results
) {
  makeCanvasLayer(results, foregroundCanvasElement, 'foreground');
  makeCanvasLayer(results, backgroundCanvasElement, 'background');
  outputCanvasCtx.drawImage(backgroundCanvasElement, 0, 0);
  outputCanvasCtx.drawImage(foregroundCanvasElement, 0, 0);
}

function makeCanvasLayer(results, canvasElement, type) {
  const canvasCtx = canvasElement.getContext('2d');

  canvasCtx.save();

  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.segmentationMask,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  if (type === 'foreground') {
    canvasCtx.globalCompositeOperation = 'source-in';
  }

  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  canvasCtx.restore();
}

export function applyBlur(blurIntensity) {
  backgroundCanvasCtx.filter = `blur(${blurIntensity}px)`;
}

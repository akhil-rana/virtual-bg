const script = document.createElement('script');
script.type = 'text/javascript';
script.src =
  'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/selfie_segmentation.js';
script.crossOrigin = 'anonymous';

document.getElementsByTagName('head')[0].appendChild(script);

const foregroundCanvasElement = document.createElement('canvas');
const backgroundCanvasElement = document.createElement('canvas');

let outputCanvasCtx = null;

export async function blurBackground(
  inputVideoElement,
  outputCanvasElement,
  blurIntensity = 10,
  modelSelection = 0
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
      blurIntensity,
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
  foregroundCanvasElement = foregroundCanvasElement,
  backgroundCanvasElement = backgroundCanvasElement,
  blurIntensity,
  results
) {
  makeCanvasLayer(results, foregroundCanvasElement, 'foreground');
  makeCanvasLayer(results, backgroundCanvasElement, 'background');
  outputCanvasCtx.drawImage(backgroundCanvasElement, 0, 0);
  const backgroundCanvasCtx = backgroundCanvasElement.getContext('2d');
  backgroundCanvasCtx.filter = `blur(${blurIntensity}px)`;
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

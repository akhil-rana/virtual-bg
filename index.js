const script = document.createElement('script');
script.type = 'text/javascript';
script.src =
  'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/selfie_segmentation.js';
script.crossOrigin = 'anonymous';

document.getElementsByTagName('head')[0].appendChild(script);

export async function start(videoElement, onResults, modelSelection) {
  let selfieSegmentation = new SelfieSegmentation({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
    },
  });
  selfieSegmentation.setOptions({
    modelSelection: modelSelection,
  });
  selfieSegmentation.onResults(onResults);

  let myStream = await navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 1024 }, height: { ideal: 720 } },
  });

  videoElement.srcObject = myStream;
  videoElement.addEventListener('play', () => {
    async function step() {
      await selfieSegmentation.send({ image: videoElement });
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
  videoElement.addEventListener('pause', async () => {});
}

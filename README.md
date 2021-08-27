## Easily add virtual background effects to your video/camera input inside any web browser<br/><br/>



### A simple example to blur background camera stream:<br/><br/>

    npm install virtual-bg

#### index.html
    <div  id="app">
        <video autoplay="true" id="inputVideoElement"></video>
        <canvas id="output_canvas" width="1280px" height="720px"></canvas>
    </div>

 <br/>

#### index.js

    import { segmentBackground, applyBlur } from 'virtual-bg';

    const inputVideoElement = document.querySelector('#inputVideoElement');
    const outputCanvasElement = document.querySelector('#output_canvas');

    let myStream = await navigator.mediaDevices.getUserMedia({
          video: true
    });

    inputVideoElement.srcObject = myStream;

    segmentBackground(inputVideoElement, outputCanvasElement);
    applyBlur(7);
    

<br/><br/><br/>

<b>Note</b>: This library is using  [mediapipe's selfie segmentation](https://www.npmjs.com/package/@mediapipe/selfie_segmentation) model and and library as a base. 

I'll be adding more features like image, video backgrounds and more in the future. Stay updated.

For any doubts, please contact me at contact@akhilrana.com or start a issue/discussion at https://github.com/akhil-rana/virtual-BG-demo
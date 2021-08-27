## Easily add virtual background effects to your video/camera input inside any web browser<br/>
#### Try a working background blur demo [here](http://demo.virtualbg.akhilrana.com/)<br/>



    npm install virtual-bg

### A simple example to blur background camera stream:<br/>

#### index.html
    <div  id="app">
        <video autoplay="true" id="inputVideoElement"></video>
        <canvas id="output_canvas" width="1280px" height="720px"></canvas>
    </div>


#### index.js

    import { segmentBackground, applyBlur } from 'virtual-bg';

    const inputVideoElement = document.querySelector('#inputVideoElement');
    const outputCanvasElement = document.querySelector('#output_canvas');

    let myStream = await navigator.mediaDevices.getUserMedia({
          video: true
    });

    inputVideoElement.srcObject = myStream;

    // segments foreground & background
    segmentBackground(inputVideoElement, outputCanvasElement);  
    
    // applies a blur intensity of 7px to the background 
    applyBlur(7); 
    

<br/><br/>

<b>Note</b>: This library is using  [mediapipe's selfie segmentation](https://www.npmjs.com/package/@mediapipe/selfie_segmentation) model and and library as a base. 

I'll be adding more features like image, video backgrounds and more in the future. Stay updated.

For any doubts, please contact me at contact@akhilrana.com or start a issue/discussion at https://github.com/akhil-rana/virtual-BG-demo
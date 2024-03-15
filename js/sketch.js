
// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

// PoseNet with a pre-recorded video, modified from:
// https://github.com/ml5js/ml5-examples/blob/master/p5js/PoseNet/sketch.js

let poseNet;
let poses = [];

let video;

var leftEye;
var rightEye;

function setup() {
  createCanvas(500, 500);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, {multiplier:0.5}, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
    // draw()
    // console.log('result', results)
    myPose(results);
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log('model is ready!')
}

function myPose(results) {
  // console.log('results', results)
  results.forEach(result => {
    image(video, 0, 0, width, height);
    const leftEye = result.pose.keypoints.find( i => i.part === 'leftEye')
    noStroke();
    fill(255, 0, 0);
    ellipse(leftEye.position.x, leftEye.position.y, 20);
    const rightEye = result.pose.keypoints.find( i => i.part === 'rightEye')
    noStroke();
    fill(255, 0, 0);
    ellipse(rightEye.position.x, rightEye.position.y, 20);
    const tiltAngel = calculateAngle(leftEye.position.x, leftEye.position.y, rightEye.position.x, rightEye.position.y)
    window.manFigure.head.tilt = Math.round(1.5 * (tiltAngel - 180))
    const nodAngel = mapRange(rightEye.position.y, 202, 275, -45, 45)
    window.manFigure.head.nod = nodAngel;
  })
}

function calculateAngle(x1, y1, x2, y2) {
  // Calculate the angle in radians
  let deltaX = x2 - x1;
  let deltaY = y2 - y1;
  let radians = Math.atan2(deltaY, deltaX);

  // Convert radians to degrees
  let degrees = radians * (180 / Math.PI);

  // Ensure the angle is between 0 and 360 degrees
  if (degrees < 0) {
    degrees += 360;
  }

  return degrees;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}


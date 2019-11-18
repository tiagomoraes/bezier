// ================ CONSTANTS ================

const AUTHORS = 'Tiago Moraes & Vinícius Dantas';

// ================ GENERAL FUNCTIONS ================

function paintCurve(points) {
  for(let i = 1; i < points.length; i++) {
    line(points[i].x, points[i].y, points[i-1].x, points[i-1].y);
  }
}

// add more functions here

// ================ SETUP & DRAW ================

function setup() {
  // add setup code before the createCanvas()


  createCanvas(1920, 1080);
}

function draw() {
  paintCurve(testCurve);
}

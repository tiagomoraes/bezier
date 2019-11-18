// ================ CONSTANTS ================

const AUTHORS = "Tiago Moraes & Vinícius Dantas";

// ================ GENERAL FUNCTIONS ================

// add more functions here

// ================ SETUP & DRAW ================

function setup() {
  // add setup code before the createCanvas()
  createCanvas(1920, 1080);
}

function draw() {
  // call drawing functions here
  let bc = new BezierCurve([
    {x: 10, y:20},
    {x: 120, y:100},
    {x:640, y:200}
  ])
  bc.display();
}

// ================ CLASSES OBJECTS ================

class BezierCurve {
  constructor(controlPoints) {
    this.controlPoints = controlPoints;
  }

  // custom functions of the class here
  display() {
    for(let i = 1; i < this.controlPoints.length; i++) {
      line(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i-1].x, this.controlPoints[i-1].y);
    }
  }
}
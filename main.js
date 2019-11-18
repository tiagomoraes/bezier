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
    {x: 40, y:40},
    {x: 100, y:100},
    {x:200, y:100},
    {x:260, y:40}
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
    let points = this.computePoints(100);
    for(let i = 1; i < points.length; i++) {
      line(points[i].x, points[i].y, points[i-1].x, points[i-1].y);
    }
  }

  deCastejau(points, t) {
    if (points.length > 1) {
      let nextPoints = [];
      for(let i = 0; i < points.length-1; i++) {
        nextPoints.push({
          x: (1-t)*points[i].x + t*points[i+1].x,
          y: (1-t)*points[i].y + t*points[i+1].y
        });
      }
      return this.deCastejau(nextPoints, t);
    } else {
      return points[0];
    }
  }

  computePoints(howManyPoints) {
    howManyPoints--;
    let points = [];
    let delta = 1.0/howManyPoints;
    let t = delta;
    points.push(this.controlPoints[0]);
    for(let i = 1; i < howManyPoints; i++) {
      points.push(this.deCastejau(this.controlPoints, t));
      t += delta;
    }
    points.push(this.controlPoints[this.controlPoints.length-1]);
    return points;
  }
}
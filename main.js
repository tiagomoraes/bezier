// ================ CONSTANTS ================

const AUTHORS = "Tiago Moraes & Vinícius Dantas";
const DOT_SIZE = 10; // ver algum valor bom

// ================ GLOBAL VARIABLES ================

let bezierCurves;
let showControlPoints = true;
let showControlPolygonal = false;
let showCurves = true;
let howManyPoints = 100;

// ================ GENERAL FUNCTIONS ================

// add more functions here

// ================ SETUP & DRAW ================

function setup() {
  createCanvas(1920, 1080);
  bezierCurves = [];
  let points = [{x: 200, y:200},
    {x: 100, y:500},
    {x:200, y:500},
    {x:260, y:800},
    {x:800, y:680},
    {x:460, y:400}
  ];
  bezierCurves.push(new BezierCurve(points));
}

function draw() {
  // call drawing functions here
  bezierCurves[0].display();

  //console.log(bc.insideControlPoint(1000, 1000));
}

function mousePressed() {
  let index = bezierCurves[0].insideControlPoint(mouseX, mouseY);
  console.log(bezierCurves[0].controlPoints);
  if(index) {
    bezierCurves[0].updatePoint(index, 100, 200);
    bezierCurves[0].display();
  }
}

// ================ CLASSES OBJECTS ================

class BezierCurve {
  constructor(controlPoints) {
    this.controlPoints = controlPoints;
    this.curvePoints = this.computePoints(howManyPoints);
  }

  // custom functions of the class here
  display() {
    this.setCurve();

    if(showControlPoints) {
      stroke('green');
      strokeWeight(DOT_SIZE);
      for(let i = 0; i < this.controlPoints.length; i++) { 
        point(this.controlPoints[i].x, this.controlPoints[i].y);
      }
    }

    if(showControlPolygonal) {
      stroke('red');
      strokeWeight(1);
      for(let i = 1; i < this.controlPoints.length; i++) {
        line(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i-1].x, this.controlPoints[i-1].y);
      }
    }

    if(showCurves) {
      stroke('black');
      strokeWeight(1);
      for(let i = 1; i < this.curvePoints.length; i++) {
        line(this.curvePoints[i].x, this.curvePoints[i].y, this.curvePoints[i-1].x, this.curvePoints[i-1].y);
      }
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

  computePoints(numPoints) {
    numPoints--;
    let points = [];
    let delta = 1.0/numPoints;
    let t = delta;
    points.push(this.controlPoints[0]);
    for(let i = 1; i < numPoints; i++) {
      points.push(this.deCastejau(this.controlPoints, t));
      t += delta;
    }
    points.push(this.controlPoints[this.controlPoints.length-1]);
    return points;
  }

  setCurveFlag(value) {
    this.showCurves = value;
  }

  setPointsFlag(value) {
    this.showControlPoints = value;
  }

  setPolygonalFlag(value) {
    this.showControlPolygonal = value;
  }

  setCurve() {
    this.curvePoints = this.computePoints(howManyPoints);
  }

  insideControlPoint(x, y) {
    for(let i = 0; i < this.controlPoints.length; i++) {
      let px = this.controlPoints[i].x;
      let py = this.controlPoints[i].y;

      let d = dist(px, py, x, y);
      if (d <= DOT_SIZE) {
        return i;
      }
    }
    return null;
  }

  addPoint(x, y) {
    this.controlPoints.push({x: x, y: y});
  }

  updatePoint(pos, x, y) {
    this.controlPoints[pos] = {x: x, y: y};
  }

  removePoint(pos) {
    this.controlPoints.splice(pos, 1);
  }
}
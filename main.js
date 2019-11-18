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
  let points = [{x: 40, y:40},
                {x: 100, y:500},
                {x:200, y:500},
                {x:260, y:40}];
  let bc = new BezierCurve(points);
  bc.setHowManyPoits(8);
  bc.setCurve();
  bc.setPolygonalFlag(true);
  bc.display();
}

// ================ CLASSES OBJECTS ================

class BezierCurve {
  constructor(controlPoints, howManyPoints = 100) {
    this.controlPoints = controlPoints;
    this.howManyPoints = howManyPoints
    this.curvePoints = this.computePoints(this.howManyPoints);
    this.showControlPoints = true;
    this.showControlPolygonal = false;
    this.showCurves = true;
  }

  // custom functions of the class here
  display() {
    
    if(this.showControlPoints) {
      stroke('green');
      strokeWeight(10);
      for(let i = 0; i < this.controlPoints.length; i++) { 
        point(this.controlPoints[i].x, this.controlPoints[i].y);
      }
    }

    if(this.showControlPolygonal) {
      stroke('red');
      strokeWeight(1);
      for(let i = 1; i < this.controlPoints.length; i++) {
        line(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i-1].x, this.controlPoints[i-1].y);
      }
    }

    if(this.showCurves) {
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

  setCurveFlag(value) {
    this.showCurves = value;
  }

  setPointsFlag(value) {
    this.showControlPoints = value;
  }

  setPolygonalFlag(value) {
    this.showControlPolygonal = value;
  }

  setHowManyPoits(value) {
    this.howManyPoints = value;
  }

  setCurve() {
    this.curvePoints = this.computePoints(this.howManyPoints);
  }
}
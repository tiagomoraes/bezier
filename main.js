// ================ CONSTANTS ================

const AUTHORS = "Tiago Moraes & Vinícius Dantas";
const DOT_SIZE = 10; // ver algum valor bom

// ================ GENERAL FUNCTIONS ================

// add more functions here

// ================ SETUP & DRAW ================

function setup() {
  // add setup code before the createCanvas()
  createCanvas(1920, 1080);
}

function draw() {
  // call drawing functions here
  let points = [{x: 200, y:200},
                {x: 100, y:500},
                {x:200, y:500},
                {x:260, y:800}];
  let bc = new BezierCurve(points);
  bc.setPolygonalFlag(true);
  bc.addPoint(2, 500,400);
  bc.addPoint(2, 2,2);
  bc.updatePoint(3, 800, 800);
  bc.removePoint(bc.insideControlPoint(4, 4));
  bc.updatePoint(3, 1000, 500 );
  bc.setCurve();
  bc.display();

  //console.log(bc.insideControlPoint(1000, 1000));
}

function mousePressed(e) {
  let index = bc.insideControlPoint(e.clientX, e.clientY);
  if(index) {
    bc.updatePoint(index, 100, 200);
  }
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
      strokeWeight(DOT_SIZE);
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

  insideControlPoint(x, y) {
    for(let i = 0; i < this.controlPoints.length; i++) {
      let px = this.controlPoints[i].x, py = this.controlPoints[i].y;

      let d = dist(px.x, px.y, py.x, py.y);
      if (d <= DOT_SIZE) {
        return i;
      }
    }
    return null;
  }

  addPoint(pos, x, y) {
    this.controlPoints.splice(pos, 0, {x: x, y: y});
  }

  updatePoint(pos, x, y) {
    this.controlPoints[pos] = {x: x, y: y};
  }

  removePoint(pos) {
    this.controlPoints.splice(pos, 1);
  }
}
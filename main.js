// ================ CONSTANTS ================

const AUTHORS = "Tiago Moraes & Vinícius Dantas";
const DOT_SIZE = 15; // ver algum valor bom
const toast = new Toasty();

// ================ GLOBAL VARIABLES ================

let bezierCurves = [];
let showControlPoints = true;
let showControlPolygonal = true;
let showCurves = true;
let howManyPoints = 100;
let dragging = false;
let draggingIndex = null;
let selectedCurve = null;
let selectedFunction = 'add';


let addCurveBtn;
let selectCurveSel;
let deleteCurveBtn;
let curveResolutionInput;
let controlPointsFlag;
let controlPolygonFlag;
let curvesFlag;
let setCurveResolution;
let resetBtn;

// ================ GENERAL FUNCTIONS ================

// jQuery functions
$(document).ready(() => {
  $('input[name=curve-functions]').click(() => {
    selectedFunction = $('input[name=curve-functions]:checked').val();
  });
});

function displayAllCurves() {
  if(bezierCurves) {
    clear();
    bezierCurves.forEach((e, index) => {
      e.display(index);
    });
  }
}

function getCurvePoint(curveIndex, x, y) {

  /*
  Get the clicked point index on that curve. 
  If there is no point there, returns null
  */

  if(bezierCurves) {
    let currentBezier = bezierCurves[curveIndex];

    for(let i = 0; i < currentBezier.controlPoints.length; i++) {
      let px = currentBezier.controlPoints[i].x;
      let py = currentBezier.controlPoints[i].y;
  
      let d = dist(px, py, x, y);
      if (d <= DOT_SIZE) {

        // returns the curve index and point index
        return i;
      }
    }
  
  }

  return null;
}

function addNewCurve() {
  let tempCurve = new BezierCurve();
  bezierCurves.push(tempCurve);

  // succes creation alert
  toast.success(`Curva ${bezierCurves.length - 1} cirada com sucesso!`);

  atualizeCurveSelector();
}

function selectChanged() {
  selectedCurve = selectCurveSel.value();
}

function atualizeCurveSelector() {
  // atualize curve selector

  let curveSelector = $('#curve-select');
  curveSelector.html('');
  for(let i = 0; i < bezierCurves.length; i++) {
    if(i === bezierCurves.length -1) {
      curveSelector.append(`
        <option value="${i}" selected>${i}</option>
      `);
    } else {
      curveSelector.append(`
        <option value="${i}">${i}</option>
      `);
    }
    
  }
  
  if(bezierCurves) {
    selectedCurve = bezierCurves.length - 1;
  }

}

function canvasMousePressed() {
  if(bezierCurves && bezierCurves.length) {
    if(selectedFunction === 'add') {
      // add
      bezierCurves[selectedCurve].addPoint(mouseX, mouseY);

    } else if(selectedFunction === 'move') {
      // move
      let index = getCurvePoint(selectedCurve, mouseX, mouseY);

      if(! (bezierCurves[selectedCurve].controlPoints && bezierCurves[selectedCurve].controlPoints.length)) {
        toast.error('Crie pontos de controle antes de movê-los!');
      }

      if(index !== null) {
        dragging = true;
        draggingIndex = index;
      }


    } else {
      // delete
      let index = getCurvePoint(selectedCurve, mouseX, mouseY);
      if(index !== null) {
        bezierCurves[selectedCurve].removePoint(index);
      }
    }
  } else {
    toast.error('Não há curvas cadastradas!');
  }
}

function deleteCurvePressed() {
  bezierCurves.splice(selectedCurve, 1);
  atualizeCurveSelector();
}

function changedResolution() {
  howManyPoints = curveResolutionInput.value();
}

function handleControlPointsClick() {
  if(this.checked()) {
    showControlPoints = true;
  } else {
    showControlPoints = false;
  }
}

function handleControlPolygonalClick() {
  if(this.checked()) {
    showControlPolygonal = true;
  } else {
    showControlPolygonal = false;
  }
}

function handleCurvesClick() {
  if(this.checked()) {
    showCurves = true;
  } else {
    showCurves = false;
  }
}

function reset() {
  bezierCurves = [];
  atualizeCurveSelector();
  displayAllCurves();
}

// ================ SETUP & DRAW ================

function setup() {

  // linkando inputs com HTML
  addCurveBtn = select('#add-curve');
  selectCurveSel = select('#curve-select');
  deleteCurveBtn = select('#delete-curve');
  curveResolutionInput = select('#curve-resolution');
  setCurveResolution = select('#set-curve-resolution');
  controlPointsFlag = select('#control-points');
  controlPolygonFlag = select('#control-polygon');
  curvesFlag = select('#curves');
  resetBtn = select('#reset');

  curveResolutionInput.value(howManyPoints);

  // listeners
  addCurveBtn.mousePressed(addNewCurve);
  selectCurveSel.changed(selectChanged);
  deleteCurveBtn.mousePressed(deleteCurvePressed);
  setCurveResolution.mousePressed(changedResolution);
  controlPointsFlag.changed(handleControlPointsClick);
  controlPolygonFlag.changed(handleControlPolygonalClick);
  curvesFlag.changed(handleCurvesClick);
  resetBtn.mousePressed(reset);
  
  // set canvas based on div width and height
  let canvasContainerDiv = $('#canvas-container');
  let height = canvasContainerDiv.innerHeight();
  let width = canvasContainerDiv.innerWidth();
  let canvas = createCanvas(width, height);
  canvas.parent('canvas-container');
  canvas.mousePressed(canvasMousePressed);
}

function draw() {

  // call drawing functions here
  
  if(dragging) {
    let c = selectedCurve;
    let i = draggingIndex;

    bezierCurves[c].updatePoint(i, mouseX, mouseY);
  }

  displayAllCurves();

  //console.log(bc.insideControlPoint(1000, 1000));
}

function mouseReleased() {
  if(dragging) {
    dragging = false;
    draggingCurve = null;
    draggingIndex = null;
  }
}

function keyPressed() {

}

// ================ CLASSES OBJECTS ================

class BezierCurve {
  constructor(controlPoints) {
    this.controlPoints = [];
    if(controlPoints) {
      this.controlPoints = controlPoints;
    }

    this.curvePoints = this.computePoints(howManyPoints);
  }

  // custom functions of the class here
  display(index) {
    this.setCurve();

    if(this.controlPoints && this.controlPoints.length) { // only if there are control points
      if(showControlPoints) {
        if(index == selectedCurve) {
          stroke('green');
        } else {
          stroke('gray');
        }
        strokeWeight(DOT_SIZE);
        for(let i = 0; i < this.controlPoints.length; i++) { 
          point(this.controlPoints[i].x, this.controlPoints[i].y);
        }
      }
  
      if(showControlPolygonal) {
        if(index == selectedCurve) {
          stroke('red');
        } else {
          stroke('gray');
        }
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
    if(this.controlPoints) {
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

    return null;
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

  addPoint(x, y) {
    this.controlPoints.push({x: x, y: y});
    return 1;
  }

  updatePoint(pos, x, y) {
    if(this.controlPoints && this.controlPoints[pos]) {
      this.controlPoints[pos] = {x: x, y: y};
      return 1;
    }

    return 0;
  }

  removePoint(pos) {
    this.controlPoints.splice(pos, 1);
  }
}
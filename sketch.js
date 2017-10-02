let shapes = [];
let newShape = null;
let selectedShape = null;
let drawing = false;
let curve = false;

let myStroke = 255;
let myStrokeWeight = 1;
let myFill = -1;
let myCurve = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  for(let i = 0; i < shapes.length ; i++)
    shapes[i].draw(i == selectedShape);
  if (newShape) newShape.draw(true);

  displayMode();

  displayHelp();
}

function displayMode() {
  drawButton(0, 0);
  drawButton(0, 20);
  drawButton(0, 40);
  drawButton(0, 60);
  drawButton(0, 80);

  fill(255);
  noStroke();

  let s = selectedShape != null ? shapes[selectedShape].stroke : myStroke;
  let w = selectedShape != null ? shapes[selectedShape].strokeWeight : myStrokeWeight;
  let f = selectedShape != null ? shapes[selectedShape].fill : myFill;
  let c = selectedShape != null ? shapes[selectedShape].curve : myCurve;

  text("Mode: " + (drawing ? "Draw" : "Select"), 25, 16);
  text("Stroke: " + (s == -1 ? "None" : s), 25, 36);
  text("Stroke weight: " + w, 25, 56);
  text("Fill: " + (f == -1 ? "None" : f), 25, 76);
  text("Shape: " + (c ? "Curve" : "Polygon"), 25, 96);
}

function displayHelp() {
  text("(M)ode (S)troke Stroke(w)eight (F)ill (C)urve (Del)ete z-(Up) z-(Down)", 20, windowHeight - 20);
}

function drawButton(x, y) {
  stroke(0);
  strokeWeight(2);
  fill(255);

  rect(x, y, 20, 20);
  rect(x+5, y+5, 10, 10);
}

function mousePressed() {
  if (mouseX < 20 && mouseY < 100) {
    if (mouseY < 20)
      switchMode();
    else if (mouseY < 40)
      updateRelevantStroke();
    else if (mouseY < 60)
      updateRelevantStrokeWeight();
    else if (mouseY < 80)
      updateRelevantFill();
    else
      updateRelevantCurve();
    return false;
  }

  if (drawing) {
    newShape.push(mouseX, mouseY);
  } else {
    let didSelect = false;
    for (let i = 0; i < shapes.length; i++)
      if (mouseInShape(shapes[i])) {
        selectedShape = i;
        didSelect = true;
      }
    if (!didSelect) selectedShape = null;
  }

  return false;
}


function keyPressed() {
  switch (keyCode) {
    case 77: //m
      switchMode();
      break;
    case 83: //s
      updateRelevantStroke();
      break;
    case 87: //w
      updateRelevantStrokeWeight();
      break;
    case 70: //f
      updateRelevantFill();
      break;
    case 67: //c
      updateRelevantCurve();
      break;
    case DELETE:
      if (drawing || selectedShape == null) break;
      shapes.splice(selectedShape, 1);
      selectedShape = null;
      break;
    case DOWN_ARROW:
      if (drawing || selectedShape == null) break;
      if (selectedShape != 0) {
        let t = shapes[selectedShape - 1];
        shapes[selectedShape - 1] = shapes[selectedShape];
        shapes[selectedShape] = t;
        selectedShape--;
      }
      break;
    case UP_ARROW:
      if (drawing || selectedShape == null) break;
      if (selectedShape != (shapes.length - 1)) {
        let t = shapes[selectedShape + 1];
        shapes[selectedShape + 1] = shapes[selectedShape];
        shapes[selectedShape] = t;
        selectedShape++;
      }
      break;
  }
}

function switchMode() {
  if (drawing) {
    if (newShape.vertices.length)
      shapes.push(newShape);
    newShape = null;
  } else {
    selectedShape = null;
    newShape = new Shape(myStroke, myStrokeWeight, myFill, myCurve);
  }
  drawing = !drawing;
}

function updateRelevantStroke() {
  let s;
  if (selectedShape != null)
    s = shapes[selectedShape].stroke;
  else
    s = myStroke;

  s = +prompt("Stroke:", (s == -1 ? "None" : s));
  if (isNaN(s) || s < 0)
    s = -1;

  if (selectedShape != null)
    shapes[selectedShape].stroke = s;
  else {
    myStroke = s;
    if (newShape != null) newShape.stroke = s;
  }
}

function updateRelevantStrokeWeight() {
  let w;
  if (selectedShape != null)
    w = shapes[selectedShape].strokeWeight;
  else
    w = myStrokeWeight;

  w = +prompt("Stroke weight:", w);

  if (selectedShape != null)
    shapes[selectedShape].strokeWeight = w;
  else {
    myStrokeWeight = w;
    if (newShape != null) newShape.strokeWeight = w;
  }
}

function updateRelevantFill() {
  let f;
  if (selectedShape != null)
    f = shapes[selectedShape].fill;
  else
    f = myFill;

  f = +prompt("Fill:", (f == -1 ? "None" : f));
  if (isNaN(f) || f < 0)
    f = -1;

  if (selectedShape != null)
    shapes[selectedShape].fill = f;
  else {
    myFill = f;
    if (newShape != null) newShape.fill = f;
  }
}

function updateRelevantCurve() {
  if (selectedShape != null)
    shapes[selectedShape].curve = !shapes[selectedShape].curve;
  else {
    myCurve = !myCurve;
    if (newShape != null) newShape.curve = myCurve;
  }
}

function mouseInShape(shape) {
  // Stolen from https://github.com/substack/point-in-polygon/blob/master/index.js
  let x = mouseX, y = mouseY, vs = shape.vertices;

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0], yi = vs[i][1];
    var xj = vs[j][0], yj = vs[j][1];

    var intersect = ((yi > y) != (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

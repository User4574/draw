function Shape(s, w, f, c) {
  this.vertices = [];
  this.stroke = s;
  this.strokeWeight = w;
  this.fill = f;
  this.curve = c;

  this.push = function(x, y) {
    this.vertices.push([x, y]);
  };

  this.draw = function(selected = false) {
    let smod = selected ? 2 : 0;

    if (!selected && this.fill != -1)
      fill(this.fill);
    else
      noFill();

    if (selected)
      stroke(255);
    else
      if (this.stroke == -1)
        noStroke();
      else
        stroke(this.stroke);

    if (selected) {
      strokeWeight((this.strokeWeight + smod) * 2 + 2);
      for (let i = 0; i < this.vertices.length; i++)
        point(this.vertices[i][0], this.vertices[i][1]);
    }

    strokeWeight(this.strokeWeight + smod);
    beginShape();
    for (let i = 0; i < this.vertices.length; i++)
      if (this.curve)
        curveVertex(this.vertices[i][0], this.vertices[i][1]);
      else
        vertex(this.vertices[i][0], this.vertices[i][1]);
    endShape((!selected && !this.curve) ? CLOSE : OPEN);
  };
}

// Initiate window
var x1 = 50;
var y1 = 50;
var x2 = 300;
var y2 = 300;
var x3, y3;

var drag1 = document.getElementById("drag-1");
var drag2 = document.getElementById("drag-2");
drag1.style.transform = 'translate(' + x1 + 'px, ' + y1 + 'px)';
drag2.style.transform = 'translate(' + x2 + 'px, ' + y2 + 'px)';

redraw(false);
toggleGrid();

interact('.draggable')
  .draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    autoScroll: false,

    listeners: {
      move: dragMoveListener,
      end (event) {
      }
    }
  });

// Get the coordinates of the intermediate point
function getThirdPoint() {
    dx = x2 - x1;
    dy = y2 - y1;
    length = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    parallelScale = document.getElementById("p3par").value / 100;
    perpendicularScale = document.getElementById("p3per").value / 100;

    xParallel = parallelScale * dx;
    yParallel = parallelScale * dy;
    xPerpendicular = perpendicularScale * dy;
    yPerpendicular = -perpendicularScale * dx;

    p3 = new Array();
    p3[0] = x1 + xPerpendicular + xParallel;
    p3[1] = y1 + yPerpendicular + yParallel;
    return p3;
}

// Event listener for dragging points
function dragMoveListener(event) {
    var target = event.target;
    x = event.pageX;
    y = event.pageY;

    if (target.id == "drag-1") {
        x1 = x;
        y1 = y;
    }
    else if (target.id == "drag-2") {
        x2 = x;
        y2 = y;
    }
    else if (target.id == "intermediate") {
        x3 = x;
        y3 = y;
        dx = x2 - x1;
        dy = y2 - y1;
        document.getElementById("p3par").value = Math.floor(100*(x1*x1 - x1*x2 - x1*x3 + x2*x3 + y1*y1 - y1*y2 - y1*y3 + y2*y3)/(x1*x1 - 2*x1*x2 + x2*x2 + y1*y1 - 2*y1*y2 + y2*y2));
        document.getElementById("p3per").value = Math.floor(100*(-x1*y3 + y2*x1 - x2*y1 + x2*y3 + x3*y1 - y2*x3)/(-x1*x1 + 2*x1*x2 - x2*x2 - y1*y1 + 2*y1*y2 - y2*y2));
    }

    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    if (target.id == "intermediate") {
        redraw(true);
    }
    else {
        redraw(false);
    }
    
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// Redraw graphics
function redraw(intermediate) {
    if (!intermediate) {
        p3 = getThirdPoint();
        x3 = p3[0];
        y3 = p3[1];
    }
    x = x3;
    y = y3;
    document.getElementById("intermediate").style.transform = 'translate(' +
                                                                x +
                                                                'px, ' +
                                                                y +
                                                                'px)';
    offset = 0;
    x1string = Math.floor(offset + x1);
    y1string = Math.floor(offset + y1);
    x2string = Math.floor(offset + x2);
    y2string = Math.floor(offset + y2);
    x3string = Math.floor(offset + x);
    y3string = Math.floor(offset + y);
    document.getElementById('bezierCurve').setAttribute("d", "M " + x1string + "," + y1string +
                                                        " C " +
                                                        x1string + "," + y1string + " " +
                                                        x3string + "," + y3string + " " +
                                                        x2string + "," + y2string);

    line1 = document.getElementById('helperLine1');
    line2 = document.getElementById('helperLine2');
    line1.setAttribute("x1", x1);
    line1.setAttribute("x2", x);
    line1.setAttribute("y1", y1);
    line1.setAttribute("y2", y);
    line2.setAttribute("x1", x);
    line2.setAttribute("x2", x2);
    line2.setAttribute("y1", y);
    line2.setAttribute("y2", y2);

    updateCoordinates();

    document.getElementById("length").value = Math.floor(document.getElementById('bezierCurve').getTotalLength());
}

// Redraw based on parallel/perpendicular offset input
function redrawFromInput() {
    p3par = document.getElementById("p3par");
    p3per = document.getElementById("p3per");
    if (isNaN(p3par.value)) {
        p3par.value = 50;
    }
    if (isNaN(p3per.value)) {
        p3per.value = 50;
    }
    p3par.value = Math.floor(p3par.value);
    p3per.value = Math.floor(p3per.value);
    redraw(false);
}

// Redraw based on length input
function redrawFromLength() {
    length = document.getElementById("length");
    if (isNaN(length.value)) {
        length.value = 0;
    }

    newLength = Math.floor(length.value);
    width = document.getElementById("rootWindow").offsetWidth;
    height = document.getElementById("rootWindow").offsetHeight;

    x1 = 100;
    y1 = 300;
    x2 = 1000;
    y2 = 300;
    drag1.style.transform = 'translate(' + x1 + 'px, ' + y1 + 'px)';
    drag2.style.transform = 'translate(' + x2 + 'px, ' + y2 + 'px)';
    redraw(false);
    
    currentLength = Math.floor(document.getElementById('bezierCurve').getTotalLength());
    dx = Math.floor((x2 - x1) * newLength / currentLength);
    dy = Math.floor((y2 - y1) * newLength / currentLength);
    x1new = Math.floor(width / 2 - dx / 2);
    y1new = Math.floor(height / 2 - dy / 2);
    x2 = x1new + dx;
    y2 = y1new + dy;
    x1 = x1new;
    y1 = y1new;
    drag1.style.transform = 'translate(' + x1 + 'px, ' + y1 + 'px)';
    drag2.style.transform = 'translate(' + x2 + 'px, ' + y2 + 'px)';
    redraw(false);
}

// Update coordinate text next to points
function updateCoordinates() {
    intermediateCoord = document.getElementById("intermediateCoord");
    drag1Coord = document.getElementById("drag1Coord");
    drag2Coord = document.getElementById("drag2Coord");
    offset = 10;

    intermediateCoord.setAttribute("x", x3 + offset);
    intermediateCoord.setAttribute("y", y3 + offset);
    drag1Coord.setAttribute("x", x1 + offset);
    drag1Coord.setAttribute("y", y1 + offset);
    drag2Coord.setAttribute("x", x2 + offset);
    drag2Coord.setAttribute("y", y2 + offset);

    intermediateCoord.innerHTML = "(" + Math.floor(x3) + "," + Math.floor(y3) + ")";
    drag1Coord.innerHTML = "(" + Math.floor(x1) + "," + Math.floor(y1) + ")";
    drag2Coord.innerHTML = "(" + Math.floor(x2) + "," + Math.floor(y2) + ")";

    document.getElementById("x1coord").value = Math.floor(x1);
    document.getElementById("y1coord").value = Math.floor(y1);
    document.getElementById("x2coord").value = Math.floor(x2);
    document.getElementById("y2coord").value = Math.floor(y2);
    document.getElementById("x3coord").value = Math.floor(x3);
    document.getElementById("y3coord").value = Math.floor(y3);
}

// Redraw graph from input coordinates
function redrawFromCoordinates() {
    coordX1 = document.getElementById("x1coord").value;
    coordY1 = document.getElementById("y1coord").value;
    coordX2 = document.getElementById("x2coord").value;
    coordY2 = document.getElementById("y2coord").value;
    coordX3 = document.getElementById("x3coord").value;
    coordY3 = document.getElementById("y3coord").value;

    if (isNaN(coordX1)) {
        coordX1 = 0;
    }
    if (isNaN(coordX2)) {
        coordX2 = 0;
    }
    if (isNaN(coordX3)) {
        coordX3 = 0;
    }
    if (isNaN(coordY1)) {
        coordY1 = 0;
    }
    if (isNaN(coordY2)) {
        coordY2 = 0;
    }
    if (isNaN(coordY3)) {
        coordY3 = 0;
    }
    
    x1 = parseInt(coordX1);
    y1 = parseInt(coordY1);
    x2 = parseInt(coordX2);
    y2 = parseInt(coordY2);
    x3 = parseInt(coordX3);
    y3 = parseInt(coordY3);

    drag1.style.transform = 'translate(' + x1 + 'px, ' + y1 + 'px)';
    drag2.style.transform = 'translate(' + x2 + 'px, ' + y2 + 'px)';
    dx = x2 - x1;
    dy = y2 - y1;
    document.getElementById("p3par").value = Math.floor(100*(x1*x1 - x1*x2 - x1*x3 + x2*x3 + y1*y1 - y1*y2 - y1*y3 + y2*y3)/(x1*x1 - 2*x1*x2 + x2*x2 + y1*y1 - 2*y1*y2 + y2*y2));
    document.getElementById("p3per").value = Math.floor(100*(-x1*y3 + y2*x1 - x2*y1 + x2*y3 + x3*y1 - y2*x3)/(-x1*x1 + 2*x1*x2 - x2*x2 - y1*y1 + 2*y1*y2 - y2*y2));
    redraw(true);
}

// Toggle background grid
function toggleGrid() {
    checkbox = document.getElementById("showGrid");
    rootWindow = document.getElementById("rootWindow");
    if (checkbox.checked) {
        rootWindow.setAttribute("class", "bgGrid");
    } else {
        rootWindow.setAttribute("class", "");
    }
}

// Toggle background grid (from pressing label text instead of checkbox)
function toggleGridFromLabel() {
    document.getElementById("showGrid").checked ^= 1;
    toggleGrid();
}

window.dragMoveListener = dragMoveListener;

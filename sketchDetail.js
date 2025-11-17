let vulcani;
let mioFont, mioFontBold;
let selectedVolcano;


let minEle, maxEle;
let cone, stratovolcano, caldera, crater, shieldvolcano, subglacial, submarine, maars, unknown;

let size = 400
let x = 80
let y = 100;

function preload() {
  vulcani = loadTable("assets/volcanoes.csv", "csv", "header");
  mioFontBold = loadFont("assets/Quicksand-Bold.ttf");
  mioFont = loadFont("assets/Quicksand-Medium.ttf");

  cone = loadImage("A/cone2.png");
  stratovolcano = loadImage("A/stratovolcanoH.png");
  caldera = loadImage("A/calderaH.png");
  crater = loadImage("A/crater5.png");
  shieldvolcano = loadImage("A/shieldvolcano3.png");
  subglacial = loadImage("A/subglacial.png");
  submarine = loadImage("A/submarineH.png");
  maars = loadImage("A/maars1.png");
  unknown = loadImage("A/unknownH.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(mioFont);
  background(23, 17, 35);
  angleMode(DEGREES);

  // Recupero dei parametri dall'URL
  let params = getURLParams();
  let volcanoName = params.Volcano_Name ? decodeURIComponent(params.Volcano_Name).trim().toLowerCase() : null;
  let lat = params.Latitude ? parseFloat(params.Latitude) : null;
  let lon = params.Longitude ? parseFloat(params.Longitude) : null;

  selectedVolcano = null;

 

  // Cerco il vulcano corrispondente nella tabella
  for (let r = 0; r < vulcani.getRowCount(); r++) {
    let row = vulcani.getRow(r);
    let rowName = row.getString("Volcano Name").trim().toLowerCase();

    if (rowName === volcanoName) {
      if (volcanoName === "unnamed" && lat !== null && lon !== null) {
        let rowLat = parseFloat(row.getString("Latitude"));
        let rowLon = parseFloat(row.getString("Longitude"));
        if (Math.abs(rowLat - lat) < 0.0001 && Math.abs(rowLon - lon) < 0.0001) {
          selectedVolcano = row;
          break;
        }
      } else {
        selectedVolcano = row;
        break;
      }
    }
  }

  if (!selectedVolcano) console.log("Vulcano non trovato:", volcanoName);
  else console.log("Vulcano selezionato:", selectedVolcano.getString("Volcano Name"));

  
}



function draw() {
  background(23, 17, 35);
  drawVolcanoDetails(selectedVolcano);


}



function drawVolcano(type) {
  push();
  
  noTint();

  if (type === "Cone"){
    tint(251,139,36);
    image(cone, x, y, size, size);
  }
  else if (type === "Stratovolcano"){
    tint(236,164,0);
    image(stratovolcano, x, y, size, size);
  }
  else if (type === "Caldera"){
    tint(227,100,20);
    image(caldera, x -20, y + 70, size*1.2, size*0.7);
  }
  else if (type === "Crater System"){
    tint(130, 113, 145);
    image(crater, x, y +200, size, size / 4 );
  }
  else if (type === "Shield Volcano"){
    tint(247, 160, 114); 
    image(shieldvolcano, x- 20, y + 70, size*1.2, size * 0.7);
  }
  else if (type === "Subglacial"){
    tint(221, 240, 255);
    image(subglacial, x, y, size, size);
  }
  else if (type === "Submarine Volcano"){ 
    tint(91, 133, 170);
    image(submarine, x, y, size, size)
  }
  else if (type === "Maars / Tuff ring"){
    tint(156, 13, 56);
    image(maars, x, y, size*1.2, size);
  }
  else {
    
    tint(163,145,113);
    image(unknown, x, y, size, size);
  }

  pop();
}

function drawVolcanoDetails(volcano) {
  if (!volcano) {
    fill(255);
    textAlign(CENTER);
    textFont(mioFont);
    textSize(24);
    text("Volcano not found. return to the map.", width / 2, height / 2);

    textSize(16);
    fill(246, 198, 76);
    text("Back to the map", width / 2, height / 2 + 50);
    return;
  }

  

  
  drawVolcano(volcano.get("TypeCategory"), x, y, size);

  
  textFont(mioFontBold);
  fill(255);
  textSize(40);
  textAlign(CENTER);
  let name = volcano.get("Volcano Name");
  text(name, x + size/2, size + 180);

  
  
  textSize(18);
  textAlign(LEFT);
  let yStart = 100;
  let xStart = windowWidth/2 + 50
  let textSpace = 5

  let country = volcano.get("Country");
  let location = volcano.get("Location");
  let lat = volcano.get("Latitude");
  let lon = volcano.get("Longitude");
  let elevation = volcano.get("Elevation (m)");
  let type = volcano.get("Type");
  let typeCategory = volcano.get("TypeCategory")
  let status = volcano.get("Status");
  let lastEruption = volcano.get("Last Known Eruption");
  
  textFont(mioFont);
  text(`Country: ${country}, ${location}`, xStart, yStart ); 
  text(`Location: ${lat}° Lat , ${lon}° Lon`, xStart, yStart + 30 ); 
   
  text(`Type: ${type}`,xStart, yStart + 60);
  text(`Category: ${typeCategory} `, xStart, yStart + 90); 

  text(`Elevation: ${elevation} m`, xStart, yStart + 150);

  text(`Status: ${status} `, xStart, yStart + 430); 

  text(`Last Eruption: ${lastEruption}`, xStart, yStart + 460); 

  /*textFont(mioFont);
  text(`${country}, ${location}`, xStart + 7*4,5 + textSpace, yStart);
  text(`${lat}° Lat | ${lon}° Lon`, xStart+ textSpace, yStart+30);
  text(`${elevation} m `, xStart+ textSpace, yStart + 60);
  text(`${type} `, xStart+ textSpace, yStart + 90);
  text(`${typeCategory} `, xStart + textSpace, yStart + 120);
  text(`${status} `, xStart + textSpace, yStart + 150);
  text(`${lastEruption}`, xStart + textSpace, yStart + 180);*/

  drawTriangle(volcano);
  drawEruption(volcano);

}

function drawTriangle(volcano) {
  if (!volcano) return;

  let ele = parseFloat(volcano.get("Elevation (m)"));
  if (isNaN(ele)) ele = 0;

  
  let minElev = -6000;
  let maxElev = 6000;

  
  let xCenter = windowWidth/ 2 + 250;
  let yBase = 360;

  
  let scaleX = windowWidth/ 2 + 270;
  let scaleTop = yBase - 100;   // 6000
  let scaleBottom = yBase + 100; // -6000

  
  let h = map(ele, minElev, maxElev, 100, -100);

  
  //let size = map(abs(ele), 0, maxElev, 20, 120);

  
  fill(246,198,76);
  noStroke();

  
    
    triangle(
      xCenter, yBase + h,
      xCenter - 20, yBase,
      xCenter + 20, yBase
    );
  

 
  stroke(91, 82, 104);
  strokeWeight(2);
  line(scaleX, scaleTop, scaleX, scaleBottom);

  strokeWeight(2);
  line(scaleX - 10, scaleTop, scaleX + 10, scaleTop);

  
  let y3000 = map(3000, maxElev, minElev, scaleTop, scaleBottom);
  line(scaleX - 8, y3000, scaleX + 8, y3000);

  
  let y0 = map(0, maxElev, minElev, scaleTop, scaleBottom);
  line(scaleX - 100, y0, scaleX + 12, y0);

  
  let yMinus3000 = map(-3000, maxElev, minElev, scaleTop, scaleBottom);
  line(scaleX - 8, yMinus3000, scaleX + 8, yMinus3000);

  
  let yMinus6000 = scaleBottom;
  line(scaleX - 10, yMinus6000, scaleX + 10, yMinus6000);

  
  noStroke();
  fill(255);
  textAlign(LEFT);
  textSize(14);

  text("+6000 m", scaleX + 15, scaleTop + 5);
  text("+3000 m", scaleX + 15, y3000 + 5);
  
  fill(255, 220, 100);
  text("0 m", scaleX + 15, y0 + 5);

  fill(255);
  text("-3000 m", scaleX + 15, yMinus3000 + 5);
  text("-6000 m", scaleX + 15, scaleBottom + 5);

}

function drawEruption(volcano){
  if (!volcano) return;

  let eruption = volcano.get("Last Known Eruption");
  

  push();
  let xR = windowWidth/2 + 50;
  let yR = 620;
  let w = 30;
  let h = 30;
  let d = 5;
  let dd = 5;

  let w1 = w*0.46;
  let w2 = w*0.64;
  let w3 = w*2
  let w4 = w*4
  let w5 = w*5
  

  if(eruption === "D1"){
  fill(246,198,76);
  rect(xR,yR, w1, h, 5);}
  else {
    fill(91, 82, 104);
    rect(xR,yR, w1, h, 5);
  }
  if(eruption === "D2"){
  fill(246,198,76);
  rect(xR + w1 + d, yR, w2, h, 5);}
  else {
    fill(91, 82, 104);
    rect(xR + w1 + d, yR, w2, h, 5);
  }
  if(eruption === "D3"){
  fill(246,198,76);
  rect(xR + w1 + w2 + 2*d, yR, w, h, 5);}
  else {
    fill(91, 82, 104);
    rect(xR + w1 + w2 + 2*d, yR, w, h, 5)
  }
  if(eruption === "D4"){
  fill(246,198,76);
  rect(xR + w1 + w2 + w + 3*d, yR, w, h, 5);}
  else {
    fill(91, 82, 104);
    rect(xR + w1 + w2 + w + 3*d, yR, w, h, 5)
  }
  if(eruption === "D5"){
  fill(246,198,76);
  rect(xR +w1 + w2 + 2*w + 4*d, yR, w3, h, 5);}
  else {
    fill(91, 82, 104);
    rect(xR +w1 + w2 + 2*w + 4*d, yR, w3, h, 5)
  }
  if(eruption === "D6"){
  fill(246,198,76);
  rect(xR +w1 + w2 + 2*w +  w3 + 5*d, yR, w4, h, 5);}
  else {
    fill(91, 82, 104);
    rect(xR +w1 + w2 + 2*w +  w3 + 5*d, yR, w4, h, 5)
  }
  if(eruption === "D7"){
  fill(246,198,76);
  rect(xR +w1 + w2 + 2*w +  w3 + w4 + 6*d, yR, w5, h, 5);}
  else {
    fill(91, 82, 104);
    rect(xR +w1 + w2 + 2*w +  w3 + w4 + 6*d, yR, w5, h, 5)
  }

  textSize(12)
  if (["U", "U1", "U7"].includes(eruption)){
  fill(200);
  text('Undated, but probable Holocene eruption', xR+ 150, yR - 60);}
  else if (["Q", "D", "P"].includes(eruption)){
  fill(200);
  text('Quaternary eruption(s)', xR + 150, yR - 60);}
  else if (["Unknown", "?"].includes(eruption)){
  fill(200);
  text('Uncertain Holocene eruption', xR + 220, yR -60);}
  
  

  
  
  
  
  stroke(91, 82, 104);
  strokeWeight(2);
  line(xR, yR + h+ 5, windowWidth /2 + 500, yR + h+ 5);

  

  //1964
  line(xR + w1 + dd, yR + h+ 5,xR + w1 + dd, yR + h+ 15);

  //1900
  line(xR + w1 + w2 + 2*dd, yR + h+ 5,xR + w1 + w2 + 2*dd, yR + h+ 15);

  //1800
  line(xR + w1 + w2 + w+ 3*dd, yR + h+ 5,xR + w1 + w2 + w + 3*dd, yR + h+ 15);

  //1700
  line(xR + w1 + w2 + 2*w + 4*dd, yR + h+ 5,xR + w1 + w2 + 2*w +4*dd, yR + h+ 15);

  //1500
  line(xR + w1 + w2+ 2*w + w3 + 5*dd, yR + h+ 5,xR + w1 + w2 + 2*w + w3 + 5*dd, yR + h+ 15);

  //0
  line(xR + w1 + w2 + 2*w + w3+ w4 + 6*dd, yR + h+ 5,xR + w1 + w2 + 2*w + w3 + w4 + 6*dd, yR + h+ 15);

  noStroke();
  fill(255)
  textSize(10);
  text('Now', xR-30, yR + h+ 20);
  text('1964', xR + w1 + dd- 15, yR + h+ 30);
  text('1900', xR + w1 + w2 + 2* dd- 15, yR + h+ 30);
  text('1800', xR + w1 + w2 + w + 3* dd- 15, yR + h+ 30);
  text('1700', xR + w1 + w2 + 2*w + 4* dd- 15, yR + h+ 30);
  text('1500', xR + w1 + w2 + 2*w + w3 + 5* dd- 15, yR + h+ 30);
  text('0', xR + w1 + w2 + 2*w + w3+ w4 + 6*dd - 3, yR + h+ 30);
  text('B.C.', xR + w1 + w2 + 2*w + w3+ w4 + 6*dd + w5, yR + h+ 20)

  pop();

  push();
  let rectWidths = [w1, w2, w, w, w3, w4, w5];
  let rectLabels = ["D1","D2","D3","D4","D5","D6","D7"];
  let rectX = xR;

  textSize(12);
  textAlign(CENTER, BOTTOM);
  fill(255); 

  for(let i = 0; i < rectWidths.length; i++){
  text(rectLabels[i], rectX + rectWidths[i]/2, yR - 5);
  rectX += rectWidths[i] + d; 

  }
  pop();





}



/*function saveFilters() {
  o
  let types = ["Cone", "Stratovolcano", "Caldera", "Crater System", "Shield Volcano", "Subglacial", "Submarine Volcano", "Maars / Tuff ring", "Unknown"];
  let selectedTypes = [];

  types.forEach(type => {
    let checkbox = document.getElementById(type); 
    if (checkbox && checkbox.checked) selectedTypes.push(type);
  });

  localStorage.setItem("selectedTypes", JSON.stringify(selectedTypes));
}*/


function mouseClicked() {



  if (!selectedVolcano) {
    let linkX = width / 2;
    let linkY = height / 2 + 50;

    if (mouseX > linkX - 100 && mouseX < linkX + 100 &&
        mouseY > linkY - 15 && mouseY < linkY + 5) {
      saveFilters();
      window.location.href = "index.html";
    }
  }
}



let vulcani
let minLat, maxLat, minLon, maxLon;
let minEle,maxEle;
let cone, stratovolcano, caldera, crater, shieldvolcano, subglacial, submarine, maars, unknown;
let padding = 200
let yEquator;
let mioFontBold;
let mioFont;
let hovered = null;




function preload() {

  vulcani = loadTable("assets/volcanoes.csv","csv","header");
  cone = loadImage("A/cone2.png");
  stratovolcano = loadImage("A/stratovolcanoH.png");
  caldera = loadImage("A/calderaH.png");
  crater = loadImage("A/crater5.png");
  shieldvolcano = loadImage("A/shieldvolcano3.png");
  subglacial = loadImage("A/subglacial.png");
  submarine= loadImage("A/submarineH.png");
  maars = loadImage("A/maars1.png")
  unknown = loadImage("A/unknown.png");
  mioFontBold = loadFont("assets/Quicksand-Bold.ttf");
  mioFont = loadFont("assets/Quicksand-Medium.ttf");
  

  
  // put preload code here
}

/*function loadFilters() {
  let saved = localStorage.getItem("selectedTypes");
  if (!saved) return;

  let selectedTypes = JSON.parse(saved);
  selectedTypes.forEach(type => {
    let checkbox = document.getElementById(type);
    if (checkbox) checkbox.checked = true;
  });

  
}*/

function setup() {
  createCanvas(windowWidth, 1000);
  //loadFilters();
  imageMode(CENTER);
  textFont(mioFont);
  angleMode(DEGREES)
 
  let allLat = vulcani.getColumn("Latitude").map(Number);
  let allLon = vulcani.getColumn("Longitude").map(Number);
  let allEle = vulcani.getColumn("Elevation (m)").map(Number);
  

  console.log(allEle);

  
  minLat = min(allLat);
  maxLat = max(allLat);
  minLon = min(allLon);
  maxLon = max(allLon);
  minEle = min(allEle);
  maxEle = max(allEle);



  let l = width /2 - 320 //1100 //650
  let m = width/2 - 100//880 //430
  let n = width/2 + 120 //660 // 210

  
  showCone = createCheckbox('Cones', true);
  showCone.position(l, 30);
  showStratovolcano = createCheckbox('Stratovolcanoes', true);
  showStratovolcano.position(l, 60);
  showCrater = createCheckbox('Craters', true);
  showCrater.position(l, 90);
  showCaldera = createCheckbox('Calderas', true);
  showCaldera.position(m, 30);
  showShieldvolcano = createCheckbox('Shield volcanoes', true);
  showShieldvolcano.position(m, 60);
  showSubglacial = createCheckbox('Subglacial', true);
  showSubglacial.position(m, 90);
  showSubmarine = createCheckbox('Submarines', true);
  showSubmarine.position(n, 30);
  showMaars = createCheckbox('Maars / Tuff ring', true);
  showMaars.position(n,60)
  showUnknown = createCheckbox('Unknown / others', true);
  showUnknown.position(n, 90);
 
  styleAllCheckboxes("white", "Arial", 15, "#ff6600");
}

function draw() {
  background (23, 17, 35); //15,76,92
  drawLines();
  drawVulcani();
  drawLegenda();
  
}



 function drawVulcani() {

  hovered = null; 

  let hoveredVolcanoes = [];

  for (let rowNumber = 0; rowNumber < vulcani.getRowCount(); rowNumber++) {
    let lon = vulcani.getNum(rowNumber, "Longitude");
    let lat = vulcani.getNum(rowNumber, "Latitude");


    
    let name = vulcani.getString(rowNumber, "Volcano Name");

    let ele = 0

    try {
      ele = vulcani.getNum(rowNumber, "Elevation (m)");
    } catch(error){
      console.log('errore',name,':',error)
    }
    

    if (isNaN(ele)) ele = 0;
    ele = constrain(ele, minEle, maxEle);

    

    let x = map(lon, minLon, maxLon, 20, width - 20);
    let y = map(lat, minLat, maxLat, height - 20, 20 + padding);
    
    let c = map(ele, minEle, maxEle, 0, 1);
    let c1 = color("orange");
    let c2 = color ("red");
    let colore = lerpColor(c1, c2, c);


    let d = dist(x, y, mouseX, mouseY);
    
    

    

  
    noStroke();

    let type = vulcani.getString(rowNumber,"TypeCategory");
    let g = 15
    let isVisible = false

    
    if (d < 7) {
    g = 30;         
    tint(255, 230, 180); 
    } else {
    noTint();       
    }


    if(type === "Cone" && showCone.checked()){
    tint(251,139,36);
    image(cone, x, y, g, g,);
    noTint();
    isVisible = true
    }
    if(type === "Stratovolcano" && showStratovolcano.checked()){
    tint(236,164,0);
    image(stratovolcano, x, y, g, g);
    noTint();
    isVisible = true;
    }
    if(type === "Caldera" && showCaldera.checked()){
    tint(227,100,20);
    image(caldera, x, y, g, g);
    noTint();
    isVisible = true;
    }

    if(type === "Crater System" && showCrater.checked()){
    tint(130, 113, 145)
    image(crater, x, y, g, 5);
    noTint();
    isVisible = true;
    }

    if(type === "Other / Unknown" && showUnknown.checked()){
    tint(163,145,113)
    image(unknown, x, y, g, g);
    noTint();
    isVisible = true;
    }

    if(type === "Shield Volcano" && showShieldvolcano.checked()){
    tint(247, 160, 114)
    image(shieldvolcano, x, y, g, g);
    noTint();
    isVisible = true;
    }

    if(type === "Submarine Volcano" && showSubmarine.checked()){
    tint(91, 133, 170)
    image(submarine, x, y, g, g);
    noTint();
    isVisible = true;
    }

    if(type === "Subglacial" && showSubglacial.checked()){
    tint(221, 240, 255)
    image(subglacial, x, y, g, g);
    noTint();
    isVisible = true;
    }

    if(type === "Maars / Tuff ring" && showMaars.checked()){
    tint(156, 13, 56)
    image(maars, x, y, g, g);
    noTint();
    isVisible = true;
    }
    

    
    if(d < 5 && isVisible){
      hovered = { name, lat, lon, type };
      hoveredVolcanoes.push({name, x, y});
    }
      
  }

  hoveredVolcanoes.forEach((v, i) => {
    fill('white');
    text(v.name, v.x + 6, v.y + i * 15);
  });
} 


function drawLegenda() {


  let a = width/2 - 175//950
  let b = width/2 + 55//730
  let c = width/2 + 275//500
  let h = 40

  let img = 20

  tint(251,139,36);
  image(cone, a, h, img, img,);
  tint(236,164,0);
  image(stratovolcano, a, h + 30, img, img,);
  tint(130, 113, 145);
  image(crater, a, h + 60, img, img /2 ,);
  tint(227,100,20);
  image(caldera, b, h , img, img,);
  tint(247, 160, 114);
  image(shieldvolcano, b, h+ 30, img, img,);
  tint(221, 240, 255);
  image(subglacial, b, h + 60, img, img,);
  tint(91, 133, 170);
  image(submarine, c, h , img, img,);
  tint(156, 13, 56);
  image(maars, c, h + 30, img, img,);
  tint(163,145,113);
  image(unknown, c, h + 60, img, img,);

  push();
  translate(30, 100);
  textFont(mioFontBold);
  fill(246,198,76)
  textSize(30);
  text("volcanoes", -3, 20, 45)
  textSize(100);
  text("Es 3", -10, 0);
  pop();

}

function styleAllCheckboxes(textColor, font, size, accentColor) {
  
  let labels = selectAll('label');
  for (let l of labels) {
    l.style("color", textColor);
    l.style("font-family", "'Quicksand', Arial, sans-serif");
    l.style("font-size", size + "px");
    //l.style("font-weight", "bold");
  }

  
}

function drawLines(){

  let yEquator = map(0, minLat, maxLat, height - 20, 20 + padding);
  stroke(91, 82, 104);
  strokeWeight(2);
  line(20, yEquator, width - 20, yEquator);

  
  let xGreenwich = map(0, minLon, maxLon, 20, width - 20);
  stroke(91, 82, 104);
  strokeWeight(2);
  line(xGreenwich, 20 + padding, xGreenwich, height - 20);
  
  
  ellipse(xGreenwich, yEquator, 3, 3);

  console.log(yEquator);

  noStroke();
  fill(255);
  ellipse(xGreenwich, yEquator, 5, 5);

  push();

  let lonMouse = map(mouseX, 20, width - 20, minLon, maxLon);
  let latMouse = map(mouseY, height - 20, 20 + padding, minLat, maxLat);

  fill(255);
  textSize(16);
  text(`Lon: ${lonMouse.toFixed(4)}  Lat: ${latMouse.toFixed(4)}`, 20, 190);

  pop();

  textSize(12);
  fill(91, 82, 104);
  text("Equator", 20, yEquator -5);

  push();
  translate(xGreenwich -5, yEquator -325);
  rotate(-90);
  textSize(12);
  fill(91, 82, 104);
  text("M. Greenwich", 0, 0)
  
  
  pop();

  
}

function mousePressed() {
  if (hovered) {
    let latStr = hovered.lat.toFixed(6);
    let lonStr = hovered.lon.toFixed(6);

    let newURL = `detail.html?Volcano_Name=${encodeURIComponent(hovered.name)}&Latitude=${latStr}&Longitude=${lonStr}`;
    console.log("Redirecting to:", newURL);
    window.location.href = newURL;
  }
}


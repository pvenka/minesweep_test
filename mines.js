var grid = document.getElementById("grid");
var testMode = false; //Turn this variable to true to see where the mines are
var k = 0;
var vals = [];
var d = new Date();
var seconds = (d.getMinutes()+5) * 60 + d.getSeconds();
createGrid();
var timer = setInterval(myTimer,1000);
function myTimer() {
    var d = new Date();
    var t = d.toLocaleTimeString();
    document.getElementById("cTime").innerHTML = t;

}

function getMandN() {
   if (document.getElementById("nRC").value) {
  var n = document.getElementById("nRC").value;
}
   else { n = 8;}
  

   if (document.getElementById("nMines").value) {
  var m = document.getElementById("nMines").value;
   }
  else { m = 10}
   return [m,n];
  }
function createGrid() {
  //create an n by n grid
  timer;
  
  getmn = getMandN();
  m = getmn[0];
  n = getmn[1];
   if ((n < 4)  || (n > 40 )||(m < 4)  || (m > n*n-1)) {
    document.getElementById("result").style.color="#1A5276";
    document.getElementById("result").innerHTML = "Please choose a positive and resaonable number";
    
 }
  else {

  grid.innerHTML="";
  for (var i=0; i<n; i++) {
    row = grid.insertRow(i);
    for (var j=0; j<n; j++) {
      cell = row.insertCell(j);
      cell.onclick = function() { clickCell(this); };
      var mine = document.createAttribute("data-mine");       
      mine.value = "false";             
      cell.setAttributeNode(mine);
    }
  }
  addMines();
  document.getElementById("result").style.color="#1A5276";
  document.getElementById("result").innerHTML = "Game in Progress!";
  document.getElementById("score").innerHTML="SCORE: " + 0;
 }
}
//----------
//function addMines() {
//   getmn = getMandN();
//  m = getmn[0];
//  n = getmn[1];
  //Add m number of mines randomly
//  for (var i=0; i<m; i++) {
 //   var row = Math.floor(Math.random() * n);
 //   var col = Math.floor(Math.random() * n);
 //   var cell = grid.rows[row].cells[col];
 //   cell.setAttribute("data-mine","true");
 //   if (testMode) cell.innerHTML="X";
 // }
//}
//-----------Used the above function initially. Sometimes the same set row,col values were created and 
// it resulted in number of mines being less than the said amount. For this the function was changed to the one
// gien below.



function newrowcol(n) {
    var row = Math.floor(Math.random() * n);
    var col = Math.floor(Math.random() * n);
    if (!(vals.includes(row.toString()+col.toString()))) {
    vals.push(row.toString()+col.toString());
    var cell = grid.rows[row].cells[col];
    cell.setAttribute("data-mine","true");
    if (testMode) cell.innerHTML="X";
    } else {
     newrowcol(n)
    }
}



function addMines() {
  //Add m number of mines randomly
   getmn = getMandN();
  m = getmn[0];
  n = getmn[1];
  vals = [];
  for (var i=0; i<m; i++) {
    newrowcol(n);
  }

}



function revealMines() {
     getmn = getMandN();
  m = getmn[0];
  n = getmn[1];
    //Show all the cells containing mines
    for (var i=0; i<n; i++) {
      for(var j=0; j<n; j++) {
        var cell = grid.rows[i].cells[j];
        if (cell.getAttribute("data-mine")=="true") cell.className="mine";
      }
    }
}

function checkCompletion() {
  getmn = getMandN();
  m = getmn[0];
  n = getmn[1];
  var complete = true;
     if (document.getElementById("result").innerHTML == "Game Over!") {
          document.getElementById("result").innerHTML="You already Lost. Try a new Game!";
         }
        else {
        document.getElementById("result").style.color="#1A5276";
        document.getElementById("result").innerHTML="Some more tiles left: Keep Going!";
          

    for (var i=0; i<n; i++) {
      for(var j=0; j<n; j++) {
        if ((grid.rows[i].cells[j].getAttribute("data-mine")=="false") && (grid.rows[i].cells[j].innerHTML=="")) complete=false;
      }
  }
  if (complete) {
     document.getElementById("result").style.color="#229954";
     document.getElementById("result").innerHTML = "You Won!";
     k = 0;
     revealMines(m);
  }
  }
}

function clickCell(cell) {
  //Check if the end-user clicked on a mine
  getmn = getMandN();
  m = getmn[0];
  n = getmn[1];
  if (cell.getAttribute("data-mine")=="true") {
    revealMines(n);
    document.getElementById("result").style.color="#FF2222";
    document.getElementById("result").innerHTML  = "Game Over!";
    k =0;
  } else {
    cell.className="clicked";
    k = k+1;
    document.getElementById("score").innerHTML = "SCORE: " + k;
    //Count and display the number of adjacent mines
    var mineCount=0;
    var cellRow = cell.parentNode.rowIndex;
    var cellCol = cell.cellIndex;
    for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,n-1); i++) {
      for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,n-1); j++) {
        if (grid.rows[i].cells[j].getAttribute("data-mine")=="true") mineCount++;
      }
    }
    cell.innerHTML=mineCount;
    if (mineCount==0) { 
      //Reveal all adjacent cells as they do not have a mine
      for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,n-1); i++) {
        for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,n-1); j++) {
          //Recursive Call
          if (grid.rows[i].cells[j].innerHTML=="") clickCell(grid.rows[i].cells[j]);
        }
      }
    }
    //checkCompletion();
  }
}

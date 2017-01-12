var canvas; // canvas element
var board;  // two dimension array with canvas 2d context

var boardWidth = 600;  // board (canvas) width
var boardHeight = 600; // board (canvas) height

var rowsColumns; // number of rows and columns (rows = columns)
var nodeDim;     // dimensions of each node
var nodePoints;  // array - node coordinates

var i1 = -1,
  	j1 = -1,
  	i2 = -1, 
  	j2 = -1; // position of object on board after user's click (i1, j1, i2, j2)

var colorArray;    // array of colors
var colorUse;      // array how many times a color used
var numOfColors;   // number of colors
var colorsOnBoard; // array with colors on board

var pairsRemaining;   // pairs remaining in game
var totalMoves = 0;   // user's total moves
var rightOptions = 0; // user's right options
var wrongOptions =0;  // user's wrong options

var x1CoordinatesArray; // two dimension array for coordinates and limits of x1
var x2CoordinatesArray; // two dimension array for coordinates and limits of x2

var y1CoordinatesArray; // two dimension array for coordinates and limits of y1
var y2CoordinatesArray; // two dimension array for coordinates and limits of y2

var availableClicks; // two dimension array - available clicks


document.addEventListener("DOMContentLoaded", false); // mouse listener


// Function to check user's input
function checkUserInput(userInput) {
	
	if( (userInput==4) || (userInput == 8) || (userInput==16) || (userInput == 32) ) {
		
		rowsColumns = userInput;
		createBoard();
		
	}
	else {
		
		alert("Please enter 4 or 8 or 16 or 32");
		
	}
	
} // End checkUserInput


function createBoard() {
	
	calculateNodeDim();
	calculateNodePoints();
	calculatePairs();
	createColors();
	initAvailableClicks();
	initStats();
	showStats();
	resetStopwatch();
	startStopwatch(); // stopwatch
	initBoard();
	
} // End create board


function calculateNodeDim() {
	
	nodeDim = boardWidth/rowsColumns;
	
} // End calculateNodeDim


function calculateNodePoints() {
	
	var i; // simple counter
	
	nodePoints = new Array(rowsColumns);
	
	nodePoints[0] = 0;
	
	for(i=1 ; i<rowsColumns ; i++) {
		
		nodePoints[i] = nodePoints[i-1] + nodeDim;
		
	} // End for
	
} // End calculateNodePoints


function calculatePairs() {
	
	pairsRemaining = (rowsColumns*rowsColumns)/2;
	
} // End calculatePairs


function createColors() {
	
	var i; // simple counter
	
	numOfColors = (rowsColumns*rowsColumns)/2;
	colorArray = new Array(numOfColors);
	colorUse = new Array(numOfColors);
	
	for(i=0 ; i<numOfColors ; i++) {
		
		colorArray[i] = "rgb("+
						Math.floor(Math.random()*256)+","+
			  			Math.floor(Math.random()*256)+","+
			  			Math.floor(Math.random()*256)+")";
			  			
		colorUse[i] = 0;
			
	} // End for
	
	colorArray.sort(function() {
  		return .5 - Math.random();
  	});
  	
} // End createColors


function initAvailableClicks() {
	
	var i, j;
	
	availableClicks = new Array(rowsColumns);
	
	for(i=0 ; i<rowsColumns ; i++) {
		
		availableClicks[i] = new Array(rowsColumns);
			
		for(j=0 ; j<rowsColumns ; j++) {
			
			if( ( (i === 0) || (i == rowsColumns-1) ) || ( (j === 0) || (j == rowsColumns-1 ) ) ) {
				
				availableClicks[i][j] = 1;
				
			}
			else {
				
				availableClicks[i][j] = 0;
				
			} // End else
			
		} // End for
		
	} // End for
	
} // End initAvailableClicks


function initStats() {
	
	totalMoves = 0;
	rightOptions = 0;
	wrongOptions = 0;
	
} // End initStats


function showStats() {
	
	document.getElementById("game-pairs").innerHTML = pairsRemaining + " Pairs Remaining";
	document.getElementById("game-stats").innerHTML = "Game Stats";
	document.getElementById("total-moves").innerHTML = "Total Moves: " + totalMoves;
	document.getElementById("right-options").innerHTML = "Right Options: " + rightOptions;
	document.getElementById("wrong-options").innerHTML = "Wrong Options: " + wrongOptions;
	
} // End showStats


// initialize canvas (board)
function initBoard() {
	
	var i, j;
	var color;
	
	canvas = document.getElementById("mahjong-game");
	canvas.width = boardWidth;
	canvas.height = boardHeight;
	canvas.style.border = "1px solid black";
	canvas.addEventListener("mousedown", getPosition, false);
	
	board = new Array(rowsColumns);
	colorsOnBoard = new Array(rowsColumns);
	
	x1CoordinatesArray = new Array(rowsColumns);
	x2CoordinatesArray = new Array(rowsColumns);
	y1CoordinatesArray = new Array(rowsColumns);
	y2CoordinatesArray = new Array(rowsColumns);
	
	for(i=0 ; i<rowsColumns ; i++) {
		
		board[i] = new Array(rowsColumns);
		colorsOnBoard[i] = new Array(rowsColumns);
		
		x1CoordinatesArray[i] = new Array(rowsColumns);
		x2CoordinatesArray[i] = new Array(rowsColumns);
		y1CoordinatesArray[i] = new Array(rowsColumns);
		y2CoordinatesArray[i] = new Array(rowsColumns);
		
		for(j=0 ; j<rowsColumns ; j++) {
		    
			board[i][j] = canvas.getContext("2d");
			colorsOnBoard[i][j] = shuffleColors();
			board[i][j].fillStyle = colorsOnBoard[i][j]; 
			board[i][j].fillRect(i*nodeDim, j*nodeDim, nodeDim, nodeDim);
			
			board[i][j] = {'x1': i*nodeDim, 'x2': i*nodeDim + nodeDim,  'y1': j*nodeDim, 'y2': j*nodeDim + nodeDim};
			
			x1CoordinatesArray[i][j] = i*nodeDim;
			x2CoordinatesArray[i][j] = i*nodeDim + nodeDim;
			y1CoordinatesArray[i][j] = j*nodeDim;
			y2CoordinatesArray[i][j] = j*nodeDim + nodeDim;
			
		} // End for
		
	} // End for
	
} // End initBoard


function shuffleColors() {
	
	var pos;
	
	while(true) {
		
		pos = Math.floor(Math.random()*colorArray.length);
		
		if(colorUse[pos] < 2) {
			
			colorUse[pos]++;
			return colorArray[pos];
			
		} // End if
		
	} // End while
	
} // End shuffleColors


function getPosition(event) {
    var x = new Number();
    var y = new Number();
    var canvas = document.getElementById("mahjong-game");

	if (event.x != undefined && event.y != undefined) {
    	x = event.x;
  		y = event.y;
	}
	else { // Firefox method to get the position
  		x = event.clientX + document.body.scrollLeft +
      	document.documentElement.scrollLeft;
  		y = event.clientY + document.body.scrollTop +
      	document.documentElement.scrollTop;
	}
	
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	/*
	if( (i1 === undefined)  || (j1 === undefined) && (i2 === undefined) || (j2 === undefined) ) {
		i1 = -1;
		j1 = -1;
		
		i2 = -1;
		j2 = -1;
	}
	*/
	findPositionOnBoard(x, y);
	
} // End getPosition


function findPositionOnBoard(x, y) {
	
	var tempI, tempJ;
	var i, j;
	var flag = false;
	
	for(i=0 ; i<board.length ; i++) {
		
		for(j=0 ; j<board[i].length ; j++) {
			
			if( ( (x >= x1CoordinatesArray[i][j]) && (x < x2CoordinatesArray[i][j]) ) && ( (y >= y1CoordinatesArray[i][j]) && (y < y2CoordinatesArray[i][j]) ) ) {
				
				tempI = i;
				tempJ = j;
				
				flag = true;
				
				break;
				
			} // End if
			
		} // End for
		
		if(flag) {
			
			break;
			
		} // End if
		
	} // End for
	
	if( (i1 == -1) && (j1 == -1) ) {
		
		i1 = tempI;
		j1 = tempJ;
		drawNodeHover();
	}
	else if( (i2 == -1) && (j2 == -1) ) {
		
		i2 = tempI;
		j2 = tempJ;
		checkIfSame();
		
	}
	
} // End findPositionOnBoard


function checkIfSame() {
	
	board[i1][j1] = canvas.getContext("2d");
	board[i2][j2] = canvas.getContext("2d");
	
	if( !( (i1 == i2) && (j1 == j2) ) ) {
		
			// na katharizo to hover
			
		if( ( availableClicks[i1][j1] == 1 ) && (availableClicks[i2][j2] == 1) ) {
				
			if(colorsOnBoard[i1][j1] == colorsOnBoard[i2][j2]) {
					
				board[i1][j1].clearRect(i1*nodeDim,j1*nodeDim,nodeDim,nodeDim);
				board[i2][j2].clearRect(i2*nodeDim,j2*nodeDim,nodeDim,nodeDim);
				
				pairsRemaining--;
				
				rightOptions++;
				
				availableClicks[i1][j1]++;
				availableClicks[i2][j2]++;
				
				changeStatusAvailableClicks(); // only if user click right nodes
				checkIfSolved(); // check if mahjong solved
				
			} // End if
			else {
				
				wrongOptions++;
				
			} // End else
			
			totalMoves++;
			
		} // End if (available clicks)
		
	} // End if
	
	i1 = -1;
	j1 = -1;
	
	i2 = -1;
	j2 = -1;
	
	showStats();
	
} // End checkIfSame


function changeStatusAvailableClicks() { // change availability status
	
	var i, j;
	
	
	if( !(i1 === 0) ) {
		
		if( availableClicks[i1-1][j1] != 1 ) {
			
			availableClicks[i1-1][j1]++;
				
		}
		
	}
	if( !( j1 == (rowsColumns-1) ) ) {
		
		if( availableClicks[i1][j1+1] != 1 ) {
			
			availableClicks[i1][j1+1]++;
				
		}
			
	}
	if( !( i1 == (rowsColumns-1) ) ) {
		
		if(availableClicks[i1+1][j1] != 1) {
			
			availableClicks[i1+1][j1]++;
			
		}
		
	}
	if( !(j1 === 0) ) {
		
		if(availableClicks[i1][j1-1] != 1) {
			
			availableClicks[i1][j1-1]++;
			
		}	
		
	}
	
	
	
	
	if( !(i2 === 0) ) {
		
		if(availableClicks[i2-1][j2] != 1) {
			
			availableClicks[i2-1][j2]++;
			
		}
		
	}
	if( !( j2 == (rowsColumns-1) ) ) {
		
		if(availableClicks[i2][j2+1] != 1) {
			
			availableClicks[i2][j2+1]++;
				
		}	
		
	}
	if( !( i2 == (rowsColumns-1) ) ) {
		
		if(availableClicks[i2+1][j2] != 1) {
			
			availableClicks[i2+1][j2]++;
			
		}
		
	}
	if( !(j2 === 0) ) {
		
		if(availableClicks[i2][j2-1] != 1) {
			
			availableClicks[i2][j2-1]++;
				
		}
			
	}
		
} // changeStatusAvailableClicks


function checkIfSolved() {
	
	if(pairsRemaining === 0) {
		
		stopStopwatch();
		
		document.getElementById("congratulations").innerHTML = "Congratulations!";
		
	} // End if
	
} // End checkIfSolved

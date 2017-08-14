// CKS Project 3

// Variables that need to be accessed by several functions
var tableContent = [];
var generation = 0;
var population = 0;
var interval;

// Hide interaction buttons until board is populated
document.getElementById('start').style.visibility = "hidden";
document.getElementById('stop').style.visibility = "hidden";
document.getElementById('gen1').style.visibility = "hidden";
document.getElementById('gen23').style.visibility = "hidden";
document.getElementById('reset').style.visibility = "hidden";

// Event handlers
$(function() {
	$('#populate').on('click', getTableInfo);
	$('#gameboard').on('click', 'td', changeState);
	$('#start').on('click', beginEvolution);
	$('#reset').on('click', reset);
	$('#stop').on('click', stopEvolution);
	$('#gen1').on('click', incrementGen);
	$('#gen23').on('click', incrementGen23);
	
});

function getTableInfo() {
	// Retrieve user-selected game board data
	var boardSize = document.getElementById('size').value;
	var isRandom = document.getElementById('random').value;
	var rand;

	// Check for type of table generation; random or fixed
	if (isRandom == "yes") {
		rand = true;
	}
	else if (isRandom == "no") {
		rand = false;
	}
	else {
		console.log("Error in random value acquistion.");
	}

	// Check for size of table to generate & call generateTable function with user generate parameters
	if (boardSize == "small") {
		var cols = 100; 
		generateTable(cols, rand);
	}
	else if (boardSize == "med") {
		var cols = 125;
		generateTable(cols, rand);
	}
	else if (boardSize == "large") {
		var cols = 150;
		generateTable(cols, rand);
	}
	else {
		console.log("Error in board size acquistion.");
	}
}

function generateTable(cols, isRand) {
	var table = "";
	var i;
	var j;
	var rows = 75;
	var lifeState = 0;

	// Generate rows and columns based on user input
	// Randomly generate life or death states for cells
	if (isRand) {
		var lifePercent = 10;
		for (i = 0; i < rows; i++) {
			table += "<tr>";
			tableContent[i] = new Array();
			for (j = 0; j < cols; j++){
				if (Math.floor(Math.random() * 101) > lifePercent ){
					lifeState = 0;
					table += "<td class=\"deadcell\"></td>";
				}
				else {
					lifeState = 1;
					population++;
					table += "<td class=\"livecell\"></td>";
				}
				tableContent[i][j] = lifeState;
			}
			table += "</tr>"	
		}
		document.getElementById('gameboard').innerHTML = table;
	}
	// Create fixed seed pattern of still lives, oscillators
	else {
		var tableRows = document.getElementById('gameboard').rows;

		for (i = 0; i < rows; i++) {
			table += "<tr>";
			tableContent[i] = new Array();
			for (j = 0; j < cols; j++){
				lifeState = 0;
				table += "<td class=\"deadcell\"></td>";
				tableContent[i][j] = lifeState;
			}
			table += "</tr>"	
		}

		document.getElementById('gameboard').innerHTML = table;

		// Make a block still life
		tableRows[25].cells[10].className = 'livecell';
		tableRows[25].cells[11].className = 'livecell';
		tableRows[26].cells[10].className = 'livecell';
		tableRows[26].cells[11].className = 'livecell';
		population += 4;
		// Make a boat still life
		tableRows[5].cells[51].className = 'livecell';
		tableRows[5].cells[52].className = 'livecell';
		tableRows[6].cells[51].className = 'livecell';
		tableRows[6].cells[53].className = 'livecell';
		tableRows[7].cells[52].className = 'livecell';
		population += 5;
		// Make a beehive still life
		tableRows[40].cells[78].className = 'livecell';
		tableRows[40].cells[79].className = 'livecell';
		tableRows[41].cells[77].className = 'livecell';
		tableRows[41].cells[80].className = 'livecell';
		tableRows[42].cells[78].className = 'livecell';
		tableRows[42].cells[79].className = 'livecell';
		population += 6;
		// Make a blinker oscillator
		tableRows[65].cells[23].className = 'livecell';
		tableRows[65].cells[24].className = 'livecell';
		tableRows[65].cells[25].className = 'livecell';
		population += 3;
		// Make a glider
		tableRows[15].cells[33].className = 'livecell';
		tableRows[16].cells[34].className = 'livecell';
		tableRows[17].cells[32].className = 'livecell';
		tableRows[17].cells[33].className = 'livecell';
		tableRows[17].cells[34].className = 'livecell';
		population += 5;
	}

	generation++; 
	document.getElementById('pop').textContent = population;
	document.getElementById('gen').textContent = generation;
	document.getElementById('start').style.visibility = "visible";
	document.getElementById('stop').style.visibility = "visible";
	document.getElementById('gen1').style.visibility = "visible";
	document.getElementById('gen23').style.visibility = "visible";
	document.getElementById('reset').style.visibility = "visible";
}

// If user clicks on a table cell, change the cell from live to dead or vice versa
function changeState() {
	stopEvolution();
	// Inset population update (add span w/ id)
	var currClass = this.getAttribute('class');
	if (currClass == "livecell") {
		this.className = 'deadcell';
	}
	else {
		this.className = 'livecell';
		population++;
		document.getElementById('pop').textContent = population;
	}
}

// Reset population and generation values, and remove current table display
function reset() {
	var table = "";
	generation = 0;
	population = 0;
	tableContent = [];

	stopEvolution();
	document.getElementById('gameboard').innerHTML = table;
	document.getElementById('pop').textContent = "";
	document.getElementById('gen').textContent = "";
	// Hide interation buttons until a new game is populated.
	document.getElementById('start').style.visibility = "hidden";
	document.getElementById('stop').style.visibility = "hidden";
	document.getElementById('gen1').style.visibility = "hidden";
	document.getElementById('gen23').style.visibility = "hidden";
	document.getElementById('reset').style.visibility = "hidden";
}

function beginEvolution() {
	interval = setInterval(updateBoard, 500);
}

function stopEvolution() {
	clearInterval(interval);
}

// Stop interval based generation incrementing and update board by 1 generations
function incrementGen() {
	stopEvolution();
	updateBoard();
}

// Stop interval based generation incrementing and update board by 23 generations
function incrementGen23() {
	var i = 0;
	stopEvolution();
	while (i < 23) {
		updateBoard();
		i++;
	}
}

function updateBoard() {
	// Get a collection of all row elements in the table
	var tableRows = document.getElementById('gameboard').rows;
	// Get the number of rows
	var rows = tableRows.length;
	// Get the number of columns
	var cols = tableRows[0].cells.length;

	var currCell;
	var currState;
	// Will hold number of living neighbors
	var liveNbs = 0;
	// Will hold values for adjacent neighbors
	var top;
	var bottom;
	var left;
	var right;
	// Will hold values for diagonal neighbors
	var diagTl;
	var diagTr;
	var diagBl;
	var diagBr;

	var i, j;

	// Reset population #
	population = 0;

	// Traverse table rows
	for (i = 0; i < rows; i++) {
		// Traverse table columns
		for (j = 0; j < cols; j++) {
			// Keep track of the current cell and its state
			currCell = tableRows[i].cells[j];
			currState = currCell.getAttribute('class');
			// Eliminate border edges from neighbor checking
			if (i != 0 && j != 0 && i != rows - 1 && j != cols - 1) {
				// Store all 8 neighbor cells and check to see if they are alive
				top = tableRows[i-1].cells[j];
				if (top.getAttribute('class') == "livecell") {
					liveNbs++;
				}
				bottom = tableRows[i+1].cells[j];
				if (bottom.getAttribute('class') == "livecell") {
					liveNbs++;
				}
				left = tableRows[i].cells[j-1];
				if (left.getAttribute('class') == "livecell") {
					liveNbs++;
				}
				right = tableRows[i].cells[j+1];
				if (right.getAttribute('class') == "livecell") {
					liveNbs++;
				}
				diagTl = tableRows[i-1].cells[j-1];
				if (diagTl.getAttribute('class') == "livecell") {
					liveNbs++;
				}
				diagTr = tableRows[i-1].cells[j+1];
				if (diagTr.getAttribute('class') == "livecell") {
					liveNbs++;
				}
				diagBl = tableRows[i+1].cells[j-1];
				if (diagBl.getAttribute('class') == "livecell") {
					liveNbs++;
				}
				diagBr = tableRows[i+1].cells[j+1];
				if (diagBr.getAttribute('class') == "livecell") {
					liveNbs++;
				}

				// Apply rules of game to current cell
				if (currState == "livecell" && (liveNbs < 2 || liveNbs > 3)) {
					tableContent[i][j] = 0;
				}
				if (currState == "livecell" && (liveNbs == 2 || liveNbs == 3)) {
					tableContent[i][j] = 1;
				}
				if (currState == "deadcell" && liveNbs == 3) {
					tableContent[i][j] = 1;
				}

				// Reset live neighbor count for next iteration
				liveNbs = 0;
			}
			else {
				tableContent[i][j] = 0;
			}
		}
	}

	// Traverse tableContent array and copy new lifestate values into table
	for (i = 0; i < rows; i++) {
		for (j = 0; j < cols; j++){
			if (tableContent[i][j] == 0) {
				tableRows[i].cells[j].className = 'deadcell';
			}
			else if (tableContent[i][j] == 1) {
				tableRows[i].cells[j].className = 'livecell';
				population++;
			}
			else {
				console.log("Error in array to table copy loop.")
			}
		}
	}
	// Update generation
	generation++;
	document.getElementById('pop').textContent = population;
	document.getElementById('gen').textContent = generation;
}
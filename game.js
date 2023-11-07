function TicTacToe(placeholder, grid_size, callback) {


	this.placeholder = placeholder;


	this.paint(grid_size);


	this.callback = callback;


	this.scores = {
		X: 0,
		O: 0
	};

	this.marks = {
		X: "X",  
		O: "O",  
		count: 0 
	};

	return this;
}

TicTacToe.prototype.paint = function(grid_size) {

	var self = this;


	self.grid_size = grid_size;

	var html = '<table id="tic-tac-toe" align="center">';
	
	for(var i = 0; i < grid_size; i++) {
		html += '<tr>';
		for(var j = 0; j < grid_size; j++) {
			html+= '<td></td>';
		}
		html += '</tr>';
	}

	html += '</table>';
	
	self.placeholder.innerHTML = html;


	self.columns = self.placeholder.getElementsByTagName("td");


	for(i = 0; i < this.columns.length; i++) {
		self.columns[i].addEventListener("click", markHandler);
	}

	function markHandler(e) {
		self.mark(e.target);
	}

};

TicTacToe.prototype.mark = function(column) {

	if(column.innerHTML) {
		return;
	}

	// Count the move
	this.marks.count++;


	var current_mark = this.marks.count % 2 === 1 ? this.marks.X : this.marks.O;

	// Fill the column with mark
	column.innerHTML = current_mark;
	column.classList.add(current_mark);


	if(this.didWin(current_mark)) {
		// Increment the player score
		if(this.marks.count % 2 === 1) {
			this.scores.X++;
		} else {
			this.scores.O++;
		}
		
		this.callback(current_mark, this.scores);
	} else if(this.marks.count === this.columns.length) {
		// Send result as draw
		this.callback("draw");
	}

};

TicTacToe.prototype.didWin = function(mark) {


	var grid_size = this.grid_size;

	
	var horizontal_count,
		vertical_count,
		right_to_left_count = 0,
		left_to_right_count = 0;


	
	for(var i = 0; i < grid_size; i++) {


		horizontal_count = vertical_count = 0;

		// Loop 2
		for(var j = 0; j < grid_size; j++) {

		
			if(this.columns[i * grid_size + j].innerHTML == mark) {
				horizontal_count++;
			}

			
			if(this.columns[j * grid_size + i].innerHTML == mark) {
				vertical_count++;
			}

		}


		if(horizontal_count == grid_size || vertical_count == grid_size) {
			return true;	
		}

		// i * grid_size + i ===> "0,4,8"
		if(this.columns[i * grid_size + i].innerHTML == mark) {
			right_to_left_count++;
		}

		// (grid_size - 1) * (i+1) ===> "2,4,6"
		if(this.columns[(grid_size - 1) * (i+1)].innerHTML == mark) {
			left_to_right_count++;
		}

	} 


	if(right_to_left_count == grid_size || left_to_right_count == grid_size) {
		return true;	
	}

	return false;
};

TicTacToe.prototype.empty = function() {
	// Go through all columns and empty them
	for(var i = 0; i < this.columns.length; i++) {
		this.columns[i].innerHTML = '';
		this.columns[i].classList.remove(this.marks.X);
		this.columns[i].classList.remove(this.marks.O);

	}
	// Reset the count
	this.marks.count = 0;
};

TicTacToe.prototype.reset = function() {
	this.empty();
	this.scores = {
		X: 0,
		O: 0
	};
};




var placeholder = document.getElementById("placeholder");

var tictactoe = new TicTacToe(placeholder, 3, onResult);

function onResult(result, scores) {
	if(result == 'draw') {
		alert("Gelijkspel!");
	} else {
		alert(result + " heeft gewonnen!");
		updateScores(scores.X, scores.O);
	}
	tictactoe.empty();
}

function updateScores(X, O) {
	document.querySelector("#scoreboard #player1").innerHTML = X;
	document.querySelector("#scoreboard #player2").innerHTML = O;	
}

function restart(grid_size) {
	tictactoe.reset();
	updateScores(0, 0);
	if(grid_size) {
		tictactoe.paint(grid_size);
	}
}
const game = {
    xTurn: true,
    xState: [],
    oState: [],
    winningStates: [
        // Rows
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],

        // Columns
        ['0', '3', '6'],
        ['1', '4', '7'],
        ['2', '5', '8'],

        // Diagonal
        ['0', '4', '8'],
        ['2', '4', '6']
    ]
}
document.addEventListener('click', event => {

});
document.addEventListener('click', event => {
    const target = event.target
    const isCell = target.classList.contains('grid-cell')
    const isDisabled = target.classList.contains('disabled')

    if (isCell && !isDisabled) {
        const cellValue = target.dataset.value

        game.xTurn === true
            ? game.xState.push(cellValue)
            : game.oState.push(cellValue)

        target.classList.add('disabled')
        target.classList.add(game.xTurn ? 'x' : 'o')

        game.xTurn = !game.xTurn
    }
})

game.xTurn = !game.xTurn
if (!document.querySelectorAll('.grid-cell:not(.disabled)').length) {
    document.querySelector('.game-over').classList.add('visible')
    document.querySelector('.game-over-text').textContent = 'Draw!'
}
game.winningStates.forEach(winningState => {
    const xWins = winningState.every(state => game.xState.includes(state))
    const oWins = winningState.every(state => game.oState.includes(state))

    if (xWins || oWins) {
        document.querySelectorAll('.grid-cell').forEach(cell => cell.classList.add('disabled'))
        document.querySelector('.game-over').classList.add('visible')
        document.querySelector('.game-over-text').textContent = xWins
            ? 'X wins!'
            : 'O wins!'
    }
})
document.querySelector('.restart').addEventListener('click', () => {
    document.querySelector('.game-over').classList.remove('visible')
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('disabled', 'x', 'o')
    })

    game.xTurn = true
    game.xState = []
    game.oState = []
})


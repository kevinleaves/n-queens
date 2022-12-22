/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  // create matrix
  let matrix = [];
  for (let i = 0; i < n; i++) {
    let array2 = [];
    for (let j = 0; j < n; j++) {
      array2.push(0);
    }
    matrix.push(array2);
  }
  // create board obj
  var board = new Board(matrix);
  // iterate over rows
  for (let i = 0; i < n; i++) {
    // iterate over columns
    for (let j = 0; j < n; j++) {
      // place a one on matrix.row.column
      board.attributes[i][j] = 1;
      // check for conflicts using hasAnyRooksConflicts
      // if above call is true, replace the one with a zero
      if (board.hasAnyRooksConflicts()) {
        board.attributes[i][j] = 0;
      }
    }
  }

  console.log(board);
  // create solution arr
  var solution = [];
  // iterate over board keys, excluding 'n'
  for (var key in board.attributes) {
    if (key !== 'n') {
      //   push arrays at each key to solution
      solution.push(board.attributes[key])
    }
  }

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  // return solution array
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  // create the board object using the matrix
  let board = new Board({'n': n});
  // counter for solutions
  var solutionCount = 0;

  // helper function that recurses
  const recurseRows = function(rowIndex = 0) {
    // base case goes before iteration. if rows equal to n, increment counter & return
    if(rowIndex === n) {
      solutionCount++;
      return;
    }

    // iterate through columns
    for (let colIndex = 0; colIndex < n; colIndex++) {
      // toggle current current cell
      board.togglePiece(rowIndex, colIndex);
      // if valid board, recurse down the rows
      if (!board.hasAnyRooksConflicts()) {
        recurseRows(rowIndex + 1)
      }
      // if not valid board,
      // untoggle current cell
      board.togglePiece(rowIndex, colIndex);
    }
  }

  recurseRows()
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);

  // return counter
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

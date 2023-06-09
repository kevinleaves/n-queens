// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //else return false;
      // create variable for count1s
      let countOnes = 0;
      // iterate over row array
      let array = this.attributes[rowIndex];
      for (let i = 0; i < array.length; i++) {
        // if element is 1, increment count1s
        if (array[i]) {
          countOnes++;
          // if count1s is greater than 1, return true
          if (countOnes > 1) {return true;}
        }
      }

      // otherwise return false
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // iterate through the object

      for (var rowIndex = 0; rowIndex < this.attributes.n; rowIndex++) {
        // call hasRowConflict with the key
        // if invocation evaluates to true
        if (this.hasRowConflictAt(rowIndex)) {
          return true;
        }
      }
      // return true;
      return false;
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // create variable for count
      let counter = 0;
      // iterate through n amount
      for (let rowIndex = 0; rowIndex < this.attributes.n; rowIndex++) {
        // if element at location = 1
        if (this.attributes[rowIndex][colIndex]) {
          counter++
          // increment counter
          if (counter > 1) {
            // if counter is greater than 1
            return true;
          }
        }
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      // iterate through all col indexes
      for (let colIndex = 0; colIndex < this.attributes.n; colIndex++) {
        // call helper function passing in new col indexes
        if (this.hasColConflictAt(colIndex)) {
          // if helper function evaluates to true, return true
          return true;
        }
      //otherwise false
      }
      // loop through columns and pass current column into hasColConflictAt
      for (var colIndex = 0; colIndex < this.attributes.n; colIndex++) {
        if (this.hasColConflictAt(colIndex) === true) {
          return true;
        }
      }
      return false;
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // initialize the counter
      let counter = 0;
      let row, col
      // if majorDiagonalColumnIndexAtFirstRow is less than 0
      if (majorDiagonalColumnIndexAtFirstRow < 0) {
        // row index is equal to the absolute value of majorDiagonalColumnIndexAtFirstRow
        row = Math.abs(majorDiagonalColumnIndexAtFirstRow)
        // col index is equal to 0
        col = 0;
      } else {
        // col index is equal to majorDiagonalColumnIndexAtFirstRow
        col = majorDiagonalColumnIndexAtFirstRow;
        // row index is equal to 0
        row = 0;
      }

      var n = this.attributes.n;
      // while index is less than n
      while (row < n && col < n) {
        // if the value of matrix[row][col] is 1
        if (this.attributes[row][col] === 1) {
          // increment the counter
          counter++
          // if counter is greater than 1
          if (counter > 1) {
            // return true
            return true;
          }
        }
        // increment row and col
        row++
        col++
      }

      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      // set a variable to negative value of n + 1
      let n = this.attributes.n;
      var currentDiagonal = (-n) + 1
      // while variable is not equal to n
      while (currentDiagonal !== n) {
        // invoke the helper function with variable value
        if (this.hasMajorDiagonalConflictAt(currentDiagonal)) {
          return true;
        }
        // increment the value
        currentDiagonal++
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
    // find starting point
    let row, col;
    let n = this.attributes.n;
    // if minorDiagonalColumnIndexAtFirstRow is less than n
    if (minorDiagonalColumnIndexAtFirstRow < n) {
      // row is 0 and col is equal to minorDiagonalColumnIndexAtFirstRow
      row = 0
      col = minorDiagonalColumnIndexAtFirstRow;
    }

    // if minorDiagonalColumnIndexAtFirstRow is greater than or equal to n
    if (minorDiagonalColumnIndexAtFirstRow >= n) {
      // row is minorDiagonalColumnIndexAtFirstRow - n + 1
      row = minorDiagonalColumnIndexAtFirstRow - n + 1;
      // col is n - 1
      col = n - 1;
    }

    let counter = 0;
    // while col greater or equal to 0 and row is less than n
    while (col >= 0 && row < n) {

      // if 1 exist
      if (this.attributes[row][col] === 1) {
        // increment counter
        counter++;
        // if counter is greater than 1
        if (counter > 1) {
          // return true;
          return true;
        }
      }
      // increment row decrement col
      row++
      col--;
    }

      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      // 0 to 2(n - 1)
      let currentDiagonal = 0;
      while(currentDiagonal <= 2 * (this.attributes.n -1)) {
        if (this.hasMinorDiagonalConflictAt(currentDiagonal)) {
          return true;
        }
        currentDiagonal++;
      }

      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());

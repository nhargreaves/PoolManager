import React, { Component } from "react";

class SubmitScoreForm extends Component {
  constructor(props) {
    super(props);

    this.hasInvalidCells = false;
  }

  handleSubmit(e) {
    var regexName = /^[A-Z]+$/; // matches 1 or more uppercase letters
    var regexScore = /^[0-2]$/; // matches 0, 1, or 2
    var score1 = parseInt(document.getElementById("score1").value, 10);
    var score2 = parseInt(document.getElementById("score2").value, 10);
    var player1 = document.getElementById("player1").value.toUpperCase();
    var player2 = document.getElementById("player2").value.toUpperCase();

    console.log("Player 1: " + player1);
    console.log("Player 2: " + player2);

    /* check the inputs match the regular expressions */
    if (
      !regexName.test(player1) ||
      !regexName.test(player2) ||
      !regexScore.test(score1) ||
      !regexScore.test(score2)
    ) {
      this.hasInvalidCells = true;
    }
    /* check the two scores entered add up to 2 */
    if (score1 + score2 !== 2) {
      this.hasInvalidCells = true;
    }
    if (this.hasInvalidCells) {
      alert("Not a valid input");
      this.hasInvalidCells = false;
    } else {
      /* submit score */
      alert("Submitted!");
    }
  }

  render() {
    return (
      <div className="submitScoreForm">
        <h2>Submit Score</h2>
        <form>
          <input type="number" placeholder="Score" id="score1" />
          <input type="text" placeholder="Player 1" id="player1" />
          <input type="text" placeholder="Player 2" id="player2" />
          <input type="number" placeholder="Score" id="score2" />
          <br />
          <button type="button" onClick={e => this.handleSubmit(e)}>
            Submit Score
          </button>
        </form>
      </div>
    );
  }
}

export default SubmitScoreForm;
import React, { Component } from "react";
import auth0Client from "../../Auth";
import backend from "../../api/backend";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";

class CreateSeasonForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      auth0Players: [],
      playersName: ["", ""],
      seasonName: ""
    };

    this.state = this.initialState;
  }

  getPlayers = async () => {
    try {
      let token;
      await backend
        .post(
          "/api/89ball_season/token",
          {},
          {
            headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
          }
        )
        .then(res => {
          token = res;
        });

      await axios
        .get("https://dev-q70ogh1b.eu.auth0.com/api/v2/users", {
          params: {
            search_engine: "v3"
          },
          headers: { Authorization: `Bearer ${token.data}` }
        })
        .then(res => {
          this.setState({ auth0Players: res.data });
        });
    } catch (e) {
      if (e.response.status === 401) {
        this.toastUnauthorised();
      }
      if (e.response.status === 400) {
        this.toastError("Something went wrong. Please try again");
      }
    }
  };


  componentDidMount(){
    if(auth0Client.isAuthenticated()){
      console.log("players fetched")
      this.getPlayers()
    }
  }

  addPlayer() {
    this.setState({ playersName: [...this.state.playersName, ""] });
  }

  handleChange(e, indexToChange) {
    this.setState({
      playersName: this.state.playersName.map((player, index) => {
        if (index === indexToChange) {
          return e.target.value.toUpperCase();
        }
        return player;
      })
    });
  }

  /* posts a message to slack saying a new season has been created */
  postCreateSeasonSlackMessage = async () => {
    await this.web.chat.postMessage({
      channel: this.channel,
      text:
        "New " +
        (this.props.type === "8" ? ":8ball:" : ":9ball:") +
        " season called 'Season " +
        this.state.seasonName +
        "' created"
    });
  };

  handleKeyDown(e, index) {
    if (e.key === "Enter") {
      this.addPlayer();
    } else if (e.key === "ArrowUp" && index > 1) {
      this.refs["inputPlayer" + (index - 1)].focus();
    } else if (e.key === "ArrowDown" && index < this.state.playersName.length) {
      this.refs["inputPlayer" + (index + 1)].focus();
    } else if (e.key === "Backspace" && e.target.value === "" && index > 1) {
      this.removePlayer(index - 1);
      this.refs["inputPlayer" + (index - 1)].focus();
    }
  }

  removePlayer(index) {
    this.state.playersName.splice(index, 1);
    this.setState({ playersName: this.state.playersName });
  }

  setSeasonName(e) {
    this.setState({ seasonName: e.target.value });
  }

  isValidPlayersNumber() {
    /* check if the season name text input matches the regular expression, otherwise, check if there are less than 2 players inputted */
    if (this.state.playersName.length < 2) {
      return false;
    }

    return true;
  }

  isValidPlayersName() {
    var regex = /^[A-Z]+$/; // matches 1 or more capital letters
    /* check if the player text inputs match the regular expression */
    for (var i = 0; i < this.state.playersName.length; i++) {
      if (!regex.test(this.state.playersName[i])) {
        return false;
      }
    }
    return true;
  }

  createSeason = () => {
    //SET STATE IS ASYNCHRONOUS
    this.setState({ players: this.preparePlayers() }, () => {
      this.props.createSeason(this.state);
      //this.postCreateSeasonSlackMessage();
      this.props.closePopUp();
      this.setState(this.initialState);
    });
  };

  preparePlayers() {
    let temp = [];
    this.state.playersName.map(
      playerName =>
        (temp = [
          ...temp,
          {
            type: parseInt(this.props.type),
            seasonId: parseInt(this.state.seasonName),
            staffName: playerName
          }
        ])
    );
    return temp;
  }

  isValidSeason() {
    var regexSeasonNumber = /^[1-9]([0-9])*$/; // matches 1 number from 1 to 9 followed by 0 or more numbers from 0 to 9

    if (this.state.seasonName !== "") {
      let res = this.props.seasons.filter(
        season => season.seasonId === parseInt(this.state.seasonName)
      );
      if (res.length === 0 && regexSeasonNumber.test(this.state.seasonName)) {
        return true;
      }
    }
    return false;
  }

  /* displays button if inputs are valid, otherwise, hides it */
  createSeasonBtnStyle() {
    if (
      this.isValidSeason() &&
      this.isValidPlayersName() &&
      this.isValidPlayersNumber()
    ) {
      return {
        display: "inline-block"
      };
    } else {
      return {
        display: "none"
      };
    }
  }

  checkPlayersNumberError() {
    if (this.isValidPlayersNumber()) {
      return null;
    } else {
      return <div className="error">Not enough players</div>;
    }
  }

  checkPlayersNameError() {
    if (this.isValidPlayersName()) {
      return null;
    } else {
      return <div className="error">Invalid player name(s)</div>;
    }
  }

  checkSeasonError() {
    if (this.isValidSeason()) {
      return null;
    } else {
      return <div className="error">Enter a valid season number</div>;
    }
  }

  toastUnauthorised = () => {
    toast.error("⛔ Unauthorised! Please login", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  toastError = message => {
    toast.error(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  render() {
    return (
      <div id="createSeasonForm">
        <ToastContainer />
        <h3>Create a Season</h3>
        <form>
          <label>Season number:</label>
          <input
            type="text"
            placeholder="Season number"
            value={this.state.seasonName}
            id="inputSeasonNo"
            ref="inputSeasonNo"
            onChange={e => this.setSeasonName(e)}
            onKeyPress={e => this.handleKeyDown(e)}
          />
          {this.checkSeasonError()}
          <div className="inputPlayers">
            {/* map the players in the state to inputs */}
            {this.state.playersName.map((player, index) => {
              return (
                <div key={index} className="form-row">
                  {/* player name text input */}
                  <input
                    autoFocus
                    placeholder={"Player " + (index + 1)}
                    className="inputPlayerName"
                    id={"inputPlayer" + (index + 1)}
                    ref={"inputPlayer" + (index + 1)}
                    onChange={e => this.handleChange(e, index)}
                    value={player}
                    onKeyDown={e => this.handleKeyDown(e, index + 1)}
                  />
                  <div
                    id={"button" + (index + 1)}
                    className="delete-icon"
                    alt="remove player"
                    onClick={() => this.removePlayer(index)}
                  />
                </div>
              );
            })}
            {this.checkPlayersNumberError()}
            {this.checkPlayersNameError()}

            {/* button for adding a player */}
            <button
              type="button"
              id="addPlayer"
              onClick={e => this.addPlayer(e)}
            >
              + Add player
            </button>
            <button
              type="button"
              id="createSeasonBtn"
              ref="createSeasonBtn"
              onClick={this.createSeason}
              style={this.createSeasonBtnStyle()}
            >
              Create season
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateSeasonForm;

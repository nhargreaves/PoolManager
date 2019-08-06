import React from "react";
import { withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import auth0Client from "../Auth";
import backend from "../api/backend";
import SubNavBar from "./nav/SubNavBar.js";
import Header from "./nav/Header.js";
import "../App.css";
import HoFTable from "./halloffame/HoFTable";
import HoFTable9 from "./halloffame/HoFTable9";

class HoFPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      latestSeason: "",
      players: []
    };
  }

  getLatestSeason = async () => {
    const latest = await backend.get("/api/89ball_season/latest", {
      params: {
        type: this.state.type
      }
    });

    this.setState({
      latestSeason: latest.data[0].seasonId
    });
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.match.params.type });
    await this.getLatestSeason();
    // when component mounted, start a GET request
    // to specified URL
    const result = await backend.get("/api/hall_of_fame?type=8", {
    });

    this.setState({ players: result.data });

    const HoF9 = await backend.get("/api/hall_of_fame?type=9", {
    });

    this.setState({ HoF9: HoF9.data });

    this.createHoF();
  };

  createHoF = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth0Client.getIdToken()}`
      };

      await backend.post(
        "/api/hall_of_fame/calculate?type=8",
        {
          headers: headers
        }
      ).then((result) => {
        this.setState({players: result.data})
      })
    } catch (e) {
      if (e.response.status === 401) {
        this.toastUnauthorised();
      }
    }
  };

  toastSuccess = message => {
    toast.success(`✅ ${message}!`, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  render() {
    return (
      <div id="seasons">
        <ToastContainer />
        <Header />
        <SubNavBar
          latestSeason={this.state.latestSeason}
          type={this.state.type}
        />
        <div className="content">
          <div className="contentLeft">
            <div className="hallOfFameTitleContainer">
              <span className="eight-ball-icon" alt="eight ball" />
              <h3>8-Ball</h3>
              <span className="eight-ball-icon" alt="eight ball" />
            </div>
            <HoFTable players={this.state.players} />
          </div>
          <div className="contentRight">
            <div className="hallOfFameTitleContainer">
              <span className="nine-ball-icon" alt="nine ball" />
              <h3>9-Ball</h3>
              <span className="nine-ball-icon" alt="nine ball" />
            </div>
            <HoFTable9 HoF9={this.state.HoF9} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(HoFPage);

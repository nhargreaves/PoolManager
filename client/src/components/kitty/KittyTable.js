import React, { Component } from "react";
import moment from "moment";

class KittyTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showText: "Show more..."
    };
  }

  toggleShow = () => {
    if (this.state.showText === "Show more...") {
      this.setState({ showText: "Show less..." });
      for (var i = 0; i < Object.keys(this.refs).length; i++) {
        this.refs["lateRow" + (i + 8)].style.display = "table-row";
      }
    } else {
      this.setState({ showText: "Show more..." });
      for (var i = 0; i < Object.keys(this.refs).length; i++) {
        this.refs["lateRow" + (i + 8)].style.display = "none";
      }
    }
  };

  render() {
    const toBeDisplayed = this.props.kitty.map((k, index) => {
      if (index > 7) {
        return (
          <tr key={k.id} className="lateRow" ref={"lateRow" + index}>
            <td>{k.id}</td>
            <td className="kittyTableDate">
              {moment(k.date).format("DD-MM-YY")}
            </td>
            <td>
              {k.type === 8 ? (
                <div className="eight-ball-icon-20" alt="eight ball" />
              ) : k.type === 9 ? (
                <div className="nine-ball-icon-20" alt="nine ball" />
              ) : (
                "type error"
              )}
            </td>
            <td>{k.seasonId}</td>
            <td>{k.staffName}</td>
            <td className="kittyTableDesc">{k.description}</td>
            {k.value < 0 ? (
              <td style={{ color: "Red" }} align="center">
                £{k.value.toFixed(2)}
              </td>
            ) : (
              <td style={{ color: "Green" }} align="center">
                £{k.value.toFixed(2)}
              </td>
            )}
          </tr>
        );
      } else {
        return (
          <tr key={k.id}>
            <td>{k.id}</td>
            <td className="kittyTableDate">
              {moment(k.date).format("DD-MM-YY")}
            </td>
            <td>
              {k.type === 8 ? (
                <div className="eight-ball-icon-20" alt="eight ball" />
              ) : k.type === 9 ? (
                <div className="nine-ball-icon-20" alt="nine ball" />
              ) : (
                "type error"
              )}
            </td>
            <td>{k.seasonId}</td>
            <td>{k.staffName}</td>
            <td className="kittyTableDesc">{k.description}</td>
            {k.value < 0 ? (
              <td style={{ color: "Red" }} align="center">
                £{k.value.toFixed(2)}
              </td>
            ) : (
              <td style={{ color: "Green" }} align="center">
                £{k.value.toFixed(2)}
              </td>
            )}
          </tr>
        );
      }
    });

    if (this.props.kitty.length === 0) {
      return null;
    }
    return (
      <div>
        <div className="kittyTitle">
          <h3>Statement:</h3>

          <h3 id="balanceTracker">
            {this.props.kitty.length
              ? "Balance: £" + this.props.kitty[0].total.toFixed(2)
              : null}
          </h3>
        </div>

        <table cellSpacing="0" className="kittyTable">
          <thead>
            <tr>
              <th>#</th>
              <th className="kittyTableDate">Date</th>
              <th>Type</th>
              <th>Season</th>
              <th>Name</th>
              <th className="kittyTableDesc">Description</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {toBeDisplayed}
            <tr className="showRow">
              <td
                colSpan="2"
                style={{ width: "inherit" }}
                onClick={this.toggleShow}
              >
                {this.state.showText}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default KittyTable;

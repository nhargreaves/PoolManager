import React from "react";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import CreateSeasonForm from "../CreateSeasonForm.js";
import sinon from "sinon";
chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

/* initalise the different elements to avoid repetition */
const wrapper = shallow(<CreateSeasonForm seasons={[]} />);
const addPlayerBtn = wrapper.find("#addPlayer");
const createSeasonBtn = wrapper.find("#createSeasonBtn");
const inputSeasonNo = wrapper.find("#inputSeasonNo");

describe("Rendering", () => {
  it("should render the different elements", () => {
    wrapper.exists().should.be.true;
    addPlayerBtn.exists().should.be.true;
    createSeasonBtn.exists().should.be.true;
    inputSeasonNo.exists().should.be.true;
  });
});

/* ================================================================================================== */

describe("Add a Player", () => {
  it("should add a player to the state", () => {
    // run the add player method, players length should increase by 1
    wrapper.setState({ playersName: ["", ""] });
    wrapper.instance().addPlayer();
    wrapper.state().playersName.should.have.lengthOf(3);
  });
});

/* ================================================================================================== */

describe("Add Player button click", () => {
  it("should run addPlayer() function", () => {
    var spy = sinon.spy(CreateSeasonForm.prototype, "addPlayer");

    addPlayerBtn.simulate("click");
    spy.calledOnce.should.be.true;
  });
});

/* ================================================================================================== */

describe("Remove a Player", () => {
  it("should remove a player from the state", () => {
    const initialArr = ["ALICE", "BOB", "CHARLES"];
    const expectedArr = ["ALICE", "CHARLES"];

    wrapper.setState({ playersName: initialArr });
    wrapper.state().playersName.should.have.lengthOf(3);

    wrapper.instance().removePlayer(1);

    wrapper.state().playersName.should.have.lengthOf(2);
    wrapper.state().playersName[0].should.equal(expectedArr[0]);
    wrapper.state().playersName[1].should.equal(expectedArr[1]);
  });
});

/* ================================================================================================== */

describe("Remove Player button click", () => {
  it("should run removePlayer() function", () => {
    var spy = sinon.spy(CreateSeasonForm.prototype, "removePlayer");

    /* add 2 players so remove buttons are visible */
    addPlayerBtn.simulate("click");
    addPlayerBtn.simulate("click");

    const removePlayerBtn = wrapper.find("#button2");

    removePlayerBtn.simulate("click");
    spy.calledOnce.should.be.true;
  });
});

/* ================================================================================================== */

describe("Create Season button click", () => {
  it("should run createSeason() function", () => {
    var spy = sinon.spy(CreateSeasonForm.prototype, "createSeason");
    const wrapper = shallow(
      <CreateSeasonForm createSeason={() => {}} closePopUp={() => {}} />
    );
    const createSeasonBtn = wrapper.find("#createSeasonBtn");

    // prevents error with alerts. An alert showing is normal behaviour, not an error
    window.alert = () => {};

    createSeasonBtn.simulate("click");

    spy.calledOnce.should.be.true;
  });
});

/* ================================================================================================== */

describe("Typing a season number", () => {
  it("should run setSeasonName()", () => {
    var spy = sinon.spy(CreateSeasonForm.prototype, "setSeasonName");
    const event = { target: { value: "1" } };
    inputSeasonNo.simulate("change", event);

    spy.called.should.be.true;
  });

  it("should change the state", () => {
    const event = { target: { value: "1" } };
    inputSeasonNo.simulate("change", event);
    wrapper.state().seasonName.should.equal("1");
  });
});

/* ================================================================================================== */

describe("Validation", () => {
  beforeEach(() => {
    wrapper.setState({
      playersName: [""],
      seasonName: ""
    });
  });

  it("should return false when nothing is entered", () => {
    wrapper.instance().isValidSeason().should.be.false;
    wrapper.instance().isValidPlayersName().should.be.false;
    wrapper.instance().isValidPlayersNumber().should.be.false;
  });

  it("should return false when there is no season name entered", () => {
    wrapper.setState({
      playersName: ["STEVE", "DAVE"],
      seasonName: ""
    });

    wrapper.instance().isValidSeason().should.be.false;
  });

  it("should return false when no player names are entered", () => {
    wrapper.setState({
      playersName: ["", ""],
      seasonName: "3"
    });

    wrapper.instance().isValidPlayersName().should.be.false;
  });

  it("should return false when only 1 player name is entered", () => {
    wrapper.setState({
      playersName: ["STEVE", ""],
      seasonName: "3"
    });

    wrapper.instance().isValidPlayersName().should.be.false;
  });

  it("should return false if a letter is entered into season name", () => {
    wrapper.setState({
      playersName: ["STEVE", "DAVE"],
      seasonName: "season"
    });

    wrapper.instance().isValidSeason().should.be.false;
  });

  it("should return false if a lowercase letter is entered into players", () => {
    wrapper.setState({
      playersName: ["Steve", "Dave"],
      seasonName: "3"
    });

    wrapper.instance().isValidPlayersName().should.be.false;
  });

  it("should return true if all inputs are correct", () => {
    wrapper.setState({
      playersName: ["STEVE", "DAVE"],
      seasonName: "3"
    });

    wrapper.instance().isValidSeason().should.be.true;
    wrapper.instance().isValidPlayersNumber().should.be.true;
    wrapper.instance().isValidPlayersName().should.be.true;
  });

  it("should return true if there are more than 2 players", () => {
    wrapper.setState({
      playersName: ["STEVE", "DAVE", "CHARLIE", "RACHEL"],
      seasonName: "3"
    });

    wrapper.instance().isValidPlayersNumber().should.be.true;
  });
});

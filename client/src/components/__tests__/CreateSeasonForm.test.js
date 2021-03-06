import React from "react";
import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import CreateSeasonForm from "../season/CreateSeasonForm.js";
import sinon from "sinon";

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

/* initalise the different elements to avoid repetition */
const wrapper = shallow(<CreateSeasonForm seasons={[]} />);
const addPlayerBtn = wrapper.find("#addPlayer");
const createSeasonBtn = wrapper.find("#createSeasonBtn");
const inputSeasonNo = wrapper.find("#inputSeasonNo");

describe("Rendering", () => {
  it("should render the different elements", () => {
    expect(wrapper.exists()).to.be.true;
    expect(addPlayerBtn.exists()).to.be.true;
    expect(createSeasonBtn.exists()).to.be.true;
    expect(inputSeasonNo.exists()).to.be.true;
  });
});

/* ================================================================================================== */

describe("Add a Player", () => {
  it("should add a player to the state", () => {
    // run the add player method, players length should increase by 1
    wrapper.setState({ playersName: ["", ""] });
    wrapper.instance().addPlayer();
    expect(wrapper.state().playersName).to.have.lengthOf(3);
  });
});

/* ================================================================================================== */

describe("Add Player button click", () => {
  it("should run addPlayer() function", () => {
    var spy = sinon.spy(CreateSeasonForm.prototype, "addPlayer");

    addPlayerBtn.simulate("click");
    expect(spy.calledOnce).to.be.true;
  });
});

/* ================================================================================================== */

describe("Remove a Player", () => {
  it("should remove a player from the state", () => {
    const initialArr = ["ALICE", "BOB", "CHARLES"];
    const expectedArr = ["ALICE", "CHARLES"];

    wrapper.setState({ playersName: initialArr });
    expect(wrapper.state().playersName).to.have.lengthOf(3);

    wrapper.instance().removePlayer(1);

    expect(wrapper.state().playersName).to.have.lengthOf(2);
    expect(wrapper.state().playersName[0]).to.equal(expectedArr[0]);
    expect(wrapper.state().playersName[1]).to.equal(expectedArr[1]);
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
    expect(spy.calledOnce).to.be.true;
  });
});

/* ================================================================================================== */

describe("Typing a season number", () => {
  it("should change the state", () => {
    const event = { target: { value: "1" } };
    inputSeasonNo.simulate("change", event);
    expect(wrapper.state().seasonName).to.equal("1");
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

  it("should return false when there is no season name entered", () => {
    wrapper.setState({
      playersName: ["STEVE", "DAVE"],
      seasonName: ""
    });

    expect(wrapper.instance().isValidSeason()).to.be.false;
  });

  it("should return false if a letter is entered into season name", () => {
    wrapper.setState({
      playersName: ["STEVE", "DAVE"],
      seasonName: "season"
    });

    expect(wrapper.instance().isValidSeason()).to.be.false;
  });

  it("should return true if all inputs are correct", () => {
    wrapper.setState({
      playersName: ["STEVE", "DAVE"],
      seasonName: "3"
    });

    expect(wrapper.instance().isValidSeason()).to.be.true;
    expect(wrapper.instance().isValidPlayersNumber()).to.be.true;
  });

  it("should return true if there are more than 2 players", () => {
    wrapper.setState({
      playersName: ["STEVE", "DAVE", "CHARLIE", "RACHEL"],
      seasonName: "3"
    });

    expect(wrapper.instance().isValidPlayersNumber()).to.be.true;
  });
});

/* ================================================================================================== */

describe("Create a season", () => {
  it("should run method in createSeason prop when season created", () => {
    var fake = sinon.fake();

    const wrapper = shallow(
      <CreateSeasonForm createSeason={fake} closePopUp={() => {}} />
    );

    wrapper.instance().createSeason();

    expect(fake.calledOnce).to.be.true;
  });
});

/* ================================================================================================== */

describe("Close popup", () => {
  it("should run method in closePopUp prop when season created", () => {
    var fake = sinon.fake();

    const wrapper = shallow(
      <CreateSeasonForm createSeason={() => {}} closePopUp={fake} />
    );

    wrapper.instance().createSeason();

    expect(fake.calledOnce).to.be.true;
  });
});

/* ================================================================================================== */

describe("Error messages", () => {
  it("should display when there aren't enough players", () => {
    wrapper.setState({ playersName: ["STEVE"] });

    expect(wrapper.instance().checkPlayersNumberError()).to.not.equal(null);
  });

  it("should not display if there are enough players", () => {
    wrapper.setState({ playersName: ["STEVE", "DAVE"] });

    expect(wrapper.instance().checkPlayersNumberError()).to.equal(null);
  });

  it("should display when the season name is invalid", () => {
    wrapper.setState({ seasonName: "" });

    expect(wrapper.instance().checkSeasonError()).to.not.equal(null);
  });

  it("should not display if the season name is valid", () => {
    wrapper.setState({ seasonName: "3" });

    expect(wrapper.instance().checkSeasonError()).to.equal(null);
  });

  it("should display if there are duplicate players", () => {
    wrapper.setState({ playersName: ["STEVE", "STEVE"] });

    expect(wrapper.instance().checkPlayersError()).to.not.equal(null);
  });

  it("should not display if there are no duplicate players", () => {
    wrapper.setState({ playersName: ["STEVE", "DAVE"] });

    expect(wrapper.instance().checkPlayersError()).to.equal(null);
  });
});

import React from "react";
import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import App from "../App.js";

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe("App component", () => {
  it("should render", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).to.be.true;
  });
});

import chai, { expect } from "chai";
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "constants";
require("chromedriver");
const { Builder, By, Key, until } = require("selenium-webdriver");
var driver = new Builder().forBrowser("chrome").build();
driver
  .manage()
  .window()
  .maximize();
chai.use(require("chai-as-promised"));
var homepage = "http://nldpoolleague.azurewebsites.net/";

describe("App", () => {
  // uncomment to demonstrate
  //   afterEach(async () => {
  //     await driver.sleep(500);
  //   });

  describe("LandingPage", () => {
    beforeEach(async () => {
      await jest.setTimeout(30000);
      await driver.get(homepage);
    });

    it("should have expected title value", async () => {
      var actual = await driver.getTitle();
      var expected = "Pool Manager";
      expect(actual).to.equal(expected);
    });

    it("should navigate to the 8-ball section when 8-ball is clicked", async () => {
      await driver
        .findElement(
          By.xpath("//*[@id='eightBallLink'][@class='landingPageLink']")
        )
        .click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "8-ball/";
      expect(actual).to.contain(expected);
    });

    it("should navigate to the 9-ball section when 9-ball is clicked", async () => {
      await driver
        .findElement(
          By.xpath("//*[@id='nineBallLink'][@class='landingPageLink']")
        )
        .click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "9-ball/";
      expect(actual).to.contain(expected);
    });
  });

  describe("8-ball Seasons page navigation", () => {
    beforeEach(async () => {
      await jest.setTimeout(30000);
      await driver.get(homepage + "8-ball/seasons");
    });

    it('should say "8-ball" in the subnav bar', async () => {
      var text = await driver
        .findElement(By.xpath("//*[@class='nav']/h2"))
        .getText();
      var expected = "8-Ball";
      expect(text).to.equal(expected);
    });

    it('should navigate to the landing page when "POOL MANAGER" is clicked', async () => {
      await driver.findElement(By.xpath("//*[@class='headerLeft']/a")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage;
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 9-ball seasons page when "9-ball" is clicked', async () => {
      await driver.findElement(By.id("nineBallLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "9-ball/seasons";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 8-ball kitty when "kitty" clicked', async () => {
      await driver.findElement(By.id("KittyLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "8-ball/kitty";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the hall of fame when "Hall of Fame" clicked', async () => {
      await driver.findElement(By.id("HoFLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "8-ball/hall_of_fame";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 8-ball overview when "current season" clicked', async () => {
      await driver.findElement(By.id("fixturesLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "8-ball/overview/";
      expect(actual).to.contain(expected);
    });
  });

  describe("9-ball Seasons page navigation", () => {
    beforeEach(async () => {
      await jest.setTimeout(30000);
      await driver.get(homepage + "9-ball/seasons");
    });

    it('should say "9-ball" in the subnav bar', async () => {
      var text = await driver
        .findElement(By.xpath("//*[@class='nav']/h2"))
        .getText();
      var expected = "9-Ball";
      expect(text).to.equal(expected);
    });

    it('should navigate to the landing page when "POOL MANAGER" is clicked', async () => {
      await driver.findElement(By.xpath("//*[@class='headerLeft']/a")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage;
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 8-ball seasons page when "8-ball" is clicked', async () => {
      await driver.findElement(By.id("eightBallLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "8-ball/seasons";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 9-ball kitty when "kitty" clicked', async () => {
      await driver.findElement(By.id("KittyLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "9-ball/kitty";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the hall of fame when "Hall of Fame" clicked', async () => {
      await driver.findElement(By.id("HoFLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "9-ball/hall_of_fame";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 9-ball overview when "current season" clicked', async () => {
      await driver.findElement(By.id("fixturesLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "9-ball/overview/";
      expect(actual).to.contain(expected);
    });
  });

  describe("Signing in", () => {
    beforeEach(async () => {
      await jest.setTimeout(30000);
    });
    it("should be able to sign in", async () => {
      await driver.get(homepage);
      await driver.findElement(By.id("loginBtn")).click();
      await driver.sleep(4000);
      await driver
        .wait(until.elementLocated(By.name("username")), 5 * 1000)
        .then(element => {
          return element.sendKeys("matthew");
        });
      await driver
        .wait(until.elementLocated(By.name("password")), 5 * 1000)
        .then(element => {
          return element.sendKeys("test");
        });
      await driver.findElement(By.className("auth0-label-submit")).click();
      await driver.sleep(3000);
      var actual = await driver.getCurrentUrl();
      var expected = homepage;
      expect(actual).to.equal(expected);
    });
  });

  describe("Dashboard", () => {
    beforeEach(async () => {
      await jest.setTimeout(30000);
    });
    it("should be able to navigate to the dashboard page after signing in", async () => {
      await driver
        .wait(until.elementLocated(By.id("eightBallLink")), 5 * 1000)
        .then(element => {
          return element.click();
        });
      await driver.findElement(By.id("dashboardLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "8-ball/dashboard";
      expect(actual).to.equal(expected);
      await driver.sleep(1000);
    });

    it("should say the user's name at the top of the screen", async () => {
      var text = await driver
        .findElement(By.xpath("//*[@class='player-info']/h3"))
        .getText();
      var expected = "Welcome back MATTHEW";
      expect(text).to.equal(expected);
      await driver.quit();
    });
  });
});

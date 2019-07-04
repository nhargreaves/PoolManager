var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");

const eight_ball_leagues = require("../models/eight_ball_leagues");

/* 
  GET handler for /api/8ball_leagues
  Function: To get all the players detail in the league
*/
router.get("/", (req, res) => {
  eight_ball_leagues.query().then(
    players => {
      res.json(players);
    },
    e => {
      res.status(400).json(e);
    }
  );
});

/* 
  POST handler for /api/8ball_leagues/add/player
  Function: To add player to the 8 ball league
*/
router.post("/add/player", (req, res) => {
  const body = _.pick(req.body, "seasonId", "staffName");

  const schema = {
    seasonId: Joi.number()
      .integer()
      .required(),
    staffName: Joi.string().required()
  };

  //Validation
  if (Joi.validate(body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  eight_ball_leagues
    .query()
    .insert({ seasonId: body.seasonId, staffName: body.staffName })
    .then(
      player => {
        res.json(player);
      },
      e => {
        res.status(404).json(e);
      }
    );
});

/* 
  DELETE handler for /api/8ball_leagues/delete/player
  Function: To delete player from the league (NOTE YET IMPLEMENTED IN THE UI)
*/
router.delete("/delete/player", (req, res) => {
  const body = _.pick(req.body, "seasonId", "staffName");

  const schema = {
    seasonId: Joi.number()
      .integer()
      .required(),
    staffName: Joi.string().required()
  };

  //Validation
  if (Joi.validate(body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  eight_ball_leagues
    .query()
    .delete()
    .where({ seasonId: body.seasonId, staffName: body.staffName })
    .then(
      result => {
        if (result === 0) {
          //Nothing deleted
          res.status(404).json();
        } else {
          //Something deleted
          res.status(204).send();
        }
      },
      e => {
        //Internal error
        res.status(500).send();
      }
    );
});

module.exports = router;

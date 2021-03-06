var express = require("express");
var router = express.Router();
const Joi = require("joi");
const auth = require("../auth");
const moment = require("moment-timezone");

const kitty = require("../models/kitty");
const eight_nine_ball_leagues = require("../models/eight_nine_ball_leagues");

/* 
  GET handler for /api/kitty
  Function: To get all the kitty details
*/
router.get("/", (req, res) => {
  kitty
    .query()
    .orderBy("id", "desc")
    .then(
      kitty => {
        res.json(kitty);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  POST handler for /api/kitty/transaction
  Function: To add credit transaction to kitty
*/
router.post("/transaction", (req, res) => {
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
    seasonId: Joi.number()
      .integer()
      .required(),
    staffName: Joi.string().required(),
    description: Joi.string().required(),
    value: Joi.number().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  kitty
    .query()
    .orderBy("id", "desc")
    .then(
      latest => {
        kitty
          .query()
          .orderBy("id", "desc")
          .insert({
            date: moment()
              .toDate()
              .toISOString(),
            type: req.body.type,
            seasonId: req.body.seasonId,
            staffName: req.body.staffName,
            description: req.body.description,
            value: req.body.value,
            total: (latest.length ? latest[0].total : 0) + req.body.value
          })
          .then(
            kitty => {
              res.json(kitty);
            },
            e => {
              res.status(400).json(e);
            }
          );
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  GET handler for /api/kitty/unpaid?staffName
  Function: To get all the kitty details
*/
router.get("/unpaid", (req, res) => {
  const schema = {
    staffName: Joi.string().required()
  };

  //Validation
  if (Joi.validate(req.query, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  eight_nine_ball_leagues
    .query()
    .where({ staffName: req.query.staffName, paid: 0 })
    .orderBy("type", "asc")
    .orderBy("seasonId", "desc")
    .then(
      unpaid => {
        res.json(unpaid);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  GET handler for /api/kitty/allUnpaid?staffName
  Function: To get all the kitty details
*/
router.get("/allUnpaid", (req, res) => {
  //Validation
  // if (Joi.validate(req.query, schema, { convert: false }).error) {
  //   res.status(400).json({ status: "error", error: "Invalid data" });
  //   return;
  // }

  eight_nine_ball_leagues
    .query()
    .where({ paid: 0 })
    .orderBy("type", "asc")
    .orderBy("seasonId", "desc")
    .then(
      unpaid => {
        res.json(unpaid);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

module.exports = router;


exports.up = function(knex) {
  return knex.schema.createTable("hall_of_fame", table => {
    table.increments();
    table.unique(["type","staffName"]);
    table.integer("type").notNullable();
    table.string("staffName").notNullable();
    table.integer("plays").defaultTo(0);
    table.integer("wins").defaultTo(0);
    table.integer("winRate").defaultTo(0);
    table.integer("draws").defaultTo(0);
    table.integer("drawRate").defaultTo(0);
    table.integer("loss").defaultTo(0);
    table.integer("lossRate").defaultTo(0);
    table.integer("punctuality").defaultTo(0);
    table.integer("punctRate").defaultTo(0);
    table.integer("goalsAgainstTop").defaultTo(0);
    table.integer("highestPoints").defaultTo(0);
    table.integer("scrappyPlays").defaultTo(0);
    table.integer("scrappy").defaultTo(0);
    table.integer("scrappyRate").defaultTo(0);
    table.integer("winningStreak").defaultTo(0);
    table.integer("losingStreak").defaultTo(0);
    table.integer("improvement").defaultTo(0);
    table.integer("curStreak").defaultTo(0);
    table.integer("curLosingStreak").defaultTo(0);
    table.integer("totalPoints").defaultTo(0);
    table.float("avgPoints",2).defaultTo(0);
    table.float("avgPointsSeason",2).defaultTo(0);

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
     return knex.schema.dropTable("hall_of_fame");
};

exports.up = function(knex) {
    return knex.schema.createTable("position_history", table => {
      table.increments();
      table.unique(["type","seasonId","staffName"]);
      table.integer("seasonId").notNullable();
      table.integer("type").notNullable();
      table.string("staffName").notNullable();
      table.integer("position");

      table
      .foreign(["type", "seasonId", "staffName"])
      .references(["type", "seasonId", "staffName"])
      .inTable("eight_nine_ball_leagues")
      .onDelete("CASCADE");
  
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
       return knex.schema.dropTable("position_history");
  };
  
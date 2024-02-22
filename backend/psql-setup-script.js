const { sequelize } = require("./db/models");

sequelize.showAllSchemas({logging: flase}).then(async (data) => {
    if (!data.includes(process.env.SCHEMA)) {
        await sequelize.createSchema(process.env.SCHEMA)
    }
})
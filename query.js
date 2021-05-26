const Sequelize = require("sequelize-cockroachdb");
// const { Pool } = require("pg");

// const MONGO_API = process.env.PELS_MONGO_URL


var sequelize = new Sequelize({
    dialect: "postgres",
    username: "",
    password: "",
    host: "free-tier.gcp-us-central1.cockroachlabs.cloud",
    port: 26257,
    database: "",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
        // For secure connection:
        /*ca: fs.readFileSync('certs/ca.crt')
                  .toString()*/
      },
    },
    logging: false,
  });

async function searchWpp(num){
    const query = await sequelize.query(`SELECT * FROM wpp_table WHERE user_phone = ${num}`, { type: sequelize.QueryTypes.SELECT})
    return query
}

async function insertWpp(num){
    await sequelize.query(`INSERT INTO wpp_table VALUES(${num},0,0,0)`)
    console.log('Number inserted');   
}

async function updateWpp(num, position, step){
  let sql = `UPDATE wpp_table SET ${position != null?`position=${position}`:`step=${step}`} WHERE user_phone=${num}`
  console.log(sql)
  const query =  await sequelize.query(sql)
  console.log('Updated state');
}

module.exports = {searchWpp, insertWpp, updateWpp}

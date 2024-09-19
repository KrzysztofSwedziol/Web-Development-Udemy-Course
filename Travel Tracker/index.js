import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

async function connectToDatabase(){
  let db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "EzIo125701",
    port: 5432
  });
  await db.connect();
  //console.log("łączenie udane");
  return db;
}

async function findCountryCode(countryPassed){
  let country = countryPassed.toLowerCase();
  //console.log(`lowered country name : ${country}`);
  let countryArr = country.split("");
  //console.log(`splited country ${countryArr}`);
  countryArr[0] = countryArr[0].toUpperCase();
  //console.log(`uppered country : ${countryArr}`);
  let countryJoined = countryArr.join("");
  //console.log(`joined country ${countryJoined}`);
  let db = await connectToDatabase();
  try{
    let countryCode = await querDatabase(db, `SELECT country_code FROM countries WHERE country_name = '${countryJoined}'`);
    db.end();
    return countryCode[0].country_code;
  }catch(error){
    console.log("chyba coś jest nie tak z twoim państwem", error.message);
    db.end();
  }
  
}

async function querDatabase(db, command){
  let result = [];
  console.log(command);
  try{
    result = await db.query(command);
    //console.log("pozyskiwanie danych udane");
    return result.rows;
  }catch(error){
    console.log("coś poszło nie tak przy wydobywaniu z bazy danych za pomocą danej komendy", error.message);
  };
}

let app = express();
let port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  let db = await connectToDatabase();
  let visitedCountries = await querDatabase(db, "SELECT * FROM visited_countries");
  let visitedAmount = visitedCountries.length;
  //console.log(visitedCountries);
  let countryCodes = visitedCountries.map(element => {
    return element.country_code;
  });
  //console.log(countryCodes);
  db.end();
  res.render("index.ejs", {
    total: visitedAmount,
    countries: countryCodes
  })
});

app.post("/add", async (req, res) => {
  let country = req.body.country;
  //console.log(country);
  let countryCode = await findCountryCode(country);
  //console.log(countryCode)
  let db = await connectToDatabase();
  await querDatabase(db, `INSERT INTO visited_countries(country_code) VALUES ('${countryCode}')`);

  db.end();
  res.redirect("/");

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

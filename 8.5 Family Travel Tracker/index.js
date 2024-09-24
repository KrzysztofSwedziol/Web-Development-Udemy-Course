import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

let curr_user_id = 8;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "EzIo125701",
  port: 5432
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Krzysztof", color: "teal" },
  { id: 2, name: "Piotr", color: "powderblue" },
  { id: 3, name: "Stanisław", color: "blue" }
];


async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: "teal",
  });
});
app.post("/add", async (req, res) => {
  const input = req.body.country;
  //console.log(input)
  const curr_id = await db.query(`SELECT id FROM COUNTRIES WHERE country_name = '${input}'`);
  let curr_id2 = curr_id.rows;
  //console.log(curr_id2);
  const country_id = curr_id2[0].id;
  //console.log(country_id);
  let curr_id3 = parseInt(country_id, 10);
  //console.log(curr_id3);


  const result = await db.query(
    `INSERT INTO users_visited_countries(user_id, country_id) VALUES($1, $2)`,
    [curr_user_id, curr_id3]
  );
  res.redirect("/");
  
});
app.post("/user", async (req, res) => {
  if(req.body.add){
    console.log("przekierowuję");
    res.render("new.ejs");
  }else{
    let user_id = req.body.user;
    curr_user_id = parseInt(user_id, 10);
    //console.log(user_id);

    let visitedPersonCountries = await db.query(`SELECT c.country_code FROM users u INNER JOIN
      users_visited_countries uvc on u.id = uvc.user_id
      INNER JOIN countries c on uvc.country_id = c.id
      WHERE u.id = '${user_id}'`);

    let codes = visitedPersonCountries.rows;
    let country_codes = codes.map((country) => {
      return country.country_code;
    })
    //console.log(country_codes);

    res.render("index.ejs", {
      countries: country_codes,
      total: country_codes.length,
      users: users,
      color: "teal",
    });
  }
});

app.post("/new", async (req, res) => {

  let new_name = req.body.name;
  let new_color = req.body.color;
  await db.query(`INSERT INTO users(name) VALUES('${new_name}')`);
  let new_id = users[users.length - 1].id + 1;
  users.push({ id : new_id, name: new_name, color: new_color});
  console.log(users);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

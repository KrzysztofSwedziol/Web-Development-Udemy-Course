import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "EzIo125701",
  port: 5432
});
await db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

app.get("/", async (req, res) => {
  let database_items = await db.query('SELECT * FROM to_do_list');
  let items_send = database_items.rows;
  //console.log(items_send);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items_send,
  });
});

app.post("/add", async (req, res) => {
  let item = req.body.newItem;
  console.log(item);
  //items.push({ title: item });
  await db.query("INSERT INTO to_do_list (title) VALUES ($1)", [item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  let curr_id = req.body.updatedItemId;
  let id_send = parseInt(curr_id, 10);
  let curr_name = req.body.updatedItemTitle;
  await db.query('UPDATE to_do_list SET title = $1 WHERE id = $2', [curr_name, id_send]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  await db.query("DELETE FROM to_do_list WHERE id = $1", [id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

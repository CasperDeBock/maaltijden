const Joi = require("joi");
const express = require("express");
var cors = require("cors");
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const maaltijden = [
  { id: 1, name: "Hamburger" },
  { id: 2, name: "Balletjes" },
  { id: 3, name: "Spaghetti" },
  { id: 4, name: "Pasta Brocolli" },
  { id: 5, name: "WAP" },
  { id: 6, name: "Kip Ert Wort" },
  { id: 7, name: "Kip Curry" },
  { id: 8, name: "Krokant Kipbroodje" },
  { id: 9, name: "Mex Wrap" },
  { id: 10, name: "Pasta Cheechbacon" },
  { id: 11, name: "Macaroni" },
  { id: 12, name: "Broodje Worst" },
];

let weekly = [];

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.get("/api/maaltijden", (req, res) => {
  res.send(maaltijden);
});

app.post("/api/maaltijden/generateweekly", (req, res) => {
  var step = 0;
  while (step < 5) {
    var randmeal = Math.floor(Math.random() * maaltijden.length);
    if (!weekly.includes(maaltijden[randmeal])) {
      weekly[step] = maaltijden[randmeal];
      step++;
    }
  }
});

app.get("/api/weekly", (req, res) => {
  res.send(weekly);
});

app.get("/api/maaltijden/:id", (req, res) => {
  const maaltijd = maaltijden.find((c) => c.id === parseInt(req.params.id));
  if (!maaltijd)
    return res.status(404).send("De maaltijd met die id bestaat niet");
  res.send(maaltijd);
});

app.post("/api/maaltijden", (req, res) => {
  const { error } = validate(req.body); //result.error
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const maaltijd = {
    id: maaltijden.length + 1,
    name: req.body.name,
  };
  maaltijden.push(maaltijd);
  res.send(maaltijd);
});

app.put("/api/maaltijden/:id", (req, res) => {
  //look up maaltijd
  const maaltijd = maaltijden.find((c) => c.id === parseInt(req.params.id));
  //-> niet? return 404
  if (!maaltijd)
    return res.status(404).send("De maaltijd met die id bestaat niet");

  //validate
  const { error } = validate(req.body); //result.error
  //ifinvalid return 400
  if (error) {
    //400
    res.status(400).send(error.details[0].message);
    return;
  }

  //update
  maaltijd.name = req.body.name;

  //return updated maaltijd
  res.send(maaltijd);
});

function validate(maaltijd) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(maaltijd, schema);
}

app.delete("/api/maaltijden/:id", (req, res) => {
  //lookup maaltijd
  const maaltijd = maaltijden.find((c) => c.id === parseInt(req.params.id));
  //-> niet? return 404
  if (!maaltijd)
    return res.status(404).send("De maaltijd met die id bestaat niet");

  //delete
  const index = maaltijden.indexOf(maaltijd);
  maaltijden.splice(index, 1);
  //return
  res.send(maaltijd);
});

app.delete("/api/deleteweekly", (req, res) => {
  weekly = [];
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

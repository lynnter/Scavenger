const mongoose = require("mongoose");
const db = require("../models");

// This file empties the Books collection and inserts the books below

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost/reactgamelist"
);

const gameSeed = [
  {
    title: "Find the tresure!",
    // cluecode: {
    //   [{clue: "Like Amazon, but free!",
    //     code: "The library"}]
    // }

    date: new Date(Date.now())
  }
  
];

db.Game
  .remove({})
  .then(() => db.Game.collection.insertMany(gameSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

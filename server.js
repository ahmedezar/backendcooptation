const express = require("express");
const app = express();

const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const config = require("./config.json");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
/*
todo Here we test the Tree logic
*/


// dammy list of user , each have an ID and a parent id the root have a Null as a parentID
const data = [
    { id: 56, parentId: 62 },
    { id: 81, parentId: 80 },
    { id: 74, parentId: null },
    { id: 76, parentId: 80 },
    { id: 63, parentId: 62 },
    { id: 80, parentId: 86 },
    { id: 87, parentId: 86 },
    { id: 62, parentId: 74 },
    { id: 86, parentId: 74 },
  ];
  /*
  reduce function turns a map into a ingle value , 
  ^ acc : accumulator :: measns the  returned value , from the  previous iteration
  ^ el : the current element
  ^ i : index of the current element
  */
  const idMapping = data.reduce((acc, el, i) => {
    acc[el.id] = i;
    return acc;
  }, {});

  let root;
data.forEach((el) => {
  // Handle the root element
  if (el.parentId === null) {
    root = el;
    return;
  }
  // Use our mapping to locate the parent element in our data array
  const parentEl = data[idMapping[el.parentId]];
  // Add our current el to its parent's `children` array
  parentEl.children = [...(parentEl.children || []), el];
});

  console.log(idMapping)
  console.log("::::::::::::::::::::")
  console.log("::::::::::::::::::::")
  console.log(root)
  console.log("::::::::::::::::::::")
  console.log("::::::::::::::::::::")

  console.log(root.children[0].children)
  // console.log(root.children[0]);
  /*
  & end of the Tree logic
  */
//we want to be informed whether mongoose has connected to the db or not 
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(
        () => {
            console.log("Connecté a la base de données");
        },
        (err) => {
            console.log("Connexion a la base de données echouée", err);
        }
    );
const userRoute = require("./routes/user.route.js");
const invitRoute = require("./routes/invit.route.js");
const offerRoute = require("./routes/offer.route");
const recRoute = require("./routes/recommandation.route");

// make 
app.use(express.static(path.join(__dirname, 'uploads')))

app.use("/api/user", userRoute);
app.use("/api/invit", invitRoute);
app.use("/api/offer/",offerRoute);
app.use("/api/rec/",recRoute);

if (process.env.NODE_ENV === "production") {
    console.log("app in production mode");
    app.use(express.static("client/build"));
    app.get("/*", function (req, res) {
        res.sendFile(
            path.join(__dir, "client", "build", "index.html"),
            function (err) {
                if (err) res.status(500).send(err);
            }
        );
    });
}

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
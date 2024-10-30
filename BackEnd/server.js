import express from "express";
import UserRouter from "./routes/userRoute.js";
import AuthRouter from "./routes/auth.js";
import session from "express-session";
import passport from "./util/passport-config.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cors from "cors";

mongoose
  .connect("mongodb://localhost/Login")
  .then(() => console.log("CONNECTED TO DATABASE"))
  .catch((err) => console.log(`ERROR: ${err}`));

const app = express();
const PORT = 3000;

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173", // Allow your frontend's origin
  credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));

app.use(
  session({
    secret: "carl",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(AuthRouter);
app.use(UserRouter);

app.listen(PORT, () => {
  console.log(`Server running in PORT http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  console.log(`SERVER IS RUNNING`);
});

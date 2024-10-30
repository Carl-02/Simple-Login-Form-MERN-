import { Router } from "express";
import passport from "passport";
import "../strategies/local-strategy.js";
import "../strategies/discord-strategy.js";
const router = Router();

//LOGIN
router.post("/api/auth/local", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
  console.log(req.user);
});

//CHECK LOGIN STATUS IF AUTHENTICATE
router.get("/api/auth/status", (req, res) => {
  console.log("INSIDE /auth/status endpoint");
  console.log(req.user);
  req.user ? res.send(req.user) : res.sendStatus(401);
});

//LOGOUT SESSION AND PASSPORT
router.post("/api/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);

  req.logout((err) => {
    if (err) return res.sendStatus(401);

    res.send(200);
  });
});

//DISCORD AUTH LOGIN
router.get("/api/auth/discord", passport.authenticate("discord"));
router.get(
  "/api/auth/discord/redirect",
  passport.authenticate("discord", { failureRedirect: "/login" }),
  (req, res) => {
    // Redirect to the dashboard on successful login
    res.redirect("http://localhost:5173/navbar"); // Change this to your frontend dashboard URL
  }
);

export default router;

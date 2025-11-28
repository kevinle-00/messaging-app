import express from "express";

const router = express.Router();

router.post("/register", (req, res, next) => {
  res.json({ message: "register" });
});

router.post("/login", (req, res, next) => {
  res.json({ message: "login" });
});

export default router;

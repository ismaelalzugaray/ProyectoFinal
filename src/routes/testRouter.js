import express from "express";

const router = express.Router();

router.get("/loggerTest", (req, res) => {
  req.logger.error(new Error());
  req.logger.fatal("Test fatal log");
  req.logger.debug("Test debug log");
  req.logger.http("Test http log");
  req.logger.info("Test info log");
  req.logger.warning("Test warning log");
  res.send("Logger Test");
});

export default router;

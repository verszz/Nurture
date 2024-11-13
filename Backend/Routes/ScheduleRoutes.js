const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const moment = require('moment');
const {
  loadScheduleFromDatabase,
  calculateHourlyStressData,
  addSchedule,
} = require("../repositories/Repository.schedule.js");

router.post("/getScheduleData", async (req, res) => {
  const { scheduleOwner } = req.body;

  if (!scheduleOwner) {
    return res.status(400).send("Schedule owner is required.");
  }

  try {
    const schedule = await loadScheduleFromDatabase(scheduleOwner);
    if (schedule.length === 0) {
      return res
        .status(404)
        .send(`No schedule found for owner: ${scheduleOwner}`);
    }
    res.json(schedule);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/getStressData", async (req, res) => {
  const { scheduleOwner } = req.body;

  if (!scheduleOwner) {
    return res.status(400).send("Schedule owner is required.");
  }

  try {
    const schedule = await loadScheduleFromDatabase(scheduleOwner);
    if (schedule.length === 0) {
      return res
        .status(404)
        .send(`No schedule found for owner: ${scheduleOwner}`);
    }

    const days = [...new Set(schedule.map((entry) => entry.day))];
    const result = {};
    for (const day of days) {
      const daySchedule = schedule.filter((entry) => entry.day === day);
      result[day] = await calculateHourlyStressData(daySchedule);
    }

    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/addSchedule",
  [
    body("className").notEmpty().withMessage("Class name is required."),
    body("day").notEmpty().withMessage("Day is required."),
    body("classStartTime").notEmpty().withMessage("Class start time is required."),
    body("classEndTime").notEmpty().withMessage("Class end time is required."),
    body("taskDuration").isNumeric().withMessage("Task duration must be a number."),
    body("sleepHours").isNumeric().withMessage("Sleep hours must be a number."),
    body("scheduleOwner").notEmpty().withMessage("Schedule owner is required."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      className,
      day,
      classStartTime,
      classEndTime,
      taskDuration,
      sleepHours,
      scheduleOwner,
    } = req.body;

    try {
      const scheduleId = await addSchedule(
        className,
        day,
        classStartTime,
        classEndTime,
        taskDuration,
        sleepHours,
        scheduleOwner
      );
      res.status(201).json({ scheduleId });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
const { pool } = require("../config/db.config.js");
const moment = require('moment');

const POST_CLASS_CONSTANT_DURATION = 30; // in minutes


exports.deleteSchedule = async function (scheduleId, scheduleOwner) {
  const client = await pool.connect();
  try {
    const query = `
      DELETE FROM Nurture_Schedule
      WHERE id = $1 AND schedule_owner = $2
      RETURNING id
    `;
    const values = [scheduleId, scheduleOwner];
    const res = await client.query(query, values);

    if (res.rowCount === 0) {
      throw new Error("Schedule not found or unauthorized action.");
    }

    return res.rows[0].id; // Return the deleted schedule ID
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// Function to add a schedule to the database
exports.addSchedule = async function (
  className,
  day,
  classStartTime,
  classEndTime,
  taskDuration,
  sleepHours,
  scheduleOwner
) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO Nurture_Schedule (class_name, day, class_start_time, class_end_time, task_duration, sleep_hours, schedule_owner)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
    `;
    const values = [
      className,
      day,
      classStartTime,
      classEndTime,
      taskDuration,
      sleepHours,
      scheduleOwner,
    ];
    const res = await client.query(query, values);
    return res.rows[0].id;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// Function to load schedule data for a specific user from the database
exports.loadScheduleFromDatabase = async function (scheduleOwner) {
  const query = `
    SELECT * FROM Nurture_Schedule 
    WHERE schedule_owner = $1 
    ORDER BY day, class_start_time
  `;
  const res = await pool.query(query, [scheduleOwner]);
  return res.rows;
};

// Function to create hourly stress data points
exports.calculateHourlyStressData = async function (schedule) {
  const hourlyStressScores = {};
  for (let hour = 6; hour <= 21; hour++) {
    hourlyStressScores[moment({ hour }).format("HH:mm")] = 0;
  }

  schedule.forEach((entry) => {
    const classStartTime = moment(entry.class_start_time, "HH:mm:ss");
    const classEndTime = moment(entry.class_end_time, "HH:mm:ss");
    const classDuration = moment
      .duration(classEndTime.diff(classStartTime))
      .asHours();
    const classStress = 5 * classDuration; // Example stress calculation

    let currentTime = classStartTime;
    while (currentTime.isBefore(classEndTime)) {
      const timeString = currentTime.format("HH:mm");
      if (hourlyStressScores[timeString] !== undefined) {
        hourlyStressScores[timeString] = Math.max(
          hourlyStressScores[timeString],
          classStress
        );
      }
      currentTime.add(30, "minutes");
    }

    // Add stress decay after class
    let steadyEndTime = classEndTime
      .clone()
      .add(POST_CLASS_CONSTANT_DURATION, "minutes");
    let currentStress = classStress;
    const stressDropPerStep = classStress / 6; // Decay over 2 hours (6 steps)

    for (let i = 0; i <= 6; i++) {
      const decayTime = steadyEndTime
        .clone()
        .add(i * 20, "minutes")
        .format("HH:mm");
      if (hourlyStressScores[decayTime] !== undefined) {
        hourlyStressScores[decayTime] = Math.max(
          hourlyStressScores[decayTime],
          Math.max(0, currentStress)
        );
      }
      currentStress -= stressDropPerStep;
    }
  });

  return hourlyStressScores;
};
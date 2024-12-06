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

exports.loadScheduleFromDatabase = async function (scheduleOwner) {
  const query = `
    SELECT * FROM Nurture_Schedule 
    WHERE schedule_owner = $1 
    ORDER BY
      CASE day
        WHEN 'Senin' THEN 1
        WHEN 'Selasa' THEN 2
        WHEN 'Rabu' THEN 3
        WHEN 'Kamis' THEN 4
        WHEN 'Jumat' THEN 5
      END,
      class_start_time
  `;
  const res = await pool.query(query, [scheduleOwner]);
  return res.rows;
};

exports.calculateHourlyStressData = async function (schedule) {
  const hourlyStressScores = {};
  const baseIdleStress = 2; // Starting idle stress value
  const idleStressGrowth = 0.34; // Growth per hour
  const eveningClassMultiplier = 1.7; // Multiplier for classes after 4 PM
  const nightClassMultiplier = 2.1; // Multiplier for classes after 6 PM

  // Initialize hourly stress scores with idle stress values
  for (let hour = 6; hour <= 21; hour++) {
    hourlyStressScores[moment({ hour }).format("HH:mm")] =
      baseIdleStress + (hour - 6) * idleStressGrowth;
  }
   // Calculate stress decay for hours 19:00 to 21:00
   const startStress = baseIdleStress + (18 - 6) * idleStressGrowth; // Stress value at 18:00
   const decayDuration = 6; // 6 hours for the decay
   const decayPerHour = (startStress - baseIdleStress) / decayDuration; // Calculate the amount of decay per hour
 
   for (let hour = 19; hour <= 21; hour++) {
     const timeString = moment({ hour }).format("HH:mm");
     hourlyStressScores[timeString] = startStress - decayPerHour * (hour - 19);
   }

  schedule.forEach((entry) => {
    const classStartTime = moment(entry.class_start_time, "HH:mm:ss");
    const classEndTime = moment(entry.class_end_time, "HH:mm:ss");
    const classDuration = moment.duration(classEndTime.diff(classStartTime)).asHours();

    // Calculate base stress value
    let classStress = 5 * classDuration;

    // Adjust class stress based on the class's start time or end time
    if (classStartTime.hour() >= 18 || classEndTime.hour() >= 18) {
      classStress *= nightClassMultiplier; // After 6 PM, apply night multiplier
    } else if (classStartTime.hour() >= 16) {
      classStress *= eveningClassMultiplier; // After 4 PM, apply evening multiplier
    }

    let currentTime = classStartTime;
    let incrementalStress = 0;

    // Loop through each hour of the class
    while (currentTime.isBefore(classEndTime)) {
      const timeString = currentTime.format("HH:mm");

      // Determine the appropriate stress multiplier for this hour
      let currentMultiplier = 1;
      if (currentTime.hour() >= 18) {
        currentMultiplier = nightClassMultiplier; // After 6 PM
      } else if (currentTime.hour() >= 16) {
        currentMultiplier = eveningClassMultiplier; // After 4 PM
      }

      // Calculate the base stress for this time and apply the multiplier
      if (hourlyStressScores[timeString] !== undefined) {
        incrementalStress += 1; // Increase stress for each hour
        hourlyStressScores[timeString] += incrementalStress * currentMultiplier;
      }

      currentTime.add(1, "hour");
    }

    // Add stress decay after the class (4 hours to idle)
    let steadyEndTime = classEndTime.clone();
    let currentStressValue = classStress;
    const stressDropPerStep = currentStressValue / 16; // Decay over 4 hours (12 steps)

    for (let i = 0; i <= 12; i++) {
      const decayTime = steadyEndTime
        .clone()
        .add(i * 20, "minutes")
        .format("HH:mm");
      if (hourlyStressScores[decayTime] !== undefined) {
        hourlyStressScores[decayTime] = Math.max(
          hourlyStressScores[decayTime],
          Math.max(0, currentStressValue)
        );
      }
      currentStressValue -= stressDropPerStep;
    }
  });

  return hourlyStressScores;
};
import axios from 'axios';

// Function to get the stress data from the backend API
export const getStressData = async (scheduleOwner) => {
    try {
      const response = await axios.post(`http://localhost:3000/schedule/getStressData`, {
        scheduleOwner,
      });
      return response.data; // This returns the stress data for each day
    } catch (error) {
      console.error("Error getting stress data:", error);
      throw error; // Rethrow error to handle it in the component
    }
  };
  
  // Function to add a new schedule to the database
  export const addSchedule = async (
    className,
    day,
    classStartTime,
    classEndTime,
    taskDuration,
    sleepHours,
    scheduleOwner
  ) => {
    try {
      const response = await axios.post(`http://localhost:3000/schedule/addSchedule`, {
        className,
        day,
        classStartTime,
        classEndTime,
        taskDuration,
        sleepHours,
        scheduleOwner,
      });
      return response.data; // Returns the ID of the newly added schedule
    } catch (error) {
      console.error("Error adding schedule:", error);
      throw error; // Rethrow error to handle it in the component
    }
  };
  
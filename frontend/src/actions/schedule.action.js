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
  
  export const getScheduleData = async (scheduleOwner) => {
    try {
      const response = await axios.post("http://localhost:3000/schedule/getScheduleData", {
        scheduleOwner,
      });
  
      // Check if the response contains the data directly
      if (response.data) {
        // If the backend returns the data directly, return it
        return {
          success: true,
          data: response.data, // Schedule data
        };
      } else {
        console.error("API did not return schedule data:", response.data);
        return {
          success: false,
          message: "Failed to fetch schedule",
        };
      }
    } catch (error) {
      console.error("Error getting schedule data:", error);
      return {
        success: false,
        message: "Error fetching schedule data",
      };
    }
  };
  

  export const deleteSchedule = async (scheduleId, scheduleOwner) => {
    try {
      const response = await axios.delete('http://localhost:3000/schedule/DeleteSchedule', {
        data: { scheduleId, scheduleOwner },
      });
      console.log(response.data.message);
    } catch (error) {
      console.error("Error deleting schedule:", error.response?.data || error.message);
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


  
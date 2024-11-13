import csv
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

# Constants for stress calculations
MAX_DAILY_HOURS = 8
MIN_BREAK_TIME = 15  # in minutes between classes
MIN_SLEEP_HOURS = 7
MAX_TASK_LOAD = 10  # arbitrary scale of perceived load

# Constants for stress decay
POST_CLASS_CONSTANT_DURATION = 30  # 30 minutes steady stress post-class
POST_CLASS_DECAY_DURATION = 120  # 120 minutes gradual decay

# Function to load the schedule from CSV
def load_schedule_from_csv(filename):
    week_schedule = []
    with open(filename, mode='r') as file:
        reader = csv.DictReader(file)
        current_day_schedule = {}
        for row in reader:
            day = row['day']
            start_time = datetime.strptime(row['class_start_time'], '%H:%M')
            end_time = datetime.strptime(row['class_end_time'], '%H:%M')
            task_duration = float(row['task_duration']) if row['task_duration'] else 0
            sleep_hours = float(row['sleep_hours'])
            
            # Grouping classes and tasks by days
            if current_day_schedule and current_day_schedule["day"] != day:
                week_schedule.append(current_day_schedule)
                current_day_schedule = {}
            
            if not current_day_schedule:
                current_day_schedule = {
                    "day": day,
                    "classes": [],
                    "tasks": [],
                    "sleep_hours": 0
                }
            
            # Adding classes and tasks
            if start_time and end_time:
                current_day_schedule["classes"].append({
                    "start_time": start_time,
                    "end_time": end_time,
                    "duration": (end_time - start_time).seconds / 3600  # in hours
                })
            
            if task_duration > 0:
                current_day_schedule["tasks"].append({
                    "duration": task_duration
                })
                
            current_day_schedule["sleep_hours"] = sleep_hours
        
        if current_day_schedule:
            week_schedule.append(current_day_schedule)
    return week_schedule

# Function to calculate the stress decay after a class
def calculate_stress_decay(class_stress, start_time):
    decay_times = []
    decay_stress_levels = []
    
    # Add steady stress for the first 30 minutes after the class
    steady_end_time = start_time + timedelta(minutes=POST_CLASS_CONSTANT_DURATION)
    decay_times.append(start_time)
    decay_stress_levels.append(class_stress)
    decay_times.append(steady_end_time)
    decay_stress_levels.append(class_stress)
    
    # Add gradual decay over the next 2 hours
    decay_end_time = steady_end_time + timedelta(minutes=POST_CLASS_DECAY_DURATION)
    decay_steps = 6  # 6 steps for 2 hours of decay (20 minutes each)
    stress_drop_per_step = class_stress / decay_steps
    current_stress = class_stress
    
    for i in range(1, decay_steps + 1):
        decay_times.append(steady_end_time + timedelta(minutes=20 * i))
        current_stress -= stress_drop_per_step
        decay_stress_levels.append(max(0, current_stress))  # Ensure stress doesn't go negative
    
    return decay_times, decay_stress_levels

# Function to analyze the stress for each class in a day
def analyze_class_stress(day_schedule):
    hourly_stress_scores = {datetime.strptime(f"{hour:02}:00", "%H:%M"): 0 for hour in range(6, 22)}
    
    for class_info in day_schedule["classes"]:
        class_start = class_info["start_time"]
        class_end = class_info["end_time"]
        class_duration = class_info["duration"]
        class_stress = 5 * class_duration  # Example: stress is scaled with duration
        
        # Record class stress during the class hours
        current_time = class_start
        while current_time < class_end:
            if current_time in hourly_stress_scores:
                hourly_stress_scores[current_time] = max(hourly_stress_scores[current_time], class_stress)
            current_time += timedelta(minutes=30)
        
        # Record post-class decay in stress
        decay_times, decay_stress_levels = calculate_stress_decay(class_stress, class_end)
        for decay_time, decay_stress in zip(decay_times, decay_stress_levels):
            if decay_time in hourly_stress_scores:
                hourly_stress_scores[decay_time] = max(hourly_stress_scores[decay_time], decay_stress)
    
    return sorted(hourly_stress_scores.items())  # Sorted by time

# Function to plot hourly stress levels for a selected day
def plot_hourly_stress(hourly_stress_scores, day):
    times = [item[0].strftime("%H:%M") for item in hourly_stress_scores]
    stress_levels = [item[1] for item in hourly_stress_scores]
    
    plt.figure(figsize=(12, 6))
    plt.plot(times, stress_levels, marker='o', color='r', linestyle='-', linewidth=2, markersize=6)
    plt.title(f"Hourly Stress Levels for {day}")
    plt.xlabel("Time")
    plt.ylabel("Stress Level")
    plt.grid(visible=True)
    plt.xticks(rotation=45)
    plt.show()

# Function to plot the daily stress for the week
def plot_daily_stress(daily_stress_scores):
    days = [item[0] for item in daily_stress_scores]
    stress_levels = [item[1] for item in daily_stress_scores]
    
    plt.figure(figsize=(10, 6))
    plt.bar(days, stress_levels, color='b')
    plt.title("Daily Stress Levels for the Week")
    plt.xlabel("Day")
    plt.ylabel("Stress Level")
    plt.xticks(rotation=45)
    plt.show()

# Function to analyze the weekly schedule
def analyze_week_schedule(week_schedule):
    daily_stress_scores = []
    
    for day in week_schedule:
        total_day_stress = 0
        for class_info in day["classes"]:
            class_duration = class_info["duration"]
            class_stress = 5 * class_duration  # Example: stress is scaled with duration
            total_day_stress += class_stress
        
        # Include task stress and sleep hours in the total stress calculation
        total_day_stress += sum(task["duration"] for task in day["tasks"])
        if day["sleep_hours"] < MIN_SLEEP_HOURS:
            total_day_stress += (MIN_SLEEP_HOURS - day["sleep_hours"]) * 2  # Penalty for lack of sleep
        
        daily_stress_scores.append((day["day"], total_day_stress))
    
    return daily_stress_scores

# Main function to load, analyze, and plot
def main():
    filename = input("Enter the CSV filename containing the weekly schedule: ")
    week_schedule = load_schedule_from_csv(filename)
    daily_stress_scores = analyze_week_schedule(week_schedule)
    
    # Plot weekly stress levels
    plot_daily_stress(daily_stress_scores)
    
    # Loop for hourly breakdown selection
    while True:
        selected_day = input("Enter a day of the week to see hourly stress breakdown (e.g., Monday), or 'exit' to quit: ")
        
        if selected_day.lower() == "exit":
            print("Exiting the program.")
            break

        day_found = False
        for day in week_schedule:
            if day["day"].lower() == selected_day.lower():
                hourly_stress_scores = analyze_class_stress(day)
                plot_hourly_stress(hourly_stress_scores, selected_day)
                day_found = True
                break

        if not day_found:
            print(f"No data found for '{selected_day}'. Please check the spelling or try another day.")

main()
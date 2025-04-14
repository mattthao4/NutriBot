import React, { useState } from 'react';
import { CalendarIcon, ChartBarIcon, ArrowTrendingUpIcon, FireIcon, ScaleIcon, BeakerIcon } from '@heroicons/react/24/outline';

function WeeklyReport() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  
  const weeks = [
    {
      id: 0,
      startDate: '2023-04-10',
      endDate: '2023-04-16',
      meals: [
        { day: 'Monday', breakfast: 'Oatmeal with berries', lunch: 'Grilled chicken salad', dinner: 'Salmon with vegetables' },
        { day: 'Tuesday', breakfast: 'Greek yogurt with granola', lunch: 'Quinoa bowl', dinner: 'Turkey stir-fry' },
        { day: 'Wednesday', breakfast: 'Smoothie bowl', lunch: 'Tuna sandwich', dinner: 'Vegetable curry' },
        { day: 'Thursday', breakfast: 'Avocado toast', lunch: 'Chicken wrap', dinner: 'Beef stew' },
        { day: 'Friday', breakfast: 'Pancakes', lunch: 'Salad bowl', dinner: 'Pasta primavera' },
        { day: 'Saturday', breakfast: 'Eggs benedict', lunch: 'Burger', dinner: 'Pizza' },
        { day: 'Sunday', breakfast: 'French toast', lunch: 'Sushi', dinner: 'Roast chicken' },
      ],
      nutrition: {
        calories: { average: 2200, goal: 2000 },
        protein: { average: 120, goal: 100 },
        carbs: { average: 250, goal: 200 },
        fat: { average: 80, goal: 70 },
      },
      progress: {
        weight: { start: 75, end: 74.5 },
        bodyFat: { start: 20, end: 19.8 },
        waterIntake: { average: 2.5, goal: 3 },
      },
      achievements: [
        'Met protein goals 5 out of 7 days',
        'Stayed within calorie range 6 out of 7 days',
        'Completed meal prep for all weekday meals'
      ],
      improvements: [
        'Consider increasing protein intake slightly',
        'Plan weekend meals in advance',
        'Add more variety to snacks'
      ]
    }
  ];

  const currentWeek = weeks[selectedWeek];

  const getProgressColor = (current, goal) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Weekly Report</h1>
          <p className="text-gray-600">Track your nutrition and fitness progress</p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="icon text-primary-2" />
          <select 
            className="input bg-white"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
          >
            {weeks.map((week, index) => (
              <option key={week.id} value={index}>
                {new Date(week.startDate).toLocaleDateString()} - {new Date(week.endDate).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <ChartBarIcon className="icon text-primary-2" />
            <h2 className="text-lg font-semibold">Nutrition Summary</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(currentWeek.nutrition).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <span className="capitalize font-medium text-gray-700">{key}</span>
                  <span className="font-medium">
                    {value.average} / {value.goal}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getProgressColor(value.average, value.goal)}`}
                    style={{ width: `${Math.min(100, (value.average / value.goal) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <ArrowTrendingUpIcon className="icon text-primary-2" />
            <h2 className="text-lg font-semibold">Progress</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ScaleIcon className="icon text-primary-2" />
                  <p className="text-gray-600">Weight</p>
                </div>
                <p className="text-lg font-medium">
                  {currentWeek.progress.weight.end} kg
                  <span className={`text-sm ml-2 ${currentWeek.progress.weight.end < currentWeek.progress.weight.start ? 'text-green-500' : 'text-red-500'}`}>
                    ({currentWeek.progress.weight.end - currentWeek.progress.weight.start} kg)
                  </span>
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FireIcon className="icon text-primary-2" />
                  <p className="text-gray-600">Body Fat</p>
                </div>
                <p className="text-lg font-medium">
                  {currentWeek.progress.bodyFat.end}%
                  <span className={`text-sm ml-2 ${currentWeek.progress.bodyFat.end < currentWeek.progress.bodyFat.start ? 'text-green-500' : 'text-red-500'}`}>
                    ({currentWeek.progress.bodyFat.end - currentWeek.progress.bodyFat.start}%)
                  </span>
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BeakerIcon className="icon text-primary-2" />
                <p className="text-gray-600">Water Intake</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getProgressColor(currentWeek.progress.waterIntake.average, currentWeek.progress.waterIntake.goal)}`}
                    style={{ width: `${(currentWeek.progress.waterIntake.average / currentWeek.progress.waterIntake.goal) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  {currentWeek.progress.waterIntake.average}L / {currentWeek.progress.waterIntake.goal}L
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Meal Plan</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium text-gray-600">Day</th>
                  <th className="text-left py-3 font-medium text-gray-600">Breakfast</th>
                  <th className="text-left py-3 font-medium text-gray-600">Lunch</th>
                  <th className="text-left py-3 font-medium text-gray-600">Dinner</th>
                </tr>
              </thead>
              <tbody>
                {currentWeek.meals.map((meal) => (
                  <tr key={meal.day} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{meal.day}</td>
                    <td className="py-3">{meal.breakfast}</td>
                    <td className="py-3">{meal.lunch}</td>
                    <td className="py-3">{meal.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card bg-green-50">
            <h2 className="text-lg font-semibold mb-4 text-green-800">Achievements 🎉</h2>
            <ul className="space-y-2">
              {currentWeek.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card bg-yellow-50">
            <h2 className="text-lg font-semibold mb-4 text-yellow-800">Areas for Improvement 💪</h2>
            <ul className="space-y-2">
              {currentWeek.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyReport; 
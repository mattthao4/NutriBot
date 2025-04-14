import React, { useState } from 'react';
import { ChartBarIcon, CalendarIcon, FireIcon, ScaleIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, BeakerIcon } from '@heroicons/react/24/outline';

function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const stats = {
    calories: {
      current: 1850,
      goal: 2000,
      trend: 'down',
      change: 150
    },
    protein: {
      current: 120,
      goal: 140,
      trend: 'up',
      change: 15
    },
    weight: {
      current: 75.5,
      goal: 72,
      trend: 'down',
      change: 0.5
    },
    water: {
      current: 2.5,
      goal: 3,
      trend: 'up',
      change: 0.3
    }
  };

  const recentMeals = [
    {
      id: 1,
      name: 'Chicken Salad',
      time: '12:30 PM',
      calories: 450,
      protein: 35,
      carbs: 30,
      fats: 15
    },
    {
      id: 2,
      name: 'Protein Shake',
      time: '10:00 AM',
      calories: 250,
      protein: 25,
      carbs: 20,
      fats: 5
    }
  ];

  const upcomingMeals = [
    {
      id: 1,
      name: 'Grilled Salmon',
      time: '7:00 PM',
      calories: 550,
      protein: 40,
      carbs: 35,
      fats: 20
    },
    {
      id: 2,
      name: 'Greek Yogurt',
      time: '3:00 PM',
      calories: 150,
      protein: 15,
      carbs: 10,
      fats: 5
    }
  ];

  const getTrendIcon = (trend) => {
    return trend === 'up' ? (
      <ArrowTrendingUpIcon className="icon text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="icon text-red-500" />
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Track your nutrition and fitness progress</p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="icon text-primary-2" />
          <select 
            className="input bg-white"
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {key === 'calories' && <FireIcon className="icon text-primary-2" />}
                {key === 'protein' && <ScaleIcon className="icon text-primary-2" />}
                {key === 'weight' && <ChartBarIcon className="icon text-primary-2" />}
                {key === 'water' && <BeakerIcon className="icon text-primary-2" />}
                <h3 className="font-medium text-gray-700 capitalize">{key}</h3>
              </div>
              {getTrendIcon(value.trend)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-gray-800">
                  {value.current}
                  {key === 'weight' ? ' kg' : key === 'water' ? ' L' : ''}
                </p>
                <p className={`text-sm ${value.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {value.trend === 'up' ? '+' : '-'}{value.change}
                </p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-primary-2"
                  style={{ width: `${Math.min(100, (value.current / value.goal) * 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Goal: {value.goal}{key === 'weight' ? ' kg' : key === 'water' ? ' L' : ''}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Meals</h2>
          <div className="space-y-4">
            {recentMeals.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{meal.name}</p>
                  <p className="text-sm text-gray-600">{meal.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{meal.calories} kcal</p>
                  <p className="text-sm text-gray-600">
                    P: {meal.protein}g C: {meal.carbs}g F: {meal.fats}g
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Upcoming Meals</h2>
          <div className="space-y-4">
            {upcomingMeals.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{meal.name}</p>
                  <p className="text-sm text-gray-600">{meal.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{meal.calories} kcal</p>
                  <p className="text-sm text-gray-600">
                    P: {meal.protein}g C: {meal.carbs}g F: {meal.fats}g
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 
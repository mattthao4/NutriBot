import React, { useState, useEffect } from 'react';
import { ChartBarIcon, CalendarIcon, FireIcon, ScaleIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, BeakerIcon, XMarkIcon } from '@heroicons/react/24/outline';

function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [mealPlan, setMealPlan] = useState({});
  const [recentMeals, setRecentMeals] = useState([]);
  const [upcomingMeals, setUpcomingMeals] = useState([]);
  const [stats, setStats] = useState({
    calories: {
      current: 0,
      goal: 2000,
      trend: 'down',
      change: 0
    },
    protein: {
      current: 0,
      goal: 140,
      trend: 'up',
      change: 0
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
  });

  useEffect(() => {
    // Load meal plan from session storage
    const savedMealPlan = JSON.parse(sessionStorage.getItem('mealPlan') || '{}');
    setMealPlan(savedMealPlan);
    updateMealsAndStats(savedMealPlan);
  }, []);

  const updateMealsAndStats = (plan) => {
    const today = new Date();
    const recent = [];
    const upcoming = [];
    let totalCalories = 0;
    let totalProtein = 0;

    // Process all meals in the plan
    Object.entries(plan).forEach(([day, meals]) => {
      Object.entries(meals).forEach(([mealType, recipes]) => {
        recipes.forEach(recipe => {
          const mealDate = new Date(recipe.addedAt);
          const mealData = {
            id: `${day}-${mealType}-${recipe.id}`,
            name: recipe.name,
            time: `${day} ${mealType}`,
            calories: recipe.calories,
            protein: parseInt(recipe.nutrition.protein),
            carbs: parseInt(recipe.nutrition.carbs),
            fats: parseInt(recipe.nutrition.fat)
          };

          // Add to recent or upcoming based on date
          if (mealDate <= today) {
            recent.push(mealData);
            totalCalories += recipe.calories;
            totalProtein += parseInt(recipe.nutrition.protein);
          } else {
            upcoming.push(mealData);
          }
        });
      });
    });

    // Sort meals by time
    recent.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    upcoming.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));

    // Update state
    setRecentMeals(recent.slice(0, 2));
    setUpcomingMeals(upcoming.slice(0, 2));

    // Update stats
    setStats(prevStats => ({
      ...prevStats,
      calories: {
        ...prevStats.calories,
        current: totalCalories,
        change: totalCalories - prevStats.calories.current
      },
      protein: {
        ...prevStats.protein,
        current: totalProtein,
        change: totalProtein - prevStats.protein.current
      }
    }));
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? (
      <ArrowTrendingUpIcon className="icon text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="icon text-red-500" />
    );
  };

  const removeMeal = (mealId) => {
    // Parse the mealId to get day, mealType, and recipeId
    const [day, mealType, recipeId] = mealId.split('-');
    
    // Get current meal plan
    const currentMealPlan = JSON.parse(sessionStorage.getItem('mealPlan') || '{}');
    
    // Remove the specific recipe from the meal plan
    if (currentMealPlan[day] && currentMealPlan[day][mealType]) {
      currentMealPlan[day][mealType] = currentMealPlan[day][mealType].filter(
        recipe => recipe.id !== parseInt(recipeId)
      );
      
      // If no recipes left for this meal type, remove the meal type
      if (currentMealPlan[day][mealType].length === 0) {
        delete currentMealPlan[day][mealType];
      }
      
      // If no meal types left for this day, remove the day
      if (Object.keys(currentMealPlan[day]).length === 0) {
        delete currentMealPlan[day];
      }
      
      // Save updated meal plan
      sessionStorage.setItem('mealPlan', JSON.stringify(currentMealPlan));
      
      // Update state
      setMealPlan(currentMealPlan);
      updateMealsAndStats(currentMealPlan);
    }
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
                  {value.trend === 'up' ? '+' : '-'}{Math.abs(value.change)}
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
            {recentMeals.length > 0 ? (
              recentMeals.map((meal) => (
                <div key={meal.id} className="relative flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <button
                    onClick={() => removeMeal(meal.id)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove meal"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
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
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No recent meals recorded
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Upcoming Meals</h2>
          <div className="space-y-4">
            {upcomingMeals.length > 0 ? (
              upcomingMeals.map((meal) => (
                <div key={meal.id} className="relative flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <button
                    onClick={() => removeMeal(meal.id)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove meal"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
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
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No upcoming meals planned
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 
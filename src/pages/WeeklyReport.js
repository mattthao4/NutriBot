import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { mealPlanState, currentWeekState, formatDate } from '../recoil/atoms';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import '../styles/theme.css';
import './WeeklyReport.css';
import { CalendarIcon, ChartBarIcon, ArrowTrendingUpIcon, FireIcon, ScaleIcon, BeakerIcon } from '@heroicons/react/24/outline';

ChartJS.register(ArcElement, Tooltip, Legend);

const WeeklyReport = () => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [mealPlan] = useRecoilState(mealPlanState);
  const [currentWeek, setCurrentWeek] = useRecoilState(currentWeekState);
  const [nutritionData, setNutritionData] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    dailyAverages: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    mealTypeBreakdown: {}
  });
  const [mealTypeStats, setMealTypeStats] = useState({});

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

  // Initialize currentWeek if it's undefined
  useEffect(() => {
    if (!currentWeek) {
      const defaultWeek = {
        startDate: new Date().toISOString(),
        progress: {
          weight: { current: 0, goal: 0 },
          bodyFat: { current: 0, goal: 0 },
          waterIntake: { average: 0, goal: 0 }
        },
        achievements: [],
        improvements: []
      };
      setCurrentWeek(defaultWeek);
    }
  }, [currentWeek, setCurrentWeek]);

  useEffect(() => {
    calculateNutritionData(mealPlan);
  }, [mealPlan]);

  useEffect(() => {
    // Set up storage event listener
    const handleStorageChange = (e) => {
      if (e.key === 'mealPlan-' + currentWeek) {
        calculateNutritionData(mealPlan);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [mealPlan, currentWeek]);

  const calculateNutritionData = (plan) => {
    if (!plan) return;

    const dailyTotals = {};
    const mealTypeTotals = {
      breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      lunch: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      dinner: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    };

    // Process all meals in the plan
    Object.entries(plan).forEach(([day, meals]) => {
      if (!meals) return;
      
      dailyTotals[day] = { calories: 0, protein: 0, carbs: 0, fat: 0 };

      Object.entries(meals).forEach(([mealType, recipes]) => {
        if (!recipes || !Array.isArray(recipes)) return;

        recipes.forEach(recipe => {
          if (!recipe) return;

          // Extract nutrition values with proper null checks and defaults
          const calories = Number(recipe.calories || 0);
          const protein = Number(recipe.protein || recipe.nutrition?.protein?.replace('g', '') || 0);
          const carbs = Number(recipe.carbs || recipe.nutrition?.carbs?.replace('g', '') || 0);
          const fat = Number(recipe.fat || recipe.nutrition?.fat?.replace('g', '') || 0);

          // Add to daily totals with null checks
          if (dailyTotals[day]) {
            dailyTotals[day].calories += calories;
            dailyTotals[day].protein += protein;
            dailyTotals[day].carbs += carbs;
            dailyTotals[day].fat += fat;
          }

          // Add to meal type totals with null checks
          const normalizedMealType = mealType.toLowerCase();
          if (mealTypeTotals[normalizedMealType]) {
            mealTypeTotals[normalizedMealType].calories += calories;
            mealTypeTotals[normalizedMealType].protein += protein;
            mealTypeTotals[normalizedMealType].carbs += carbs;
            mealTypeTotals[normalizedMealType].fat += fat;
          }
        });
      });
    });

    // Calculate weekly totals with null checks
    const weeklyTotals = Object.values(dailyTotals).reduce((acc, day) => ({
      calories: acc.calories + (day?.calories || 0),
      protein: acc.protein + (day?.protein || 0),
      carbs: acc.carbs + (day?.carbs || 0),
      fat: acc.fat + (day?.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // Calculate daily averages with null checks
    const numDays = Object.keys(dailyTotals).length || 1;
    const dailyAverages = {
      calories: Math.round(weeklyTotals.calories / numDays),
      protein: Math.round(weeklyTotals.protein / numDays),
      carbs: Math.round(weeklyTotals.carbs / numDays),
      fat: Math.round(weeklyTotals.fat / numDays)
    };

    setNutritionData({
      totalCalories: weeklyTotals.calories,
      totalProtein: weeklyTotals.protein,
      totalCarbs: weeklyTotals.carbs,
      totalFat: weeklyTotals.fat,
      dailyAverages,
      mealTypeBreakdown: mealTypeTotals
    });

    setMealTypeStats(mealTypeTotals);
  };

  const getProgressColor = (value, goal) => {
    const percentage = (value / goal) * 100;
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMealTypeColor = (mealType) => {
    const colors = {
      'Breakfast': '#FFD166',
      'Lunch': '#06D6A0',
      'Dinner': '#118AB2',
      'Snacks': '#EF476F'
    };
    return colors[mealType] || '#6C757D';
  };

  // Safely extract progress data with fallback values
  const weight = currentWeek?.progress?.weight;
  const bodyFat = currentWeek?.progress?.bodyFat;
  const waterIntake = currentWeek?.progress?.waterIntake;

  const getChartData = (data) => ({
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [data.protein, data.carbs, data.fat],
      backgroundColor: [
        'rgba(255, 107, 107, 0.8)',  // Protein - Red
        'rgba(78, 205, 196, 0.8)',   // Carbs - Teal
        'rgba(255, 209, 102, 0.8)',  // Fat - Yellow
      ],
      borderColor: [
        'rgba(255, 107, 107, 1)',
        'rgba(78, 205, 196, 1)',
        'rgba(255, 209, 102, 1)',
      ],
      borderWidth: 1,
    }],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}g`;
          }
        }
      }
    }
  };

  return (
    <div className="weekly-report-page">
      <div className="page-background" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490645930917-897ecb06fdf4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }} />
      <div className="page-content-wrapper">
        <div className="page-header">
          <div className="title-section">
            <h1>Weekly Report</h1>
            <div className="date-range">
              {formatDate(new Date(currentWeek))} - {formatDate(new Date(new Date(currentWeek).setDate(new Date(currentWeek).getDate() + 6)))}
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stats-card total-calories">
            <h3>Total Calories</h3>
            <div className="stat-value">{nutritionData.totalCalories}</div>
            <div className="stat-label">for the week</div>
          </div>

          <div className="stats-card average-calories">
            <h3>Average Calories</h3>
            <div className="stat-value">{nutritionData.dailyAverages.calories}</div>
            <div className="stat-label">per meal</div>
          </div>
        </div>

        <div className="macro-charts">
          <div className="chart-container">
            <h3>Weekly Macro Breakdown</h3>
            <Pie data={getChartData(nutritionData.dailyAverages)} options={chartOptions} />
          </div>
          <div className="chart-container">
            <h3>Meal Type Distribution</h3>
            <Pie 
              data={{
                labels: Object.keys(mealTypeStats),
                datasets: [{
                  data: Object.values(mealTypeStats).map(stats => stats.calories),
                  backgroundColor: [
                    'rgba(255, 107, 107, 0.8)',  // Breakfast
                    'rgba(78, 205, 196, 0.8)',   // Lunch
                    'rgba(255, 209, 102, 0.8)',  // Dinner
                  ],
                  borderColor: [
                    'rgba(255, 107, 107, 1)',
                    'rgba(78, 205, 196, 1)',
                    'rgba(255, 209, 102, 1)',
                  ],
                  borderWidth: 1,
                }],
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value} calories`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="nutrition-chart">
          <h3>Average Nutrition per Meal</h3>
          <div className="nutrition-bars">
            <div className="nutrition-bar">
              <div className="bar-label">Protein</div>
              <div className="bar-container">
                <div 
                  className="bar-fill protein"
                  style={{ width: `${(nutritionData.dailyAverages.protein / 140) * 100}%` }}
                >
                  <span className="bar-value">{nutritionData.dailyAverages.protein}g</span>
                </div>
              </div>
            </div>
            <div className="nutrition-bar">
              <div className="bar-label">Carbs</div>
              <div className="bar-container">
                <div 
                  className="bar-fill carbs"
                  style={{ width: `${(nutritionData.dailyAverages.carbs / 250) * 100}%` }}
                >
                  <span className="bar-value">{nutritionData.dailyAverages.carbs}g</span>
                </div>
              </div>
            </div>
            <div className="nutrition-bar">
              <div className="bar-label">Fat</div>
              <div className="bar-container">
                <div 
                  className="bar-fill fat"
                  style={{ width: `${(nutritionData.dailyAverages.fat / 65) * 100}%` }}
                >
                  <span className="bar-value">{nutritionData.dailyAverages.fat}g</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="meal-type-chart">
          <h3>Meals by Type</h3>
          <div className="meal-type-bars">
            {Object.entries(mealTypeStats).map(([mealType, stats]) => (
              <div key={mealType} className="meal-type-bar">
                <div className="bar-label">{mealType}</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${(stats.calories / Math.max(...Object.values(mealTypeStats).map(s => s.calories))) * 100}%`,
                      backgroundColor: getMealTypeColor(mealType)
                    }}
                  >
                    <span className="bar-value">{stats.calories} calories</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                {Object.entries(nutritionData.dailyAverages).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="capitalize font-medium text-gray-700">{key}</span>
                      <span className="font-medium">
                        {value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${getProgressColor(value, nutritionData.dailyAverages[key])}`}
                        style={{ width: `${Math.min(100, (value / nutritionData.dailyAverages[key]) * 100)}%` }}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport; 
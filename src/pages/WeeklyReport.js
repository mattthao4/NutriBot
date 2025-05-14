import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { mealPlanState, currentWeekState, formatDate, formatDisplayDate, getWeekDates } from '../recoil/atoms';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import '../styles/theme.css';
import './WeeklyReport.css';
import { CalendarIcon, ChartBarIcon, ArrowTrendingUpIcon, FireIcon, ScaleIcon, BeakerIcon } from '@heroicons/react/24/outline';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

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

  const weekDates = getWeekDates(new Date(currentWeek));

  const handleDateChange = (direction) => {
    const newDate = new Date(currentWeek);
    if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentWeek(newDate.toISOString());
  };

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
      const defaultWeek = new Date();
      setCurrentWeek(defaultWeek.toISOString());
    }
  }, [currentWeek, setCurrentWeek]);

  useEffect(() => {
    calculateNutritionData(mealPlan);
  }, [mealPlan, currentWeek]);

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
      breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
      lunch: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
      dinner: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 }
    };

    // Get the current week's dates
    const currentWeekDates = getWeekDates(new Date(currentWeek));

    // Process all meals in the plan for the current week only
    Object.entries(plan).forEach(([day, meals]) => {
      // Skip if the day is not in the current week
      if (!currentWeekDates.includes(day)) return;
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
            mealTypeTotals[normalizedMealType].count += 1;
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
      'breakfast': '#FFD166',
      'lunch': '#06D6A0',
      'dinner': '#118AB2',
      'snacks': '#EF476F'
    };
    return colors[mealType.toLowerCase()] || '#6C757D';
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

  const getTimeSeriesData = () => {
    const weekDates = getWeekDates(new Date(currentWeek));
    const dailyData = weekDates.map(date => {
      const dayMeals = mealPlan[date] || {};
      const totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      };

      Object.values(dayMeals).forEach(recipes => {
        recipes.forEach(recipe => {
          if (!recipe) return;
          totals.calories += Number(recipe.calories || 0);
          totals.protein += Number(recipe.protein || recipe.nutrition?.protein?.replace('g', '') || 0);
          totals.carbs += Number(recipe.carbs || recipe.nutrition?.carbs?.replace('g', '') || 0);
          totals.fat += Number(recipe.fat || recipe.nutrition?.fat?.replace('g', '') || 0);
        });
      });

      return totals;
    });

    return {
      labels: weekDates.map(date => formatDisplayDate(date)),
      datasets: [
        {
          label: 'Calories',
          data: dailyData.map(day => day.calories),
          backgroundColor: 'rgba(255, 107, 107, 0.8)',
          borderColor: 'rgba(255, 107, 107, 1)',
          borderWidth: 1
        },
        {
          label: 'Protein (g)',
          data: dailyData.map(day => day.protein),
          backgroundColor: 'rgba(78, 205, 196, 0.8)',
          borderColor: 'rgba(78, 205, 196, 1)',
          borderWidth: 1
        },
        {
          label: 'Carbs (g)',
          data: dailyData.map(day => day.carbs),
          backgroundColor: 'rgba(255, 209, 102, 0.8)',
          borderColor: 'rgba(255, 209, 102, 1)',
          borderWidth: 1
        },
        {
          label: 'Fat (g)',
          data: dailyData.map(day => day.fat),
          backgroundColor: 'rgba(6, 214, 160, 0.8)',
          borderColor: 'rgba(6, 214, 160, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const timeSeriesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Nutrition Values'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)',
          lineWidth: 1
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0,0,0,0.03)',
          lineWidth: 1
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    barPercentage: 0.7,
    categoryPercentage: 0.7
  };

  return (
    <div className="weekly-report-page">
      <div className="page-background" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490645930917-897ecb06fdf4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }} />
      <div className="weekly-report-content-wrapper">
        <div className="page-header">
          <div className="title-section">
            <h1>Weekly Report</h1>
            <div className="week-navigation">
              <button className="button button-secondary" onClick={() => handleDateChange('prev')}>
                <ChevronLeftIcon className="w-5 h-5" />
                Previous Week
              </button>
              <div className="date-range">
                {formatDisplayDate(weekDates[0])} - {formatDisplayDate(weekDates[6])}
              </div>
              <button className="button button-secondary" onClick={() => handleDateChange('next')}>
                Next Week
                <ChevronRightIcon className="w-5 h-5" />
              </button>
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
                  {nutritionData.dailyAverages.protein > 0 && (
                    <span className="bar-value">{nutritionData.dailyAverages.protein}g</span>
                  )}
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
                  {nutritionData.dailyAverages.carbs > 0 && (
                    <span className="bar-value">{nutritionData.dailyAverages.carbs}g</span>
                  )}
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
                  {nutritionData.dailyAverages.fat > 0 && (
                    <span className="bar-value">{nutritionData.dailyAverages.fat}g</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="meal-type-chart">
          <h3>Meals by Type</h3>
          <div className="meal-type-bars">
            {Object.entries(mealTypeStats).map(([mealType, stats]) => {
              const totalCalories = Object.values(mealTypeStats).reduce((sum, type) => sum + type.calories, 0);
              const percentage = totalCalories > 0 ? (stats.calories / totalCalories) * 100 : 0;
              const hasData = stats.calories > 0;
              
              return (
                <div key={mealType} className="meal-type-bar">
                  <div className="bar-label">
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    {hasData && <span className="meal-count"> ({stats.count} meals)</span>}
                  </div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{ 
                        width: hasData ? `${percentage}%` : '0%',
                        backgroundColor: getMealTypeColor(mealType)
                      }}
                    >
                      {hasData && (
                        <span className="bar-value">{stats.calories} calories</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="time-series-chart">
          <h3>Daily Nutrition Values</h3>
          <div className="chart-container">
            <Bar data={getTimeSeriesData()} options={timeSeriesOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport; 
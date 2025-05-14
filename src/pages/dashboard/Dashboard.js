/**
 * Dashboard.js
 * 
 * This file defines the Dashboard component, which serves as the main overview of the user's meal plan.
 * It displays the selected date, meal statistics, and a list of meals for the day.
 * 
 * Author(s): Matthew Thao
 */

import React, { useState, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { mealPlanState, currentWeekState, getWeekDates, selectedDateState } from '../../recoil/atoms';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/theme.css';
import './Dashboard.css';

const Dashboard = () => {
  const mealPlan = useRecoilValue(mealPlanState);
  const currentWeek = useRecoilValue(currentWeekState);
  const weekDates = getWeekDates(new Date(currentWeek));

  // State for selected day
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  const [dashboardStats, setDashboardStats] = useState({
    totalMeals: 0,
    totalCalories: 0,
    nutritionTotals: {
      protein: 0,
      carbs: 0,
      fat: 0
    },
    recentMeals: []
  });

  useEffect(() => {
    calculateDashboardStats();
  }, [mealPlan, selectedDate]);

  // Close date picker on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    }
    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
          } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  const calculateDashboardStats = () => {
    const stats = {
      totalMeals: 0,
      totalCalories: 0,
      nutritionTotals: {
        protein: 0,
        carbs: 0,
        fat: 0
      },
      recentMeals: []
    };
    if (mealPlan[selectedDate]) {
      Object.entries(mealPlan[selectedDate]).forEach(([mealType, meals]) => {
        stats.totalMeals += meals.length;
        meals.forEach(meal => {
          stats.totalCalories += Number(meal.calories) || 0;
          stats.nutritionTotals.protein += Number(meal.protein) || 0;
          stats.nutritionTotals.carbs += Number(meal.carbs) || 0;
          stats.nutritionTotals.fat += Number(meal.fat) || 0;
          stats.recentMeals.push({ ...meal, mealType });
        });
      });
    }
    stats.recentMeals.sort((a, b) => {
      const mealOrder = { 'Breakfast': 1, 'Lunch': 2, 'Dinner': 3, 'Snacks': 4 };
      return mealOrder[a.mealType] - mealOrder[b.mealType];
    });
    setDashboardStats(stats);
  };

  const getMealTime = (mealType) => {
    const times = {
      'Breakfast': '8:00 AM',
      'Lunch': '12:00 PM',
      'Dinner': '6:00 PM',
      'Snacks': '3:00 PM'
    };
    return times[mealType] || '12:00 PM';
  };

  const formatMealDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Navigation for previous/next day
  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev.toISOString().split('T')[0]);
  };
  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next.toISOString().split('T')[0]);
  };

  // Check if there is any nutrition data
  const hasNutritionData = dashboardStats.nutritionTotals.protein > 0 || dashboardStats.nutritionTotals.carbs > 0 || dashboardStats.nutritionTotals.fat > 0;
  const nutritionTotal = dashboardStats.nutritionTotals.protein + dashboardStats.nutritionTotals.carbs + dashboardStats.nutritionTotals.fat;

  return (
    <div className="dashboard-page">
      <div className="page-background" />
      <div className="page-content-wrapper">
        <div className="page-header">
          <div className="title-section">
            <h1>Dashboard</h1>
          </div>
          <div className="week-navigation">
            <button className="button button-secondary" onClick={handlePrevDay} title="Previous Week"><ChevronLeftIcon width={20} /> Previous Week</button>
            <h2>{formatMealDate(selectedDate)}</h2>
            <button className="button button-secondary" onClick={handleNextDay} title="Next Week">Next Week <ChevronRightIcon width={20} /></button>
          </div>
        </div>
        <div className="dashboard-grid">
          <div className="dashboard-card summary-stats">
            <h2>Daily Summary</h2>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-value">{dashboardStats.totalMeals}</span>
                <span className="stat-label">Total Meals</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{Math.round(dashboardStats.totalCalories)}</span>
                <span className="stat-label">Total Calories</span>
              </div>
            </div>
          </div>
          <div className="dashboard-card nutrition-overview">
            <h2>Nutrition Overview</h2>
            {hasNutritionData && nutritionTotal > 0 && (
              <>
                <div className="nutrition-chart">
                  <div className="chart-bar">
                    <div 
                      className="chart-segment protein" 
                      style={{ width: `${(dashboardStats.nutritionTotals.protein / nutritionTotal) * 100}%` }}
                    />
                    <div 
                      className="chart-segment carbs" 
                      style={{ width: `${(dashboardStats.nutritionTotals.carbs / nutritionTotal) * 100}%` }}
                    />
                    <div 
                      className="chart-segment fat" 
                      style={{ width: `${(dashboardStats.nutritionTotals.fat / nutritionTotal) * 100}%` }}
                    />
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color protein" />
                      <span>Protein</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color carbs" />
                      <span>Carbs</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color fat" />
                      <span>Fat</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="nutrition-totals centered-totals">
              <div className="total-item">
                <span className="total-label">Protein</span>
                <span className="total-value">{Math.round(dashboardStats.nutritionTotals.protein)}g</span>
              </div>
              <div className="total-item">
                <span className="total-label">Carbs</span>
                <span className="total-value">{Math.round(dashboardStats.nutritionTotals.carbs)}g</span>
              </div>
              <div className="total-item">
                <span className="total-label">Fat</span>
                <span className="total-value">{Math.round(dashboardStats.nutritionTotals.fat)}g</span>
              </div>
            </div>
          </div>
          <div className="dashboard-card recent-meals">
            <h2>Today's Meals</h2>
            <div className="meals-list">
              {dashboardStats.recentMeals.map((meal, index) => (
                <div key={index} className="meal-item">
                  <div className="meal-info">
                    <h3>{meal.name}</h3>
                  </div>
                  <div className="meal-time">
                    <span className="meal-type">{meal.mealType}</span>
                    <span className="meal-nutrition">{meal.calories} cal</span>
                  </div>
                </div>
              ))}
              {dashboardStats.recentMeals.length === 0 && (
                <div className="empty-state">
                  <p>No meals planned for this day</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
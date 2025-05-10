import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { XMarkIcon, PlusIcon, QuestionMarkCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { currentWeekState, mealPlanState, getMealPlanKey, formatDate } from '../recoil/atoms';
import '../styles/theme.css';
import './MealPlanner.css';

const MealPlanner = () => {
  const navigate = useNavigate();
  const [currentWeekStart, setCurrentWeekStart] = useRecoilState(currentWeekState);
  const [mealPlan, setMealPlan] = useRecoilState(mealPlanState);
  const [showHelp, setShowHelp] = useState(false);

  // Find today's date (midnight, no time, local timezone)
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  // Helper to get week dates at midnight (local)
  const getWeekDates = () => {
    const dates = [];
    const currentDate = new Date(currentWeekStart);
    currentDate.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate.toISOString().slice(0, 10));
  };

  const calculateDayNutrition = (day) => {
    const nutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };
    if (mealPlan[day]) {
      Object.values(mealPlan[day]).forEach(meals => {
        meals.forEach(meal => {
          nutrition.calories += Number(meal.calories) || 0;
          nutrition.protein += Number(meal.protein) || 0;
          nutrition.carbs += Number(meal.carbs) || 0;
          nutrition.fat += Number(meal.fat) || 0;
        });
      });
    }
    return nutrition;
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const handleMealSlotClick = (day, mealType) => {
    // Store the selected meal slot in localStorage
    localStorage.setItem('selectedMealSlot', JSON.stringify({ 
      day, 
      mealType, 
      week: getMealPlanKey(currentWeekStart) 
    }));
    navigate('/recipes');
  };

  const handleRemoveMeal = (e, day, mealType, recipeIndex) => {
    e.stopPropagation();
    const updatedMealPlan = JSON.parse(JSON.stringify(mealPlan));
    if (updatedMealPlan[day] && updatedMealPlan[day][mealType]) {
      updatedMealPlan[day][mealType].splice(recipeIndex, 1);
      if (updatedMealPlan[day][mealType].length === 0) {
        delete updatedMealPlan[day][mealType];
      }
      if (Object.keys(updatedMealPlan[day]).length === 0) {
        delete updatedMealPlan[day];
      }
      setMealPlan(updatedMealPlan);
    }
  };

  const handleClearAll = () => {
    setMealPlan({});
  };

  const renderHelpSection = () => {
    if (!showHelp) return null;
    return (
      <div className="help-section">
        <div className="help-content">
          <h2>How to Use the Meal Planner</h2>
          <div className="help-grid">
            <div className="help-item">
              <h3>Adding Meals</h3>
              <p>Click the small plus (+) button in any meal slot to add a recipe. You can add multiple recipes per meal type.</p>
            </div>
            <div className="help-item">
              <h3>Removing Meals</h3>
              <p>Click the X button next to any meal to remove it from your plan.</p>
            </div>
            <div className="help-item">
              <h3>Week Navigation</h3>
              <p>Use the arrow buttons to switch between different weeks. Each week has its own meal plan.</p>
            </div>
            <div className="help-item">
              <h3>Nutrition Tracking</h3>
              <p>View your daily nutrition totals at the right of each day's row.</p>
            </div>
          </div>
          <button className="button" onClick={() => setShowHelp(false)}>Close Help</button>
        </div>
      </div>
    );
  };

  const renderMealSlot = (day, mealType) => {
    const recipes = mealPlan[day]?.[mealType] || [];
    if (recipes.length === 0) {
      return (
        <div className="empty-meal-slot-row">
          <button
            className="add-meal-button"
            onClick={e => { e.stopPropagation(); handleMealSlotClick(day, mealType); }}
            aria-label={`Add ${mealType}`}
          >
            <span className="add-meal-label">+ Add {mealType}</span>
          </button>
        </div>
      );
    }
    return (
      <div className="meal-slot">
        <div className="meal-slot-content-list">
          {recipes.map((recipe, index) => (
            <div key={index} className="meal-item enhanced-meal-item" style={{ position: 'relative' }}>
              <button
                onClick={e => handleRemoveMeal(e, day, mealType, index)}
                className="remove-meal-button boxed-x enhanced-x-btn"
                aria-label="Remove meal"
              >
                <XMarkIcon className="w-2 h-2" />
              </button>
              <div className="meal-item-image enhanced-meal-item-image" style={{ backgroundImage: `url(${recipe.image})` }} />
              <div className="meal-item-info enhanced-meal-item-info" style={{ paddingRight: '48px' }}>
                <h4 data-fulltitle={recipe.name} title={recipe.name}>{recipe.name}</h4>
                <div className="meal-item-meta">
                  <span>{recipe.calories} cal</span>
                  <span>{recipe.prepTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="add-meal-button"
          onClick={e => { e.stopPropagation(); handleMealSlotClick(day, mealType); }}
          aria-label={`Add ${mealType}`}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderNutritionSummary = (day) => {
    const nutrition = calculateDayNutrition(day);
    return (
      <div className="nutrition-summary">
        <div className="nutrition-item">
          <span className="label">Calories:</span>
          <span className="value">{nutrition.calories}</span>
        </div>
        <div className="nutrition-item">
          <span className="label">Protein:</span>
          <span className="value">{nutrition.protein}g</span>
        </div>
        <div className="nutrition-item">
          <span className="label">Carbs:</span>
          <span className="value">{nutrition.carbs}g</span>
        </div>
        <div className="nutrition-item">
          <span className="label">Fat:</span>
          <span className="value">{nutrition.fat}g</span>
        </div>
      </div>
    );
  };

  // Fallback for adding a meal if recipe.js doesn't use the week key
  useEffect(() => {
    // Check if a new meal was added in localStorage
    const addedMeal = JSON.parse(localStorage.getItem('addedMeal') || 'null');
    const selectedSlotRaw = localStorage.getItem('selectedMealSlot');
    if (addedMeal && selectedSlotRaw) {
      let selectedSlot;
      try {
        selectedSlot = JSON.parse(selectedSlotRaw);
      } catch {
        selectedSlot = null;
      }
      if (selectedSlot) {
        // Support both new and old formats
        const slotWeek = selectedSlot.week || getMealPlanKey(currentWeekStart);
        const currentWeekKey = getMealPlanKey(currentWeekStart);
        if (slotWeek === currentWeekKey || !selectedSlot.week) {
          setMealPlan(prev => {
            const updated = { ...prev };
            if (!updated[selectedSlot.day]) updated[selectedSlot.day] = {};
            if (!updated[selectedSlot.day][selectedSlot.mealType]) updated[selectedSlot.day][selectedSlot.mealType] = [];
            // Allow duplicates: always push the added meal
            updated[selectedSlot.day][selectedSlot.mealType].push(addedMeal);
            // Persist to localStorage for the current week
            const weekKey = getMealPlanKey(currentWeekStart);
            localStorage.setItem('mealPlan-' + weekKey, JSON.stringify(updated));
            return updated;
          });
          // Remove after handling
          localStorage.removeItem('addedMeal');
          localStorage.removeItem('selectedMealSlot');
        }
      }
    }
  }, [currentWeekStart, setMealPlan]);

  return (
    <div className="meal-planner-page">
      <div className="page-background" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }} />
      <div className="page-content-wrapper">
        <div className="page-header">
          <h1>Weekly Meal Planner</h1>
          <div className="page-actions">
            <button className="button button-help" onClick={() => setShowHelp(!showHelp)}>
              <QuestionMarkCircleIcon className="w-5 h-5" />
              Help
            </button>
            <button className="button button-success">
              <span className="icon">💾</span>
              Save Plan
            </button>
            <button className="button button-danger" onClick={handleClearAll}>
              <span className="icon">🗑️</span>
              Clear All
            </button>
          </div>
        </div>
        <div className="week-navigation">
          <button className="button button-secondary" onClick={() => navigateWeek('prev')}>
            <ChevronLeftIcon className="w-5 h-5" />
            Previous Week
          </button>
          <h2>
            {formatDate(currentWeekStart)} - {formatDate(new Date(new Date(currentWeekStart).getTime() + 6 * 24 * 60 * 60 * 1000))}
          </h2>
          <button className="button button-secondary" onClick={() => navigateWeek('next')}>
            Next Week
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="meal-planner-grid enhanced-meal-planner-grid">
          <div className="grid-header enhanced-grid-header">
            <div className="day-header">Day</div>
            {mealTypes.map(mealType => (
              <div key={mealType} className="meal-header enhanced-meal-header">
                <span className="meal-icon">
                  {mealType === 'Breakfast' ? '🍳' : mealType === 'Lunch' ? '🥪' : mealType === 'Dinner' ? '🍽️' : '🍎'}
                </span>
                {mealType}
              </div>
            ))}
            <div className="meal-header enhanced-meal-header">Nutrition</div>
          </div>
          {days.map((day, index) => {
            const weekDate = getWeekDates()[index];
            const isToday = weekDate.getTime() === todayDate.getTime();
            return (
              <div key={day} className="day-row enhanced-day-row">
                <div className={`day-cell${isToday ? ' today' : ''} enhanced-day-cell`}>
                  <div className="day-date">{formatDate(weekDate)}</div>
                </div>
                {mealTypes.map(mealType => (
                  <div key={`${day}-${mealType}`} className="meal-cell enhanced-meal-cell">
                    {renderMealSlot(day, mealType)}
                  </div>
                ))}
                <div className="nutrition-cell enhanced-nutrition-cell">
                  {renderNutritionSummary(day)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {renderHelpSection()}
    </div>
  );
};

export default MealPlanner; 
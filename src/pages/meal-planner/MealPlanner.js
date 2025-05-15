/**
 * MealPlanner.js
 * 
 * This file defines the MealPlanner component, which allows users to plan their meals for the week.
 * It provides a grid layout for selecting meal slots and adding recipes to each slot.
 * 
 * Author(s): Matthew Thao
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { XMarkIcon, PlusIcon, QuestionMarkCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { currentWeekState, mealPlanState, getMealPlanKey, formatDate, selectedMealSlotState, getWeekDates, mealNotificationState } from '../../recoil/atoms';
import '../../styles/theme.css';
import './MealPlanner.css';
import MealNotification from '../../components/MealNotification';

const MealPlanner = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useRecoilState(currentWeekState);
  const [mealPlan, setMealPlan] = useRecoilState(mealPlanState);
  const [selectedMealSlot, setSelectedMealSlot] = useRecoilState(selectedMealSlotState);
  const [mealNotification, setMealNotification] = useRecoilState(mealNotificationState);
  const [showHelp, setShowHelp] = useState(false);

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const weekDates = getWeekDates(new Date(currentWeek));

  // Check for notifications in localStorage when component mounts or when currentWeek changes
  useEffect(() => {
    console.log('MealPlanner: Checking for notifications');
    const storedNotification = localStorage.getItem('mealNotification');
    console.log('MealPlanner: Raw stored notification from localStorage', storedNotification);
    
    if (storedNotification) {
      try {
        const notification = JSON.parse(storedNotification);
        console.log('MealPlanner: Parsed notification data', notification);
        // Format the notification consistently
        const formattedNotification = {
          message: `You have added ${notification.recipe?.name || 'a meal'} to ${notification.mealType || 'your meal plan'} for ${formatDisplayDate(notification.date)}`,
          type: 'add',
          mealData: {
            day: notification.date,
            mealType: notification.mealType,
            recipe: notification.recipe
          }
        };
        console.log('MealPlanner: Setting notification state', formattedNotification);
        setMealNotification(formattedNotification);
        // Clear the stored notification
        console.log('MealPlanner: Clearing stored notification from localStorage');
        localStorage.removeItem('mealNotification');
      } catch (error) {
        console.error('MealPlanner: Error parsing stored notification:', error);
      }
    } else {
      console.log('MealPlanner: No notification found in localStorage');
    }
  }, [setMealNotification, currentWeek]);

  // Log when notification state changes
  useEffect(() => {
    console.log('MealPlanner: Notification state changed', mealNotification);
  }, [mealNotification]);

  const handleDateChange = (direction) => {
    const newDate = new Date(currentWeek);
    if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentWeek(formatDate(newDate));
  };

  const handleMealSlotClick = (date, mealType) => {
    const mealSlot = {
      date,
      mealType,
    };
    setSelectedMealSlot(mealSlot);
    localStorage.setItem('selectedMealSlot', JSON.stringify(mealSlot));
    navigate('/recipes');
  };

  const formatDisplayDate = (dateInput) => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
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

  const handleRemoveMeal = (e, day, mealType, recipeIndex) => {
    e.stopPropagation();
    const updatedMealPlan = JSON.parse(JSON.stringify(mealPlan));
    if (updatedMealPlan[day] && updatedMealPlan[day][mealType]) {
      const removedMeal = updatedMealPlan[day][mealType][recipeIndex];
      // Count how many instances of this meal exist before removing
      const servings = updatedMealPlan[day][mealType].filter(
        meal => meal.name === removedMeal.name
      ).length;
      
      // Remove all instances of the same meal from this timeslot
      updatedMealPlan[day][mealType] = updatedMealPlan[day][mealType].filter(
        meal => meal.name !== removedMeal.name
      );
      
      if (updatedMealPlan[day][mealType].length === 0) {
        delete updatedMealPlan[day][mealType];
      }
      if (Object.keys(updatedMealPlan[day]).length === 0) {
        delete updatedMealPlan[day];
      }
      setMealPlan(updatedMealPlan);

      // Show notification for removed meal with quantity
      const notification = {
        message: `You removed (${servings}x) ${removedMeal.name} for ${mealType} on ${formatDisplayDate(day)}. Would you like to undo?`,
        type: 'remove',
        mealData: {
          day,
          mealType,
          recipe: removedMeal,
          index: recipeIndex,
          servings
        }
      };
      setMealNotification(notification);
    }
  };

  const handleServingChange = (e, day, mealType, recipeIndex, change) => {
    e.stopPropagation();
    const updatedMealPlan = JSON.parse(JSON.stringify(mealPlan));
    const recipe = updatedMealPlan[day][mealType][recipeIndex];
    
    console.log('MealPlanner: handleServingChange called with:', {
      day,
      mealType,
      recipeIndex,
      change,
      currentServings: recipe.servings
    });
    
    // Initialize servings if not set
    if (!recipe.servings) {
      recipe.servings = 1;
    }
    
    // If decreasing servings and it's the last one, use handleRemoveMeal to show notification
    if (change === -1 && recipe.servings <= 1) {
      console.log('MealPlanner: Decreasing servings to 0, removing meal');
      handleRemoveMeal(e, day, mealType, recipeIndex);
      return;
    }

    // Update servings count
    recipe.servings += change;
    console.log('MealPlanner: Updated servings to:', recipe.servings);
    
    // If increasing servings, add more copies of the meal
    if (change > 0) {
      const newMeal = { ...recipe };
      newMeal.servings = 1; // Each new copy starts with 1 serving
      updatedMealPlan[day][mealType].push(newMeal);
    }
    // If decreasing servings, remove one copy
    else if (change < 0) {
      // Find the last instance of this meal and remove it
      const lastIndex = updatedMealPlan[day][mealType].findLastIndex(
        meal => meal.name === recipe.name
      );
      if (lastIndex !== -1) {
        updatedMealPlan[day][mealType].splice(lastIndex, 1);
    }
    }
    
    // Update all instances of this meal to have the same servings count
    updatedMealPlan[day][mealType].forEach(meal => {
      if (meal.name === recipe.name) {
        meal.servings = recipe.servings;
      }
    });
    
    setMealPlan(updatedMealPlan);
  };

  const handleUndoRemove = () => {
    if (mealNotification?.type === 'remove' && mealNotification?.mealData) {
      const { day, mealType, recipe, index, servings } = mealNotification.mealData;
      const updatedMealPlan = JSON.parse(JSON.stringify(mealPlan));
      
      if (!updatedMealPlan[day]) {
        updatedMealPlan[day] = {};
      }
      if (!updatedMealPlan[day][mealType]) {
        updatedMealPlan[day][mealType] = [];
      }
      
      // Add back the correct number of servings
      for (let i = 0; i < servings; i++) {
        const mealCopy = { ...recipe };
        mealCopy.servings = servings; // Set the servings count for all copies
        updatedMealPlan[day][mealType].push(mealCopy);
      }
      
      setMealPlan(updatedMealPlan);
      setMealNotification(null);
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

    // Group recipes by name and track servings
    const groupedRecipes = recipes.reduce((acc, recipe) => {
      const key = recipe.name;
      if (!acc[key]) {
        acc[key] = {
          ...recipe,
          servings: 1,
          indices: [recipes.indexOf(recipe)]
        };
      } else {
        acc[key].servings++;
        acc[key].indices.push(recipes.indexOf(recipe));
      }
      return acc;
    }, {});

    return (
      <div className="meal-slot">
        <div className="meal-slot-content-list">
          {Object.values(groupedRecipes).map((recipe, index) => (
            <div key={index} className="meal-item enhanced-meal-item" style={{ position: 'relative' }}>
              <button
                onClick={e => handleRemoveMeal(e, day, mealType, recipe.indices[0])}
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
                <div className="meal-servings-control">
                  <button 
                    onClick={e => handleServingChange(e, day, mealType, recipe.indices[0], -1)}
                    className="serving-button"
                    aria-label="Decrease servings"
                  >
                    -
                  </button>
                  <span className="serving-count">{recipe.servings}x</span>
                  <button 
                    onClick={e => handleServingChange(e, day, mealType, recipe.indices[0], 1)}
                    className="serving-button"
                    aria-label="Increase servings"
                  >
                    +
                  </button>
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

  const today = new Date();
  const isToday = (d) => {
    const day = new Date(d);
    return (
      day.getFullYear() === today.getFullYear() &&
      day.getMonth() === today.getMonth() &&
      day.getDate() === today.getDate()
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
        const slotWeek = selectedSlot.week || getMealPlanKey(currentWeek);
        const currentWeekKey = getMealPlanKey(currentWeek);
        if (slotWeek === currentWeekKey || !selectedSlot.week) {
          setMealPlan(prev => {
            const updated = { ...prev };
            if (!updated[selectedSlot.date]) updated[selectedSlot.date] = {};
            if (!updated[selectedSlot.date][selectedSlot.mealType]) updated[selectedSlot.date][selectedSlot.mealType] = [];
            // Allow duplicates: always push the added meal
            updated[selectedSlot.date][selectedSlot.mealType].push(addedMeal);
            // Persist to localStorage for the current week
            const weekKey = getMealPlanKey(currentWeek);
            localStorage.setItem('mealPlan-' + weekKey, JSON.stringify(updated));
            return updated;
          });
          // Remove after handling
          localStorage.removeItem('addedMeal');
          localStorage.removeItem('selectedMealSlot');
        }
      }
    }
  }, [currentWeek, setMealPlan]);

  return (
    <div className="meal-planner-page">
      <div className="page-background"/>
      <div className="meal-planner-content-wrapper">
        <div className="page-header">
          <div className="title-section">
            <h1>Meal Planner</h1>
          </div>
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
          <button className="button button-secondary" onClick={() => handleDateChange('prev')}>
            <ChevronLeftIcon className="w-5 h-5" />
            Previous Week
          </button>
          <h2>
            {formatDisplayDate(weekDates[0])} - {formatDisplayDate(weekDates[6])}
          </h2>
          <button className="button button-secondary" onClick={() => handleDateChange('next')}>
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
            <div className="nutrition-header">Nutrition</div>
          </div>
          {weekDates.map((date, index) => {
            return (
              <div key={date} className="day-row enhanced-day-row">
                <div className={`day-cell${isToday(date) ? ' today' : ''} enhanced-day-cell`}>
                  <div className="day-date">{formatDisplayDate(date)}</div>
                </div>
                {mealTypes.map(mealType => (
                  <div key={`${date}-${mealType}`} className="meal-cell enhanced-meal-cell">
                    {renderMealSlot(date, mealType)}
                  </div>
                ))}
                <div className="nutrition-cell enhanced-nutrition-cell">
                  {renderNutritionSummary(date)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {renderHelpSection()}
      {mealNotification && (
        <MealNotification
          message={mealNotification.message}
          onClose={() => setMealNotification(null)}
          onUndo={mealNotification.type === 'remove' ? handleUndoRemove : undefined}
          recipe={mealNotification.mealData?.recipe}
          mealType={mealNotification.mealData?.mealType}
          date={mealNotification.mealData?.day}
        />
      )}
    </div>
  );
};

export default MealPlanner; 
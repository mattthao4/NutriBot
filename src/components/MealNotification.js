import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { mealPlanState } from '../recoil/atoms';
import './MealNotification.css';

const MealNotification = ({ message, recipe, mealType, date, onClose, onUndo }) => {
  console.log('MealNotification: Rendering with props', { message, recipe, mealType, date, onUndo });
  const [mealPlan, setMealPlan] = useRecoilState(mealPlanState);

  // Add a delay before auto-clearing the notification
  useEffect(() => {
    console.log('MealNotification: Setting up auto-clear timer');
    const timer = setTimeout(() => {
      console.log('MealNotification: Auto-clearing notification');
      onClose();
    }, 10000); // Clear after 10 seconds

    return () => {
      console.log('MealNotification: Cleaning up auto-clear timer');
      clearTimeout(timer);
    };
  }, [onClose]);

  const handleUndo = () => {
    if (onUndo) {
      onUndo();
    } else {
      console.log('MealNotification: Handling legacy undo action');
      const currentMealPlan = JSON.parse(JSON.stringify(mealPlan));
      const mealArray = currentMealPlan[date][mealType];
      const updatedMeals = mealArray.filter(meal => meal.id !== recipe.id);
      currentMealPlan[date][mealType] = updatedMeals;
      setMealPlan(currentMealPlan);
      onClose();
    }
  };

  return (
    <div className="meal-notification">
      <div className="meal-notification-header">
        <p className="meal-notification-message">
          {message || `You have added ${recipe?.name} to ${mealType} for ${new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}`}
        </p>
        <button
          onClick={onClose}
          className="meal-notification-close"
        >
          ✕
        </button>
      </div>
      <button
        onClick={handleUndo}
        className="meal-notification-undo"
      >
        Undo
      </button>
    </div>
  );
};

export default MealNotification; 
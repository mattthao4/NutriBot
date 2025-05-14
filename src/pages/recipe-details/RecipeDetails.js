/**
 * RecipeDetails.js
 * 
 * This file defines the RecipeDetails component, which displays detailed information about a selected recipe.
 * It includes the recipe's name, ingredients, instructions, and nutritional information.
 * 
 * Author(s): Lukas Singer
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { mealPlanState, selectedMealSlotState, onboardingStateAtom, onboardingRedirectAtom } from '../../recoil/atoms';
import '../../styles/theme.css';
import './RecipeDetails.css';
import recipes from '../../data/recipes';
import { PencilSquareIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const DIET_TYPE_LABELS = {
  noRestrictions: 'No Restrictions',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  keto: 'Keto',
  paleo: 'Paleo',
};
const BUDGET_PRIORITY_LABELS = {
  costFocused: 'Cost-Focused',
  balanced: 'Balanced',
  qualityFocused: 'Quality-Focused',
};
const MEAL_PREP_LABELS = {
  weekly: 'Weekly',
  sometimes: 'Sometimes',
  never: 'Never',
};

const RecipeDetails = () => {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const [selectedMealSlot, setSelectedMealSlot] = useRecoilState(selectedMealSlotState);
  const [mealPlan, setMealPlan] = useRecoilState(mealPlanState);
  const onboardingData = useRecoilValue(onboardingStateAtom);
  const [onboardingRedirect, setOnboardingRedirect] = useRecoilState(onboardingRedirectAtom);

  // Find the recipe by ID
  const selectedRecipe = recipes.find(recipe => recipe.id.toString() === recipeId);

  // If recipe not found, redirect to recipes page
  if (!selectedRecipe) {
    navigate('/recipes');
    return null;
  }

  const handleRecipeSelect = () => {
    if (selectedMealSlot) {
      try {
        // Get the current meal plan for the selected week
        const currentMealPlan = JSON.parse(JSON.stringify(mealPlan));

        // Initialize the date if it doesn't exist
        if (!currentMealPlan[selectedMealSlot.date]) {
          currentMealPlan[selectedMealSlot.date] = {};
        }

        // Initialize the meal type if it doesn't exist
        if (!currentMealPlan[selectedMealSlot.date][selectedMealSlot.mealType]) {
          currentMealPlan[selectedMealSlot.date][selectedMealSlot.mealType] = [];
        }

        // Add the recipe to the meal plan
        currentMealPlan[selectedMealSlot.date][selectedMealSlot.mealType].push({
          ...selectedRecipe,
          addedAt: new Date().toISOString(),
          // Flatten macros for compatibility
          protein: selectedRecipe.nutrition?.protein ? parseInt(selectedRecipe.nutrition.protein) : 0,
          carbs: selectedRecipe.nutrition?.carbs ? parseInt(selectedRecipe.nutrition.carbs) : 0,
          fat: selectedRecipe.nutrition?.fat ? parseInt(selectedRecipe.nutrition.fat) : 0,
          // Normalize ingredients to objects with a name property
          ingredients: Array.isArray(selectedRecipe.ingredients)
            ? selectedRecipe.ingredients.map(ing =>
                typeof ing === 'string' ? { name: ing } : ing
              )
            : [],
        });

        // Update the meal plan state
        setMealPlan(currentMealPlan);

        // Clear the selected meal slot
        localStorage.removeItem('selectedMealSlot');
        setSelectedMealSlot(null);

        // Navigate back to meal planner
        navigate('/meal-planner');
      } catch (error) {
        console.error('Error saving recipe to meal plan:', error);
      }
    } else {
      // If no meal slot is selected, navigate to meal planner to select a slot
      navigate('/meal-planner');
    }
  };

  const handleEditPreferences = () => {
    setOnboardingRedirect({ type: 'recipeDetails', recipeId });
    navigate('/onboarding/goals');
  };

  return (
    <div className="recipe-details-page">
      <div className="page-background" />
      <div className="recipe-details-content-wrapper">
        <div className="recipe-details-header">
          <button className="back-to-recipes-btn" onClick={() => navigate('/recipes')} title="Back to Recipes">
            <ArrowLeftIcon className="back-arrow-icon" />
          </button>
          <div className="recipe-details-image" style={{ backgroundImage: `url(${selectedRecipe.image})` }} />
          <div className="recipe-info">
            <h1 className="recipe-title">{selectedRecipe.name}</h1>
            <span>
              <span className="icon">⚖️</span>
              {selectedRecipe.calories} cal
            </span>
            <span>
              <span className="icon">⏱️</span>
              {selectedRecipe.prepTime}
            </span>
            <div className="recipe-nutrition">
              <h4>Nutrition per serving:</h4>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="label">Protein</span>
                  <span className="value">{selectedRecipe.nutrition.protein}</span>
                </div>
                <div className="nutrition-item">
                  <span className="label">Carbs</span>
                  <span className="value">{selectedRecipe.nutrition.carbs}</span>
                </div>
                <div className="nutrition-item">
                  <span className="label">Fat</span>
                  <span className="value">{selectedRecipe.nutrition.fat}</span>
                </div>
                <div className="nutrition-item">
                  <span className="label">Fiber</span>
                  <span className="value">{selectedRecipe.nutrition.fiber}</span>
                </div>
              </div>
            </div>
            <button
              className="button"
              onClick={handleRecipeSelect}
            >
              <span className="icon">➕</span>
              {selectedMealSlot ? 'Add to Plan' : 'Select Meal Slot'}
            </button>
          </div>
          {/* User Preferences Floating Box */}
          <div className="user-preferences-card user-preferences-float">
            <div className="preferences-header-row">
              <h3>Your Preferences</h3>
              <button className="edit-preferences-btn" onClick={handleEditPreferences} title="Edit Preferences">
                <PencilSquareIcon className="edit-icon" />
              </button>
            </div>
            <div className="user-preferences-list">
              <div><strong>Diet Type:</strong> {DIET_TYPE_LABELS[onboardingData.dietType] || 'Not specified'}</div>
              <div><strong>Allergies:</strong> {onboardingData.allergies && onboardingData.allergies.length > 0 ? onboardingData.allergies.join(', ') : 'None'}</div>
              <div><strong>Meals per Day:</strong> {onboardingData.mealsPerDay || 'Not specified'}</div>
              <div><strong>Meal Prep Frequency:</strong> {MEAL_PREP_LABELS[onboardingData.mealPrepFrequency] || 'Not specified'}</div>
              <div><strong>Cooking Time per Day:</strong> {onboardingData.cookingTimePerDay ? onboardingData.cookingTimePerDay + ' min' : 'Not specified'}</div>
              <div><strong>Weekly Grocery Budget:</strong> {onboardingData.weeklyGroceryBudget ? `$${onboardingData.weeklyGroceryBudget}` : 'Not specified'}</div>
              <div><strong>Budget Priority:</strong> {BUDGET_PRIORITY_LABELS[onboardingData.budgetPriority] || 'Not specified'}</div>
            </div>
          </div>
        </div>
        <div className="recipe-content">
          <div className="recipe-ingredients">
            <h4>Ingredients:</h4>
            <ul>
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{typeof ingredient === 'string' ? ingredient : ingredient.name}</li>
              ))}
            </ul>
          </div>
          <div className="recipe-instructions">
            <h4>Instructions:</h4>
            <ol>
              {selectedRecipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails; 
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { mealPlanState, selectedMealSlotState, getMealPlanKey, formatDate } from '../recoil/atoms';
import '../styles/theme.css';
import './RecipeDetails.css';
import recipes from '../data/recipes';

const RecipeDetails = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [selectedCalories, setSelectedCalories] = useState('all');
  const [selectedMealSlot, setSelectedMealSlot] = useRecoilState(selectedMealSlotState);
  const [mealPlan, setMealPlan] = useRecoilState(mealPlanState);

  const selectedRecipe = recipes[useParams().recipeId - 1];

  useEffect(() => {
    window.scrollTo(0, 0)
    // Get the meal slot from localStorage
    const savedMealSlot = JSON.parse(localStorage.getItem('selectedMealSlot') || 'null');
    if (savedMealSlot) {
      setSelectedMealSlot(savedMealSlot);
    } else {
      // If no meal slot is selected, redirect to meal planner
      navigate('/meal-planner');
    }
  }, [navigate, setSelectedMealSlot]);

  const handleRecipeSelect = (recipe) => {
    if (selectedMealSlot) {
      try {
        // Get the current meal plan for the selected week
        const weekKey = selectedMealSlot.week;
        const currentMealPlan = JSON.parse(JSON.stringify(mealPlan));

        // Initialize the day if it doesn't exist
        if (!currentMealPlan[selectedMealSlot.day]) {
          currentMealPlan[selectedMealSlot.day] = {};
        }

        // Initialize the meal type if it doesn't exist
        if (!currentMealPlan[selectedMealSlot.day][selectedMealSlot.mealType]) {
          currentMealPlan[selectedMealSlot.day][selectedMealSlot.mealType] = [];
        }

        // Add the recipe to the meal plan
        currentMealPlan[selectedMealSlot.day][selectedMealSlot.mealType].push({
          ...recipe,
          addedAt: new Date().toISOString(),
          // Flatten macros for compatibility
          protein: recipe.nutrition?.protein ? parseInt(recipe.nutrition.protein) : 0,
          carbs: recipe.nutrition?.carbs ? parseInt(recipe.nutrition.carbs) : 0,
          fat: recipe.nutrition?.fat ? parseInt(recipe.nutrition.fat) : 0,
          // Normalize ingredients to objects with a name property
          ingredients: Array.isArray(recipe.ingredients)
            ? recipe.ingredients.map(ing =>
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
    }
  };

  return (
    <div className="recipe-details-page">
      <div className="page-background" />
      <div className="page-content-wrapper">
        <div className="recipe-details-header">
          <div className="recipe-details-image" style={{ backgroundImage: `url(${selectedRecipe.image})` }} />
          <div className="recipe-info">
            <h1 className="recipe-title">{ selectedRecipe.name }</h1>
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
              onClick={() => handleRecipeSelect(selectedRecipe)}
            >
              <span className="icon">➕</span>
              Add to Plan
            </button>
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
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails; 
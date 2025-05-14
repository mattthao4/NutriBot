import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { mealPlanState, selectedMealSlotState, onboardingStateAtom, onboardingRedirectAtom } from '../recoil/atoms';
import '../styles/theme.css';
import './Recipes.css';
import recipes from '../data/recipes';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

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

const Recipes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [selectedCalories, setSelectedCalories] = useState('all');
  const [selectedMealSlot, setSelectedMealSlot] = useRecoilState(selectedMealSlotState);
  const [mealPlan, setMealPlan] = useRecoilState(mealPlanState);
  const onboardingData = useRecoilValue(onboardingStateAtom);
  const [onboardingRedirect, setOnboardingRedirect] = useRecoilState(onboardingRedirectAtom);

  useEffect(() => {
    // Get the meal slot from localStorage
    const savedMealSlot = JSON.parse(localStorage.getItem('selectedMealSlot') || 'null');
    if (savedMealSlot) {
      setSelectedMealSlot(savedMealSlot);
    } else {
      // If no meal slot is selected, redirect to meal planner
      navigate('/meal-planner');
    }
  }, [navigate, setSelectedMealSlot]);

  const diets = ['all', 'vegan', 'vegetarian', 'keto', 'paleo'];
  const cookTimes = ['all', 'quick', 'medium', 'long'];
  const calorieRanges = ['all', 'low', 'medium', 'high'];

  // Helper: check if recipe is recommended for user
  const isRecipeRecommended = (recipe) => {
    if (!onboardingData) return false;
    // 1. Diet type must match (unless 'noRestrictions')
    if (onboardingData.dietType && onboardingData.dietType !== 'noRestrictions') {
      if (recipe.diet !== onboardingData.dietType) return false;
    }
    // 2. Exclude if any allergen is present
    if (onboardingData.allergies && onboardingData.allergies.length > 0) {
      const recipeIngredients = recipe.ingredients.map(ing => (typeof ing === 'string' ? ing.toLowerCase() : ing.name.toLowerCase()));
      const hasAllergen = onboardingData.allergies.some(allergy => recipeIngredients.includes(allergy.toLowerCase()));
      if (hasAllergen) return false;
    }
    // 3. Cooking time must be at most user's preference (if set)
    if (onboardingData.cookingTimePerDay && recipe.prepTime) {
      // Assume recipe.prepTime is a string like '30 min' or '1 hr'
      let recipeMinutes = 0;
      if (typeof recipe.prepTime === 'string') {
        const match = recipe.prepTime.match(/(\d+)\s*min/);
        if (match) recipeMinutes = parseInt(match[1], 10);
        else if (/1\s*hr/.test(recipe.prepTime)) recipeMinutes = 60;
        else if (/2\s*hr/.test(recipe.prepTime)) recipeMinutes = 120;
      }
      if (recipeMinutes > onboardingData.cookingTimePerDay) return false;
    }
    return true;
  };

  const handleRecipeSelect = (recipe) => {
    if (selectedMealSlot) {
      try {
        // Get the current meal plan
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
    } else {
      // If no meal slot is selected, navigate to recipe details
      navigate(`/recipes/${recipe.id}`);
    }
  };

  const filteredRecipes = recipes
    .filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiet = selectedDiet === 'all' || recipe.diet === selectedDiet;
      const matchesTime = selectedTime === 'all' || recipe.timeCategory === selectedTime;
      const matchesCalories = selectedCalories === 'all' || recipe.calorieCategory === selectedCalories;
      
      return matchesSearch && matchesDiet && matchesTime && matchesCalories;
    })
    .sort((a, b) => {
      // Sort recommended recipes to the top
      const aRecommended = isRecipeRecommended(a);
      const bRecommended = isRecipeRecommended(b);
      if (aRecommended && !bRecommended) return -1;
      if (!aRecommended && bRecommended) return 1;
      return 0;
    });

  const formatMealSlotInfo = (mealSlot) => {
    if (!mealSlot) return '';
    
    const date = new Date(mealSlot.date);
    return `${mealSlot.mealType} for ${date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })}`;
  };

  const getAddedMealTypes = (recipeId) => {
    if (!mealPlan || !selectedMealSlot) return null;
    
    const addedMealTypes = new Set();
    // Only check the selected date
    const selectedDate = selectedMealSlot.date;
    if (mealPlan[selectedDate]) {
      Object.entries(mealPlan[selectedDate]).forEach(([mealType, recipes]) => {
        if (recipes.some(r => r.id === recipeId)) {
          addedMealTypes.add(mealType);
        }
      });
    }

    if (addedMealTypes.size === 0) return null;

    const mealTypes = Array.from(addedMealTypes);
    if (mealTypes.length === 1) {
      return `Added for ${mealTypes[0]}`;
    } else if (mealTypes.length === 2) {
      return `Added for ${mealTypes[0]} and ${mealTypes[1]}`;
    } else {
      return `Added for ${mealTypes.slice(0, -1).join(', ')}, and ${mealTypes[mealTypes.length - 1]}`;
    }
  };

  const getTotalOccurrences = (recipeId) => {
    if (!mealPlan) return 0;
    
    let total = 0;
    Object.values(mealPlan).forEach(dayMeals => {
      Object.values(dayMeals).forEach(recipes => {
        total += recipes.filter(r => r.id === recipeId).length;
      });
    });
    return total;
  };

  const handleEditPreferences = () => {
    setOnboardingRedirect({ type: 'recipes' });
    navigate('/onboarding/goals');
  };

  return (
    <div className="recipes-page">
      <div className="page-background" />
      <div className="recipes-content-wrapper">
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
        <div className="page-header">
          <div>
            <h1>Recipes</h1>
            {selectedMealSlot && (
              <h2>
                Selecting {formatMealSlotInfo(selectedMealSlot)}
              </h2>
            )}
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <label>Diet:</label>
            <select 
              value={selectedDiet} 
              onChange={(e) => setSelectedDiet(e.target.value)}
              className="filter-select"
            >
              {diets.map(diet => (
                <option key={diet} value={diet}>
                  {diet.charAt(0).toUpperCase() + diet.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Cook Time:</label>
            <select 
              value={selectedTime} 
              onChange={(e) => setSelectedTime(e.target.value)}
              className="filter-select"
            >
              {cookTimes.map(time => (
                <option key={time} value={time}>
                  {time.charAt(0).toUpperCase() + time.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Calories:</label>
            <select 
              value={selectedCalories} 
              onChange={(e) => setSelectedCalories(e.target.value)}
              className="filter-select"
            >
              {calorieRanges.map(range => (
                <option key={range} value={range}>
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="recipes-grid">
          {filteredRecipes.map(recipe => (
            <div 
              key={recipe.id}
              className="recipe-card"
            >
              <div 
                className="recipe-image" 
                style={{ backgroundImage: `url(${recipe.image})` }}
                onClick={() => navigate(`/recipes/${recipe.id}`)}
              />
              <div className="recipe-content">
                <div className="recipe-header">
                  <h3>{recipe.name}</h3>
                  <div className="recipe-tags">
                    {isRecipeRecommended(recipe) && (
                      <span className="recommended-label">Recommended</span>
                    )}
                    {getAddedMealTypes(recipe.id) && (
                      <span className="added-label">{getAddedMealTypes(recipe.id)}</span>
                    )}
                    {getTotalOccurrences(recipe.id) > 0 && (
                      <span className="total-label">Total times added: {getTotalOccurrences(recipe.id)}</span>
                    )}
                  </div>
                </div>
                <div className="recipe-meta">
                  <span className="meta-item">
                    <span className="icon">⚖️</span>
                    {recipe.calories} cal
                  </span>
                  <span className="meta-item">
                    <span className="icon">⏱️</span>
                    {recipe.prepTime}
                  </span>
                </div>
                <div className="recipe-actions">
                  <button 
                    className="button button-primary"
                    onClick={() => navigate(`/recipes/${recipe.id}`)}
                  >
                    View recipe
                  </button>
                  <button 
                    className="button button-primary"
                    onClick={() => handleRecipeSelect(recipe)}
                    disabled={!selectedMealSlot}
                  >
                    <span className="icon">➕</span>
                    {selectedMealSlot ? 'Add to Plan' : 'Select a Meal Slot First'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon">🔍</span>
            <p>No recipes found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes; 
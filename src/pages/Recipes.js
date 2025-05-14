import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { mealPlanState, selectedMealSlotState } from '../recoil/atoms';
import '../styles/theme.css';
import './Recipes.css';
import recipes from '../data/recipes';

const Recipes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [selectedCalories, setSelectedCalories] = useState('all');
  const [selectedMealSlot, setSelectedMealSlot] = useRecoilState(selectedMealSlotState);
  const [mealPlan, setMealPlan] = useRecoilState(mealPlanState);

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

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet = selectedDiet === 'all' || recipe.diet === selectedDiet;
    const matchesTime = selectedTime === 'all' || recipe.timeCategory === selectedTime;
    const matchesCalories = selectedCalories === 'all' || recipe.calorieCategory === selectedCalories;
    
    return matchesSearch && matchesDiet && matchesTime && matchesCalories;
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

  return (
    <div className="recipes-page">
      <div className="page-background" />
      <div className="recipes-content-wrapper">
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
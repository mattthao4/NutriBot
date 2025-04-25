import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/theme.css';
import './Recipes.css';

const Recipes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [selectedCalories, setSelectedCalories] = useState('all');
  const [selectedMealSlot, setSelectedMealSlot] = useState(null);

  useEffect(() => {
    // Get the meal slot from session storage
    const savedMealSlot = JSON.parse(sessionStorage.getItem('selectedMealSlot') || 'null');
    if (savedMealSlot) {
      setSelectedMealSlot({ 
        day: savedMealSlot.day, 
        mealType: savedMealSlot.mealType 
      });
    } else {
      // If no meal slot is selected, redirect to meal planner
      navigate('/meal-planner');
    }
  }, [navigate]);

  const diets = ['all', 'vegan', 'vegetarian', 'keto', 'paleo'];
  const cookTimes = ['all', 'quick', 'medium', 'long'];
  const calorieRanges = ['all', 'low', 'medium', 'high'];

  const recipes = [
    {
      id: 1,
      name: 'Avocado Toast',
      image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      calories: 350,
      prepTime: '10 mins',
      diet: 'vegetarian',
      timeCategory: 'quick',
      calorieCategory: 'medium',
      ingredients: ['Bread', 'Avocado', 'Eggs', 'Salt', 'Pepper'],
      nutrition: {
        protein: '12g',
        carbs: '35g',
        fat: '20g',
        fiber: '8g'
      }
    },
    {
      id: 2,
      name: 'Greek Salad',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      calories: 250,
      prepTime: '15 mins',
      diet: 'vegetarian',
      timeCategory: 'quick',
      calorieCategory: 'low',
      ingredients: ['Cucumber', 'Tomatoes', 'Feta', 'Olives', 'Olive Oil'],
      nutrition: {
        protein: '8g',
        carbs: '15g',
        fat: '18g',
        fiber: '6g'
      }
    },
    {
      id: 3,
      name: 'Grilled Salmon',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd941a6bae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      calories: 450,
      prepTime: '25 mins',
      diet: 'paleo',
      timeCategory: 'medium',
      calorieCategory: 'medium',
      ingredients: ['Salmon', 'Lemon', 'Dill', 'Olive Oil', 'Salt', 'Pepper'],
      nutrition: {
        protein: '35g',
        carbs: '5g',
        fat: '28g',
        fiber: '2g'
      }
    },
    {
      id: 4,
      name: 'Quinoa Bowl',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      calories: 400,
      prepTime: '20 mins',
      diet: 'vegan',
      timeCategory: 'medium',
      calorieCategory: 'medium',
      ingredients: ['Quinoa', 'Chickpeas', 'Avocado', 'Cucumber', 'Tomatoes', 'Lemon'],
      nutrition: {
        protein: '15g',
        carbs: '45g',
        fat: '18g',
        fiber: '12g'
      }
    }
  ];

  const handleRecipeSelect = (recipe) => {
    if (selectedMealSlot) {
      try {
        // Get existing meal plan from session storage
        const mealPlan = JSON.parse(sessionStorage.getItem('mealPlan') || '{}');
        
        // Initialize the day if it doesn't exist
        if (!mealPlan[selectedMealSlot.day]) {
          mealPlan[selectedMealSlot.day] = {};
        }
        
        // Initialize the meal type if it doesn't exist
        if (!mealPlan[selectedMealSlot.day][selectedMealSlot.mealType]) {
          mealPlan[selectedMealSlot.day][selectedMealSlot.mealType] = [];
        }
        
        // Add the recipe to the meal plan
        mealPlan[selectedMealSlot.day][selectedMealSlot.mealType].push({
          ...recipe,
          addedAt: new Date().toISOString()
        });
        
        // Save the updated meal plan
        sessionStorage.setItem('mealPlan', JSON.stringify(mealPlan));
        
        // Clear the selected meal slot
        sessionStorage.removeItem('selectedMealSlot');
        
        // Navigate back to meal planner
        navigate('/meal-planner');
      } catch (error) {
        console.error('Error saving recipe to meal plan:', error);
      }
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet = selectedDiet === 'all' || recipe.diet === selectedDiet;
    const matchesTime = selectedTime === 'all' || recipe.timeCategory === selectedTime;
    const matchesCalories = selectedCalories === 'all' || recipe.calorieCategory === selectedCalories;
    
    return matchesSearch && matchesDiet && matchesTime && matchesCalories;
  });

  return (
    <div className="recipes-page">
      <div className="page-background" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490645930917-897ecb06fdf4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }} />
      <div className="page-content-wrapper">
        <div className="page-header">
          <div>
            <h1>Recipes</h1>
            {selectedMealSlot && (
              <p className="meal-slot-info">
                Selecting {selectedMealSlot.mealType} for {selectedMealSlot.day}
              </p>
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
              <div className="recipe-image" style={{ backgroundImage: `url(${recipe.image})` }} />
              <div className="recipe-content">
                <h3>{recipe.name}</h3>
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
                <div className="recipe-nutrition">
                  <h4>Nutrition per serving:</h4>
                  <div className="nutrition-grid">
                    <div className="nutrition-item">
                      <span className="label">Protein</span>
                      <span className="value">{recipe.nutrition.protein}</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="label">Carbs</span>
                      <span className="value">{recipe.nutrition.carbs}</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="label">Fat</span>
                      <span className="value">{recipe.nutrition.fat}</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="label">Fiber</span>
                      <span className="value">{recipe.nutrition.fiber}</span>
                    </div>
                  </div>
                </div>
                <div className="recipe-ingredients">
                  <h4>Ingredients:</h4>
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
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
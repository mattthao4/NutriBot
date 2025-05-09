import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { mealPlanState, selectedMealSlotState, getMealPlanKey, formatDate } from '../recoil/atoms';
import '../styles/theme.css';
import './Recipes.css';

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

  const recipes = [
    {
      id: 1,
      name: 'Avocado Toast',
      image: 'https://cdn.loveandlemons.com/wp-content/uploads/2020/01/avocado-toast-480x270.jpg',
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
      image: 'https://res.cloudinary.com/hksqkdlah/image/upload/41765-sfs-grilled-salmon-10664.jpg',
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
    },
    {
      id: 5,
      name: 'Vegan Buddha Bowl',
      image: 'https://cdn.loveandlemons.com/wp-content/uploads/2020/06/IMG_25456.jpg',
      calories: 420,
      prepTime: '20 mins',
      diet: 'vegan',
      timeCategory: 'medium',
      calorieCategory: 'medium',
      ingredients: ['Quinoa', 'Chickpeas', 'Sweet Potato', 'Spinach', 'Tahini'],
      nutrition: {
        protein: '16g',
        carbs: '60g',
        fat: '12g',
        fiber: '10g'
      }
    },
    {
      id: 6,
      name: 'Chicken Caesar Salad',
      image: 'https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FRecipes%2F2024-04-chicken-caesar-salad%2Fchicken-caesar-salad-653',
      calories: 350,
      prepTime: '15 mins',
      diet: 'keto',
      timeCategory: 'quick',
      calorieCategory: 'medium',
      ingredients: ['Chicken Breast', 'Romaine', 'Parmesan', 'Caesar Dressing', 'Croutons'],
      nutrition: {
        protein: '30g',
        carbs: '10g',
        fat: '20g',
        fiber: '3g'
      }
    },
    {
      id: 7,
      name: 'Egg Muffins',
      image: 'https://easyfamilyrecipes.com/wp-content/uploads/2023/03/Ham-and-Cheese-Egg-Muffins-Recipe.jpg',
      calories: 120,
      prepTime: '25 mins',
      diet: 'keto',
      timeCategory: 'quick',
      calorieCategory: 'low',
      ingredients: ['Eggs', 'Spinach', 'Bell Pepper', 'Cheese'],
      nutrition: {
        protein: '8g',
        carbs: '2g',
        fat: '8g',
        fiber: '1g'
      }
    },
    {
      id: 8,
      name: 'Vegetarian Chili',
      image: 'https://www.tasteofhome.com/wp-content/uploads/2018/01/Vegetarian-Chili-Ole-_EXPS_THESCODR22_138856_DR_12_15_2b.jpg',
      calories: 300,
      prepTime: '40 mins',
      diet: 'vegetarian',
      timeCategory: 'long',
      calorieCategory: 'medium',
      ingredients: ['Beans', 'Tomatoes', 'Corn', 'Bell Pepper', 'Onion'],
      nutrition: {
        protein: '12g',
        carbs: '50g',
        fat: '5g',
        fiber: '14g'
      }
    },
    {
      id: 9,
      name: 'Fruit & Nut Snack Bars',
      image: 'https://wholeandheavenlyoven.com/wp-content/uploads/2015/08/fruit-n-nut-bars6.jpg',
      calories: 180,
      prepTime: '10 mins',
      diet: 'vegan',
      timeCategory: 'quick',
      calorieCategory: 'low',
      ingredients: ['Oats', 'Dates', 'Almonds', 'Peanut Butter', 'Maple Syrup'],
      nutrition: {
        protein: '4g',
        carbs: '28g',
        fat: '6g',
        fiber: '3g'
      }
    }
  ];

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

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet = selectedDiet === 'all' || recipe.diet === selectedDiet;
    const matchesTime = selectedTime === 'all' || recipe.timeCategory === selectedTime;
    const matchesCalories = selectedCalories === 'all' || recipe.calorieCategory === selectedCalories;
    
    return matchesSearch && matchesDiet && matchesTime && matchesCalories;
  });

  const formatMealSlotInfo = (mealSlot) => {
    if (!mealSlot) return '';
    
    // Parse the week key to get the date
    const weekDate = new Date(mealSlot.week);
    const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(mealSlot.day);
    
    // Add the day offset to get the correct date
    const mealDate = new Date(weekDate);
    mealDate.setDate(weekDate.getDate() + dayIndex);
    
    return `${mealSlot.mealType} for ${mealDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })}`;
  };

  const getAddedMealTypes = (recipeId) => {
    if (!mealPlan || !selectedMealSlot) return null;
    
    const addedMealTypes = new Set();
    // Only check the selected day
    const selectedDay = selectedMealSlot.day;
    if (mealPlan[selectedDay]) {
      Object.entries(mealPlan[selectedDay]).forEach(([mealType, recipes]) => {
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
      <div className="page-background" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490645930917-897ecb06fdf4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }} />
      <div className="page-content-wrapper">
        <div className="page-header">
          <div>
            <h1>Recipes</h1>
            {selectedMealSlot && (
              <p className="meal-slot-info">
                Selecting {formatMealSlotInfo(selectedMealSlot)}
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
                      <li key={index}>{typeof ingredient === 'string' ? ingredient : ingredient.name}</li>
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
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import '../styles/theme.css';
import './ShoppingList.css';

const ShoppingList = () => {
  const [shoppingList, setShoppingList] = useState({});
  const [checkedItems, setCheckedItems] = useState({});

  const generateShoppingList = (mealPlan) => {
    const newShoppingList = {};
    
    // Process each day in the meal plan
    Object.entries(mealPlan).forEach(([day, meals]) => {
      if (!meals) return;
      
      // Process each meal type in the day
      Object.entries(meals).forEach(([mealType, mealItems]) => {
        if (!mealItems || !Array.isArray(mealItems)) return;
        
        // Process each recipe in the meal
        mealItems.forEach(recipe => {
          if (!recipe || !recipe.ingredients) {
            console.warn('Invalid recipe data:', recipe);
            return;
          }

          // Handle both array and string formats for ingredients
          const ingredients = Array.isArray(recipe.ingredients) 
            ? recipe.ingredients 
            : recipe.ingredients.split(',').map(ing => ing.trim());
          
          // Process each ingredient
          ingredients.forEach(ingredient => {
            let ingredientName, ingredientCategory, ingredientQuantity, ingredientUnit;
            
            if (typeof ingredient === 'string') {
              // Handle string format: "Ingredient Name"
              ingredientName = ingredient;
              ingredientCategory = 'Others';
              ingredientQuantity = 1;
              ingredientUnit = 'unit';
            } else if (typeof ingredient === 'object') {
              // Handle object format: { name, category, quantity, unit }
              ingredientName = ingredient.name;
              ingredientCategory = ingredient.category || 'Others';
              ingredientQuantity = ingredient.quantity || 1;
              ingredientUnit = ingredient.unit || 'unit';
            } else {
              console.warn('Invalid ingredient format:', ingredient);
              return;
            }
            
            if (!ingredientName) {
              console.warn('Missing ingredient name:', ingredient);
              return;
            }
            
            if (!newShoppingList[ingredientCategory]) {
              newShoppingList[ingredientCategory] = [];
            }
            
            // Check if ingredient already exists in the category
            const existingIngredient = newShoppingList[ingredientCategory].find(
              item => item.name.toLowerCase() === ingredientName.toLowerCase()
            );
            
            if (existingIngredient) {
              // Add quantities if they're numbers, otherwise just increment count
              if (typeof existingIngredient.quantity === 'number' && typeof ingredientQuantity === 'number') {
                existingIngredient.quantity += ingredientQuantity;
              } else {
                existingIngredient.quantity = (parseInt(existingIngredient.quantity) || 0) + (parseInt(ingredientQuantity) || 1);
              }
            } else {
              newShoppingList[ingredientCategory].push({
                name: ingredientName,
                quantity: ingredientQuantity,
                unit: ingredientUnit
              });
            }
          });
        });
      });
    });
    
    return newShoppingList;
  };

  useEffect(() => {
    // Load initial meal plan and generate shopping list
    const loadShoppingList = () => {
      try {
        const mealPlanStr = sessionStorage.getItem('mealPlan');
        if (!mealPlanStr) {
          console.log('No meal plan found in session storage');
          return;
        }

        const mealPlan = JSON.parse(mealPlanStr);
        console.log('Current meal plan:', mealPlan);
        
        if (!mealPlan || typeof mealPlan !== 'object') {
          console.error('Invalid meal plan data:', mealPlan);
          return;
        }

        const newShoppingList = generateShoppingList(mealPlan);
        console.log('Generated shopping list:', newShoppingList);
        
        if (Object.keys(newShoppingList).length > 0) {
          setShoppingList(newShoppingList);
        }
      } catch (error) {
        console.error('Error loading shopping list:', error);
      }
    };

    // Load checked items
    const loadCheckedItems = () => {
      try {
        const checkedItemsStr = sessionStorage.getItem('checkedItems');
        if (checkedItemsStr) {
          const savedCheckedItems = JSON.parse(checkedItemsStr);
          setCheckedItems(savedCheckedItems);
        }
      } catch (error) {
        console.error('Error loading checked items:', error);
      }
    };

    // Initial load
    loadShoppingList();
    loadCheckedItems();

    // Set up storage event listener
    const handleStorageChange = (e) => {
      if (e.key === 'mealPlan') {
        console.log('Meal plan changed in another tab');
        loadShoppingList();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Set up interval to check for local changes
    const intervalId = setInterval(() => {
      loadShoppingList();
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  const handleCheckItem = (category, itemName) => {
    const newCheckedItems = {
      ...checkedItems,
      [`${category}-${itemName}`]: !checkedItems[`${category}-${itemName}`]
    };
    
    setCheckedItems(newCheckedItems);
    sessionStorage.setItem('checkedItems', JSON.stringify(newCheckedItems));
  };

  const handleRemoveItem = (category, itemName) => {
    const newShoppingList = { ...shoppingList };
    newShoppingList[category] = newShoppingList[category].filter(
      item => item.name !== itemName
    );
    
    if (newShoppingList[category].length === 0) {
      delete newShoppingList[category];
    }
    
    setShoppingList(newShoppingList);
  };

  const handleClearAll = () => {
    setShoppingList({});
    setCheckedItems({});
    sessionStorage.removeItem('checkedItems');
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Produce': 'var(--secondary-1)',
      'Dairy': 'var(--primary-1)',
      'Meat': 'var(--accent-2)',
      'Pantry': 'var(--primary-2)',
      'Others': 'var(--secondary-2)'
    };
    
    return colors[category] || 'var(--primary-1)';
  };

  return (
    <div className="shopping-list-page">
      <div className="page-background" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }} />
      <div className="page-content-wrapper">
        <div className="page-header">
          <h1>Shopping List</h1>
          <div className="page-actions">
            <button className="button button-success">
              <span className="icon">💾</span>
              Save List
            </button>
            <button 
              className="button button-danger"
              onClick={handleClearAll}
            >
              <span className="icon">🗑️</span>
              Clear All
            </button>
          </div>
        </div>
        
        {Object.keys(shoppingList).length === 0 ? (
          <div className="empty-state">
            <p>Your shopping list is empty. Add meals to your meal planner to see ingredients here.</p>
          </div>
        ) : (
          <div className="shopping-list-grid">
            {Object.entries(shoppingList).map(([category, items]) => (
              <div key={category} className="category-section">
                <div 
                  className="category-header"
                  style={{ backgroundColor: getCategoryColor(category) }}
                >
                  <h3>{category}</h3>
                  <span className="item-count">{items.length} items</span>
                </div>
                <div className="category-content">
                  {items.map((item, index) => (
                    <div key={index} className="shopping-item">
                      <input
                        type="checkbox"
                        className="item-checkbox"
                        checked={checkedItems[`${category}-${item.name}`] || false}
                        onChange={() => handleCheckItem(category, item.name)}
                      />
                      <div className="item-details">
                        <h4 className="item-name">{item.name}</h4>
                        <div className="item-quantity">
                          {item.quantity} {item.unit}
                        </div>
                      </div>
                      <button
                        className="remove-item-button"
                        onClick={() => handleRemoveItem(category, item.name)}
                        aria-label="Remove item"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList; 
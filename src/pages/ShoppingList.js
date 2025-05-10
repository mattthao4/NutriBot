import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRecoilState } from 'recoil';
import { mealPlanState, currentWeekState } from '../recoil/atoms';
import '../styles/theme.css';
import './ShoppingList.css';

const ShoppingList = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [mealPlan] = useRecoilState(mealPlanState);
  const [currentWeek] = useRecoilState(currentWeekState);

  useEffect(() => {
    generateShoppingList(mealPlan);
  }, [mealPlan]);

  const generateShoppingList = (plan) => {
    const ingredients = new Map();
    
    // Process all meals in the plan
    Object.entries(plan).forEach(([day, meals]) => {
      Object.entries(meals).forEach(([mealType, recipes]) => {
        recipes.forEach(recipe => {
          if (recipe.ingredients) {
            recipe.ingredients.forEach(ingredient => {
              if (!ingredient || !ingredient.name) return;
              const key = ingredient.name.toLowerCase();
              if (ingredients.has(key)) {
                const existing = ingredients.get(key);
                ingredients.set(key, {
                  ...existing,
                  quantity: existing.quantity + (ingredient.quantity || 1),
                  recipes: [...existing.recipes, recipe.name]
                });
              } else {
                ingredients.set(key, {
                  name: ingredient.name,
                  quantity: ingredient.quantity || 1,
                  unit: ingredient.unit || '',
                  recipes: [recipe.name]
                });
              }
            });
          }
        });
      });
    });

    setShoppingList(Array.from(ingredients.values()));
  };

  useEffect(() => {
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
    loadCheckedItems();

    // Set up storage event listener
    const handleStorageChange = (e) => {
      if (e.key === 'mealPlan-' + currentWeek) {
        generateShoppingList(mealPlan);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [mealPlan, currentWeek]);

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
        
        {shoppingList.length === 0 ? (
          <div className="empty-state">
            <p>Your shopping list is empty. Add meals to your meal planner to see ingredients here.</p>
          </div>
        ) : (
          <div className="shopping-list-grid">
            {shoppingList.map((item, index) => (
              <div key={index} className="shopping-item">
                <input
                  type="checkbox"
                  className="item-checkbox"
                  checked={checkedItems[item.name] || false}
                  onChange={() => handleCheckItem('default', item.name)}
                />
                <div className="item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <div className="item-quantity">
                    {item.quantity} {item.unit}
                  </div>
                </div>
                <button
                  className="remove-item-button"
                  onClick={() => handleRemoveItem('default', item.name)}
                  aria-label="Remove item"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList; 
import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { mealPlanState, currentWeekState, formatDate } from '../recoil/atoms';
import '../styles/theme.css';
import './ShoppingList.css';

const ShoppingList = () => {
  const navigate = useNavigate();
  const [shoppingList, setShoppingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [mealPlan] = useRecoilState(mealPlanState);
  const [currentWeek, setCurrentWeek] = useRecoilState(currentWeekState);
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'daily'
  const [selectedDay, setSelectedDay] = useState(null);

  // Load checked items from localStorage on component mount
  useEffect(() => {
    const savedCheckedItems = localStorage.getItem('checkedItems');
    if (savedCheckedItems) {
      setCheckedItems(JSON.parse(savedCheckedItems));
    }
  }, []);

  // Save checked items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
  }, [checkedItems]);

  // Helper to get week dates at midnight (local)
  const getWeekDates = () => {
    const dates = [];
    const currentDate = new Date(currentWeek);
    currentDate.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Get the start and end dates of the current week
  const weekDates = getWeekDates();
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const handlePreviousWeek = () => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() - 7);
    setCurrentWeek(newWeekStart);
  };

  const handleNextWeek = () => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() + 7);
    setCurrentWeek(newWeekStart);
  };

  const generateShoppingList = (plan) => {
    const ingredients = new Map();
    
    // Process all meals in the plan
    Object.entries(plan).forEach(([day, meals]) => {
      // Skip if we're in daily view and this isn't the selected day
      if (viewMode === 'daily' && selectedDay && day !== selectedDay) return;

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
    generateShoppingList(mealPlan);
  }, [mealPlan, viewMode, selectedDay]);

  const handleCheckItem = (itemName) => {
    setCheckedItems(prev => {
      const newCheckedItems = {
        ...prev,
        [itemName]: !prev[itemName]
      };
      return newCheckedItems;
    });
  };

  const handleClearChecked = () => {
    setCheckedItems({});
  };

  const handleRemoveItem = (category, itemName) => {
    setShoppingList(prevList => prevList.filter(item => item.name !== itemName));
  };

  const handleClearAll = () => {
    setShoppingList({});
    setCheckedItems({});
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
          <div>
            <div className="title-section">
              <h1>Shopping List</h1>
              <span className="total-items">
                {shoppingList.length} {shoppingList.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="view-controls">
              <div className="date-navigation">
                <button className="nav-button" onClick={handlePreviousWeek}>
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <span className="date-range">
                  {formatDate(weekStart)} - {formatDate(weekEnd)}
                </span>
                <button className="nav-button" onClick={handleNextWeek}>
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="view-mode-toggle">
                <button 
                  className={`view-mode-button ${viewMode === 'weekly' ? 'active' : ''}`}
                  onClick={() => {
                    setViewMode('weekly');
                    setSelectedDay(null);
                  }}
                >
                  Weekly View
                </button>
                <button 
                  className={`view-mode-button ${viewMode === 'daily' ? 'active' : ''}`}
                  onClick={() => setViewMode('daily')}
                >
                  Daily View
                </button>
              </div>
            </div>
            {viewMode === 'daily' && (
              <div className="day-selector">
                {weekDates.map((date, index) => (
                  <button
                    key={index}
                    className={`day-button ${selectedDay === ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index] ? 'active' : ''}`}
                    onClick={() => setSelectedDay(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index])}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="page-actions">
            <button className="button button-success">
              <span className="icon">💾</span>
              Save List
            </button>
            <button 
              className="button button-secondary"
              onClick={handleClearChecked}
            >
              <span className="icon">✓</span>
              Clear Checked
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
              <div key={index} className={`shopping-item ${checkedItems[item.name] ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  className="item-checkbox"
                  checked={checkedItems[item.name] || false}
                  onChange={() => handleCheckItem(item.name)}
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
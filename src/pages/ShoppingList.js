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
    <div className="shopping-list-container">
      <div className="page-header">
        <div className="title-section">
          <h1>Shopping List</h1>
          <span className="total-items">
            {shoppingList.length} {shoppingList.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div className="week-navigation">
          <button onClick={handlePreviousWeek} className="nav-button">
            ←
          </button>
          <span className="week-range">
            {formatDate(weekStart)} - {formatDate(weekEnd)}
          </span>
          <button onClick={handleNextWeek} className="nav-button">
            →
          </button>
        </div>
        <div className="view-toggle">
          <button 
            className={`toggle-button ${viewMode === 'weekly' ? 'active' : ''}`}
            onClick={() => setViewMode('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`toggle-button ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => setViewMode('daily')}
          >
            Daily
          </button>
        </div>
      </div>

      <div className="shopping-list-grid">
        <div className="shopping-list-column">
          <h2>To Buy</h2>
          <div className="shopping-list">
            {shoppingList
              .filter(item => !checkedItems[item.name])
              .map((item, index) => (
                <div key={index} className="shopping-item">
                  <div className="item-content">
                    <input
                      type="checkbox"
                      checked={checkedItems[item.name] || false}
                      onChange={() => handleCheckItem(item.name)}
                      className="item-checkbox"
                    />
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">{item.quantity}</span>
                  </div>
                  <button 
                    onClick={() => handleRemoveItem('default', item.name)}
                    className="remove-button"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div className="shopping-list-column">
          <h2>Done</h2>
          <div className="shopping-list done-list">
            {shoppingList
              .filter(item => checkedItems[item.name])
              .map((item, index) => (
                <div key={index} className="shopping-item done-item">
                  <div className="item-content">
                    <input
                      type="checkbox"
                      checked={checkedItems[item.name] || false}
                      onChange={() => handleCheckItem(item.name)}
                      className="item-checkbox"
                    />
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">{item.quantity}</span>
                  </div>
                  <button 
                    onClick={() => handleRemoveItem('default', item.name)}
                    className="remove-button"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList; 
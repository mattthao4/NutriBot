import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { mealPlanState, currentWeekState, formatDate } from '../recoil/atoms';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/theme.css';
import './ShoppingList.css';

const ShoppingList = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [mealPlan] = useRecoilState(mealPlanState);
  const [currentWeek, setCurrentWeek] = useRecoilState(currentWeekState);
  const [viewMode, setViewMode] = useState('weekly');
  const [selectedDay, setSelectedDay] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

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
    // Set to Sunday
    const day = currentDate.getDay();
    currentDate.setDate(currentDate.getDate() - day);
    currentDate.setHours(0, 0, 0, 0);
    
    // Generate dates from Sunday to Saturday
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(currentDate);
      dates.push(newDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const weekStart = weekDates[0]; // Sunday
  const weekEnd = weekDates[6];   // Saturday

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDateChange = (direction) => {
    if (viewMode === 'daily') {
      if (!selectedDay) {
        // If no day is selected, select the first day of the week (Sunday)
        setSelectedDay(formatDate(weekStart));
        return;
      }
      // In daily view, navigate through individual days
      const newDate = new Date(selectedDay);
      const currentDay = newDate.getDay();
      
      if (direction === 'next') {
        if (currentDay === 6) { // If it's Saturday
          // Move to next week's Sunday
          newDate.setDate(newDate.getDate() + 1);
          setCurrentWeek(formatDate(newDate));
        } else {
          newDate.setDate(newDate.getDate() + 1);
        }
      } else {
        if (currentDay === 0) { // If it's Sunday
          // Move to previous week's Saturday
          newDate.setDate(newDate.getDate() - 1);
          setCurrentWeek(formatDate(newDate));
        } else {
          newDate.setDate(newDate.getDate() - 1);
        }
      }
      
      setSelectedDay(formatDate(newDate));
    } else {
      // In weekly view, navigate through weeks
      const newDate = new Date(currentWeek);
      // Set to the Sunday of the current week
      const day = newDate.getDay();
      newDate.setDate(newDate.getDate() - day);
      
      if (direction === 'next') {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() - 7);
      }
      console.log(`${direction} week:`, formatDate(newDate));
      setCurrentWeek(formatDate(newDate));
    }
  };

  const handleWeekSelect = (date) => {
    if (viewMode === 'daily') {
      // In daily view, select the specific day
      setSelectedDay(formatDate(date));
      // Also update the current week to match the selected date
      const weekStartDate = new Date(date);
      weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
      setCurrentWeek(formatDate(weekStartDate));
    } else {
      // In weekly view, select the week
      setCurrentWeek(formatDate(date));
    }
    setShowCalendar(false);
  };

  const generateShoppingList = (plan) => {
    if (!plan) return;
    
    const ingredients = new Map();
    const weekStartStr = formatDate(weekStart);
    const weekEndStr = formatDate(weekEnd);
    
    // Process all meals in the plan
    Object.entries(plan).forEach(([day, meals]) => {
      // Skip if we're in daily view and this isn't the selected day
      if (viewMode === 'daily' && selectedDay && day !== selectedDay) return;
      
      // Skip if the day is outside our current week
      if (day < weekStartStr || day > weekEndStr) return;

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
                  quantity: existing.quantity + (Number(ingredient.quantity) || 1),
                  recipes: [...existing.recipes, recipe.name]
                });
              } else {
                ingredients.set(key, {
                  name: ingredient.name,
                  quantity: Number(ingredient.quantity) || 1,
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

  // Update shopping list when meal plan, view mode, selected day, or current week changes
  useEffect(() => {
    generateShoppingList(mealPlan);
  }, [mealPlan, viewMode, selectedDay, currentWeek]);

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

  const handleRemoveItem = (itemName) => {
    setShoppingList(prevList => prevList.filter(item => item.name !== itemName));
  };

  const handleClearAll = () => {
    setShoppingList([]);
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
          <button className="button button-secondary" onClick={() => handleDateChange('prev')}>
            <ChevronLeftIcon className="w-5 h-5" />
            Previous Week
          </button>
          <h2>
            {viewMode === 'weekly' 
              ? `${formatDisplayDate(weekStart)} - ${formatDisplayDate(weekEnd)}`
              : selectedDay 
                ? formatDisplayDate(new Date(selectedDay))
                : 'Select a day'}
          </h2>
          <button className="button button-secondary" onClick={() => handleDateChange('next')}>
            Next Week
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="view-toggle">
          <button 
            className={`toggle-button ${viewMode === 'weekly' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('weekly');
              setSelectedDay(null);
            }}
          >
            Weekly
          </button>
          <button 
            className={`toggle-button ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('daily');
              // When switching to daily view, select the first day of the current week
              const weekStartDate = new Date(currentWeek);
              weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
              setSelectedDay(formatDate(weekStartDate));
            }}
          >
            Daily
          </button>
        </div>
        {viewMode === 'daily' && (
          <div className="day-selector">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
              const isSelected = selectedDay ? new Date(selectedDay).getDay() === index : false;
              return (
                <button
                  key={day}
                  className={`day-button ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    // Find the same day of week in the selected week
                    const selectedDate = new Date(selectedDay || weekStart);
                    const daysToAdd = index - selectedDate.getDay();
                    const newDate = new Date(selectedDate);
                    newDate.setDate(selectedDate.getDate() + daysToAdd);
                    setSelectedDay(formatDate(newDate));
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        )}
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
                    <span className="item-quantity">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.name)}
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
                    <span className="item-quantity">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.name)}
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
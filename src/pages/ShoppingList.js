import React, { useState, useEffect } from 'react';
import '../styles/theme.css';
import './ShoppingList.css';
import { PlusIcon, TrashIcon, CheckIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const ShoppingList = () => {
  const [mealPlan, setMealPlan] = useState({});
  const [shoppingList, setShoppingList] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('Other');
  const [newQuantity, setNewQuantity] = useState('1');
  const [items, setItems] = useState([
    { 
      id: 1, 
      name: 'Chicken breast', 
      category: 'Meat', 
      quantity: '1 lb', 
      purchased: false,
      expiryDate: '2023-04-20'
    },
    { 
      id: 2, 
      name: 'Brown rice', 
      category: 'Grains', 
      quantity: '2 lbs', 
      purchased: false,
      expiryDate: '2024-01-01'
    },
    { 
      id: 3, 
      name: 'Broccoli', 
      category: 'Vegetables', 
      quantity: '2 heads', 
      purchased: true,
      expiryDate: '2023-04-18'
    },
  ]);

  const categories = ['Meat', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Other'];

  useEffect(() => {
    // Load meal plan from session storage
    const savedMealPlan = JSON.parse(sessionStorage.getItem('mealPlan') || '{}');
    setMealPlan(savedMealPlan);
    generateShoppingList(savedMealPlan);
  }, []);

  const generateShoppingList = (plan) => {
    const ingredients = new Map();
    const categories = new Map();

    // Process all recipes in the meal plan
    Object.values(plan).forEach(day => {
      Object.values(day).forEach(meals => {
        meals.forEach(recipe => {
          recipe.ingredients.forEach(ingredient => {
            const count = ingredients.get(ingredient) || 0;
            ingredients.set(ingredient, count + 1);
            
            // Categorize ingredients (simplified example)
            const category = getIngredientCategory(ingredient);
            const catCount = categories.get(category) || 0;
            categories.set(category, catCount + 1);
          });
        });
      });
    });

    // Convert to array and sort by count
    const sortedIngredients = Array.from(ingredients.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    setShoppingList(sortedIngredients);
    setCategoryStats(Object.fromEntries(categories));
  };

  const getIngredientCategory = (ingredient) => {
    // Simple categorization logic
    const lowerIngredient = ingredient.toLowerCase();
    if (lowerIngredient.includes('chicken') || lowerIngredient.includes('beef') || lowerIngredient.includes('fish')) {
      return 'Proteins';
    } else if (lowerIngredient.includes('rice') || lowerIngredient.includes('pasta') || lowerIngredient.includes('bread')) {
      return 'Grains';
    } else if (lowerIngredient.includes('apple') || lowerIngredient.includes('banana') || lowerIngredient.includes('berry')) {
      return 'Fruits';
    } else if (lowerIngredient.includes('spinach') || lowerIngredient.includes('lettuce') || lowerIngredient.includes('carrot')) {
      return 'Vegetables';
    } else if (lowerIngredient.includes('milk') || lowerIngredient.includes('cheese') || lowerIngredient.includes('yogurt')) {
      return 'Dairy';
    } else {
      return 'Other';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Proteins': '#FF6B6B',
      'Grains': '#4ECDC4',
      'Fruits': '#FFD166',
      'Vegetables': '#06D6A0',
      'Dairy': '#118AB2',
      'Other': '#073B4C'
    };
    return colors[category] || '#6C757D';
  };

  const addItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      setItems([
        ...items,
        {
          id: items.length + 1,
          name: newItem,
          category: newCategory,
          quantity: newQuantity,
          purchased: false,
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
      ]);
      setNewItem('');
      setNewQuantity('1');
    }
  };

  const togglePurchased = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const getItemsByCategory = () => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
  };

  const itemsByCategory = getItemsByCategory();

  return (
    <div className="shopping-list-page">
      <div className="page-background" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490645930917-897ecb06fdf4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }} />
      <div className="page-content-wrapper">
        <h1>Shopping List</h1>
        
        <div className="stats-container">
          <div className="stats-card">
            <h3>Ingredients by Category</h3>
            <div className="category-chart">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div 
                  key={category} 
                  className="category-bar"
                  style={{
                    width: `${(count / shoppingList.length) * 100}%`,
                    backgroundColor: getCategoryColor(category)
                  }}
                >
                  <span className="category-label">{category}</span>
                  <span className="category-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="stats-card">
            <h3>Most Used Ingredients</h3>
            <div className="ingredients-chart">
              {shoppingList.slice(0, 5).map((item, index) => (
                <div key={item.name} className="ingredient-bar">
                  <div 
                    className="bar-fill"
                    style={{
                      width: `${(item.count / shoppingList[0].count) * 100}%`,
                      backgroundColor: getCategoryColor(getIngredientCategory(item.name))
                    }}
                  />
                  <span className="ingredient-label">{item.name}</span>
                  <span className="ingredient-count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="shopping-list-container">
          <h2>All Ingredients</h2>
          <div className="ingredients-grid">
            {shoppingList.map((item, index) => (
              <div 
                key={item.name} 
                className="ingredient-card"
                style={{ borderColor: getCategoryColor(getIngredientCategory(item.name)) }}
              >
                <div className="ingredient-header">
                  <h3>{item.name}</h3>
                  <span className="ingredient-category">
                    {getIngredientCategory(item.name)}
                  </span>
                </div>
                <div className="ingredient-count-badge">
                  {item.count} {item.count === 1 ? 'recipe' : 'recipes'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList; 
import React, { useState } from 'react';
import { MagnifyingGlassIcon, BookOpenIcon, FireIcon, ScaleIcon } from '@heroicons/react/24/outline';

function Recipes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');

  const diets = ['all', 'vegan', 'keto', 'paleo', 'vegetarian'];
  const cookTimes = ['all', 'quick', 'medium', 'long'];

  const recipes = [
    {
      id: 1,
      name: 'High-Protein Chicken Bowl',
      category: 'Lunch',
      prepTime: '25 mins',
      calories: 450,
      protein: 35,
      carbs: 30,
      fats: 15,
      diet: 'keto',
      cost: '$$',
      image: 'https://via.placeholder.com/150',
      ingredients: ['Chicken breast', 'Brown rice', 'Broccoli', 'Olive oil'],
      instructions: ['Cook chicken', 'Steam vegetables', 'Combine and serve']
    },
    {
      id: 2,
      name: 'Quick Oatmeal Breakfast',
      category: 'Breakfast',
      prepTime: '10 mins',
      calories: 300,
      protein: 12,
      carbs: 45,
      fats: 8,
      diet: 'vegetarian',
      cost: '$',
      image: 'https://via.placeholder.com/150',
      ingredients: ['Oats', 'Milk', 'Banana', 'Honey'],
      instructions: ['Cook oats', 'Add toppings', 'Serve warm']
    }
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet = selectedDiet === 'all' || recipe.diet === selectedDiet;
    const matchesTime = selectedTime === 'all' || 
      (selectedTime === 'quick' && parseInt(recipe.prepTime) <= 15) ||
      (selectedTime === 'medium' && parseInt(recipe.prepTime) > 15 && parseInt(recipe.prepTime) <= 30) ||
      (selectedTime === 'long' && parseInt(recipe.prepTime) > 30);
    
    return matchesSearch && matchesDiet && matchesTime;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Recipes</h1>
          <p className="text-gray-600">Discover and save your favorite meals</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes..."
              className="input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <select 
              className="input"
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
            >
              {diets.map(diet => (
                <option key={diet} value={diet}>
                  {diet.charAt(0).toUpperCase() + diet.slice(1)}
                </option>
              ))}
            </select>
            <select 
              className="input"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              {cookTimes.map(time => (
                <option key={time} value={time}>
                  {time.charAt(0).toUpperCase() + time.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="card hover:shadow-lg transition-shadow">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{recipe.name}</h3>
                  <p className="text-sm text-gray-600">{recipe.category}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="bg-primary-1 text-white text-sm px-2 py-1 rounded">
                    {recipe.prepTime}
                  </span>
                  <span className="text-sm text-gray-600 mt-1">{recipe.cost}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center bg-gray-50 p-2 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FireIcon className="icon text-primary-2" />
                    <p className="text-sm font-medium">Calories</p>
                  </div>
                  <p className="text-lg font-medium">{recipe.calories}</p>
                </div>
                <div className="text-center bg-gray-50 p-2 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ScaleIcon className="icon text-primary-2" />
                    <p className="text-sm font-medium">Protein</p>
                  </div>
                  <p className="text-lg font-medium">{recipe.protein}g</p>
                </div>
                <div className="text-center bg-gray-50 p-2 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BookOpenIcon className="icon text-primary-2" />
                    <p className="text-sm font-medium">Carbs</p>
                  </div>
                  <p className="text-lg font-medium">{recipe.carbs}g</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">Ingredients:</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <li>+{recipe.ingredients.length - 3} more</li>
                  )}
                </ul>
              </div>

              <button className="btn btn-primary w-full mt-4">
                View Recipe
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recipes; 
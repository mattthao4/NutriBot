import React, { useState } from 'react';
import { PlusIcon, TrashIcon, CheckIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

function ShoppingList() {
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Shopping List</h1>
          <p className="text-gray-600">Manage your grocery items and track purchases</p>
        </div>
        <form onSubmit={addItem} className="flex gap-2">
          <input
            type="text"
            placeholder="Add new item..."
            className="input"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <select 
            className="input"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Quantity"
            className="input w-24"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            <PlusIcon className="icon" />
          </button>
        </form>
      </div>

      <div className="card">
        <div className="space-y-6">
          {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBagIcon className="icon text-primary-2" />
                <h2 className="text-lg font-semibold">{category}</h2>
              </div>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      item.purchased ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => togglePurchased(item.id)}
                        className={`p-2 rounded-full ${
                          item.purchased ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {item.purchased ? <CheckIcon className="icon" /> : null}
                      </button>
                      <div>
                        <p className={`font-medium ${item.purchased ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {item.name}
                        </p>
                        <div className="flex gap-2 text-sm text-gray-600">
                          <span>{item.quantity}</span>
                          <span>•</span>
                          <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <TrashIcon className="icon" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShoppingList; 
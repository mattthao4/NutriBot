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
      },
      instructions: [
        'Toast the bread until golden brown.',
        'Mash the avocado in a bowl and season with salt and pepper.',
        'Spread the mashed avocado on the toast.',
        'Top with a poached egg if desired.'
      ]
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
      },
      instructions: [
        'Dice the cucumber and tomatoes.',
        'Combine the diced vegetables in a bowl.',
        'Add crumbled feta and olives.',
        'Drizzle with olive oil and toss to combine.'
      ]
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
      },
      instructions: [
        'Preheat the grill to medium-high heat.',
        'Season the salmon with salt, pepper, and dill.',
        'Grill the salmon for about 4-5 minutes on each side.',
        'Squeeze lemon juice over the top before serving.'
      ]
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
      },
      instructions: [
        'Cook quinoa according to package instructions.',
        'Drain and rinse chickpeas.',
        'Dice avocado, cucumber, and tomatoes.',
        'Combine all ingredients in a bowl and squeeze lemon juice over the top.'
      ]
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
      },
      instructions: [
        'Cook quinoa according to package instructions.',
        'Roast sweet potato cubes until tender.',
        'Drain and rinse chickpeas.',
        'Combine quinoa, sweet potato, chickpeas, and spinach in a bowl.',
        'Drizzle with tahini sauce.'
      ]
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
      },
      instructions: [
        'Grill or pan-sear the chicken breast until fully cooked.',
        'Chop the romaine lettuce into bite-sized pieces.',
        'Combine the lettuce, chicken, parmesan, and croutons in a bowl.',
        'Drizzle with Caesar dressing and toss to combine.'
      ]
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
      },
      instructions: [
        'Preheat the oven to 350°F (175°C).',
        'Whisk eggs in a bowl and season with salt and pepper.',
        'Add chopped spinach, bell pepper, and cheese to the egg mixture.',
        'Pour the mixture into muffin tins and bake for 20-25 minutes.'
      ]
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
      },
      instructions: [
        'Sauté onions and bell peppers until softened.',
        'Add beans, tomatoes, and corn to the pot.',
        'Simmer for 30 minutes, stirring occasionally.',
        'Season with salt, pepper, and chili powder to taste.'
      ]
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
      },
      instructions: [
        'Blend dates in a food processor until smooth.',
        'Mix oats, almonds, peanut butter, and maple syrup in a bowl.',
        'Press the mixture into a lined baking dish.',
        'Refrigerate for at least 1 hour before cutting into bars.'
      ]
    }
];

export default recipes;
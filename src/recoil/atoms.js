import { atom } from 'recoil';

// Helper function to get the current week's Monday date
const getCurrentWeekMonday = () => {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1);
  return monday.toISOString().slice(0, 10);
};

// Helper function to format date as YYYY-MM-DD
export const formatDate = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toISOString().split('T')[0];
};

// Helper function to format date in a more readable format
export const formatDisplayDate = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

// Helper function to get start of week for a given date
export const getWeekStart = (date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return start;
};

// Helper function to get end of week for a given date
export const getWeekEnd = (date) => {
  const end = new Date(date);
  end.setDate(date.getDate() + (6 - date.getDay()));
  return end;
};

// Helper function to get all dates in a week
export const getWeekDates = (date) => {
  const start = getWeekStart(date);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    dates.push(formatDate(currentDate));
  }
  return dates;
};

// Atom for the current week's start date
export const currentWeekState = atom({
  key: 'currentWeekState',
  default: formatDate(new Date()),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        localStorage.setItem('currentWeek', newValue);
      });
    },
    ({ setSelf }) => {
      const savedValue = localStorage.getItem('currentWeek');
      if (savedValue) {
        setSelf(savedValue);
      }
    },
  ],
});

// Meal plan state - now using dates as keys
export const mealPlanState = atom({
  key: 'mealPlanState',
  default: {},
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        localStorage.setItem('mealPlan', JSON.stringify(newValue));
      });
    },
    ({ setSelf }) => {
      const savedValue = localStorage.getItem('mealPlan');
      if (savedValue) {
        setSelf(JSON.parse(savedValue));
      }
    },
  ],
});

// Selected meal slot state - now using date instead of day
export const selectedMealSlotState = atom({
  key: 'selectedMealSlotState',
  default: null,
});

// Atom for storing user's onboarding preferences
export const onboardingStateAtom = atom({
  key: 'onboardingStateAtom',
  default: {
    goal: null, // e.g., 'weightLoss', 'muscleGain', 'maintenance', 'generalHealth'
    age: null,
    gender: null,
    height: null, // cm
    weight: null, // kg
    activityLevel: null, // e.g., 'sedentary', 'light', 'moderate', 'veryActive'
    dietType: null, // e.g., 'noRestrictions', 'vegetarian', 'vegan', 'keto', 'paleo'
    allergies: [], // e.g., ['gluten', 'nuts']
    mealsPerDay: null, // e.g., 2, 3, 4
    mealPrepFrequency: null, // e.g., 'weekly', 'sometimes', 'never'
    cookingTimePerDay: null, // e.g., 15, 30, 45, 60 ('min')
    weeklyGroceryBudget: null, // e.g., 25, 75, 125, 200
    budgetPriority: null, // e.g., 'costFocused', 'balanced', 'qualityFocused'
  },
  // Optional: Add effects for localStorage persistence if needed for the whole onboarding object
});

// Atom for tracking onboarding redirection
export const onboardingRedirectAtom = atom({
  key: 'onboardingRedirectAtom',
  default: null, // or { type: 'recipes' } or { type: 'recipeDetails', recipeId: '...' }
});

// Helper function to get meal plan key
export const getMealPlanKey = (date) => {
  const monday = new Date(date);
  monday.setDate(monday.getDate() - monday.getDay() + 1);
  return monday.toISOString().slice(0, 10);
};

export const mealNotificationState = atom({
  key: 'mealNotificationState',
  default: null,
}); 
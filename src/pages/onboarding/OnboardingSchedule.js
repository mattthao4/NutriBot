/**
 * OnboardingSchedule.js
 * 
 * This file defines the OnboardingSchedule component, which allows users to set their meal schedule preferences.
 * It includes options for selecting the number of meals per day, meal prep frequency, and cooking time.
 * 
 * Author(s): Eli Goldberger
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { onboardingStateAtom } from '../../recoil/atoms';
import './OnboardingStep.css'; // Shared CSS

const MEALS_PER_DAY_OPTIONS = [
  { id: '2', label: '2 meals' },
  { id: '3', label: '3 meals' },
  { id: '4+', label: '4+ meals' },
];

const MEAL_PREP_OPTIONS = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'sometimes', label: 'Sometimes' },
  { id: 'never', label: 'Never' },
];

const COOKING_TIME_MARKS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '60+ min' },
];

const OnboardingSchedule = () => {
  const navigate = useNavigate();
  const [onboardingData, setOnboardingData] = useRecoilState(onboardingStateAtom);

  const handleMealsPerDaySelect = (value) => {
    setOnboardingData(prev => ({ ...prev, mealsPerDay: value }));
  };

  const handleMealPrepSelect = (value) => {
    setOnboardingData(prev => ({ ...prev, mealPrepFrequency: value }));
  };

  const handleCookingTimeChange = (e) => {
    setOnboardingData(prev => ({ ...prev, cookingTimePerDay: parseInt(e.target.value, 10) }));
  };

  const handleNext = () => {
    if (onboardingData.mealsPerDay && onboardingData.mealPrepFrequency) {
      if (onboardingData.cookingTimePerDay === null) {
        // Set a default value of 30
        setOnboardingData(prev => ({ ...prev, cookingTimePerDay: 30 }));
      }
      navigate('/onboarding/budget');
    } else {
      alert('Please complete all schedule preferences.');
    }
  };

  const handleBack = () => {
    navigate('/onboarding/diet');
  };

  return (
    <div className="onboarding-step-container schedule-step">
      <h2 className="step-title">Meal Schedule</h2>

      <div className="form-group">
        <label>How many meals do you eat per day?</label>
        <div className="options-grid meals-per-day-options">
          {MEALS_PER_DAY_OPTIONS.map(option => (
            <div 
              key={option.id} 
              className={`option-card mini-option-card ${onboardingData.mealsPerDay === option.id ? 'selected' : ''}`}
              onClick={() => handleMealsPerDaySelect(option.id)}
              role="radio"
              aria-checked={onboardingData.mealsPerDay === option.id}
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleMealsPerDaySelect(option.id)}
            >
              <h3 className="option-label">{option.label}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Do you meal prep?</label>
        <div className="options-grid meal-prep-options">
          {MEAL_PREP_OPTIONS.map(option => (
            <div 
              key={option.id} 
              className={`option-card mini-option-card ${onboardingData.mealPrepFrequency === option.id ? 'selected' : ''}`}
              onClick={() => handleMealPrepSelect(option.id)}
              role="radio"
              aria-checked={onboardingData.mealPrepFrequency === option.id}
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleMealPrepSelect(option.id)}
            >
              <h3 className="option-label">{option.label}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="cookingTimePerDay">Time available for cooking (per day)</label>
        <input 
          type="range" 
          id="cookingTimePerDay" 
          name="cookingTimePerDay"
          min="15" 
          max="60" 
          step="15" 
          value={onboardingData.cookingTimePerDay || 30} // Default to 30 if null
          onChange={handleCookingTimeChange}
          className="form-slider"
        />
        <div className="slider-labels">
          {COOKING_TIME_MARKS.map(mark => (
            <span key={mark.value} style={{ flex: 1, textAlign: 'center' }}>{mark.label}</span>
          ))}
        </div>
        { 
          <p className="slider-current-value">Selected: {onboardingData.cookingTimePerDay || 30}{onboardingData.cookingTimePerDay === 60 ? '+' : ''} min</p>
        }
      </div>

      <div className="navigation-buttons">
        <button onClick={handleBack} className="btn-secondary">Back</button>
        <button onClick={handleNext} className="btn-primary">Next</button>
      </div>
    </div>
  );
};

export default OnboardingSchedule; 
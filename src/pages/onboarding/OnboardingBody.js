/**
 * OnboardingBody.js
 * 
 * This file defines the OnboardingBody component, which allows users to input their body measurements and physical characteristics.
 * It includes fields for height, weight, age, gender, and activity level to help personalize meal recommendations.
 * 
 * Author(s): Eli Goldberger
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { onboardingStateAtom } from '../../recoil/atoms';
import './OnboardingStep.css'; // Shared CSS

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { id: 'light', label: 'Light', description: 'Exercise 1-3 days/week' },
  { id: 'moderate', label: 'Moderate', description: 'Exercise 3-5 days/week' },
  { id: 'veryActive', label: 'Very Active', description: 'Exercise 6-7 days/week' },
];

const GENDER_OPTIONS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
  { id: 'preferNotToSay', label: 'Prefer not to say' },
];

const OnboardingBody = () => {
  const navigate = useNavigate();
  const [onboardingData, setOnboardingData] = useRecoilState(onboardingStateAtom);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setOnboardingData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value,
    }));
  };

  const handleActivitySelect = (activityId) => {
    setOnboardingData(prev => ({ ...prev, activityLevel: activityId }));
  };

  const handleNext = () => {
    // Basic validation (can be more comprehensive)
    if (onboardingData.age && onboardingData.gender && onboardingData.height && onboardingData.weight && onboardingData.activityLevel) {
      navigate('/onboarding/diet');
    } else {
      alert('Please fill in all fields to continue.');
    }
  };

  const handleBack = () => {
    navigate('/onboarding/goals');
  };

  return (
    <div className="onboarding-step-container body-step">
      <h2 className="step-title">Tell us about yourself</h2>
      <div className="form-grid-col-2">
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input 
            type="number" 
            id="age" 
            name="age" 
            value={onboardingData.age || ''} 
            onChange={handleChange} 
            placeholder="e.g., 25"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select 
            id="gender" 
            name="gender" 
            value={onboardingData.gender || ''} 
            onChange={handleChange}
            className="form-select"
          >
            <option value="" disabled>Select gender</option>
            {GENDER_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="height">Height (cm)</label>
          <input 
            type="number" 
            id="height" 
            name="height" 
            value={onboardingData.height || ''} 
            onChange={handleChange} 
            placeholder="e.g., 175"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input 
            type="number" 
            id="weight" 
            name="weight" 
            value={onboardingData.weight || ''} 
            onChange={handleChange} 
            placeholder="e.g., 70"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group full-width-group">
        <label>Activity Level</label>
        <div className="options-grid activity-options-grid">
          {ACTIVITY_LEVELS.map(option => (
            <div 
              key={option.id} 
              className={`option-card mini-option-card ${onboardingData.activityLevel === option.id ? 'selected' : ''}`}
              onClick={() => handleActivitySelect(option.id)}
              role="radio"
              aria-checked={onboardingData.activityLevel === option.id}
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleActivitySelect(option.id)}
            >
              <h3 className="option-label">{option.label}</h3>
              {/* <p className="option-description">{option.description}</p> */}
            </div>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button onClick={handleBack} className="btn-secondary">Back</button>
        <button onClick={handleNext} className="btn-primary">Next</button>
      </div>
    </div>
  );
};

export default OnboardingBody; 
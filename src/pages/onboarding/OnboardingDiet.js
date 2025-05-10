import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { onboardingStateAtom } from '../../recoil/atoms';
import './OnboardingStep.css'; // Shared CSS

const DIET_TYPES = [
  { id: 'noRestrictions', label: 'No Restrictions' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
];

const ALLERGY_OPTIONS = [
  { id: 'gluten', label: 'Gluten' },
  { id: 'nuts', label: 'Nuts' },
  { id: 'soy', label: 'Soy' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'eggs', label: 'Eggs' },
];

const OnboardingDiet = () => {
  const navigate = useNavigate();
  const [onboardingData, setOnboardingData] = useRecoilState(onboardingStateAtom);

  const handleDietTypeSelect = (dietTypeId) => {
    setOnboardingData(prev => ({ ...prev, dietType: dietTypeId }));
  };

  const handleAllergyToggle = (allergyId) => {
    setOnboardingData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergyId) 
        ? prev.allergies.filter(item => item !== allergyId) 
        : [...prev.allergies, allergyId],
    }));
  };

  const handleNext = () => {
    // Basic validation: ensure a diet type is selected (allergies are optional)
    if (onboardingData.dietType) {
      navigate('/onboarding/schedule');
    } else {
      alert('Please select a diet type to continue.');
    }
  };

  const handleBack = () => {
    navigate('/onboarding/body');
  };

  return (
    <div className="onboarding-step-container diet-step">
      <h2 className="step-title">Dietary Preferences</h2>
      
      <div className="form-group">
        <label>Diet Type</label>
        <div className="options-grid diet-type-options">
          {DIET_TYPES.map(option => (
            <div 
              key={option.id} 
              className={`option-card mini-option-card ${onboardingData.dietType === option.id ? 'selected' : ''}`}
              onClick={() => handleDietTypeSelect(option.id)}
              role="radio"
              aria-checked={onboardingData.dietType === option.id}
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleDietTypeSelect(option.id)}
            >
              <h3 className="option-label">{option.label}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Allergies & Restrictions</label>
        <div className="options-grid allergy-options-grid">
          {ALLERGY_OPTIONS.map(option => (
            <div 
              key={option.id} 
              className={`option-card checkbox-option-card ${onboardingData.allergies.includes(option.id) ? 'selected' : ''}`}
              onClick={() => handleAllergyToggle(option.id)}
              role="checkbox"
              aria-checked={onboardingData.allergies.includes(option.id)}
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleAllergyToggle(option.id)}
            >
              {/* Basic checkmark visualization */}
              {onboardingData.allergies.includes(option.id) && <span className="checkmark">&#10003;</span>}
              <h3 className="option-label">{option.label}</h3>
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

export default OnboardingDiet; 
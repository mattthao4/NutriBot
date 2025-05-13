import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { onboardingStateAtom } from '../../recoil/atoms';
import './OnboardingStep.css'; // A shared CSS for common step styling

const GOAL_OPTIONS = [
  { id: 'weightLoss', label: 'Weight Loss', description: 'Reduce body fat while maintaining muscle mass' },
  { id: 'muscleGain', label: 'Muscle Gain', description: 'Increase muscle mass with adequate protein intake' },
  { id: 'maintenance', label: 'Maintenance', description: 'Maintain current weight with balanced nutrition' },
  { id: 'generalHealth', label: 'General Health', description: 'Focus on nutritional balance and overall wellbeing' },
];

const OnboardingGoals = () => {
  const navigate = useNavigate();
  const [onboardingData, setOnboardingData] = useRecoilState(onboardingStateAtom);

  const handleSelection = (goalId) => {
    setOnboardingData(prevData => ({
      ...prevData,
      goal: goalId,
    }));
  };

  const handleNext = () => {
    if (onboardingData.goal) {
      navigate('/onboarding/body'); // Navigate to the next step
    } else {
      alert('Please select a goal to continue.');
    }
  };
  
  // const handleBack = () => {
  //   navigate('/login'); // Or to a previous step if applicable later
  // };

  return (
    <div className="onboarding-step-container goals-step">
      <h2 className="step-title">What are your nutrition goals?</h2>
      <div className="options-grid">
        {GOAL_OPTIONS.map(option => (
          <div 
            key={option.id} 
            className={`option-card ${onboardingData.goal === option.id ? 'selected' : ''}`}
            onClick={() => handleSelection(option.id)}
            role="radio"
            aria-checked={onboardingData.goal === option.id}
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleSelection(option.id)}
          >
            <div className="option-icon-placeholder">
              <span role="img" aria-label={option.label} className="option-icon-emoji">🎯</span> 
            </div>
            <h3 className="option-label">{option.label}</h3>
            <p className="option-description">{option.description}</p>
          </div>
        ))}
      </div>
      <div className="navigation-buttons">
        {/* Back button can be added later or made conditional */}
        {/* <button onClick={handleBack} className="btn-secondary">Back</button> */}
        <button onClick={handleNext} className="btn-primary">Next</button>
      </div>
    </div>
  );
};

export default OnboardingGoals; 
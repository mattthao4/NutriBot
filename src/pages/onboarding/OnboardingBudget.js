/**
 * OnboardingBudget.js
 * 
 * This file defines the OnboardingBudget component, which allows users to set their budget preferences for meal planning.
 * It includes options for weekly grocery budget and budget priority (cost-focused, balanced, or quality-focused).
 * 
 * Author(s): Eli Goldberger
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { onboardingStateAtom, currentWeekState, mealPlanState, onboardingRedirectAtom } from '../../recoil/atoms';
import './OnboardingStep.css'; // Shared CSS

const BUDGET_OPTIONS = [
  { id: 25, label: '$25 - $50' },
  { id: 75, label: '$50 - $100' },
  { id: 125, label: '$100 - $150' },
  { id: 200, label: '$150+' },
];

const BUDGET_PRIORITY_OPTIONS = [
  { id: 'costFocused', label: 'Cost-Focused', description: 'Prioritize lowest cost ingredients.' },
  { id: 'balanced', label: 'Balanced', description: 'Balance between cost and quality/variety.' },
  { id: 'qualityFocused', label: 'Quality-Focused', description: 'Prioritize higher quality ingredients, cost is secondary.' },
];

const OnboardingBudget = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [onboardingData, setOnboardingData] = useRecoilState(onboardingStateAtom);
  const setCurrentWeek = useSetRecoilState(currentWeekState);
  const setMealPlan = useSetRecoilState(mealPlanState);
  const [onboardingRedirect, setOnboardingRedirect] = useRecoilState(onboardingRedirectAtom);

  React.useEffect(() => {
    if (onboardingRedirect === undefined) setOnboardingRedirect(null);
  }, [onboardingRedirect, setOnboardingRedirect]);

  const handleBudgetSelect = (value) => {
    setOnboardingData(prev => ({ ...prev, weeklyGroceryBudget: value }));
  };

  const handlePrioritySelect = (value) => {
    setOnboardingData(prev => ({ ...prev, budgetPriority: value }));
  };

  const handleFinish = () => {
    if (onboardingData.weeklyGroceryBudget && onboardingData.budgetPriority) {
      // Here you would typically send onboardingData to your backend
      console.log('Onboarding Complete:', onboardingData);
      
      // For now, simulate completion and reset relevant app state
      localStorage.setItem('hasCompletedOnboarding', 'true');
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData)); // Store all data

      // Potentially reset other states if needed upon new onboarding
      const now = new Date();
      const monday = new Date(now);
      monday.setDate(now.getDate() - now.getDay() + 1);
      setCurrentWeek(monday.toISOString().slice(0, 10));
      setMealPlan({});
      // Redirect based on onboardingRedirect
      if (onboardingRedirect && onboardingRedirect.type === 'recipes') {
        setOnboardingRedirect(null);
        navigate('/recipes');
      } else if (onboardingRedirect && onboardingRedirect.type === 'recipeDetails') {
        setOnboardingRedirect(null);
        navigate(onboardingRedirect.recipeId ? `/recipes/${onboardingRedirect.recipeId}` : '/recipes');
      } else {
        setOnboardingRedirect(null);
        navigate('/');
      }
    } else {
      alert('Please complete all budget preferences.');
    }
  };

  const handleBack = () => {
    navigate('/onboarding/schedule');
  };

  return (
    <div className="onboarding-step-container budget-step">
      <h2 className="step-title">Budget Preferences</h2>

      <div className="form-group">
        <label>What's your approximate weekly grocery budget?</label>
        <div className="options-grid budget-options">
          {BUDGET_OPTIONS.map(option => (
            <div 
              key={option.id} 
              className={`option-card mini-option-card ${onboardingData.weeklyGroceryBudget === option.id ? 'selected' : ''}`}
              onClick={() => handleBudgetSelect(option.id)}
              role="radio"
              aria-checked={onboardingData.weeklyGroceryBudget === option.id}
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleBudgetSelect(option.id)}
            >
              <h3 className="option-label">{option.label}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>How do you prioritize your spending?</label>
        <div className="options-grid priority-options">
          {BUDGET_PRIORITY_OPTIONS.map(option => (
            <div 
              key={option.id} 
              className={`option-card ${onboardingData.budgetPriority === option.id ? 'selected' : ''}`}
              onClick={() => handlePrioritySelect(option.id)}
              role="radio"
              aria-checked={onboardingData.budgetPriority === option.id}
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handlePrioritySelect(option.id)}
            >
              {/* <div className="option-icon-placeholder">{option.icon || ''}</div> */}
              <h3 className="option-label">{option.label}</h3>
              <p className="option-description">{option.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button onClick={handleBack} className="btn-secondary">Back</button>
        <button onClick={handleFinish} className="btn-primary">Finish</button>
      </div>
    </div>
  );
};

export default OnboardingBudget; 
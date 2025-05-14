/**
 * OnboardingContainer.js
 * 
 * This file defines the OnboardingContainer component, which serves as the main wrapper for the onboarding process.
 * It manages the overall layout and navigation between different onboarding steps, providing a consistent user experience.
 * 
 * Author(s): Eli Goldberger
 */

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './OnboardingContainer.css'; // We'll create this next

const ONBOARDING_STEPS = [
  { path: '/onboarding/goals', name: 'Goals', progress: 20 },
  { path: '/onboarding/body', name: 'Body', progress: 40 },
  { path: '/onboarding/diet', name: 'Diet', progress: 60 },
  { path: '/onboarding/schedule', name: 'Schedule', progress: 80 },
  { path: '/onboarding/budget', name: 'Budget', progress: 100 },
];

const OnboardingContainer = () => {
  const location = useLocation();
  const currentStep = ONBOARDING_STEPS.find(step => step.path === location.pathname);
  const currentProgress = currentStep ? currentStep.progress : 0;
  // const currentStepName = currentStep ? currentStep.name : 'Welcome'; // Not used yet, but can be useful

  return (
    <div className="onboarding-container-page">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <h1>Welcome to NutriBot!</h1>
          <p>Let's set up your personalized meal planning experience</p>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar-labels">
            {ONBOARDING_STEPS.map(step => (
              <span 
                key={step.name} 
                className={`progress-label ${location.pathname.includes(step.path) ? 'active' : ''}`}
              >
                {step.name}
              </span>
            ))}
          </div>
          <div className="progress-bar-track">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>

        <div className="onboarding-step-content">
          {/* The current onboarding step component will be rendered here */}
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default OnboardingContainer; 
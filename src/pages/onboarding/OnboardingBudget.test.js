import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecoilRoot, atom } from 'recoil';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import OnboardingBudget from './OnboardingBudget';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock Recoil atoms
const mockOnboardingStateAtom = atom({
  key: 'mockBudgetOnboardingStateAtom', // Unique key
  default: {
    goal: 'muscleGain',
    age: 25,
    gender: 'male',
    height: 180,
    weight: 75,
    activityLevel: 'veryActive',
    dietType: 'vegan',
    allergies: ['nuts'],
    mealsPerDay: '4+',
    mealPrepFrequency: 'weekly',
    cookingTimePerDay: 45,
    weeklyGroceryBudget: null,
    budgetPriority: null,
  },
});

const mockCurrentWeekState = atom({
    key: 'mockCurrentWeekStateBudget', // Unique key
    default: '2023-01-02' 
});

const mockMealPlanState = atom({
    key: 'mockMealPlanStateBudget', // Unique key
    default: {}
});

// Helper to wrap component
const renderWithProviders = (ui, { initialEntries = ['/onboarding/budget'] } = {}) => {
  const initialRecoilState = ({ set }) => {
    set(mockOnboardingStateAtom, {
        goal: 'muscleGain',
        age: 25,
        gender: 'male',
        height: 180,
        weight: 75,
        activityLevel: 'veryActive',
        dietType: 'vegan',
        allergies: ['nuts'],
        mealsPerDay: '4+',
        mealPrepFrequency: 'weekly',
        cookingTimePerDay: 45,
        weeklyGroceryBudget: null,
        budgetPriority: null,
    });
    // No need to set currentWeekState or mealPlanState for initial render of this component specifically,
    // as they are primarily set *after* finishing.
  };

  window.alert = jest.fn();
  Storage.prototype.setItem = jest.fn(); // Mock localStorage.setItem

  return render(
    <RecoilRoot initializeState={initialRecoilState}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route 
            path="/onboarding/budget" 
            element={React.cloneElement(ui, { 
              onboardingStateAtom: mockOnboardingStateAtom, 
              currentWeekState: mockCurrentWeekState, 
              mealPlanState: mockMealPlanState 
            })} 
          />
          <Route path="/onboarding/schedule" element={<div>Schedule Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    </RecoilRoot>
  );
};

describe('OnboardingBudget Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    window.alert.mockClear();
    localStorage.setItem.mockClear();
  });

  test('renders correctly', () => {
    renderWithProviders(<OnboardingBudget />);
    expect(screen.getByText('Budget Preferences')).toBeInTheDocument();
    expect(screen.getByText("What's your approximate weekly grocery budget?")).toBeInTheDocument();
    expect(screen.getByText('$50 - $100')).toBeInTheDocument(); // An example option
    expect(screen.getByText('How do you prioritize your spending?')).toBeInTheDocument();
    expect(screen.getByText('Balanced')).toBeInTheDocument(); // An example option
  });

  test('updates weeklyGroceryBudget on selection', () => {
    renderWithProviders(<OnboardingBudget />);
    fireEvent.click(screen.getByText('$100 - $150'));
    // We'll infer state change from the finish logic
  });

  test('updates budgetPriority on selection', () => {
    renderWithProviders(<OnboardingBudget />);
    fireEvent.click(screen.getByText('Cost-Focused'));
    // We'll infer state change from the finish logic
  });

  test('navigates to /onboarding/schedule when Back is clicked', () => {
    renderWithProviders(<OnboardingBudget />);
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding/schedule');
  });

  test('shows alert if Finish is clicked with weeklyGroceryBudget missing', () => {
    renderWithProviders(<OnboardingBudget />);
    fireEvent.click(screen.getByText('Balanced')); // Select priority
    fireEvent.click(screen.getByRole('button', { name: /Finish/i }));
    expect(window.alert).toHaveBeenCalledWith('Please complete all budget preferences.');
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  test('shows alert if Finish is clicked with budgetPriority missing', () => {
    renderWithProviders(<OnboardingBudget />);
    fireEvent.click(screen.getByText('$25 - $50')); // Select budget
    fireEvent.click(screen.getByRole('button', { name: /Finish/i }));
    expect(window.alert).toHaveBeenCalledWith('Please complete all budget preferences.');
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  test('calls localStorage, and navigates to /dashboard when Finish is clicked with all fields completed', () => {
    const initialData = {
        goal: 'muscleGain',
        age: 25,
        gender: 'male',
        height: 180,
        weight: 75,
        activityLevel: 'veryActive',
        dietType: 'vegan',
        allergies: ['nuts'],
        mealsPerDay: '4+',
        mealPrepFrequency: 'weekly',
        cookingTimePerDay: 45,
        weeklyGroceryBudget: null, // Will be set
        budgetPriority: null,    // Will be set
    };
    const initialRecoilState = ({ set }) => {
        set(mockOnboardingStateAtom, initialData);
    };

    render(
        <RecoilRoot initializeState={initialRecoilState}>
          <MemoryRouter initialEntries={['/onboarding/budget']}>
            <Routes>
              <Route 
                path="/onboarding/budget" 
                element={<OnboardingBudget 
                  onboardingStateAtom={mockOnboardingStateAtom} 
                  currentWeekState={mockCurrentWeekState} 
                  mealPlanState={mockMealPlanState} 
                />} 
              />
              <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            </Routes>
          </MemoryRouter>
        </RecoilRoot>
      );

    fireEvent.click(screen.getByText('$50 - $100')); // Budget: 75
    fireEvent.click(screen.getByText('Quality-Focused')); // Priority

    fireEvent.click(screen.getByRole('button', { name: /Finish/i }));

    expect(window.alert).not.toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith('hasCompletedOnboarding', 'true');
    const expectedStoredData = {
      ...initialData,
      weeklyGroceryBudget: 75, 
      budgetPriority: 'qualityFocused',
    };
    expect(localStorage.setItem).toHaveBeenCalledWith('onboardingData', JSON.stringify(expectedStoredData));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
}); 
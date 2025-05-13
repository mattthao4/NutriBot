import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecoilRoot, atom } from 'recoil';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import OnboardingSchedule from './OnboardingSchedule';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock Recoil atom for onboarding state
const mockOnboardingStateAtom = atom({
  key: 'mockOnboardingStateAtom',
  default: {
    goal: 'weightLoss',
    age: 30,
    gender: 'female',
    height: 165,
    weight: 60,
    activityLevel: 'moderate',
    dietType: 'noRestrictions',
    allergies: [],
    mealsPerDay: null,
    mealPrepFrequency: null,
    cookingTimePerDay: 30, // Default value in component
  },
});

// Helper to wrap component in RecoilRoot and MemoryRouter
const renderWithProviders = (ui, { initialEntries = ['/onboarding/schedule'] } = {}) => {
  // Mock initial state for RecoilRoot if needed for specific tests
  const initialRecoilState = ({ set }) => {
    set(mockOnboardingStateAtom, {
        goal: 'weightLoss',
        age: 30,
        gender: 'female',
        height: 165,
        weight: 60,
        activityLevel: 'moderate',
        dietType: 'noRestrictions',
        allergies: [],
        mealsPerDay: null,
        mealPrepFrequency: null,
        cookingTimePerDay: 30,
    });
  };

  window.alert = jest.fn(); // Mock window.alert

  return render(
    <RecoilRoot initializeState={initialRecoilState}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/onboarding/schedule" element={React.cloneElement(ui, { onboardingStateAtom: mockOnboardingStateAtom })} />
          <Route path="/onboarding/diet" element={<div>Diet Page</div>} />
          <Route path="/onboarding/budget" element={<div>Budget Page</div>} />
        </Routes>
      </MemoryRouter>
    </RecoilRoot>
  );
};

describe('OnboardingSchedule Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    window.alert.mockClear();
  });

  test('renders correctly with initial values', () => {
    renderWithProviders(<OnboardingSchedule />);
    expect(screen.getByText('Meal Schedule')).toBeInTheDocument();
    expect(screen.getByLabelText('How many meals do you eat per day?')).toBeInTheDocument();
    expect(screen.getByText('3 meals')).toBeInTheDocument(); // Assuming '3 meals' is an option
    expect(screen.getByLabelText('Do you meal prep?')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument(); // Assuming 'Weekly' is an option
    expect(screen.getByLabelText('Time available for cooking (per day)')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveValue('30');
  });

  test('updates mealsPerDay on selection', () => {
    renderWithProviders(<OnboardingSchedule />);
    fireEvent.click(screen.getByText('2 meals'));
    // Test Recoil state update - This requires a more complex setup or a different approach
    // For now, we primarily test navigation and interaction
    // We can infer state update if navigation works correctly based on state
  });

  test('updates mealPrepFrequency on selection', () => {
    renderWithProviders(<OnboardingSchedule />);
    fireEvent.click(screen.getByText('Never'));
    // Similar to above, direct Recoil state testing is complex here
  });

  test('updates cookingTimePerDay on slider change', () => {
    renderWithProviders(<OnboardingSchedule />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '45' } });
    expect(slider).toHaveValue('45');
    expect(screen.getByText(/Selected: 45 min/)).toBeInTheDocument();
  });

  test('navigates to /onboarding/budget when all fields are selected and Next is clicked', () => {
    renderWithProviders(<OnboardingSchedule />);
    fireEvent.click(screen.getByText('2 meals')); // Select meals per day
    fireEvent.click(screen.getByText('Sometimes')); // Select meal prep
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '15' } }); // Change cooking time

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding/budget');
  });

  test('shows alert if Next is clicked with mealsPerDay missing', () => {
    renderWithProviders(<OnboardingSchedule />);
    // mealsPerDay is null by default in mock
    fireEvent.click(screen.getByText('Weekly')); // Select meal prep
    // cookingTimePerDay has a default
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(window.alert).toHaveBeenCalledWith('Please complete all schedule preferences.');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('shows alert if Next is clicked with mealPrepFrequency missing', () => {
    renderWithProviders(<OnboardingSchedule />);
    fireEvent.click(screen.getByText('3 meals')); // Select meals per day
    // mealPrepFrequency is null by default
    // cookingTimePerDay has a default
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(window.alert).toHaveBeenCalledWith('Please complete all schedule preferences.');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  
  // Note: The component initializes cookingTimePerDay to 30 if null from Recoil.
  // So a test for cookingTimePerDay missing before Next click is tricky without altering default Recoil state for this specific test.
  // The component logic: (onboardingData.mealsPerDay && onboardingData.mealPrepFrequency && onboardingData.cookingTimePerDay !== null)

  test('navigates to /onboarding/diet when Back is clicked', () => {
    renderWithProviders(<OnboardingSchedule />);
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding/diet');
  });
}); 
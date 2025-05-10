import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './LoginPage';

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // import and retain default behavior
  useNavigate: () => mockNavigate, // override useNavigate with a mock function
}));

describe('LoginPage Component', () => {
  beforeEach(() => {
    // Clear mocks and localStorage before each test
    mockNavigate.mockClear();
    localStorage.clear();
  });

  test('renders login form correctly', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows error message for empty fields submission', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('shows error message for incorrect credentials', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wrongUser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongPassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('navigates to dashboard on successful first-time login', async () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem('hasCompletedOnboarding')).toBe('true');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('navigates to dashboard on successful subsequent login', async () => {
    localStorage.setItem('hasCompletedOnboarding', 'true'); // Simulate prior login/onboarding
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      // Ensure the flag remains true and navigation occurs
      expect(localStorage.getItem('hasCompletedOnboarding')).toBe('true');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('does not show error for valid credentials', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(screen.queryByText('Invalid username or password.')).not.toBeInTheDocument();
    expect(screen.queryByText('Please enter both username and password.')).not.toBeInTheDocument();
  });

}); 
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Earth from './Earth';

// Mock the Spinner component
jest.mock('./Spinner', () => {
  return function MockedSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

// Mock fetch
global.fetch = jest.fn();

describe('Earth component', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock environment variable
    process.env.REACT_APP_NASA_API_KEY = 'test-api-key';
  });

  test('renders without crashing', () => {
    render(<Earth />);
    expect(screen.getByText(/awesome earth imagery/i)).toBeInTheDocument();
  });

  test('displays form elements correctly', () => {
    render(<Earth />);
    expect(screen.getByDisplayValue('')).toBeInTheDocument(); // date input starts empty
    expect(screen.getByRole('button', { name: /fetch/i })).toBeInTheDocument();
  });

  test('fetch button is disabled when no date is selected', () => {
    render(<Earth />);
    const fetchButton = screen.getByRole('button', { name: /fetch/i });
    expect(fetchButton).toBeDisabled();
  });

  test('fetch button is enabled when date is selected', () => {
    render(<Earth />);
    const dateInput = screen.getByDisplayValue(''); // Get the empty date input
    const fetchButton = screen.getByRole('button', { name: /fetch/i });

    fireEvent.change(dateInput, { target: { value: '2025-01-01' } });
    expect(fetchButton).not.toBeDisabled();
  });

  test('shows loading spinner when fetching data', async () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Earth />);
    const dateInput = screen.getByDisplayValue('');
    const fetchButton = screen.getByRole('button', { name: /fetch/i });

    fireEvent.change(dateInput, { target: { value: '2025-01-01' } });
    fireEvent.click(fetchButton);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<Earth />);
    const dateInput = screen.getByDisplayValue('');
    const fetchButton = screen.getByRole('button', { name: /fetch/i });

    fireEvent.change(dateInput, { target: { value: '2025-01-01' } });
    fireEvent.click(fetchButton);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test('renders images when data is successfully fetched', async () => {
    const mockData = [
      {
        image: 'epic_1b_20250101000000',
        caption: 'Earth from space',
        date: '2025-01-01 00:00:00'
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    render(<Earth />);
    const dateInput = screen.getByDisplayValue('');
    const fetchButton = screen.getByRole('button', { name: /fetch/i });

    fireEvent.change(dateInput, { target: { value: '2025-01-01' } });
    fireEvent.click(fetchButton);

    await waitFor(() => {
      expect(screen.getByText('Earth from space')).toBeInTheDocument();
    });

    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});

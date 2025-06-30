import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import APOD from './APOD';

// Mock fetch globally
global.fetch = jest.fn();

describe('APOD component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders loading state initially', () => {
    fetch.mockImplementationOnce(() =>
      new Promise(resolve => {
        // Don't resolve immediately to keep loading state
      })
    );

    render(<APOD />);

    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  test('renders success state with APOD data', async () => {
    const mockData = {
      title: 'Amazing Space Photo',
      explanation: 'This is an amazing photo from space.',
      url: 'https://example.com/space.jpg',
      date: '2025-01-01'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    await act(async () => {
      render(<APOD />);
    });

    await waitFor(() => {
      expect(screen.getByText('Amazing Space Photo')).toBeInTheDocument();
    });

    expect(screen.getByText('This is an amazing photo from space.')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/space.jpg');
    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
  });

  test('renders error state when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    await act(async () => {
      render(<APOD />);
    });

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test('renders error state when API returns error response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    render(<APOD />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});

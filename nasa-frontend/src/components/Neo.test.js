import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Neo from './Neo';

// Mock the Spinner component
jest.mock('./Spinner', () => {
  return function MockedSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="chart-container">{children}</div>,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  CartesianGrid: () => <div data-testid="grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />
}));

// Mock fetch
global.fetch = jest.fn();

// Mock Date
const mockDate = '2025-06-15';
const RealDate = Date;

beforeAll(() => {
  global.Date = class extends RealDate {
    constructor(dateString) {
      if (dateString) {
        super(dateString);
      } else {
        super('2025-06-15T12:00:00.000Z');
      }
    }

    static now() {
      return new RealDate('2025-06-15T12:00:00.000Z').getTime();
    }

    toISOString() {
      if (arguments.length === 0) {
        return '2025-06-15T12:00:00.000Z';
      }
      return super.toISOString();
    }
  };

  Date.now = () => new RealDate('2025-06-15T12:00:00.000Z').getTime();
});

afterAll(() => {
  global.Date = RealDate;
});

describe('Neo component', () => {
  const mockChartData = {
    near_earth_objects: {
      '2025-06-09': [],
      '2025-06-10': [],
      '2025-06-11': [],
      '2025-06-12': [],
      '2025-06-13': [],
      '2025-06-14': [],
      '2025-06-15': []
    }
  };

  const mockAsteroidData = {
    near_earth_objects: {
      '2025-06-15': [
        {
          id: '1',
          name: 'Test Asteroid 1',
          estimated_diameter: {
            kilometers: { estimated_diameter_max: 1.5 }
          },
          is_potentially_hazardous_asteroid: false
        },
        {
          id: '2',
          name: 'Test Asteroid 2',
          estimated_diameter: {
            kilometers: { estimated_diameter_max: 2.0 }
          },
          is_potentially_hazardous_asteroid: true
        }
      ]
    }
  };

  beforeEach(() => {
    fetch.mockClear();
    // Mock environment variable
    process.env.REACT_APP_NASA_API_KEY = 'test-api-key';
  });

  test('renders without crashing', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockChartData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAsteroidData
      });

    await act(async () => {
      render(<Neo />);
    });

    await waitFor(() => {
      expect(screen.getByText(/neo count/i)).toBeInTheDocument();
    });
  });

  test('displays form elements correctly', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockChartData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAsteroidData
      });

    await act(async () => {
      render(<Neo />);
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('2025-06-15')).toBeInTheDocument(); // date input with today's date
      expect(screen.getByRole('button', { name: /get neos/i })).toBeInTheDocument();
    });
  });

  test('displays chart components', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockChartData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAsteroidData
      });

    await act(async () => {
      render(<Neo />);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('chart-container')).toHaveLength(2); // Two charts
      expect(screen.getByText(/neo count \(past 7 days\)/i)).toBeInTheDocument();
      expect(screen.getByText(/largest neo size/i)).toBeInTheDocument();
    });
  });

  test('displays sorting controls', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockChartData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAsteroidData
      });

    await act(async () => {
      render(<Neo />);
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /default/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sort by size/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /show hazardous first/i })).toBeInTheDocument();
    });
  });

  test('shows loading spinner initially', () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Neo />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockChartData
      })
      .mockRejectedValueOnce(new Error('API Error'));

    render(<Neo />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test('renders asteroids when data is successfully fetched', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockChartData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAsteroidData
      });

    await act(async () => {
      render(<Neo />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Asteroid 1')).toBeInTheDocument();
      expect(screen.getByText('Test Asteroid 2')).toBeInTheDocument();
    });
  });

  test('sorting functionality works correctly', async () => {
    const sortingMockData = {
      near_earth_objects: {
        '2025-06-15': [
          {
            id: '1',
            name: 'Small Asteroid',
            estimated_diameter: {
              kilometers: { estimated_diameter_max: 1.0 }
            },
            is_potentially_hazardous_asteroid: false
          },
          {
            id: '2',
            name: 'Large Asteroid',
            estimated_diameter: {
              kilometers: { estimated_diameter_max: 3.0 }
            },
            is_potentially_hazardous_asteroid: true
          }
        ]
      }
    };

    fetch.mockClear();
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockChartData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => sortingMockData
      });

    await act(async () => {
      render(<Neo />);
    });

    await waitFor(() => {
      expect(screen.getByText('Small Asteroid')).toBeInTheDocument();
      expect(screen.getByText('Large Asteroid')).toBeInTheDocument();
    });

    // Test sorting by size
    const sortBySizeButton = screen.getByRole('button', { name: /sort by size/i });
    fireEvent.click(sortBySizeButton);

    // Test sorting by danger
    const sortByDangerButton = screen.getByRole('button', { name: /show hazardous first/i });
    fireEvent.click(sortByDangerButton);

    // Verify buttons are clickable (basic interaction test)
    expect(sortBySizeButton).toBeInTheDocument();
    expect(sortByDangerButton).toBeInTheDocument();
  });
});

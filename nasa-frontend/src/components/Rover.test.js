import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Rover from './Rover';

// Mock the Spinner component
jest.mock('./Spinner', () => {
  return function MockedSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

// Mock fetch
global.fetch = jest.fn();

describe('Rover component', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock environment variable
    process.env.REACT_APP_NASA_API_KEY = 'test-api-key';
    // Mock current date to ensure consistent testing
    const mockDate = new Date('2025-06-15T12:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    Date.now = jest.fn(() => mockDate.getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders without crashing', () => {
    render(<Rover />);
    expect(screen.getByText(/mars rover: curiosity/i)).toBeInTheDocument();
    expect(screen.getByText(/explore mars through curiosity's eyes/i)).toBeInTheDocument();
  });

  test('displays form elements correctly', () => {
    render(<Rover />);
    expect(screen.getByLabelText(/select earth date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by camera/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore photos/i })).toBeInTheDocument();
  });

  test('initializes with yesterday\'s date', () => {
    render(<Rover />);
    const dateInput = screen.getByLabelText(/select earth date/i);
    // Should be yesterday's date by default
    expect(dateInput.value).toBe('2025-06-14'); // One day before mocked date
  });

  test('camera select has default "All Cameras" option', () => {
    render(<Rover />);
    const cameraSelect = screen.getByLabelText(/filter by camera/i);
    expect(cameraSelect.value).toBe('ALL');
    expect(screen.getByText(/all cameras/i)).toBeInTheDocument();
  });

  test('shows loading spinner when fetching photos', async () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Rover />);
    const fetchButton = screen.getByRole('button', { name: /explore photos/i });

    fireEvent.click(fetchButton);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<Rover />);
    const fetchButton = screen.getByRole('button', { name: /explore photos/i });

    fireEvent.click(fetchButton);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test('renders photos when data is successfully fetched', async () => {
    const mockData = {
      photos: [
        {
          id: 1,
          img_src: 'https://example.com/photo1.jpg',
          camera: { name: 'FHAZ', full_name: 'Front Hazard Avoidance Camera' },
          earth_date: '2025-06-14'
        },
        {
          id: 2,
          img_src: 'https://example.com/photo2.jpg',
          camera: { name: 'MAST', full_name: 'Mast Camera' },
          earth_date: '2025-06-14'
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    render(<Rover />);
    const fetchButton = screen.getByRole('button', { name: /explore photos/i });

    fireEvent.click(fetchButton);

    await waitFor(() => {
      expect(screen.getByText('Front Hazard Avoidance Camera')).toBeInTheDocument();
      expect(screen.getByText('Mast Camera')).toBeInTheDocument();
    });

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'https://example.com/photo1.jpg');
    expect(images[1]).toHaveAttribute('src', 'https://example.com/photo2.jpg');
  });

  test('camera filtering works correctly', async () => {
    const mockData = {
      photos: [
        {
          id: 1,
          img_src: 'https://example.com/photo1.jpg',
          camera: { name: 'FHAZ', full_name: 'Front Hazard Avoidance Camera' },
          earth_date: '2025-06-14'
        },
        {
          id: 2,
          img_src: 'https://example.com/photo2.jpg',
          camera: { name: 'MAST', full_name: 'Mast Camera' },
          earth_date: '2025-06-14'
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    render(<Rover />);
    const fetchButton = screen.getByRole('button', { name: /explore photos/i });
    const cameraSelect = screen.getByLabelText(/filter by camera/i);

    // First fetch photos
    fireEvent.click(fetchButton);

    await waitFor(() => {
      expect(screen.getByText('Front Hazard Avoidance Camera')).toBeInTheDocument();
      expect(screen.getByText('Mast Camera')).toBeInTheDocument();
    });

    // Then filter by FHAZ camera
    fireEvent.change(cameraSelect, { target: { value: 'FHAZ' } });

    await waitFor(() => {
      expect(screen.getByText('Front Hazard Avoidance Camera')).toBeInTheDocument();
      expect(screen.queryByText('Mast Camera')).not.toBeInTheDocument();
    });
  });

  test('shows no results message when no photos found', () => {
    render(<Rover />);
    expect(screen.getByText(/no photos found for this selection/i)).toBeInTheDocument();
  });
});

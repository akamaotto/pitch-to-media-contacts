import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Unified App Shell', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders contact selection surface by default', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: /AI Recommended/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Pitches/i })).toBeDisabled();
    expect(screen.getByText(/Select Contacts for Pitch/i)).toBeInTheDocument();
  });

  test('navigates to inbox and shows conversation list UI', async () => {
    render(<App />);
    const inboxTab = screen.getByRole('button', { name: /^Inbox$/ });
    await userEvent.click(inboxTab);

    expect(screen.getByPlaceholderText(/Filter threads/i)).toBeInTheDocument();
  });

  test('opens conversation detail when a thread is selected', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /^Inbox$/ }));

    const conversationTrigger = await screen.findByRole('button', { name: /Temitayo Jaiyeola/i });
    await userEvent.click(conversationTrigger);

    expect(await screen.findByRole('heading', { level: 2, name: /Temitayo Jaiyeola/i })).toBeInTheDocument();
    expect(screen.getByText(/Reply as Paul Otto/i)).toBeInTheDocument();
  });

  test('navigates to composer after generating pitches', async () => {
    jest.useFakeTimers();

    render(<App />);

    const contactCard = await screen.findByText('Sam Wakoba');
    await userEvent.click(contactCard);

    const generateButton = screen.getByRole('button', { name: /Generate Pitches/i });
    expect(generateButton).toBeEnabled();

    await userEvent.click(generateButton);

    await act(async () => {
      jest.advanceTimersByTime(26000);
    });

    expect(await screen.findByText(/Pitch Composer/i)).toBeInTheDocument();
    expect(screen.getByText(/Sending status/i)).toBeInTheDocument();
  });
});

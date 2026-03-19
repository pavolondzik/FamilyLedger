import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import App from '@/app/App';
import { resetProjectsStorage } from '@/features/projects';
import { createQueryClient } from '@/lib/queryClient';
import { store } from '@/lib/store';

const renderApp = () => {
  const queryClient = createQueryClient();

  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>,
  );
};

describe('App Projects flow', () => {
  beforeEach(() => {
    resetProjectsStorage();
  });

  it('loads projects from the API and supports create, validation, edit, and delete flows', async () => {
    const user = userEvent.setup();

    renderApp();

    expect(await screen.findByRole('button', { name: 'Edit Kitchen Remodel' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Create Project' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Project name is required.');

    await user.type(screen.getByLabelText('Project Name'), 'Garden Upgrade');
    await user.type(screen.getByLabelText('Description'), 'Raised beds and irrigation.');
    await user.click(screen.getByRole('button', { name: 'Create Project' }));

    expect(await screen.findByRole('button', { name: 'Edit Garden Upgrade' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit Garden Upgrade' }));

    const nameInput = screen.getByLabelText('Project Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Garden Upgrade Phase 1');
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(await screen.findByRole('button', { name: 'Edit Garden Upgrade Phase 1' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete Garden Upgrade Phase 1' }));

    await waitFor(() => {
      expect(screen.queryByText('Garden Upgrade Phase 1')).not.toBeInTheDocument();
    });
  });
});
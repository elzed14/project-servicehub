import { render } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default size', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toHaveClass('w-8 h-8');
  });

  it('renders with custom size', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    expect(container.firstChild).toHaveClass('w-12 h-12');
  });
});
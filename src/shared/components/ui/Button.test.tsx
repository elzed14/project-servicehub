import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import Button from './Button';

describe('Button', () => {
  it('affiche le texte correctement', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('gère les clics', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Cliquer</Button>);
    
    fireEvent.click(screen.getByText('Cliquer'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('est désactivé quand disabled=true', () => {
    render(<Button disabled>Désactivé</Button>);
    const button = screen.getByText('Désactivé');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('applique les variantes correctement', () => {
    const { rerender } = render(<Button variant="outline">Outline</Button>);
    expect(screen.getByText('Outline')).toHaveClass('border-gray-300');
    
    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByText('Destructive')).toHaveClass('bg-red-600');
  });

  it('applique les tailles correctement', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small')).toHaveClass('h-8');
    
    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large')).toHaveClass('h-12');
  });
});
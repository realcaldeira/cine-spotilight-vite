import { renderHook } from '@testing-library/react';
import { toast } from '../use-toast';

// Testes mais simples focando apenas nas funções exportadas
describe('useToast utilities', () => {
  it('should export toast function', () => {
    expect(typeof toast).toBe('function');
  });

  it('should create toast with title', () => {
    // Mock console.log para capturar chamadas se necessário
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const result = toast({
      title: 'Test Toast',
    });

    // Verifica se retorna um objeto com id e dismiss
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('dismiss');
    expect(typeof result.dismiss).toBe('function');

    consoleSpy.mockRestore();
  });

  it('should create toast with description', () => {
    const result = toast({
      title: 'Test Toast',
      description: 'Test description',
    });

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('dismiss');
  });

  it('should create toast with variant', () => {
    const result = toast({
      title: 'Error Toast',
      variant: 'destructive',
    });

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('dismiss');
  });

  it('should create toast with duration', () => {
    const result = toast({
      title: 'Timed Toast',
      duration: 5000,
    });

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('dismiss');
  });

  it('should generate unique ids for multiple toasts', () => {
    const toast1 = toast({ title: 'Toast 1' });
    const toast2 = toast({ title: 'Toast 2' });

    expect(toast1.id).not.toBe(toast2.id);
  });

  it('should handle empty toast', () => {
    const result = toast({});

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('dismiss');
  });

  it('should return dismiss function that can be called', () => {
    const result = toast({ title: 'Dismissible Toast' });

    expect(() => {
      result.dismiss();
    }).not.toThrow();
  });
});

import { renderHook, act } from '@testing-library/react';
import { useToast } from '../use-toast';

describe('useToast hook', () => {
  beforeEach(() => {
    // Reset toasts before each test
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.dismiss();
    });
  });

  it('should add a toast with title and description', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Test Title',
        description: 'Test Description',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      title: 'Test Title',
      description: 'Test Description',
    });
  });

  it('should add toast and limit to TOAST_LIMIT', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'First Toast' });
    });

    // The toast limit seems to be 1
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('First Toast');

    act(() => {
      result.current.toast({ title: 'Second Toast' });
    });

    // Should replace the first toast
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Second Toast');
  });

  it('should generate unique IDs for toasts', () => {
    const { result } = renderHook(() => useToast());

    let firstId: string;
    let secondId: string;

    act(() => {
      const first = result.current.toast({ title: 'First' });
      firstId = first.id;
    });

    act(() => {
      result.current.dismiss();
    });

    act(() => {
      const second = result.current.toast({ title: 'Second' });
      secondId = second.id;
    });

    expect(firstId).not.toBe(secondId);
    expect(typeof firstId).toBe('string');
    expect(typeof secondId).toBe('string');
  });

  it('should handle toast with variant', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Error Toast',
        variant: 'destructive',
      });
    });

    expect(result.current.toasts[0].variant).toBe('destructive');
  });

  it('should return toast object with id when created', () => {
    const { result } = renderHook(() => useToast());

    interface ToastResult {
      id: string;
      dismiss: () => void;
      update: (props: Record<string, unknown>) => void;
    }

    let toastResult: ToastResult;
    act(() => {
      toastResult = result.current.toast({ title: 'Test Toast' });
    });

    expect(toastResult).toHaveProperty('id');
    expect(toastResult).toHaveProperty('dismiss');
    expect(toastResult).toHaveProperty('update');
    expect(typeof toastResult.id).toBe('string');
    expect(typeof toastResult.dismiss).toBe('function');
    expect(typeof toastResult.update).toBe('function');
  });

  it('should handle toast dismiss through returned function', () => {
    const { result } = renderHook(() => useToast());

    interface ToastResult {
      id: string;
      dismiss: () => void;
      update: (props: Record<string, unknown>) => void;
    }

    let toastResult: ToastResult;
    act(() => {
      toastResult = result.current.toast({ title: 'Test Toast' });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      toastResult.dismiss();
    });

    // Toast is marked as dismissed but still in array
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('should handle toast update through returned function', () => {
    const { result } = renderHook(() => useToast());

    interface ToastResult {
      id: string;
      dismiss: () => void;
      update: (props: Record<string, unknown>) => void;
    }

    let toastResult: ToastResult;
    act(() => {
      toastResult = result.current.toast({ title: 'Original Title' });
    });

    act(() => {
      toastResult.update({ title: 'Updated Title' });
    });

    expect(result.current.toasts[0].title).toBe('Updated Title');
  });

  it('should dismiss all toasts when no id provided', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Test Toast' });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss();
    });

    // Check that toast is marked for removal but still present with open: false
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('should remove toast after TOAST_REMOVE_DELAY', () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Test Toast' });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(result.current.toasts[0].id);
    });

    // Should still be there but marked for removal
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].open).toBe(false);

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(1000000);
    });

    // Should be removed now
    expect(result.current.toasts).toHaveLength(0);

    jest.useRealTimers();
  });
});

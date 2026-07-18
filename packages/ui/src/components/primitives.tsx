'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ButtonHTMLAttributes,
  type DialogHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'default' | 'sm' | 'icon';
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, size = 'default', type = 'button', variant = 'primary', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={classes(
        'inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' &&
          'bg-primary text-white shadow-[0_12px_32px_-18px_var(--color-primary)] hover:bg-primary/90',
        variant === 'secondary' &&
          'border border-border bg-surface/80 text-foreground hover:border-primary/40 hover:text-primary',
        variant === 'ghost' && 'bg-transparent text-foreground hover:bg-foreground/5',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
        size === 'default' && 'h-11 px-5',
        size === 'sm' && 'h-9 px-4',
        size === 'icon' && 'size-10',
        className,
      )}
      type={type}
      {...props}
    />
  );
});

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={classes(
          'h-11 w-full rounded-xl border border-border bg-surface/80 px-3 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={classes(
        'w-full rounded-xl border border-border bg-surface/80 px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
});

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={classes('rounded-2xl border border-border bg-surface/70 shadow-sm', className)}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={classes(
        'inline-flex items-center rounded-full border border-border bg-surface/70 px-2.5 py-1 text-xs font-medium text-muted',
        className,
      )}
      {...props}
    />
  );
}

export type DialogHandle = {
  focus: () => void;
};

type DialogProps = Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open'> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const Dialog = forwardRef<DialogHandle, DialogProps>(function Dialog(
  { children, className, onOpenChange, open, ...props },
  forwardedRef,
) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(forwardedRef, () => ({
    focus: () => dialogRef.current?.focus(),
  }));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={classes(
        'm-auto max-h-[90dvh] w-[min(32rem,calc(100%-2rem))] rounded-2xl border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-slate-950/60',
        className,
      )}
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange(false);
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false);
      }}
      {...props}
    >
      {children}
    </dialog>
  );
});

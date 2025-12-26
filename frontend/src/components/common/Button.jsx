import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-primary hover:bg-primary-dark text-white shadow-md hover:shadow-lg',
  secondary: 'bg-neutral-text-muted hover:bg-neutral-text-light text-white',
  outline: 'border-2 border-primary text-primary hover:bg-primary/10',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

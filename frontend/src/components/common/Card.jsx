import { cn } from '../../utils/cn';

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn('bg-white rounded-lg shadow-soft p-6 border border-neutral-border', className)}
      {...props}
    >
      {children}
    </div>
  );
}

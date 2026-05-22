import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'default' | 'text' | 'danger';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({ variant = 'default', className = '', children, ...rest }: Props) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[variant]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}

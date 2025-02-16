import * as React from 'react';

import { cn } from '@/lib/utils';



interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';  // Exemple de support de variantes
  padding?: string;                   // Padding personnalisé
  margin?: string;                    // Margin personnalisé
  rounded?: boolean;                  // Option pour des coins arrondis
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'p-6', margin = '', rounded = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'border-2 bg-white text-black shadow-lg transition-all ease-in-out duration-300 hover:shadow-xl', // Fond blanc et texte noir
          {
            'rounded-xl': rounded,  // Coins arrondis
            'rounded-none': !rounded, // Coins carrés
            'p-6': padding === 'p-6',  // Padding personnalisé
            'm-6': margin === 'm-6',   // Margin personnalisé
          },
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-2 p-6 bg-white rounded-t-lg border-b-2 border-gray-300',  // Header avec fond blanc et bordure sous le header
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-3xl font-bold text-black', className)}  // Titre noir, plus grand et plus gras
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-md text-gray-600', className)}  // Description en gris foncé
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-2 bg-white', className)} {...props} />  // Contenu avec fond blanc
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between p-6 bg-white rounded-b-lg', className)}  // Footer avec fond blanc
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};

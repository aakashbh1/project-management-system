import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = false,
    onClick
}) => {
    const hoverStyles = hover ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : '';

    return (
        <div
            className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 ${hoverStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

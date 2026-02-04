'use client';

import { ReactNode } from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface CalloutProps {
    type?: 'info' | 'warning' | 'success';
    children: ReactNode;
}

export function Callout({ type = 'info', children }: CalloutProps) {
    const styles = {
        info: 'bg-secondary/50 border-secondary text-secondary-foreground',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
        success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
    };

    const icons = {
        info: Info,
        warning: AlertTriangle,
        success: CheckCircle,
    };

    const Icon = icons[type];

    return (
        <div className={`border-l-4 p-4 my-4 ${styles[type]}`}>
            <div className="flex">
                <Icon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <div className="prose prose-sm max-w-none dark:prose-invert">
                    {children}
                </div>
            </div>
        </div>
    );
}
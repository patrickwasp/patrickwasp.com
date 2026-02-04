'use client';

import { useState } from 'react';

interface InteractiveCounterProps {
    initialValue?: number;
    title?: string;
}

export function InteractiveCounter({ initialValue = 0, title = 'Counter' }: InteractiveCounterProps) {
    const [count, setCount] = useState(initialValue);

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 my-6 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setCount(count - 1)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                    aria-label="Decrease counter"
                >
                    -
                </button>
                <span className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100 min-w-[3rem] text-center">
                    {count}
                </span>
                <button
                    onClick={() => setCount(count + 1)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                    aria-label="Increase counter"
                >
                    +
                </button>
                <button
                    onClick={() => setCount(initialValue)}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                    aria-label="Reset counter"
                >
                    Reset
                </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This is an interactive component that works without JavaScript initially, but becomes interactive once hydrated.
            </p>
        </div>
    );
}
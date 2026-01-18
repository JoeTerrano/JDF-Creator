
import React from 'react';
import { DocumentIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DocumentIcon className="h-8 w-8 text-primary-500" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Gemini JDF Creator
          </h1>
        </div>
        <p className="hidden md:block text-slate-500 dark:text-slate-400">
          Automated Print Job Setup
        </p>
      </div>
    </header>
  );
};

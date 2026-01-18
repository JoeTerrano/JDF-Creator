
import React from 'react';
import type { JdfData } from '../types';

interface JdfFormProps {
  data: JdfData;
  onDataChange: (updatedData: JdfData) => void;
  fileName?: string;
}

export const JdfForm: React.FC<JdfFormProps> = ({ data, onDataChange, fileName }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumber = ['pageCount', 'width', 'height', 'quantity'].includes(name);
    onDataChange({
      ...data,
      [name]: isNumber ? Number(value) : value,
    });
  };

  return (
    <form className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
        Extracted Job Data
      </h2>
      <p className="text-slate-500 dark:text-slate-400">
        Review and edit the information extracted from <span className="font-medium text-primary-600 dark:text-primary-400">{fileName}</span> before generating the JDF file.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Name */}
        <div>
          <label htmlFor="jobName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Job Name</label>
          <input
            type="text"
            id="jobName"
            name="jobName"
            value={data.jobName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={data.quantity}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        {/* Page Count */}
        <div>
          <label htmlFor="pageCount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Page Count</label>
          <input
            type="number"
            id="pageCount"
            name="pageCount"
            value={data.pageCount}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
        
        {/* Color Intent */}
        <div>
          <label htmlFor="colorIntent" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Color Intent</label>
          <select
            id="colorIntent"
            name="colorIntent"
            value={data.colorIntent}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option>CMYK</option>
            <option>RGB</option>
            <option>Grayscale</option>
            <option>Other</option>
          </select>
        </div>

        {/* Dimensions */}
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Dimensions</label>
            <div className="mt-1 flex items-center space-x-2">
                <input
                    type="number"
                    name="width"
                    value={data.width}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                <span className="text-slate-500 dark:text-slate-400">x</span>
                <input
                    type="number"
                    name="height"
                    value={data.height}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                <select
                    name="units"
                    value={data.units}
                    onChange={handleChange}
                    className="block w-auto pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                    <option value="points">points</option>
                    <option value="inches">inches</option>
                    <option value="mm">mm</option>
                </select>
            </div>
        </div>


        {/* Paper Type */}
        <div className="md:col-span-2">
          <label htmlFor="paperType" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Paper Type / Media</label>
          <input
            type="text"
            id="paperType"
            name="paperType"
            value={data.paperType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="e.g., 100lb Gloss Coated Text"
          />
        </div>

        {/* Finishing Instructions */}
        <div className="md:col-span-2">
          <label htmlFor="finishingInstructions" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Finishing Instructions</label>
          <textarea
            id="finishingInstructions"
            name="finishingInstructions"
            value={data.finishingInstructions}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="e.g., Trim to size, fold in half, saddle stitch"
          />
        </div>
      </div>
    </form>
  );
};

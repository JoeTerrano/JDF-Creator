
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PdfUploader } from './components/PdfUploader';
import { JdfForm } from './components/JdfForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import type { JdfData } from './types';
import { analyzePdfForJdf } from './services/geminiService';
import { generateJdfXml } from './services/jdfService';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [jdfData, setJdfData] = useState<JdfData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setJdfData(null);
    setPdfFile(file);

    try {
      const base64Pdf = await fileToBase64(file);
      const extractedData = await analyzePdfForJdf(base64Pdf, file.name);
      setJdfData(extractedData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during PDF analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleDataChange = (updatedData: JdfData) => {
    setJdfData(updatedData);
  };

  const handleGenerateJdf = () => {
    if (!jdfData) return;

    try {
      const xmlString = generateJdfXml(jdfData);
      const blob = new Blob([xmlString], { type: 'application/vnd.cip4-jdf+xml;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const fileName = jdfData.jobName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `${fileName || 'job'}.jdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to generate JDF file.');
    }
  };

  const handleReset = () => {
    setJdfData(null);
    setPdfFile(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {!jdfData && !isLoading && (
            <PdfUploader onFileSelect={handleFileSelect} disabled={isLoading} />
          )}

          {isLoading && (
            <div className="text-center p-8">
              <LoadingSpinner />
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Analyzing PDF... this may take a moment.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
              <button
                onClick={handleReset}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {jdfData && !isLoading && (
            <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6 md:p-8 transition-all duration-500 ease-in-out">
              <JdfForm data={jdfData} onDataChange={handleDataChange} fileName={pdfFile?.name} />
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                 <button
                  onClick={handleGenerateJdf}
                  className="w-full sm:w-auto flex-grow justify-center inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Generate JDF File
                </button>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto justify-center inline-flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

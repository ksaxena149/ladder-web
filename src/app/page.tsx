'use client';

import { useState, useEffect } from 'react';
import BillList from '@/components/BillList';
import BillView from '@/components/BillView';
import { Bill } from '@/types';
import bills from '@/data/bills.json';

export default function Home() {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [billsData, setBillsData] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load bills data
  useEffect(() => {
    try {
      // Sort bills by publication date (newest first)
      const sortedBills = [...bills].sort((a, b) => {
        return new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime();
      });
      
      setBillsData(sortedBills);
      setLoading(false);
    } catch (err) {
      console.error('Error loading bills data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setLoading(false);
    }
  }, []);
  
  const handleSelectBill = (bill: Bill) => {
    setSelectedBill(bill);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center p-6 bg-gray-800 rounded-lg max-w-md">
          <h2 className="text-xl text-red-500 mb-4">Error Loading Bills</h2>
          <p className="text-white mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <main className="flex flex-col min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Ladder</h1>
        <p className="text-gray-400">Browse, view, and chat about government bills and gazettes</p>
      </header>
      
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Bill List */}
        <div className="md:col-span-1 bg-gray-800 rounded-lg p-4 overflow-hidden">
          <BillList
            bills={billsData}
            selectedBillId={selectedBill?.id || null}
            onSelectBill={handleSelectBill}
            itemsPerPage={10}
          />
        </div>
        
        {/* Bill View */}
        <div className="md:col-span-2 overflow-hidden">
          <BillView selectedBill={selectedBill} />
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>© 2025 Ladder - Government Bill Browse and Chat Application</p>
      </footer>
    </main>
  );
}

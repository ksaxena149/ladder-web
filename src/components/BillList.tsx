'use client';

import { useState } from 'react';
import { Bill } from '@/types';
import { formatDate } from '@/utils/api';

interface BillListProps {
  bills: Bill[];
  selectedBillId: string | null;
  onSelectBill: (bill: Bill) => void;
  itemsPerPage: number;
}

export default function BillList({ bills, selectedBillId, onSelectBill, itemsPerPage = 10 }: BillListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(bills.length / itemsPerPage);
  
  // Get current bills for pagination
  const indexOfLastBill = currentPage * itemsPerPage;
  const indexOfFirstBill = indexOfLastBill - itemsPerPage;
  const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-white">Government Bills</h2>
      
      <div className="flex-grow overflow-y-auto">
        <ul className="space-y-3">
          {currentBills.map((bill) => (
            <li key={bill.id}>
              <button
                onClick={() => onSelectBill(bill)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedBillId === bill.id
                    ? 'bg-primary border-2 border-primary-light'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                aria-selected={selectedBillId === bill.id}
              >
                <div className="font-medium text-white">{bill.title}</div>
                <div className="text-sm text-gray-400">
                  Published: {formatDate(bill.publication_date)}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          Previous
        </button>
        
        <div className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
        
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
} 
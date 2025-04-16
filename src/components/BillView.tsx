'use client';

import { Bill } from '@/types';
import PdfViewer from './PdfViewer';
import ChatInterface from './ChatInterface';

interface BillViewProps {
  selectedBill: Bill | null;
}

export default function BillView({ selectedBill }: BillViewProps) {
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-full">
        <PdfViewer pdfUrl={selectedBill?.pdf_url ?? null} />
      </div>
      <div className="h-full">
        <ChatInterface selectedBill={selectedBill} />
      </div>
    </div>
  );
} 
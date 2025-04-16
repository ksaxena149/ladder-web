'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  pdfUrl: string | null;
}

export default function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
  }

  function onDocumentLoadError(err: Error) {
    setError(err);
    setLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => {
      const nextPageNumber = prevPageNumber + offset;
      if (nextPageNumber >= 1 && numPages !== null && nextPageNumber <= numPages) {
        return nextPageNumber;
      }
      return prevPageNumber;
    });
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.2, 2.0));
  }

  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.6));
  }

  if (!pdfUrl) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-800 rounded-lg">
        <p className="text-gray-400">Select a bill to view its PDF</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg p-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={zoomOut}
            className="px-2 py-1 bg-gray-700 rounded text-white"
            aria-label="Zoom out"
          >
            -
          </button>
          <span className="text-white">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            className="px-2 py-1 bg-gray-700 rounded text-white"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className="px-2 py-1 bg-gray-700 rounded text-white disabled:opacity-50"
            aria-label="Previous page"
          >
            ←
          </button>
          <span className="text-white">{pageNumber} of {numPages || '--'}</span>
          <button
            onClick={nextPage}
            disabled={numPages === null || pageNumber >= numPages}
            className="px-2 py-1 bg-gray-700 rounded text-white disabled:opacity-50"
            aria-label="Next page"
          >
            →
          </button>
        </div>
      </div>
      
      {/* PDF Document */}
      <div className="flex-grow overflow-auto">
        {loading && (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="h-full flex items-center justify-center">
            <p className="text-red-500">Failed to load PDF. Please try again.</p>
          </div>
        )}
        
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="animate-pulse">Loading PDF...</div>}
          className="flex justify-center"
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            renderTextLayer={true} 
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
      </div>
    </div>
  );
} 
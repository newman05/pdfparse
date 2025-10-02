'use client'

import dynamic from 'next/dynamic';

const PdfRenderer = dynamic(() => import('./PdfRenderer'), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-white rounded-md shadow flex items-center justify-center h-screen">
      <p className="text-gray-500">Loading PDF...</p>
    </div>
  ),
});

export default PdfRenderer;
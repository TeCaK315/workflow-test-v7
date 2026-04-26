'use client';

import React, { useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: '#09090b' }}>
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b md:hidden" style={{ background: '#09090b', borderColor: '#6d5cff20' }}>
        <button onClick={() => setSidebarOpen(true)} style={{ color: '#fafafa' }}>
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-lg font-bold font-heading" style={{ color: '#fafafa' }}>workflow-test-v7</span>
        <div className="w-6" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full" style={{ background: '#09090b' }}>
            <button
              className="absolute top-4 right-4 p-1"
              onClick={() => setSidebarOpen(false)}
              style={{ color: '#fafafa50' }}
            >
              <X className="w-5 h-5" />
            </button>
            <DashboardNav onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <DashboardNav />
      </div>

      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

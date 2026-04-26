'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import InteractiveWizard from '@/components/InteractiveWizard';

const STEPS = [
  {
    "title": "Upload the JSON log of the integration error",
    "description": "Upload interface with drag-and-drop functionality"
  },
  {
    "title": "Receive analysis and suggested patch",
    "description": "Display of analysis results and suggested fixes"
  }
];

export default function CreatePage() {
  const router = useRouter();

  function handleComplete(answers: Record<string, string>) {
    try {
      const id = 'workflow-test-v7_' + Date.now();
      const payload = { id, answers, created_at: new Date().toISOString() };
      const HISTORY_KEY = 'workflow-test-v7_history';
      const list = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      list.unshift(payload);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 100)));
      router.push('/dashboard/history');
    } catch {
      router.push('/dashboard');
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-xl transition-all hover:bg-white/[0.06]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Create</h1>
            <p className="text-xs mt-0.5 opacity-60">Step-by-step setup</p>
          </div>
        </div>

        <InteractiveWizard steps={STEPS} onComplete={handleComplete} />
      </div>
    </div>
  );
}

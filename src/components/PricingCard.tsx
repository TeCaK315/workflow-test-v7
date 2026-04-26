'use client';

import { Check, Loader2 } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: number;
  features: string[];
}

interface PricingCardProps {
  plan: PricingPlan;
  isCurrentPlan: boolean;
  onUpgrade: () => void;
  loading?: boolean;
  highlighted?: boolean;
}

export default function PricingCard({ plan, isCurrentPlan, onUpgrade, loading, highlighted }: PricingCardProps) {
  const isPro = plan.name.toLowerCase() === 'pro';

  return (
    <div
      className={`relative rounded-2xl border p-6 flex flex-col transition-all hover:scale-[1.02] ${
        isPro || highlighted ? 'ring-2' : ''
      }`}
      style={{
        background: '#09090b',
        borderColor: isPro || highlighted ? '#6d5cff' : '#6d5cff40',
        ...(isPro || highlighted ? { boxShadow: '0 0 30px #6d5cff20' } : {}),
      }}
    >
      {(isPro || highlighted) && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #6d5cff, #a78bfa)' }}
        >
          POPULAR
        </div>
      )}

      <h3 className="text-xl font-heading font-bold mb-2" style={{ color: '#fafafa' }}>
        {plan.name}
      </h3>

      <div className="mb-6">
        <span className="text-4xl font-bold" style={{ color: '#fafafa' }}>
          ${plan.price === 0 ? 'Free' : `$${plan.price}`}
        </span>
        {plan.price > 0 && (
          <span className="text-sm ml-1" style={{ color: '#fafafa70' }}>/month</span>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#6d5cff' }} />
            <span className="text-sm" style={{ color: '#fafafa80' }}>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onUpgrade}
        disabled={isCurrentPlan || loading}
        className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
        style={{
          background: isCurrentPlan ? '#6d5cff20' : '#6d5cff',
          color: isCurrentPlan ? '#fafafa70' : 'white',
        }}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : plan.price === 0 ? (
          'Downgrade'
        ) : (
          'Upgrade'
        )}
      </button>
    </div>
  );
}

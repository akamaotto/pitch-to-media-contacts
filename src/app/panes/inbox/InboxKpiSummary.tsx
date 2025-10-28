import React, { useState, useEffect } from 'react';
import { Check, Eye, Mail, Users, AlertTriangle } from 'lucide-react';
import { LoadingState, ErrorBoundary, Alert } from '../../../components/ui';
import KPICard from '../../../components/ui/KPICard';

export type InboxKpis = {
  totalPitchesSent: number;
  repliesReceived: number;
  unreadReplies: number;
  openRate: string;
};

export const InboxKpiSummary = React.memo(({ totalPitchesSent, repliesReceived, unreadReplies, openRate }: InboxKpis) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate loading state for KPI data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    
    // Simulate retry
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-2 md:grid-cols-4 md:gap-4 lg:gap-4 xl:grid-cols-4 xl:gap-4">
        <LoadingState type="kpi" />
        <LoadingState type="kpi" />
        <LoadingState type="kpi" />
        <LoadingState type="kpi" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-danger" />
          <span className="text-sm text-danger">{error}</span>
          <button
            onClick={handleRetry}
            className="ml-auto rounded-md border border-border bg-background px-3 py-1 text-sm"
          >
            Try Again
          </button>
        </div>
      </Alert>
    );
  }

  return (
    <ErrorBoundary
      onError={(error) => {
        console.error('InboxKpiSummary error:', error);
        setError('Failed to load KPI data');
      }}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-2 md:grid-cols-4 md:gap-4 lg:gap-4 xl:grid-cols-4 xl:gap-4">
        <KPICard title="Pitches Sent" value={totalPitchesSent} icon={Check} colorClass="text-foreground" />
        <KPICard title="Replies Received" value={repliesReceived} icon={Users} colorClass="text-success" />
        <KPICard title="Unread Replies" value={unreadReplies} icon={Mail} colorClass="text-danger" />
        <KPICard title="Open Rate" value={openRate} icon={Eye} colorClass="text-warning" />
      </div>
    </ErrorBoundary>
  );
});

InboxKpiSummary.displayName = 'InboxKpiSummary';

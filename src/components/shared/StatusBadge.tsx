
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type ClearanceStatus = 'pending' | 'approved' | 'rejected';

interface StatusBadgeProps {
  status: ClearanceStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    color: 'bg-clearance-pending text-white',
    label: 'Pending'
  },
  approved: {
    color: 'bg-clearance-approved text-white',
    label: 'Approved'
  },
  rejected: {
    color: 'bg-clearance-rejected text-white',
    label: 'Rejected'
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];
  
  return (
    <Badge className={cn(config.color, className)}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;

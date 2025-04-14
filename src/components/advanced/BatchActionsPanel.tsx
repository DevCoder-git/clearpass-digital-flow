
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { ClearanceStatus } from '@/components/shared/StatusBadge';

interface BatchActionsPanelProps {
  selectedIds: string[];
  onApproveAll: (ids: string[]) => void;
  onRejectAll: (ids: string[], reason: string) => void;
  onClearSelection: () => void;
}

const BatchActionsPanel: React.FC<BatchActionsPanelProps> = ({
  selectedIds,
  onApproveAll,
  onRejectAll,
  onClearSelection
}) => {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  const handleApproveAll = () => {
    onApproveAll(selectedIds);
    toast.success(`Successfully approved ${selectedIds.length} requests`);
  };
  
  const handleRejectConfirm = () => {
    onRejectAll(selectedIds, rejectReason);
    setIsRejectDialogOpen(false);
    setRejectReason('');
    toast.success(`Successfully rejected ${selectedIds.length} requests`);
  };
  
  if (selectedIds.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 w-full bg-background border-t p-4 z-50 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <span className="font-medium">{selectedIds.length} requests selected</span>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onClearSelection}
        >
          Clear Selection
        </Button>
        
        <Button 
          variant="default" 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={handleApproveAll}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Approve All
        </Button>
        
        <Button 
          variant="destructive" 
          onClick={() => setIsRejectDialogOpen(true)}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Reject All
        </Button>
      </div>
      
      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject {selectedIds.length} Clearance Requests</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting these clearance requests.
              This will be visible to all affected students.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="batch-reason">Rejection Reason</Label>
              <Textarea
                id="batch-reason"
                placeholder="Enter the reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-32"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim()}
            >
              Reject All Requests
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BatchActionsPanel;

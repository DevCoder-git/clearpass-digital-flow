
import React, { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DigitalBadgeProps {
  studentName: string;
  certificateId: string;
}

const badgeShareUrl = (id: string) =>
  `https://clearpass.edu/badge/${id}`;

const DigitalBadge: React.FC<DigitalBadgeProps> = ({
  studentName,
  certificateId,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(badgeShareUrl(certificateId));
    setCopied(true);
    toast.success("Badge link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto my-8 flex flex-col items-center gap-4 bg-blue-50 rounded-xl shadow p-8 max-w-md">
      <Badge variant="blockchain" className="text-lg px-6 py-3 flex items-center gap-2">
        <BadgeCheck size={28} className="text-blue-700 drop-shadow" />
        Clearance Complete
      </Badge>
      <div className="text-center">
        <div className="font-bold text-xl mt-3">{studentName}</div>
        <div className="text-sm text-blue-700">has earned their clearance digital badge!</div>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div>This badge verifies all departmental clearances are completed and blockchain-verified for authenticity.</div>
          <div>Show this badge to employers or institutions as proof of clearance status.</div>
        </div>
        <div className="mt-5 flex flex-col gap-3 items-center">
          <Button
            size="sm"
            variant="outline"
            className="w-full max-w-xs"
            onClick={handleCopy}
          >
            {copied ? "Link Copied!" : "Copy Badge Link"}
          </Button>
          <a
            href={badgeShareUrl(certificateId)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-800 hover:underline text-xs"
          >
            View badge share page
          </a>
        </div>
      </div>
    </div>
  );
};

export default DigitalBadge;

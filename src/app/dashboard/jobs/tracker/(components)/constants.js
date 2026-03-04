import {
  Bookmark,
  Send,
  FileSearch,
  MessageSquare,
  UserCheck,
  CheckCircle,
  Archive,
  LayoutGrid,
} from "lucide-react";

export const FLOW_STAGES = [
  { key: "all", label: "All", icon: LayoutGrid },
  { key: "saved", label: "Saved", icon: Bookmark },
  { key: "applied", label: "Applied", icon: Send },
  { key: "screening", label: "Screening", icon: FileSearch },
  { key: "interview", label: "Interview", icon: MessageSquare },
  { key: "assessment", label: "Assessment", icon: UserCheck },
  { key: "offer", label: "Offer", icon: CheckCircle },
  { key: "decision", label: "Decision", icon: CheckCircle },
  { key: "archived", label: "Archived", icon: Archive },
];

export const STAGE_STATE_MAP = {
  saved: ["pending",  "completed"],
  applied: ["pending", "ghosted", "rejected"],
  screening: ["pending", "completed", "rejected"],
  interview: ["pending",  "completed", "rejected"],
  assessment: ["pending",  "completed", "rejected"],
  offer: ["pending",  "completed", "rejected", "withdrawn"],
  decision: ["pending", "completed", "rejected"],
  archived: ["withdrawn", "rejected"],
};
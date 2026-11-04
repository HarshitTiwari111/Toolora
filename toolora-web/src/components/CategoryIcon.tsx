import {
  BarChart3, Bot, Code2, Headphones, Image as ImageIcon, KanbanSquare, Lock, Mail, Megaphone,
  Mic, Palette, PenLine, Search, Sparkles, Users, Video, Wallet, Workflow, Zap,
} from "lucide-react";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  writing: PenLine,
  coding: Code2,
  "image-generation": ImageIcon,
  video: Video,
  audio: Mic,
  research: Search,
  productivity: Zap,
  marketing: Megaphone,
  chatbots: Bot,
  automation: Workflow,
  "project-management": KanbanSquare,
  crm: Users,
  "email-marketing": Mail,
  analytics: BarChart3,
  "customer-support": Headphones,
  finance: Wallet,
  security: Lock,
  design: Palette,
};

export default function CategoryIcon({ slug, className = "h-5 w-5" }: { slug: string; className?: string }) {
  const Icon = icons[slug] ?? Sparkles;
  return <Icon className={className} />;
}

import {
  BarChart3, BookOpen, Bot, ClipboardCheck, Code2, FileCheck2, Headphones, Image as ImageIcon, LayoutGrid, Lock, Mail,
  Megaphone, Mic, Newspaper, Palette, PenLine, Repeat2, Scale, Search, ShieldCheck, Sparkles, Users, Video, Wallet,
  Workflow, Zap,
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
  "project-management": ClipboardCheck,
  crm: Users,
  "email-marketing": Mail,
  analytics: BarChart3,
  "customer-support": Headphones,
  finance: Wallet,
  security: Lock,
  design: Palette,
  // Section icons (hero banners)
  reviews: FileCheck2,
  compare: Scale,
  alternatives: Repeat2,
  guides: BookOpen,
  blog: Newspaper,
  "ai-tools": Sparkles,
  saas: LayoutGrid,
  search: Search,
  trust: ShieldCheck,
};

export default function CategoryIcon({ slug, className = "h-5 w-5" }: { slug: string; className?: string }) {
  const Icon = icons[slug] ?? Sparkles;
  return <Icon className={className} />;
}

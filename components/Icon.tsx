import type { SVGProps } from "react";
import {
  Activity, ArrowRight, Award, BadgeCheck, BadgePercent, Briefcase, Building2, Cable, Calendar, Check,
  ChevronDown, ChevronLeft, ChevronRight, CircleCheck, CircleHelp, ClipboardList, Clock, Compass, Cpu,
  Droplet, Factory, FileText, Globe, HardHat, Headphones, Headset, House, Info, Lamp, Layers, LayoutGrid,
  Mail, MapPin, Menu, MessageCircle, MessageSquare, Network, Package, PackageCheck, PackageSearch, Phone,
  PhoneCall, Plus, ScrollText, Search, Send, ShieldCheck, SlidersHorizontal, Sparkles, Star, Sun,
  TrendingUp, Truck, Users, Wrench, X, Zap,
  type LucideIcon,
} from "lucide-react";

/* Brand marks were removed from lucide-react; same artwork as lucide's originals. */
function Linkedin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function Youtube(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

const ICONS: Record<string, LucideIcon | ((p: SVGProps<SVGSVGElement>) => React.JSX.Element)> = {
  activity: Activity, "arrow-right": ArrowRight, award: Award, "badge-check": BadgeCheck,
  "badge-percent": BadgePercent, briefcase: Briefcase, "building-2": Building2, cable: Cable,
  calendar: Calendar, check: Check, "chevron-down": ChevronDown, "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight, "circle-check": CircleCheck, "circle-help": CircleHelp,
  "clipboard-list": ClipboardList, clock: Clock, compass: Compass, cpu: Cpu, droplet: Droplet,
  factory: Factory, "file-text": FileText, globe: Globe, "hard-hat": HardHat, headphones: Headphones,
  headset: Headset, house: House, info: Info, lamp: Lamp, layers: Layers, "layout-grid": LayoutGrid,
  linkedin: Linkedin, mail: Mail, "map-pin": MapPin, menu: Menu, "message-circle": MessageCircle,
  "message-square": MessageSquare, network: Network, package: Package, "package-check": PackageCheck,
  "package-search": PackageSearch, phone: Phone, "phone-call": PhoneCall, plus: Plus,
  "scroll-text": ScrollText, search: Search, send: Send, "shield-check": ShieldCheck,
  "sliders-horizontal": SlidersHorizontal, sparkles: Sparkles, star: Star, sun: Sun,
  "trending-up": TrendingUp, truck: Truck, users: Users, wrench: Wrench, x: X, youtube: Youtube, zap: Zap,
};

/** Lucide icon by its kebab-case name (same names the static site used). */
export function Icon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  const Cmp = ICONS[name] || LayoutGrid;
  return <Cmp className={className} strokeWidth={1.75} aria-hidden="true" />;
}

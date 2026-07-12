'use client'
/**
 * Docs icon registry — lucide-react with legacy Icons.* keys for demos and cmd-registry.
 */
import {
  Activity,
  AlertTriangle,
  AppWindow,
  ArrowRight,
  Mail,
  BarChart3,
  Bell,
  Box,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleCheck,
  CircleX,
  ClipboardList,
  Clock,
  Cloud,
  Code,
  Compass,
  Container,
  Copy,
  Cpu,
  CreditCard,
  Database,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  Folder,
  Gauge,
  GitBranch,
  Globe,
  Home,
  Info,
  Key,
  Layers,
  LayoutGrid,
  LayoutTemplate,
  Link,
  Lock,
  LockOpen,
  LogOut,
  Menu,
  Moon,
  Network,
  Package,
  Palette,
  Play,
  Plus,
  Power,
  RefreshCw,
  Rocket,
  Ruler,
  Search,
  Server,
  Settings,
  Shield,
  Star,
  Sun,
  Tag,
  Terminal,
  Thermometer,
  Trash2,
  Type,
  Upload,
  User,
  Wifi,
  X,
  Zap,
} from 'lucide-react'

function icon(Icon) {
  function Wrapped({ size = 18, className = '', strokeWidth = 1.8, ...props }) {
    return <Icon size={size} className={className} strokeWidth={strokeWidth} {...props} />
  }
  return Wrapped
}

function filledDot({ size = 18, className = '', ...props }) {
  return <Circle size={size} className={className} fill="currentColor" strokeWidth={0} {...props} />
}

/** lucide-react@1.17 has no GitHub mark — keep the filled path from the old docs set */
function githubMark({ size = 18, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
      {...props}
    >
      <path d="M12 1.5A10.5 10.5 0 0 0 8.7 22c.5.1.7-.2.7-.5v-1.7c-2.9.6-3.5-1.4-3.5-1.4-.5-1.2-1.2-1.5-1.2-1.5-.9-.6 0-.6 0-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.6.3-1.1.6-1.4-2.3-.3-4.7-1.2-4.7-5.1 0-1.1.4-2 1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.7 5.1.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  )
}

const Icons = {
  home: icon(Home),
  palette: icon(Palette),
  grid: icon(LayoutGrid),
  forms: icon(ClipboardList),
  compass: icon(Compass),
  layers: icon(Layers),
  chart: icon(BarChart3),
  blocks: icon(LayoutTemplate),
  app: icon(AppWindow),
  type: icon(Type),
  ruler: icon(Ruler),
  search: icon(Search),
  sun: icon(Sun),
  moon: icon(Moon),
  check: icon(Check),
  copy: icon(Copy),
  code: icon(Code),
  chevDown: icon(ChevronDown),
  chevRight: icon(ChevronRight),
  chevLeft: icon(ChevronLeft),
  x: icon(X),
  plus: icon(Plus),
  rocket: icon(Rocket),
  server: icon(Server),
  bell: icon(Bell),
  mail: icon(Mail),
  alert: icon(AlertTriangle),
  info: icon(Info),
  checkCircle: icon(CircleCheck),
  xCircle: icon(CircleX),
  cpu: icon(Cpu),
  activity: icon(Activity),
  database: icon(Database),
  settings: icon(Settings),
  user: icon(User),
  logout: icon(LogOut),
  folder: icon(Folder),
  upload: icon(Upload),
  calendar: icon(Calendar),
  filter: icon(Filter),
  download: icon(Download),
  trash: icon(Trash2),
  external: icon(ExternalLink),
  github: githubMark,
  menu: icon(Menu),
  zap: icon(Zap),
  shield: icon(Shield),
  globe: icon(Globe),
  arrowRight: icon(ArrowRight),
  star: icon(Star),
  play: icon(Play),
  refresh: icon(RefreshCw),
  dot: filledDot,
  card: icon(CreditCard),
  check2: icon(CircleCheck),
  eye: icon(Eye),
  eyeOff: icon(EyeOff),
  container: icon(Container),
  branch: icon(GitBranch),
  lock: icon(Lock),
  unlock: icon(LockOpen),
  key: icon(Key),
  thermometer: icon(Thermometer),
  network: icon(Network),
  wifi: icon(Wifi),
  terminal: icon(Terminal),
  cloud: icon(Cloud),
  clock: icon(Clock),
  tag: icon(Tag),
  link: icon(Link),
  package: icon(Package),
  gauge: icon(Gauge),
  power: icon(Power),
  bolt: icon(Zap),
  cube: icon(Box),
}

/** @deprecated Use Icons.* — kept for injected page bundles */
const Ico = icon(Circle)

export { Icons, Ico }

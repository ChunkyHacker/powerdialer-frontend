import {
  Ban,
  CalendarClock,
  ChartNoAxesCombined,
  CircleGauge,
  ListChecks,
  Megaphone,
  Mic,
  PhoneCall,
  ScrollText,
  Settings,
  UserRoundSearch,
  UsersRound,
} from 'lucide-react'

export const mainNavigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: CircleGauge, end: true },
  { label: 'Campaigns', path: '/campaigns', icon: Megaphone, end: true },
  { label: 'Lead Lists', path: '/lead-lists', icon: ListChecks, end: true },
  { label: 'Leads', path: '/leads', icon: UserRoundSearch, end: true },
  { label: 'Dialer', path: '/dialer', icon: PhoneCall, end: true },
  { label: 'Callbacks', path: '/callbacks', icon: CalendarClock, end: true },
  { label: 'Call Logs', path: '/call-logs', icon: ScrollText, end: true },
  { label: 'Recordings', path: '/recordings', icon: Mic, end: true },
  { label: 'Reports', path: '/reports', icon: ChartNoAxesCombined, end: true },
  { label: 'Agents', path: '/agents', icon: UsersRound, end: true },
  { label: 'DNC', path: '/dnc', icon: Ban, end: true },
]

export const bottomNavigationItems = [
  { label: 'Settings', path: '/settings', icon: Settings, end: true },
]

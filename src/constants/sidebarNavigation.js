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
  { label: 'Campaigns', path: '/campaigns', icon: Megaphone, end: false },
  { label: 'Lead Lists', path: '/lead-lists', icon: ListChecks, end: false },
  { label: 'Leads', path: '/leads', icon: UserRoundSearch, end: false },
  { label: 'Dialer', path: '/dialer', icon: PhoneCall, end: false },
  { label: 'Callbacks', path: '/callbacks', icon: CalendarClock, end: false },
  { label: 'Call Logs', path: '/call-logs', icon: ScrollText, end: false },
  { label: 'Recordings', path: '/recordings', icon: Mic, end: false },
  { label: 'Reports', path: '/reports', icon: ChartNoAxesCombined, end: false },
  { label: 'Agents', path: '/agents', icon: UsersRound, end: false },
  { label: 'DNC', path: '/dnc', icon: Ban, end: false },
]

export const bottomNavigationItems = [
  { label: 'Settings', path: '/settings', icon: Settings, end: false },
]

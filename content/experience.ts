export type Role = {
  period: string
  title: string
  organisation: string
  location: string
  summary?: string
  points?: string[]
  current?: boolean
}

/** Brief §4 — six roles, newest first. */
export const experience: Role[] = [
  {
    period: 'Dec 2023 — Present',
    title: 'CIO & Assistant Managing Director',
    organisation: 'Sonali Life Insurance PLC',
    location: 'Dhaka',
    current: true,
    points: [
      'Lead the IT roadmap for the Head Office and 254 branches, aligned with corporate objectives.',
      'Direct data centre operations and the VMware private cloud for high availability and efficient use of resources.',
      'Oversee LAN/WAN, MPLS and routing (OSPF, BGP, EIGRP) for multi-branch connectivity.',
      'Govern information security: firewalls, VPN, IPS and regular vulnerability assessments.',
      'Advise the Board on technology risk; manage key vendors (Cisco, VMware, ISPs).',
    ],
  },
  {
    period: 'Jul 2013 — Nov 2023',
    title: 'System Analyst → Network Admin → System Admin → Head of Project',
    organisation: 'Dragon IT & Communication Ltd.',
    location: 'Dhaka',
    points: [
      'Head of Project: directed ICT strategy, resources and network system development.',
      'System Admin: ran data centre operations, web and mail servers, disaster recovery and secure VPN tunnels.',
      'Network Admin: set access policies, monitoring standards and load balancing.',
      'System Analyst: designed and deployed LAN, WAN, WLAN and server technology across the group.',
      'Helped develop and implement two financial ERP platforms for Life and Non-Life insurance.',
    ],
  },
  {
    period: 'Nov 2011 — May 2013',
    title: 'Network Engineer',
    organisation: 'City of London Academy',
    location: 'London, UK',
    summary:
      'Built the campus Layer 2 network (VLANs, VTP, EtherChannel) with Port Security and 802.1X, and taught hands-on labs in routing, switching, firewalls and Active Directory.',
  },
  {
    period: 'Jan 2011 — May 2011',
    title: 'IT Support Engineer',
    organisation: 'London Broadcasting Corp. Ltd.',
    location: 'London, UK',
    summary:
      'Active Directory identity and access management, VLAN segmentation, and firewall and antivirus hardening.',
  },
  {
    period: 'Sep 2010 — Dec 2010',
    title: 'Desktop Support Engineer',
    organisation: 'Lemon Technologies Ltd.',
    location: 'London, UK',
    summary:
      'Onsite diagnostics, Terminal Services application administration and LAN/WAN fault resolution.',
  },
  {
    period: 'Feb 2007 — Jul 2010',
    title: 'Customer Support Advisor (part-time)',
    organisation: 'Argos Ltd.',
    location: 'London, UK',
    summary: 'SLA-driven CRM and ticketing support while studying, resolving 20+ cases per shift.',
  },
]

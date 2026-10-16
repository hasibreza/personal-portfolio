import type { ExpertiseIconName } from '@/components/ui/icons'

export type Expertise = {
  title: string
  body: string
  short: string
  icon: ExpertiseIconName
  tags?: string[]
  featured?: boolean
}

/** Brief §3 — five expertise areas, Virtualization & Private Cloud first. */
export const expertise: Expertise[] = [
  {
    title: 'Virtualization & Private Cloud',
    body: 'VMware vSphere design and administration, server consolidation, high-availability clusters, enterprise storage and resource optimization.',
    short:
      'VMware vSphere design and administration, server consolidation, HA clusters, enterprise storage.',
    icon: 'server',
    tags: ['vSphere 8', 'vCenter', 'HA / DRS', 'VCP-DCV'],
    featured: true,
  },
  {
    title: 'Data Centre & Business Continuity',
    body: 'DC operations, backup and storage strategy, and disaster-recovery design that keeps critical systems available.',
    short: 'DC operations, backup, storage and disaster-recovery design.',
    icon: 'database',
  },
  {
    title: 'Enterprise Networking',
    body: 'LAN/WAN, MPLS, VLAN and EtherChannel across a multi-branch network; OSPF, BGP and EIGRP routing; redundancy and load balancing.',
    short: 'LAN/WAN, MPLS, OSPF, BGP and EIGRP across a multi-branch network.',
    icon: 'network',
  },
  {
    title: 'Cybersecurity & Governance',
    body: 'Firewalls, VPN, IPS, AAA/RADIUS and ACLs; vulnerability assessment and penetration testing; IT policy and regulatory compliance.',
    short: 'Firewalls, VPN, IPS, pen testing, IT policy and compliance.',
    icon: 'shield',
  },
  {
    title: 'Financial ERP, Analytics & AI',
    body: 'Two insurance ERP platforms delivered; SQL-driven business intelligence; applied AI, automation and Agentic AI for enterprise workflows.',
    short: 'Two insurance ERP platforms, SQL-driven BI, applied and Agentic AI.',
    icon: 'chart',
  },
]

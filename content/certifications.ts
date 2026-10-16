export type Certification = {
  code: string
  name: string
  issuer: string
  detail?: string
  year: string
  /** To supply: official Credly / vendor verification link. */
  verifyUrl?: string
  featured?: boolean
}

/** Brief §4 — the eight certifications held, exactly as confirmed by Hasib. */
export const certifications: Certification[] = [
  {
    code: 'VCP-DCV · vSphere 8',
    name: 'VMware Certified Professional — Data Center Virtualization',
    issuer: 'VMware by Broadcom',
    detail: 'The credential behind my private cloud specialism',
    year: '2024',
    featured: true,
  },
  { code: 'RHCE · EX294', name: 'Red Hat Certified Engineer', issuer: 'Red Hat', year: '2026' },
  { code: 'CEH', name: 'Certified Ethical Hacker', issuer: 'EC-Council', year: '2018' },
  {
    code: 'CCNP R&S',
    name: 'CCNP Routing & Switching',
    issuer: 'Cisco',
    detail: 'ROUTE, SWITCH, TSHOOT',
    year: '2016–2019',
  },
  { code: 'MCT', name: 'Microsoft Certified Trainer', issuer: 'Microsoft', year: '2014' },
  {
    code: 'CCNA',
    name: 'Cisco Certified Network Associate',
    issuer: 'Cisco',
    detail: 'ICND1, ICND2',
    year: '2012–2013',
  },
  { code: 'MCP', name: 'Microsoft Certified Professional', issuer: 'Microsoft', year: '2010' },
  {
    code: 'MCSA',
    name: 'MCSA — Windows Server 2008',
    issuer: 'Microsoft',
    detail: '70-640, 70-642, 70-646',
    year: '2009–2010',
  },
]

/** Training — shown as training, never as certifications (brief §4). */
export const training: { label: string; highlight?: boolean }[] = [
  { label: 'RHCA track — 3 of 8 exams completed', highlight: true },
  { label: 'Intelligent Automation with Robotics & AI' },
  { label: 'AI in Marketing' },
  { label: 'Analytics using Excel' },
  { label: 'Azure Cloud Computing' },
  { label: 'Server Administration using Hyper-V' },
  { label: 'Ethical Hacking' },
  { label: 'Vulnerability Assessment using Kali' },
  { label: 'CISSP (training)' },
  { label: 'Cisco T-Shoot' },
  { label: 'MCSE (training)' },
]

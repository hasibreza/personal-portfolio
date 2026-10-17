/** Fixed filter areas for case studies (used by /work chips and the admin editor). */
export const workAreas = [
  'Private Cloud',
  'Data Centre & DR',
  'Networking',
  'Security',
  'ERP & AI',
] as const
export type WorkArea = (typeof workAreas)[number]

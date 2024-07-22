const REG_DOMAINS =
  'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Domains';

const DOMAINS = [
  {
    id: 0,
    name: 'Налоговый портал',
    domains: [
      { id: 0, domain: 'gov.by', values: ['*.nalog', '*.nalog'] },
      {
        id: 1,
        domain: 'nalog.gov.by',
        values: ['https://iplk.portal', 'https://lkfl.portal', 'https://www.portal'],
      },
    ],
  },
  {
    id: 1,
    name: 'Cчета фактуры',
    domains: [{ id: 0, domain: 'vat.gov.by', values: [] }],
  },
  {
    id: 2,
    name: 'ФСЗН',
    domains: [
      { id: 0, domain: 'nces.by', values: ['*.usd'] },
      { id: 1, domain: 'ssf.gov.by', values: ['*.portal2'] },
    ],
  },
];

module.exports = {
  REG_DOMAINS,
  DOMAINS,
};

const REG_DOMAINS =
  'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Domains';

const TRUSTED_SITES_ZONE =
  'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2';

const REG_IE_START_PAGE = 'HKCU\\Software\\Microsoft\\Internet Explorer\\Main';

const REG_IE_POPUP_BLOCKER = 'HKCU\\Software\\Microsoft\\Internet Explorer\\New Windows';

const REG_IE_INTRANET_COMPATIBILITY =
  'HKCU\\Software\\Microsoft\\Internet Explorer\\BrowserEmulation';

const REG_IE_MSCOMPATIBILITY = 'HKCU\\Software\\Microsoft\\Internet Explorer\\BrowserEmulation';

const DOMAINS = [
  {
    id: 0,
    name: 'Налоговый портал',
    url: 'https://www.portal.nalog.gov.by/eds1',
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
    url: 'http://vat.gov.by/mainPage/',
    domains: [{ id: 0, domain: 'vat.gov.by', values: [] }],
  },
  {
    id: 2,
    name: 'ФСЗН',
    url: 'http://portal2.ssf.gov.by/mainPage/',
    domains: [
      { id: 0, domain: 'nces.by', values: ['*.usd'] },
      { id: 1, domain: 'ssf.gov.by', values: ['*.portal2'] },
    ],
  },
  {
    id: 3,
    name: 'Электронный респондент',
    url: 'http://e-respondent.belstat.gov.by/belstat/',
    domains: [{ id: 0, domain: 'e-respondent.belstat.gov.by', values: [] }],
  },
  {
    id: 4,
    name: 'НАЦ Банк (Портал валютных договоров)',
    url: 'http://rvd.nbrb.by/nbrbResidentUi/#/',
    domains: [
      { id: 0, domain: 'raschet.by', values: ['*.legal', '*.ilegal', '*.oauth', '*.ioauth'] },
      { id: 1, domain: 'nbrb.by', values: ['*.rvd'] },
    ],
  },
  {
    id: 5,
    name: 'Центр по налогам и сборам (СККО)',
    url: 'https://lk.skko.by/',
    domains: [
      { id: 0, domain: 'skko.by', values: ['*.lk'] },
      { id: 1, domain: 'support.skno.by', values: [] },
    ],
  },
];

/* 
----Regedit params -----
0 - Enable
1 - Suggest
3-  Disable
*/

const ACTIVE_X_OPTIONS = {
  1001: 'ActiveX controls and plug-ins: Download signed ActiveX controls',
  1004: 'ActiveX controls and plug-ins: Download unsigned ActiveX controls',
  1200: 'ActiveX controls and plug-ins: Run ActiveX controls and plug-ins',
  1201: 'ActiveX controls and plug-ins: Initialize and script ActiveX controls not marked as safe for scripting',
  1208: 'ActiveX controls and plug-ins: Allow previously unused ActiveX controls to run without prompt',
  1209: 'ActiveX controls and plug-ins: Allow Scriptlets',
  '120A': 'ActiveX controls and plug-ins: Override Per-Site (domain-based) ActiveX restrictions',
  '120B': 'ActiveX controls and plug-ins: Override Per-Site (domain-based) ActiveX restrict ions',
  1405: 'ActiveX controls and plug-ins: Script ActiveX controls marked as safe for scripting',
  2000: 'ActiveX controls and plug-ins: Binary and script behaviors',
  2201: 'ActiveX controls and plug-ins: Automatic prompting for ActiveX controls',
  2702: 'ActiveX controls and plug-ins: Allow ActiveX Filtering',
  '270C': 'ActiveX Controls and plug-ins: Run Antimalware software on ActiveX controls',
};

module.exports = {
  REG_DOMAINS,
  DOMAINS,
  ACTIVE_X_OPTIONS,
  TRUSTED_SITES_ZONE,
  REG_IE_START_PAGE,
  REG_IE_POPUP_BLOCKER,
  REG_IE_INTRANET_COMPATIBILITY,
  REG_IE_INTRANET_COMPATIBILITY,
};

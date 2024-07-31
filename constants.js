const REG_DOMAINS =
  'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Domains';
const REG_SECURE_PROTOCOLS =
  'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings';
const TRUSTED_SITES_ZONE =
  'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2';
const REG_IE_START_PAGE = 'HKCU\\Software\\Microsoft\\Internet Explorer\\Main';
const REG_IE_POPUP_BLOCKER = 'HKCU\\Software\\Microsoft\\Internet Explorer\\New Windows';
const REG_IE_INTRANET_COMPATIBILITY =
  'HKCU\\Software\\Microsoft\\Internet Explorer\\BrowserEmulation';
const REG_IE_MSCOMPATIBILITY = 'HKCU\\Software\\Microsoft\\Internet Explorer\\BrowserEmulation';
const AVEST_URL = 'https://nces.by/wp-content/uploads/gossuok/AvPKISetup(bel).zip';
const TORRENT_URL_OFFICE =
  'magnet:?xt=urn:btih:2678550B722624B4D0F614197758525936507C2A&tr=http%3A%2F%2Fbt2.t-ru.org%2Fann%3Fmagnet&dn=Microsoft%20Office%202016-2019%20Professional%20Plus%20%2F%20Standard%20%2B%20Visio%20%2B%20Project%2016.0.12527.22105%20(2022.03)%20(W%207-W%2011)%20RePack%20by%20KpoJIuK%20%5BMulti%2FRu%5D';
const TORRENT_URL_ACROBAT =
  'magnet:?xt=urn:btih:50FD84BC108C0F82265B13F7C95C303C8F4D70B6&tr=http%3A%2F%2Fbt3.t-ru.org%2Fann%3Fmagnet&dn=Adobe%20Acrobat%20Pro%20DC%202021.001.20149%20RePack%20by%20KpoJIuK%20%5B2021%2CMulti%2FRu%5D';
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

const PROGRAMM = {
  avest: { id: 0, name: 'Скачать Авест', url: AVEST_URL },
  office: { id: 1, name: 'Скачать Офис(2016-2019)', url: TORRENT_URL_OFFICE },
  acrobat: { id: 2, name: 'Скачать Acrobat Reader (2021)', url: TORRENT_URL_ACROBAT },
};

module.exports = {
  REG_DOMAINS,
  DOMAINS,
  ACTIVE_X_OPTIONS,
  TRUSTED_SITES_ZONE,
  REG_IE_START_PAGE,
  REG_IE_POPUP_BLOCKER,
  REG_IE_INTRANET_COMPATIBILITY,
  REG_IE_MSCOMPATIBILITY,
  REG_SECURE_PROTOCOLS,
  TORRENT_URL_OFFICE,
  AVEST_URL,
  PROGRAMM,
};

const { REG_DOMAINS, REG_IE_START_PAGE } = require('../constants');
const RegistryMapper = require('../mappers/RegistryMapper');

class PortalService {
  constructor(portalRepository, registryRepository) {
    this.portalRepository = portalRepository;
    this.registryRepository = registryRepository;
  }

  async getCheckedPortals() {
    const allPortals = await this.portalRepository.getAllPortals();
    return allPortals.filter((portal) => portal.isChecked);
  }

  async onCreateEntity(name, ...values) {
    try {
      const keys = [`${REG_DOMAINS}\\${name}`];
      const subkeys =
        values.length > 0 ? values.map((key) => `${REG_DOMAINS}\\${name}\\${key}`) : [];
      const regKeys = subkeys.length > 0 ? [...keys, ...subkeys] : keys;
      const regInsertedKeys = subkeys.length > 0 ? subkeys : keys;
      await this.registryRepository.createKey([...regKeys]);
      for (const insertedKey of regInsertedKeys) {
        const inputData = {
          key: insertedKey,
          name: '*',
          value: 2,
          type: 'REG_DWORD',
        };
        const regValue = RegistryMapper.toRegistry(inputData);
        await this.registryRepository.updateValueByName(regValue);
      }
      console.log('Operation finished successfull');
    } catch (error) {
      console.error('Error settins into regestier', error);
    }
  }

  async addToFavorites(nameSite, siteUrl) {
    const favoritesPath = path.join(os.homedir(), 'Favorites', `${nameSite}.url`);
    const favoritesBarPath = path.join(os.homedir(), 'Favorites', 'Links', `${nameSite}.url`);
    try {
      const urlFileContent = `[InternetShortcut]\r\nURL=${siteUrl}\r\nIconFile=https://www.google.com/favicon.ico\r\nIconIndex=0\r\n`;
      fs.writeFileSync(favoritesPath, urlFileContent);
      fs.writeFileSync(favoritesBarPath, urlFileContent);
      console.log('site success addedd');
    } catch (err) {
      console.error('err', err);
    }
  }

  async addSiteToStartPage(siteUrl) {
    try {
      const ieMainKey = await regedit.list(REG_IE_START_PAGE);
      const keyValue = `Secondary Start Pages`;
      const sites1 = ieMainKey[REG_IE_START_PAGE].values['Secondary Start Pages'];
      const inputData = {
        key: REG_IE_START_PAGE,
        name: keyValue,
        value: [...sites1.value, siteUrl],
        type: 'REG_MULTI_SZ',
      };

      const regValue = RegistryMapper.toRegistry(inputData);
      await this.registryRepository.updateValueByName(regValue);
    } catch (err) {
      console.log('error', err);
    }
    console.log('sited add to start page succsessfull');
  }

  async applySettings(formValues) {
    const checkedPortals = await this.getCheckedPortals(formValues);
    for (const portal of checkedPortals) {
      await this.addSiteToStartPage(portal.url);
      await this.addToFavorites(portal.name, portal.url);
      for (const domain of portal.domains) {
        await this.onCreateEntity(domain.name, ...domain.values);
      }
    }
  }
}

module.exports = PortalService;

const RegistryMapper = require('../mappers/RegistryMapper');

class RegisrtyService {
  constructor(registryRepository) {
    this.registryRepository = registryRepository;
  }

  async onChangeRegistryRule(registry) {
    try {
      for (const keyRegItem in registry) {
        await this.registryRepository.updateValueByName(registry[keyRegItem]);
      }
    } catch (err) {
      throw 'Ошибка настроек правил!';
    }
  }

  async disableAllActiveXRules(options) {
    const { TRUSTED_SITES_ZONE } = this.registryRepository.registry;
    try {
      const activeValues = Object.keys(options);
      for (const activeValue of activeValues) {
        let value = activeValue === '2702' || activeValue === '120B' ? 3 : 0;
        const inputData = {
          key: TRUSTED_SITES_ZONE.key,
          name: activeValue,
          value: value,
          type: 'REG_DWORD',
        };
        const regValue = RegistryMapper.toRegistry(inputData);
        await this.registryRepository.updateValueByName(regValue);
      }
    } catch (error) {
      console.error('Error settins into regestier', error);
    }
  }
}

module.exports = RegisrtyService;

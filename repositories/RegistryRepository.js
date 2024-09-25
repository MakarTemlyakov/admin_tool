const Registery = require('../models/Registry');
const regedit = require('regedit').promisified;

class RegistryRepository {
  constructor(registry) {
    this.registry = registry;
  }

  async createKey(keys) {
    await regedit.createKey([...keys]);
  }

  async updateValueByName(registry) {
    const value = {
      [registry.key]: {
        [registry.subkey.name]: { value: registry.subkey.value, type: registry.subkey.type },
      },
    };
    await regedit.putValue(value);
  }

  async getAllRegistryItems() {
    return this.registry;
  }
}

module.exports = RegistryRepository;

const RegistryItem = require('./RegistryItem');

class Registery {
  constructor({ key, subkey }) {
    this.key = key;
    this.subkey = new RegistryItem({ name: subkey.name, value: subkey.value, type: subkey.type });
  }
}

module.exports = Registery;

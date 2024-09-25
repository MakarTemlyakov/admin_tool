const Registery = require('../models/Registry');
const RegistryItem = require('../models/RegistryItem');

class RegistryMapper {
  static toRegistry(data) {
    const regItem = this.toRegItem(data);
    const reg = new Registery({
      key: data.key,
      subkey: regItem,
    });
    return reg;
  }

  static toRegItem(data) {
    const { name, value, type } = data;
    return new RegistryItem({ name, value, type });
  }
}

module.exports = RegistryMapper;

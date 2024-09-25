const Domain = require('./Domain');
class Portal {
  constructor({ id, name, url, isChecked, domains }) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.isChecked = isChecked;
    this.domains = domains.map(
      (domain) => new Domain({ id: domain.id, name: domain.name, values: domain.values }),
    );
  }
}

module.exports = Portal;

const Domain = require('./Domain');
class Portal {
  constructor(id, name, url, domains, isChecked) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.isChecked = isChecked;
    this.domains = domains.map((domain) => new Domain(domain.id, domain.name, domain.values));
  }
}

module.exports = Portal;

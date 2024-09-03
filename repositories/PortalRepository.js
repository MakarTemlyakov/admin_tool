const Portal = require('../models/Portal');

class PortalRepository {
  constructor(domains) {
    this.domains = domains;
  }

  getAllPortals() {
    return this.domains.map(
      (domain) => new Portal(domain.id, domain.name, domain.url, domain.domains, domain.isChecked),
    );
  }
}

module.exports = PortalRepository;

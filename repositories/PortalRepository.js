const Portal = require('../models/Portal');

class PortalRepository {
  constructor(domains) {
    this.domains = domains;
  }
  getAllPortals() {
    return this.domains.map(
      (domain) =>
        new Portal({
          id: domain.id,
          name: domain.name,
          url: domain.url,
          isChecked: domain.isChecked,
          domains: domain.domains,
        }),
    );
  }
}

module.exports = PortalRepository;

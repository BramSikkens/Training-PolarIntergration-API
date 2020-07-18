// Container where I put services and can get them from
class Container {
  private services: any;
  constructor() {
    this.services = {};
  }

  service(name: string, cb: any) {
    Object.defineProperty(this, name, {
      configurable: true,
      enumerable: true,
      get: () => {
        if (!this.services.hasOwnProperty(name)) {
          this.services[name] = cb(this);
        }
        return this.services[name];
      },
    });
  }
}

export default Container;

import Request from './Request';

class Get extends Request {
  constructor() {
    super();
  }

  async connectedCallback() {
    console.log(await this.fetch());
  }
}

customElements.define('cc-get', Get);

import BaseElement from '../../base/BaseElement';

export default class Request extends BaseElement {
  constructor() {
    super();
  }

  async fetch() {
    const request = await fetch(this.props.url);
    const response = await request.json();
    return response;
  }
}

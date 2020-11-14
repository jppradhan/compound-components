export default class BaseElement extends HTMLElement {
  constructor() {
    super();
  }

  get props() {
    this._props ||= [...this.attributes].reduce((curr, next) => {
      return { ...curr, [next.name]: next.value };
    }, {});
    return this._props;
  }
}

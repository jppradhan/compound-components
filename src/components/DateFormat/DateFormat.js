const sheet = new CSSStyleSheet();

sheet.replaceSync(`
`);

class DateFormat extends HTMLElement {
  constructor() {
    super();
  }

  set date(d) {
    this._date = new Date(d);
  }

  get date() {
    return this._date;
  }

  get format() {
    return this.getAttribute('format');
  }

  get formattedDate() {
    if (this.format === 'DD/MM/YYYY') {
      return this.date.toLocaleDateString();
    }
    return this.date.toLocaleDateString();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [sheet];

    this.element = document.createElement('div');
    shadow.appendChild(this.element);
    this.date = this.getAttribute('value');
    this.element.innerHTML = this.formattedDate;
  }
}

customElements.define('cc-date-format', DateFormat);

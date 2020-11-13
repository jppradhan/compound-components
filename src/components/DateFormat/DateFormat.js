const sheet = new CSSStyleSheet();
const DEFAULT_LOCALE = 'en-GB';

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

  get locale() {
    return this.getAttribute('locale') || DEFAULT_LOCALE;
  }

  get formattedDate() {
    if (this.date == 'Invalid Date') {
      return 'Invalid Date';
    }
    return new Intl.DateTimeFormat(this.locale, this.formatOptions).format(
      this.date,
    );
  }

  get formatOptions() {
    let options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    if (this.getAttribute('day')) {
      options['day'] = this.getAttribute('day');
    }
    if (this.getAttribute('month')) {
      options['month'] = this.getAttribute('month');
    }
    if (this.getAttribute('year')) {
      options['year'] = this.getAttribute('year');
    }
    return options;
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

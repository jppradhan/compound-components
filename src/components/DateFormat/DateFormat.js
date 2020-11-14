import BaseElement from '../../base/BaseElement';

const sheet = new CSSStyleSheet();
const DEFAULT_LOCALE = 'en-GB';

sheet.replaceSync(`
`);

class DateFormat extends BaseElement {
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
  // sometimes even the US needs 24-hour time
  // options = {
  //   year: 'numeric', month: 'numeric', day: 'numeric',
  //   hour: 'numeric', minute: 'numeric', second: 'numeric',
  //   hour12: false,
  //   timeZone: 'America/Los_Angeles'
  // };
  get formatOptions() {
    let options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    if (this.props['day']) {
      options['day'] = this.props['day'];
    }
    if (this.props['month']) {
      options['month'] = this.props['month'];
    }
    if (this.props['year']) {
      options['year'] = this.props['year'];
    }
    if (this.props['hour']) {
      options['hour'] = this.props['hour'];
    }
    if (this.props['minute']) {
      options['minute'] = this.props['minute'];
    }
    if (this.props['second']) {
      options['second'] = this.props['second'];
    }
    if (this.props['hour12']) {
      options['hour12'] = this.props['hour12'];
    }
    if (this.props['timeZone']) {
      options['timeZone'] = this.props['timeZone'];
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

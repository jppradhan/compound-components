const ALLOWED_KEYS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  'Backspace',
  'Tab',
  'Enter',
  'Shift',
  'Control',
  'Meta',
  'ArrowLeft',
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'Alt',
];

const sheet = new CSSStyleSheet();

sheet.replaceSync(`
  input {
    border: 0;
    outline: none;
    padding: 10px;
    width: 30%;
    display: inline-block;
  }
  div {
    border: 1px solid #000;
    width: 100%;
  }
  div.focused {
    outline: 1px solid blue;
  }
`);

class TimeCounter extends HTMLElement {
  get html() {
    return `<div>
      <input type="text" placeholder="00" min="0" max="99999999"/>
      <input type="text" placeholder="00" max="59" min="0" />
      <input type="text" placeholder="00" max="59" min="0"/>
    </div>`;
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [sheet];
    this.shadowRoot.innerHTML = this.html;
    this.inputs = [];
  }

  handleFocus(event) {
    event.target.parentNode.classList.add('focused');
  }

  handleFocusOut(event) {
    event.target.parentNode.classList.remove('focused');
  }

  handleKeyDown(event) {
    const value = parseInt(event.target.value);
    const min = event.target.getAttribute('min');
    const max = event.target.getAttribute('max');

    if (!ALLOWED_KEYS.includes(event.key)) {
      event.preventDefault();
      return false;
    }
    if (event.key === 'ArrowUp') {
      if (isNaN(value) || (value < max && value >= 0)) {
        event.target.value = isNaN(value) ? 0 : value + 1;
      }
    }
    if (event.key === 'ArrowDown') {
      if (isNaN(value) || (value > min && value >= 0)) {
        event.target.value = isNaN(value) ? 0 : value - 1;
      }
    }
  }

  bindEvents() {
    this.inputs.forEach((input) => {
      input.addEventListener('focus', this.handleFocus);
      input.addEventListener('focusout', this.handleFocusOut);
      input.addEventListener('keydown', this.handleKeyDown);
    });
  }

  connectedCallback() {
    this.inputs = this.shadowRoot.querySelectorAll('input');
    this.bindEvents();
  }

  disconnectedCallback() {
    this.inputs.forEach((input) => {
      input.removeEventListener('focus', this.handleFocus);
    });
  }
}

customElements.define('time-counter', TimeCounter);

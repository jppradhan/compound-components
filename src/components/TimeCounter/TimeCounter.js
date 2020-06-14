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
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
  }
  div.focused {
    border: 1px solid blue;
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
    this.focusCounter = 0;
  }

  handleFocus(index, event) {
    event.target.parentNode.classList.add('focused');
    this.focusCounter = index;
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
    if (event.key === 'ArrowRight') {
      if (this.focusCounter < 2) {
        this.focusCounter = this.focusCounter + 1;
        this.inputs[this.focusCounter].focus();
      }
    }
    if (event.key === 'ArrowLeft') {
      if (this.focusCounter > 0) {
        this.focusCounter = this.focusCounter - 1;
        this.inputs[this.focusCounter].focus();
      }
    }
  }

  attachEvents() {
    this.inputs.forEach((input, index) => {
      input.addEventListener('focus', this.handleFocus.bind(this, index));
      input.addEventListener('focusout', this.handleFocusOut.bind(this));
      input.addEventListener('keydown', this.handleKeyDown.bind(this));
    });
  }

  connectedCallback() {
    this.inputs = this.shadowRoot.querySelectorAll('input');
    this.attachEvents();
  }

  disconnectedCallback() {
    this.inputs.forEach((input) => {
      input.removeEventListener('focus', this.handleFocus);
    });
  }
}

customElements.define('time-counter', TimeCounter);

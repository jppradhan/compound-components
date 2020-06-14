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
  :host {
    display: block;
    width: 100%;
    position: relative;
  }
  :host * {
    box-sizing: border-box;
  }
  :host input {
    border: 0;
    outline: none;
    padding: 10px;
    width: 32%;
    color: inherit;
    float: left;
    display: inline-block;
    text-align: center;
  }
  :host div {
    border: 1px solid #000;
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
    color: inherit;
    box-sizing: border-box;
    height: 100%;
  }
  :host .focused {
    border: 1px solid blue;
  }
  :host span {
    display: inline-block;
    float: left;
    padding-top: 8px;
    padding-bottom: 8px;
    line-height: 1;
  }
`);

class TimeCounter extends HTMLElement {
  get html() {
    return `<div>
      <input type="text" placeholder="00" min="0" max="99999999"/>
      <span>:</span>
      <input type="text" placeholder="00" max="59" min="0" />
      <span>:</span>
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

  get value() {
    const attrValue = this.getAttribute('value')
      .split(':')
      .map((_value) => parseInt(_value));
    return attrValue;
  }

  set value(inputs) {
    const inputValues = [];
    inputs.forEach((input) => {
      inputValues.push(input.value);
    }, []);
    this.setAttribute('value', inputValues.join(':'));
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
        this.value = this.inputs;
      }
    }
    if (event.key === 'ArrowDown') {
      if (isNaN(value) || (value > min && value >= 0)) {
        event.target.value = isNaN(value) ? 0 : value - 1;
        this.value = this.inputs;
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

  handleChange() {
    this.value = this.inputs;
  }

  attachEvents() {
    this.inputs.forEach((input, index) => {
      input.addEventListener('focus', this.handleFocus.bind(this, index));
      input.addEventListener('focusout', this.handleFocusOut.bind(this));
      input.addEventListener('keydown', this.handleKeyDown.bind(this));
      input.addEventListener('change', this.handleChange.bind(this));
    });
  }

  setInputsValue() {
    this.inputs.forEach((input, index) => {
      input.setAttribute('value', this.value[index]);
    });
  }

  connectedCallback() {
    this.inputs = this.shadowRoot.querySelectorAll('input');
    this.attachEvents();
    this.setInputsValue();
  }

  disconnectedCallback() {
    this.inputs.forEach((input) => {
      input.removeEventListener('focus', this.handleFocus);
    });
  }
}

customElements.define('time-counter', TimeCounter);

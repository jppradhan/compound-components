const sheet = new CSSStyleSheet();

sheet.replaceSync(`
  :host {
    display: block;
  }
  :host video {
    width: 100%;
    height: 100%;
  }
`);

class Camera extends HTMLElement {
  constructor() {
    super();
  }

  _drawImage() {
    const imageWidth = this.videoElement.videoWidth;
    const imageHeight = this.videoElement.videoHeight;

    const context = this.canvasElement.getContext('2d');
    this.canvasElement.width = imageWidth;
    this.canvasElement.height = imageHeight;

    context.drawImage(this.videoElement, 0, 0, imageWidth, imageHeight);

    return { imageHeight, imageWidth };
  }

  async open(constraints) {
    let mediaStream = null;
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.srcObject = mediaStream;
      // Play the stream when loaded!
      this.videoElement.onloadedmetadata = (e) => {
        this.videoElement.play();
      };
      return mediaStream;
    } catch (err) {
      /* handle the error */
    }
  }

  takeBlobPhoto() {
    const { imageHeight, imageWidth } = this._drawImage();
    return new Promise((resolve, reject) => {
      this.canvasElement.toBlob((blob) => {
        resolve({ blob, imageHeight, imageWidth });
      });
    });
  }

  takeBase64Photo({ type, quality } = { type: 'png', quality: 1 }) {
    const { imageHeight, imageWidth } = this._drawImage();
    const base64 = this.canvasElement.toDataURL('image/' + type, quality);
    return { base64, imageHeight, imageWidth };
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [sheet];

    this.videoElement = document.createElement('video');
    this.canvasElement = document.createElement('canvas');

    this.videoElement.setAttribute('playsinline', true);
    this.canvasElement.style.display = 'none';

    shadow.appendChild(this.videoElement);
    shadow.appendChild(this.canvasElement);
  }
}

customElements.define('compound-camera', Camera);

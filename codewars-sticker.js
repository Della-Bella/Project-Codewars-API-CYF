class StickerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._userData = null;
  }

  set userData(value) {
    this._userData = value;
    this.render();
  }

  render() {
    if (!this._userData) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          background: yellow;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
          font-family: Arial, sans-serif;
        }
      </style>
      <div>
        <slot>${this._userData.language}: ${this._userData.name}</slot>
      </div>
    `;
  }
}

customElements.define("sticker-card", StickerCard);

// This native web component fetches data from the Codewars API and renders it as a badge
// Here is some information about web component https://developer.mozilla.org/en-US/docs/Web/Web_Components
// Here is the link to the Codewars API Docs: https://dev.codewars.com/#get-user

class CodeWarsBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._userData = null;
  }

  set userData(value) {
    this._userData = value;
    this.render();
    
    
  }

  get userData() {
    return this._userData;
  }
  
  render() {
    if (!this._userData) return;

    this.shadowRoot.innerHTML = `
    <style>
        :host {
           --rank: ${this._userData.ranks.overall.color};
           font: 600 100%/1 system-ui, sans-serif;
        }
        data { 
            color: var(--rank);
            border: 3px solid; 
            padding: .25em .5em;
        }      
      </style>
        <data value="${this._userData.ranks.overall.score}">
        ${this._userData.ranks.overall.name}
        </data>`;
  }
}

customElements.define("codewars-badge", CodeWarsBadge);

// Existing component to display user's rank and honor points
class CodeWarsBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.userName = "Della%20Bella%20";
    this.userData = {};
  }

  connectedCallback() {
    this.fetchUserData()
      .then(() => {
        this.render();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async fetchUserData() {
    const response = await fetch(
      `https://www.codewars.com/api/v1/users/${this.userName}`
    );
    this.userData = await response.json();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block; /* Already block, which is needed */
          padding: 1.5em;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #ffffff;
          color: #333;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
          box-sizing: border-box;

          /* --- Centering Styles --- */
          max-width: 600px;  /* Or choose a width like 'width: 80%;' or 'width: 500px;' */
          margin-left: auto;
          margin-right: auto;
          /* --- End Centering Styles --- */

          margin-bottom: 1em; /* Keep the space below */
        }

        /* Add other styles for elements inside your component */
        h2 {
          margin-top: 0;
          color: #111;
        }

        p {
            line-height: 1.5;
        }

        p > br {
            display: none;
        }

      </style>
      <h1> Codewars Component CYF </h1>
      <data value="${this.userData.ranks.overall.score}">
        ${this.userData.ranks.overall.name}
      </data>
      <data value="${this.userData.honor}">
        Honor Points: ${this.userData.honor}
      </data>`;
  }
}

customElements.define("codewars-badge", CodeWarsBadge);

// New component to display user's username
class CodeWarsName extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.userName = "Della%20Bella%20"; // Set default username
    this.userData = {};
  }

  connectedCallback() {
    this.fetchUserData()
      .then(() => {
        this.render();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async fetchUserData() {
    const response = await fetch(
      `https://www.codewars.com/api/v1/users/${this.userName}`
    );
    this.userData = await response.json();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font: 600 100%/1 system-ui, sans-serif;
        }
        span {
          color: #black;
        }
      </style>
      <span>${this.userData.username}</span>`;
  }
}

customElements.define("codewars-name", CodeWarsName);

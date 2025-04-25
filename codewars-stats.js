
class YourNewComponentNameDB extends HTMLElement {
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

                console.error("Could not fetch Codewars data:", error);

            });
    }


    async fetchUserData() {

        const response = await fetch(
            `https://www.codewars.com/api/v1/users/${this.userName}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.userData = await response.json();
    }



    render() {
        // 3. Replace EVERYTHING inside the backticks (`) below
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

      <div>
        <h2>My New Codewars Component!</h2>
        <p>
          <!-- 5. Access data from this.userData and display it -->
          Username: ${this.userData.username}</p>
          <br>
          Completed Challenges: ${this.userData.codeChallenges?.totalCompleted}
          </p>
          <p>
          Skills: ${this.userData.skills}
          </p><br>
          <p>
          points Gain: ${this.userData.honor}
          </p><br>
           <p>
          Completed Kata: ${this.userData.codeChallenges.totalCompleted}
          </p>
          <!-- Add more HTML elements to display other data -->
      </div>
    `;
    }
    // --- END OF THE PART YOU WILL CHANGE ---
}

// 2. Define the custom HTML tag name (must include a hyphen)
//    and link it to your new class name. RENAME BOTH parts below.
customElements.define("katas-gis-db", YourNewComponentNameDB);
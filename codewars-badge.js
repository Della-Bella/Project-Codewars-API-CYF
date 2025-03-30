// This native web component fetches data from the Codewars API and renders it as a badge
// Here is some information about web component https://developer.mozilla.org/en-US/docs/Web/Web_Components
// Here is the link to the Codewars API Docs: https://dev.codewars.com/#get-user
//the first section is for the searchsection implementation
class CodewarsSearch extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode:"open"}); //for isolated styling and structure
  }

  connectedCallback(){
    this.render(); //this is the initial render
  }
  handlingTheSearch(){
    const input = this.shadowRoot.querySelector("#usernameInput");
    const username = input.value.trim(); //input the username and clean it
    if(!username) return; //this prevents empty input
    //find the badge and change its username
    const badge = document.querySelector("codewars-badge");
    if(badge){
      badge.userName = username; //updating the username if the badge exists.
      badge.fetchActivity(); //by using badge fetch.
    }
    const challenges = document.querySelector("codewars-recent-challenges");
    if(challenges){
      challenges.setAttribute("username", username);
    }

  }
  render(){
    this.shadowRoot.innerHTML = `
      <style>
        .search-container {
          display: flex;
          margin:30px;
          max-width:50%;
          gap: 10px;
          height:50px;
        }
        input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          padding: 8px 12px;
          width:20%;
          background: #007acc;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 4px;
        }
        button:hover {
          background: #005f99;
        }
      </style>
      <div class="search-container">
        <input id="usernameInput" type="text" placeholder="Enter Codewars username..." />
        <button id="searchBtn">Search</button>
      </div>
    `;
    //event listener
    this.shadowRoot.querySelector("#searchBtn").addEventListener("click", () => this.handlingTheSearch());
  }
  }
//defining the new search component
customElements.define("codewars-search", CodewarsSearch);


//this implementation is for the codewarsbadge
class CodeWarsBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });// this creates an isolated DOM or shadow Dom for styling
    this.userName = "Mikiyas-STP"; //this holds the codewar username
    this.userData = null; //this is set to null to check for empty data
  }
  connectedCallback() {
    this.fetchActivity()
      .then(() => {
        this.render();
      })
      .catch((error) => {
        console.error("Error fetching Codewars data:", error);
        this.renderError(); //to render the error message if the API failed.
      });
  }
  // fetch the data from the Codewars API
  async fetchActivity() {
    try{
      const response = await fetch(`https://www.codewars.com/api/v1/users/${this.userName}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      this.userData = data; // set the userData property with the fetched data
      this.render();
    }catch (error){
    console.error("Failed to fetch data:", error);
    this.userData = null;
    this.renderError();
  }
}
  render() {
    if(!this.userData) return;
    const rankColor = this.userData.ranks?.overall?.color || "gray"; // Fallback if undefined
    const leaderboard = this.userData.leaderboardPosition ? `#${this.userData.leaderboardPosition}` : "N/A";
    this.shadowRoot.innerHTML = `
    <style>
    :host {
      font: 600 1rem system-ui, sans-serif;
          }
        #main-cont{
        margin:30px;
                }
        .badge{
        display: inline-block;
        color: black;
        border: 3px solid var(--rank);
        padding: 0.5em;
        border-radius: 8px;
        text-align: center;
        text-size: 1rem;
        background: green;
        }
        p{
        margin: 5px 0px;
        line-height: 1.4;
        }
        .progress-bar{
        height: 10px;
        width: 70%;
        background: #ddd;
        border-radius: 6px;
        overflow: hidden;
        }
        .progress {
        height: 100%;
        width: ${Math.min(this.userData.honor / 100, 100)}%;
        background: gray;
        transition: width 0.5s ease-in-out;
      }
      </style>
      <div id="main-cont">
      <div >
        <p><strong>Username:</strong>${this.userData.username}</p>
        <p><strong>Honor Points:</strong>${this.userData.honor}</p>
        <div class="progress-bar">
        <div class="progress"></div>
      
      </div>
      <div>
        <p><strong>Completed Challenges:</strong> ${
          this.userData.codeChallenges.totalCompleted
        }</p>
         <p><strong>Leaderboard Rank:</strong> ${leaderboard}</p>
        <p class="badge"><strong>Rank:</strong>${
          this.userData.ranks.overall.name
        }</p>
      </div>
      </div>`
      ;    
  }
  renderError(){
    this.shadowRoot.innerHTML = `<style>
      .error {
        color: red;
        font-weight: bold;
      }
    </style>
    <p class="error">Failed to load Codewars data. Please try again later.</p>`;
  }
}
customElements.define("codewars-badge", CodeWarsBadge);
/* New functionality added for the stretch exercise which is displaying the recent challenges. */
//creating a new class that extend html element to make the class a web component  <i used the same implementation>
class RecentChallenges extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.userName = "Mikiyas-STP";
    this.challenges = []; // to store the fetched challenges
  }
//this code detects observed attributes of the username 
  static get observedAttributes() {
    return ["username"];
  }
//for the changed username if oldvalue is different from newvalue replace the username with the new value then fetch the challanges.
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "username" && oldValue !== newValue) {
      this.userName = newValue;
      this.fetchChallenges();
    }
  }

  connectedCallback() {
    this.fetchChallenges()
      .then(() => this.render())
      .catch((error) => {
        console.error("Error fetching recent challenges:", error);
        this.renderError();
      });
  }
  async fetchChallenges() {
    try {
      const res = await fetch(
        `https://www.codewars.com/api/v1/users/${this.userName}/code-challenges/completed`
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      this.challenges = data.data.slice(0, 5); // Get the latest 5 challenges
      this.render();
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
      this.challenges = null;
      this.renderError();
    }
  }
  render() {
    if (!this.challenges) return;

    this.shadowRoot.innerHTML = `
    <style>
      .challenges {
        font-family: Arial, sans-serif;
        padding: 10px;
        margin-left:10px;
        background: #f8f8f8;
        border-radius: 8px;
      }
      .challenge {
        background: white;
        padding: 5px;
        margin: 5px 0;
        border-left: 5px solid #007acc;
        border-radius: 5px;
        transition: background 0.3s;
      }
      .challenge:hover{
      background: white;
      }
      .error {
        color: red;
        font-weight: bold;
      }
    </style>
    <div class="challenges">
      <h3>Recent Challenges</h3>
      ${this.challenges
        .map(
          (challenge) => `
          <div class="challenge">
            <p><strong>Name:</strong> ${challenge.name}</p>
            <p><strong>Completed At:</strong> ${new Date(
              challenge.completedAt
            ).toLocaleDateString()}</p>
            <p><a href="https://www.codewars.com/kata/${
              challenge.id
            }" target="_blank">View Kata</a></p>
          </div>`
        )
        .join("")}
    </div>`;
  }
  renderError() {
    this.shadowRoot.innerHTML = `
    <style>
      .error { color: red; font-weight: bold; }
    </style>
    <p class="error">Failed to load recent challenges. Please try again later.</p>`;
  }
}
customElements.define("codewars-recent-challenges", RecentChallenges);


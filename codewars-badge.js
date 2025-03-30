// This native web component fetches data from the Codewars API and renders it as a badge
// Here is some information about web component https://developer.mozilla.org/en-US/docs/Web/Web_Components
// Here is the link to the Codewars API Docs: https://dev.codewars.com/#get-user
class CodeWarsBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });// this creates an isolated DOM or shadow Dom for styling
    this.userName = "Mikiyas-STP"; //this holds the codewar username
    this.userData = []; //this is an array to store the userDatas
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
        margin: 5px 0;
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
      <div >
        <p><strong>Username:</strong>${this.userData.username}</p>
        <p><strong>Honor Points:</strong>${this.userData.honor}</p>
        <div class="progress-bar">
        <div class="progress"></div>
        </div>
        
        <p><strong>Completed Challenges:</strong> ${
          this.userData.codeChallenges.totalCompleted
        }</p>
         <p><strong>Leaderboard Rank:</strong> ${leaderboard}</p>
        <p class="badge"><strong>Rank:</strong>${
          this.userData.ranks.overall.name
        }</p>
      </div>`;    
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
class RecentChallenges extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.userName = 'Mikiyas-STP';
    this.challenges = [];// to store the fetched challenges
  }
  connectedCallback(){
    this.fetchChallenges()
      .then(()=> this.render())
      .catch(error => {
        console.error("Error fetching recent challenges:", error);
        this.renderError();
      });
  }
  async fetchChallenges(){
    try {
      const res = await fetch(
        `https://www.codewars.com/api/v1/users/${this.userName}/code-challenges/completed`
      );
      if (!res.ok)
        throw new Error(`HTTP error! Status: ${res.status}`);
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
          challenge => `
          <div class="challenge">
            <p><strong>Name:</strong> ${challenge.name}</p>
            <p><strong>Completed At:</strong> ${new Date(challenge.completedAt).toLocaleDateString()}</p>
            <p><a href="https://www.codewars.com/kata/${challenge.id}" target="_blank">View Kata</a></p>
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


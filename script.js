document.getElementById("fetchData").addEventListener("click", async () => {
  const usernameInput = document.getElementById("username").value;

  if (!usernameInput) {
    alert("Please enter a username!");
    return;
  }

  try {
    // Fetch the data from Codewars API
    const response = await fetch(
      `https://www.codewars.com/api/v1/users/${usernameInput}`
    );
    const data = await response.json();

    createCard(data)
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

function createCard(user) {
    document.getElementById("display").innerHTML = "";
  const cardTemplate = document.getElementById("card").content.cloneNode(true);
  const badgeContainer = cardTemplate.getElementById("badge_div");
  const badge = document.createElement("codewars-badge");
  badge.userData = user;
  badgeContainer.appendChild(badge);

  cardTemplate.querySelector("h3").textContent = user.name;
  const h4Elements = cardTemplate.querySelectorAll("h4");
  h4Elements[0].textContent = user.clan ? `Clan: ${user.clan}` : "Clan: N/A";
  h4Elements[1].textContent = user.ranks.overall.score ? `Score: ${user.ranks.overall.score}` : 'Score: N/A';;
  const stickerContainer = cardTemplate.getElementById("stickers_div");

  Object.keys(user.ranks.languages).forEach(language => {
    const sticker = document.createElement("sticker-card");
    sticker.userData = {
      language: language, // Add language name
      ...user.ranks.languages[language], // Merge existing data
    };
    stickerContainer.appendChild(sticker)
  });
  document.getElementById("display").appendChild(cardTemplate);
}

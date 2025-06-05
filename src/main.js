const fetchData = () =>
  fetch("../data.json")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      console.error("Error fetching data", response.statusText);
    })
    .then((data) => {
      return data;
    });

const getCurrentPeriod = (profileCard) => {
  if (profileCard) {
    const footerOptions = profileCard.querySelectorAll(".footer-option");
    const option = Array.from(footerOptions).find((option) =>
      option.classList.contains("selected")
    );
    return option.textContent.toLowerCase();
  }
};

const localizePeriod = (period) => {
  switch (period) {
    case "daily":
      return "Yesterday";
    case "weekly":
      return "Last Week";
    case "monthly":
      return "Last Month";
    default:
      return "";
  }
};

const renderContent = (data, currentPeriod, document) => {
  const cards = document.querySelectorAll(".card");

  // render the content for each card based on the current period selected
  cards.forEach((card) => {
    const cardData = data.find((item) => item.title === card.id);
    if (cardData) {
      const dynamicContent = card.querySelector(".text-layout-2").children;
      console.log(`Card Data for ${card.id}:`, cardData);
      console.log(`Dynamic content for ${card.id}:`, dynamicContent);
      dynamicContent[0].textContent = `${cardData.timeframes[currentPeriod].current}hrs`;
      dynamicContent[1].textContent = `${localizePeriod(currentPeriod)} - ${
        cardData.timeframes[currentPeriod].previous
      }hrs`;
    }
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const profileCard = document.getElementById("profile");
  let currentPeriod = getCurrentPeriod(profileCard);

  const data = await fetchData();

  // render initial content
  renderContent(data, currentPeriod, document);

  // change conent when a period button is pressed
  if (profileCard) {
    const footerOptions = profileCard.querySelectorAll(".footer-option");

    footerOptions.forEach((option) => {
      option.addEventListener("click", () => {
        footerOptions.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");
        currentPeriod = option.textContent.toLowerCase().trim();

        renderContent(data, currentPeriod, document);
      });
    });
  }
});

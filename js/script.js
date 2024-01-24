const itemsPerPage = 10;
let currentPage = 1;
let data;

function fetchData() {
  fetch("https://newsic-api.vercel.app/api/data")
    .then((response) => response.json())
    .then((result) => {
      data = result;
      updateTable();
    });
}

function updateTable() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Ensure the currentPage is within valid bounds
  if (startIndex >= 0 && startIndex < data.response.length) {
    const slicedData = data.response.slice(startIndex, endIndex);

    slicedData.forEach((article) => {
      const row = tableBody.insertRow();
      const titleCell = row.insertCell(0);
      const songTitleCell = row.insertCell(1);
      const songCell = row.insertCell(2);
      const regenerateCell = row.insertCell(3);

      titleCell.innerHTML = article.art_title;
      songTitleCell.innerHTML = article.song_title;
      songCell.innerHTML = article.song;

      const regenerateButton = document.createElement("button");
      regenerateButton.classList.add("regenerate-button");
      regenerateButton.innerText = "Regenerate";
      regenerateButton.addEventListener("click", () =>
        regenerateSummary(article.summary, article.art_title)
      );
      regenerateCell.appendChild(regenerateButton);
    });

    document.getElementById("currentPage").innerText = currentPage;
  } else {
    console.error("Invalid currentPage or data structure.");
  }
}

// function nextPage() {
//   const totalPages = Math.ceil(data.length / itemsPerPage);
//   if (currentPage < totalPages) {
//     currentPage++;
//     updateTable();
//   }
// }
function regenerateSummary(summary, title) {
  requestBody = { summary: summary, title: title };
  console.log("Regenerate Summary:", summary);
  console.log(requestBody);
  (async () => {
    try {
      const response = await fetch(
        "https://newsic-api.vercel.app/regenerate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data_gen = await response.json();
      console.log(data_gen);
      location.reload(true);
    } catch (error) {
      console.error("Error:", error);
    }
  })();
}

function nextPage() {
  if (data && data.response) {
    const totalPages = Math.ceil(data.response.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      updateTable();
    }
  }
}

async function searchTable() {
  try {
    const searchInput = document.getElementById("searchInput").value;
    const requestBody = { search: searchInput };
    console.log(searchInput);

    const response = await fetch(
      "https://newsic-api.vercel.app/semantic-search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    data = await response.json();
    currentPage = 1;
    updateTable();
  } catch (error) {
    console.error("Error:", error);
  }
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    updateTable();
  }
}

const searchInput = document.getElementById("searchInput").value;
if (searchInput.trim() !== "") {
  searchTable();
} else {
  fetchData();
}

async function logout() {
  try {
    const response = await fetch(
      "https://accounts.google.com/o/oauth2/revoke?token=" +
        info["access_token"],
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.ok) {
      location.href = "https://newsic-frontend.vercel.app/";
    } else {
      console.error("Logout failed. Server response:", response);
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
}

let params = {};

let regex = /([^&=]+)=([^&]*)/g,
  m;
while ((m = regex.exec(location.href))) {
  params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}
if (Object.keys(params).length > 0) {
  localStorage.setItem("authInfo", JSON.stringify(params));
}
window.history.pushState({}, document.title, "/" + "page.html");
let info = JSON.parse(localStorage.getItem("authInfo"));
// console.log(info['access_token']);
// console.log(info['expires_in']);
// console.log(JSON.parse(localStorage.getItem("authInfo")));
fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
  headers: {
    Authorization: `Bearer ${info["access_token"]}`,
  },
})
  .then((data) => data.json())
  .then((info) => {
    // console.log(info);
    document.getElementById("name").innerHTML += info.name;
    document.getElementById("image").setAttribute("src", info.picture);
  });

function toggleProfileDialog() {
  const profileDialog = document.getElementById("profileDialog");
  profileDialog.classList.toggle("show-dialog");
}

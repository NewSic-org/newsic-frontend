const itemsPerPage = 10;
let currentPage = 1;
let data;

function fetchData() {
  fetch("http://newsic-api.vercel.app/api/data")
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
  const slicedData = data.slice(startIndex, endIndex);

  slicedData.forEach((article) => {
    const row = tableBody.insertRow();
    const titleCell = row.insertCell(0);
    const songTitleCell = row.insertCell(1);
    const songCell = row.insertCell(2);

    titleCell.innerHTML = article.art_title;
    songTitleCell.innerHTML = article.song_title;
    songCell.innerHTML = article.song;
  });

  document.getElementById("currentPage").innerText = currentPage;
}

function nextPage() {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    updateTable();
  }
}

async function searchTable() {
  try {
    const searchInput = document.getElementById("searchInput").value;
    const requestBody = { search: searchInput };
    console.log(searchInput);

    const response = await fetch(
      "http://newsic-api.vercel.app/semantic-search",
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

// Set working API
if (!sessionStorage.getItem("user")) {
  sessionStorage.setItem("user", "https://api.uspeoplesearch.net/tcpa/v1?x=");
}

function checkStatus() {
  const phone = document.getElementById("phoneNumber").value.trim();
  const resultDiv = document.getElementById("result");

  if (!phone) {
    alert("Please enter a phone number");
    return;
  }

  resultDiv.innerHTML = "<p>Loading...</p>";

  const apiUrl = sessionStorage.getItem("user");
  if (!apiUrl) {
    resultDiv.innerHTML = "<p style='color:red;'>API URL not found</p>";
    return;
  }

  fetch(apiUrl + phone)
    .then(res => res.ok ? res.json() : res.text().then(t => { throw new Error(t); }))
    .then(data => {
      resultDiv.innerHTML = `
        <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
        <p><strong>Status:</strong> ${data.status || "N/A"}</p>
        <p><strong>Blacklist:</strong> ${data.listed || "N/A"}</p>
        <p><strong>Litigator:</strong> ${data.type || "N/A"}</p>
        <p><strong>State:</strong> ${data.state || "N/A"}</p>
        <p><strong>DNC National:</strong> ${data.ndnc === true ? "Yes" : "No"}</p>
        <p><strong>DNC State:</strong> ${data.sdnc === true ? "Yes" : "No"}</p>
      `;
    })
    .catch(err => {
      console.error("API Error:", err);
      resultDiv.innerHTML = `<p style="color:red;">API Error: ${err.message}</p>`;
    });
}

function copyResult() {
  const resultText = document.getElementById("result").innerText;
  if (!resultText) {
    alert("No result to copy!");
    return;
  }

  navigator.clipboard.writeText(resultText)
    .then(() => alert("Result copied to clipboard!"))
    .catch(() => alert("Failed to copy result."));
}

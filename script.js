function checkStatus() {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!phone) {
    alert("Please enter a phone number");
    return;
  }

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "<p>Loading...</p>";

  // Get API base URLs from sessionStorage
  const tcpaApi = sessionStorage.getItem("user");
  const premiumLookupApi = sessionStorage.getItem("id1");

  if (!tcpaApi || !premiumLookupApi) {
    resultDiv.innerHTML = "<p style='color:red;'>API URL not found in sessionStorage</p>";
    return;
  }

  Promise.all([
    fetch(tcpaApi + phone).then(res => res.ok ? res.json() : res.text().then(txt => { throw new Error(txt); })),
    fetch(premiumLookupApi + phone).then(res => res.ok ? res.json() : res.text().then(txt => { throw new Error(txt); }))
  ])
  .then(([tcpaData, personData]) => {
    const html = `
      <p><strong>Phone:</strong> ${tcpaData.phone || "N/A"}</p>
      <p><strong>Status:</strong> ${tcpaData.status || "N/A"}</p>
      <p><strong>Blacklist:</strong> ${tcpaData.listed || "N/A"}</p>
      <p><strong>Litigator:</strong> ${tcpaData.type || "N/A"}</p>
      <p><strong>State:</strong> ${tcpaData.state || "N/A"}</p>
      <p><strong>DNC National:</strong> ${tcpaData.ndnc === true ? "Yes" : "No"}</p>
      <p><strong>DNC State:</strong> ${tcpaData.sdnc === true ? "Yes" : "No"}</p>
      <hr>
      <p><strong>Person Name:</strong> ${personData.name || "N/A"}</p>
      <p><strong>Age:</strong> ${personData.age || "N/A"}</p>
      <p><strong>DOB:</strong> ${personData.dob || "N/A"}</p>
      <p><strong>Address:</strong> ${personData.address || "N/A"}</p>
    `;
    resultDiv.innerHTML = html;
  })
  .catch(error => {
    console.error("API Error:", error);
    resultDiv.innerHTML = `<p style="color:red;">API Error: ${error.message}</p>`;
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
    .catch(err => alert("Failed to copy result"));
}

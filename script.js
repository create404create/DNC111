const tcpaApi = "https://api.uspeoplesearch.net/tcpa/v1?x=";
const personApi = "https://api.uspeoplesearch.net/person/v3?x=";
const premiumLookupApi = "https://premium_lookup-1-h4761841.deta.app/person?x=";

function checkStatus() {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!phone) {
    alert("Please enter a phone number");
    return;
  }

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "<p>Loading...</p>";

  Promise.all([
    fetch(tcpaApi + phone).then(res => res.json()),
    fetch(premiumLookupApi + phone).then(res => res.json())
  ])
  .then(([tcpaData, personData]) => {
    console.log("TCPA:", tcpaData);
    console.log("Person:", personData);

    const html = `
      <p><strong>Phone:</strong> ${tcpaData.phone}</p>
      <p><strong>Status:</strong> ${tcpaData.status}</p>
      <p><strong>Blacklist:</strong> ${tcpaData.listed}</p>
      <p><strong>Litigator:</strong> ${tcpaData.type}</p>
      <p><strong>State:</strong> ${tcpaData.state}</p>
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
    resultDiv.innerHTML = "<p style='color:red;'>Error fetching data</p>";
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

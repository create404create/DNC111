function checkStatus() {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!phone) {
    alert("Please enter a phone number");
    return;
  }

  const tcpaApi = `https://api.uspeoplesearch.net/tcpa/v1?x=${phone}`;
  const personApi = `https://api.uspeoplesearch.net/person/v3?x=${phone}`;

  document.getElementById("result").innerHTML = "Fetching data...";

  Promise.all([
    fetch(tcpaApi).then(res => res.json()),
    fetch(personApi).then(res => res.json())
  ])
  .then(([tcpaData, personData]) => {
    let resultHTML = `
    🔍 <strong>Phone:</strong> ${tcpaData.phone || phone}
    ✅ <strong>Status:</strong> ${tcpaData.status}
    ⚠️ <strong>Blacklist:</strong> ${tcpaData.listed}
    🧑‍⚖️ <strong>Litigator:</strong> ${tcpaData.type}
    📍 <strong>State:</strong> ${tcpaData.state}
    🛑 <strong>DNC National:</strong> ${tcpaData.ndnc}
    🛑 <strong>DNC State:</strong> ${tcpaData.sdnc}
    `;

    if (personData.status === "ok" && personData.count > 0) {
      const person = personData.person[0];
      const address = person.addresses && person.addresses.length > 0 ? person.addresses[0] : {};
      resultHTML += `
      👤 <strong>Owner:</strong> ${person.name}
      🎂 <strong>DOB:</strong> ${person.dob} (Age: ${person.age})
      🏡 <strong>Address:</strong> ${address.home || ""}, ${address.city || ""}, ${address.state || ""} ${address.zip || ""}
      `;
    } else {
      resultHTML += `\n🔎 Owner info not available.`;
    }

    document.getElementById("result").innerHTML = resultHTML.trim();
  })
  .catch(error => {
    console.error("API Error:", error);
    document.getElementById("result").innerHTML = "<p style='color:red;'>Error fetching data</p>";
  });
}

function copyResult() {
  const text = document.getElementById("result").innerText;
  if (!text) return alert("No result to copy!");
  navigator.clipboard.writeText(text)
    .then(() => alert("Result copied to clipboard!"))
    .catch(() => alert("Failed to copy result."));
}

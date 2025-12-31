const API = "https://backend-server-cloud.netlify.app/.netlify/functions/proxy";
const USER_KEY = "user1-key";

async function upload() {
  const file = document.getElementById("fileInput").files[0];
  if(!file) return alert("Keine Datei ausgewählt");
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(API + "/upload", {
    method: "POST",
    headers: { "X-User-Agent-Key": USER_KEY },
    body: fd
  });

  if(res.status === 503) alert("Cloud Wartungsmodus");
  else loadFiles();
}

async function loadFiles() {
  try {
    const res = await fetch(API + "/files", { headers: { "X-User-Agent-Key": USER_KEY }});
    if(res.status === 503){ alert("Cloud Wartungsmodus"); return; }
    const files = await res.json();
    const list = document.getElementById("fileList");
    list.innerHTML = "";
    files.forEach(f => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${API}/download/${f}" target="_blank">${f}</a>`;
      list.appendChild(li);
    });
  } catch(e) {
    alert("Cloud offline");
  }
}

async function loadStatus() {
  try {
    const res = await fetch(API + "/status", { headers: { "X-User-Agent-Key": USER_KEY }});
    const data = await res.json();
    document.getElementById("status").textContent = res.status === 503 ? "Wartung" : "Online";
  } catch(e) {
    document.getElementById("status").textContent = "Offline";
  }
}

// Status & Dateien laden
loadStatus();
loadFiles();

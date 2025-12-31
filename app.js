const API = "https://backend-netlify-server.netlify.app/.netlify/functions/proxy";

const loginBtn = document.getElementById("loginBtn");

netlifyIdentity.init();

loginBtn.onclick = () => netlifyIdentity.open();

netlifyIdentity.on("login", user => {
    alert("Eingeloggt als " + user.email);
    netlifyIdentity.close();
    loadFiles();
});

async function upload() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Keine Datei ausgewählt");

  const data = new FormData();
  data.append("file", file);

  await fetch(API + "/upload", { method: "POST", body: data });
  loadFiles();
}

async function loadFiles() {
  const res = await fetch(API + "/files");
  const files = await res.json();

  const list = document.getElementById("fileList");
  list.innerHTML = "";

  files.forEach(f => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${API}/download/${f}" target="_blank">${f}</a>`;
    list.appendChild(li);
  });
}

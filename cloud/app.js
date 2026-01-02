const AUTH = "https://magenta-liger-2daeb1.netlify.app/";
let sessionToken = null;

async function handshake() {
  const nonce = Math.random().toString(36).substring(2);
  const r = await fetch(AUTH + '/handshake?nonce=' + nonce);
  const j = await r.json();
  if (!j.piOnline) {
    document.getElementById("files").innerText =
      "Hmm it looks like your data can’t be accessed…";
    return;
  }
  sessionToken = j.sessionToken;
  loadFiles();
}

async function loadFiles() {
  const r = await fetch(AUTH + "/files?token=" + sessionToken);
  const files = await r.json();
  document.getElementById("files").innerHTML = files.map(f =>
    `<div>${f} <a href="#" onclick="previewFile('${f}')">View</a> | <a href='${AUTH}/download/${f}?token=${sessionToken}'>Download</a></div>`
  ).join("");
}

handshake();

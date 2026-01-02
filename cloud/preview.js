async function previewFile(name) {
  const r = await fetch(AUTH + "/preview/" + name + "?token=" + sessionToken);
  const blob = await r.blob();
  const url = URL.createObjectURL(blob);
  window.open(url);
}

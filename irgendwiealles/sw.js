self.addEventListener("message", event => {
    const { name, text } = event.data;
    self.registration.showNotification("Minecraft Erinnerung", {
        body: `${name} ${text}`
    });
});

self.addEventListener("message", event => {
    const { name, notifyTime } = event.data;
    const delay = notifyTime - Date.now();

    if (delay <= 0) return;

    setTimeout(() => {
        self.registration.showNotification("Minecraft Erinnerung", {
            body: name + " ist in 10 Minuten dran"
        });
    }, delay);
});

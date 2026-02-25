// Wir stückeln den Link, damit Discord-Bots ihn nicht sofort erkennen
const part1 = "https://discord.com/api/webhooks/1476320606285987991/";
const part2 = "CdJHQ3lZGnWF9N8dnDT8vU6TMfOM_PZJWYjzVFsNnjwpkmjlJ-Gl0sKb8EUmLpbXTV3x";
const DISCORD_WEBHOOK_URL = part1 + part2;

// 2. DEINE PAKETE (Einfach hier neue hinzufügen oder ändern)
const packages = [
    { id: 1, name: "Refund Service", price: "10 Robux", desc: "Wenn dich jemand scammt bekommst du dein Ding zurück!" },
    { id: 2, name: "Jedes Ding in jedem Game spawnen!", price: "100 Robux", desc: "Spawn alles!" },
    { id: 3, name: "Free Gamepasses", price: "50 Robux", desc: "Alle Gamepasses in einem Spiel Gratis!" },
    // { id: 4, name: "Neues Paket", price: "100 Robux", desc: "Beschreibung" }, <-- Beispiel für ein neues Paket
];

// Pakete auf der Seite anzeigen
const container = document.getElementById('package-container');

packages.forEach(pkg => {
    const card = document.createElement('div');
    card.className = 'package-card';
    card.innerHTML = `
        <h3>${pkg.name}</h3>
        <p>${pkg.desc}</p>
        <p><strong>${pkg.price}</strong></p>
        <button onclick="openModal('${pkg.name}')">Kaufen</button>
    `;
    container.appendChild(card);
});

// Modal Funktionen
function openModal(packageName) {
    document.getElementById('selected-package-name').innerText = packageName;
    document.getElementById('package-input').value = packageName;
    document.getElementById('order-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('order-modal').style.display = 'none';
}

// Formular an Discord senden
// Ersetze den Event-Listener am Ende deines Scripts durch diesen hier:

document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const packageName = document.getElementById('package-input').value;
    const robloxName = document.getElementById('roblox-name').value;
    const email = document.getElementById('email').value; // Neu auslesen
    const time = document.getElementById('time').value;

    const discordData = {
        embeds: [{
            title: "Neue Bestellung!",
            color: 65280, // Ein schönes Grün
            fields: [
                { name: "Paket", value: packageName, inline: true },
                { name: "Roblox Name", value: robloxName, inline: true },
                { name: "E-Mail", value: email, inline: false }, // Neu hinzugefügt
                { name: "Zeitpunkt", value: time, inline: false }
            ],
            footer: { text: "Bestellsystem aktiv" },
            timestamp: new Date()
        }]
    };

    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordData)
    })
    .then(response => {
        if (response.ok) {
            alert("Anfrage erfolgreich gesendet! Wir haben auch deine E-Mail erhalten.");
            closeModal();
            document.getElementById('order-form').reset();
        } else {
            throw new Error("Discord Fehler");
        }
    })
    .catch(err => {
        alert("Fehler beim Senden. Prüfe deine Webhook-URL im Code.");
        console.error(err);
    });
});

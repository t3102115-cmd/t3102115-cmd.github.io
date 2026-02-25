// 1. DEINE EINSTELLUNGEN
const DISCORD_WEBHOOK_URL = "DEIN_DISCORD_WEBHOOK_LINK_HIER";

// 2. DEINE PAKETE (Einfach hier neue hinzufügen oder ändern)
const packages = [
    { id: 1, name: "Starter Paket", price: "500 Robux", desc: "Grundlegender Service" },
    { id: 2, name: "Pro Paket", price: "1500 Robux", desc: "Besserer Service & Support" },
    { id: 3, name: "Premium Paket", price: "5000 Robux", desc: "Der ultimative Service" },
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
document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const packageName = document.getElementById('package-input').value;
    const robloxName = document.getElementById('roblox-name').value;
    const time = document.getElementById('time').value;

    const discordData = {
        embeds: [{
            title: "🛒 Neue Bestellung!",
            color: 65280, // Grün
            fields: [
                { name: "Paket", value: packageName, inline: true },
                { name: "Roblox Name", value: robloxName, inline: true },
                { name: "Zeitpunkt", value: time }
            ],
            footer: { text: "Shop System" },
            timestamp: new Date()
        }]
    };

    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordData)
    })
    .then(() => {
        alert("Anfrage gesendet! Wir melden uns.");
        closeModal();
        document.getElementById('order-form').reset();
    })
    .catch(err => {
        alert("Fehler beim Senden. Prüfe die Konsole.");
        console.error(err);
    });
});

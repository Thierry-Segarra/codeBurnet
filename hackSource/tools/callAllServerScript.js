/** @param {NS} ns **/
export async function main(ns) {
    var myServe = ns.args[0] || false;

    let allServers = new Set(); // Utilisation d'un Set pour éviter les doublons

    // Fonction récursive pour scanner les serveurs
    function scanServers(host) {
        let servers = ns.scan(host); // Liste des serveurs connectés au serveur donné

        for (let server of servers) {
            if (!allServers.has(server)) { // Vérifie si le serveur n'a pas encore été visité
                let infoServe = ns.getServer(server);
                if (infoServe.purchasedByPlayer == myServe) {
                    allServers.add(server); // Ajoute le serveur à la liste
                    scanServers(server); // Recherche récursive des sous-serveurs
                }
            }
        }
    }

    scanServers("home");

    // Convertir Set en tableau pour sauvegarde JSON
    await saveScan(ns, Array.from(allServers));
}

// Fonction pour sauvegarder sous format JSON
async function saveScan(ns, liste) {
    const filename = "hackSource/Json/scanAllServe.json"; // Fichier JSON
    const jsonData = JSON.stringify(liste, null, 2); // Conversion en JSON formaté
    ns.write(filename, jsonData, "w"); // Écriture dans le fichier
    ns.tprint(`✅ Scan sauvegardé dans ${filename}`);
}

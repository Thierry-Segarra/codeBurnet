/** @param {NS} ns **/
export async function main(ns) {
    const server = ns.args[0]; // Serveur à pirater
    const openPorts = ns.args[1]; // Nombre de ports ouverts
    const numOpenPortsRequired = ns.args[2]; // Nombre de ports ouverts
    // const infoServeur = ns.getServer(server);

    // Vérification si le nombre de ports ouverts est suffisant
    if (openPorts < numOpenPortsRequired) {
        ns.tprint(`❌ [AutoHaked FAIL] Serveur ${server}`);
        ns.tprint(`❗ Ports requis : ${numOpenPortsRequired}, ports ouvrables : ${openPorts}`);
        ns.tprint(`🔍 Astuce : Analysez le serveur ou débloquez davantage d'outils.`);
        return; // Arrêt si les ports ouverts ne suffisent pas
    }

    ns.tprint(`🚀 [AutoHaked START] Tentative de piratage de ${server}...`);

    // Liste des outils pour ouvrir les ports
    const hackingTools = [
        { file: "BruteSSH.exe", method: ns.brutessh, log: "BruteSSH.exe utilisé" },
        { file: "FTPCrack.exe", method: ns.ftpcrack, log: "FTPCrack.exe utilisé" },
        { file: "RelaySMTP.exe", method: ns.relaysmtp, log: "RelaySMTP.exe utilisé" },
        { file: "HTTPWorm.exe", method: ns.httpworm, log: "HTTPWorm.exe utilisé" },
        { file: "SQLInject.exe", method: ns.sqlinject, log: "SQLInject.exe utilisé" }
    ];

    // Parcourir et utiliser les outils disponibles
    for (const tool of hackingTools) {
        if (ns.fileExists(tool.file, "home")) {
            try {
                tool.method(server); // Appel de la méthode correspondante
                ns.tprint(`✅ ${tool.log}`);
            } catch (error) {
                ns.tprint(`❌ Erreur lors de l'exécution de ${tool.file} : ${error}`);
            }
        }
    }

    // Obtention des droits root
    try {
        ns.nuke(server);
        ns.tprint(`✅ [AutoHaked SUCCESS] Accès root obtenu sur ${server}`);
    } catch (error) {
        ns.tprint(`❌ [AutoHaked ERROR] Échec du Nuke sur ${server} : ${error}`);
    }
}

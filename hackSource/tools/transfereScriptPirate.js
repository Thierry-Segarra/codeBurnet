/** @param {NS} ns **/
export async function main(ns) {
    let source = ns.args[0]; // Serveur source
    let destination = ns.args[1]; // Serveur destination

    if (!source || !destination) {
        ns.tprint("❌ Erreur: Veuillez spécifier le serveur source et destination.");
        return;
    }

    ns.tprint(`📦 Transfert des fichiers de ${source} vers ${destination}...`);

    // Liste des fichiers à transférer
    const filesToTransfer = [
        "hackSource/action/hack.js",
    ];

    let transferredFiles = [];
    
    // Vérifie et transfère chaque fichier
    for (let file of filesToTransfer) {
        if(!ns.fileExists(file, source)){
            ns.tprint(file + " N'existe pas")
            continue
        }
        if (!ns.fileExists(file, destination)) {
            ns.tprint(file)
            ns.scp(file, destination, source);
            transferredFiles.push(file);
        }else{
            ns.tprint(file + " Fichier deja transférés")
        }
    }

    // Vérification du transfert
    if (transferredFiles.length > 0) {
        ns.tprint("✅ Fichiers transférés avec succès:");
        transferredFiles.forEach(file => ns.tprint(`📂 ${file}`));
    } else {
        ns.tprint("🔹 Tous les fichiers sont déjà présents sur le serveur cible.");
    }

    ns.tprint("🎯 Transfert terminé !");
}

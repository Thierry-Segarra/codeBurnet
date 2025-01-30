/** @param {NS} ns **/
export async function main(ns) {
    let server = ns.args[0]; // Serveur cible (où les fichiers seront supprimés)

    if (!server) {
        ns.tprint("❌ Erreur : Veuillez spécifier un serveur.");
        return;
    }

    ns.tprint(`📦 Suppression des fichiers sur ${server}...`);

    // Liste des fichiers à supprimer
    const filesToDelete = [
        "hackSource/action/hack.js"
    ];

    let deletedFiles = []; // Stocker les fichiers supprimés

    // Vérifie l'existence et supprime chaque fichier
    for (let file of filesToDelete) {
        if (ns.fileExists(file, server)) {
            ns.mv(server,file, "hackSource/delete.txt" ); // Suppression du fichier sur le serveur en ecrassans sur un seul fichier pour gagner de la RAM
            deletedFiles.push(file);
            ns.tprint(`🗑️ Fichier supprimé : ${file}`);
        } else {
            ns.tprint(`ℹ️ Fichier déjà supprimé : ${file}`);
        }
    }

    // Résumé de la suppression
    if (deletedFiles.length > 0) {
        ns.tprint("✅ Suppression terminée avec succès !");
    } else {
        ns.tprint("🔹 Aucun fichier à supprimer.");
    }
}

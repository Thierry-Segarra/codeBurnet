/** @param {NS} ns **/
export async function main(ns) {
  const server = ns.args[0]; // Serveur cible
  const scriptToExporte = "hackSource/action/hack.js"; // Script à exporter depuis home
  const scriptSource = ns.getHostname(); // Serveur d'où copier le script

  // Vérification des paramètres d'entrée
  if (!server) {
    ns.tprint("❌ Erreur : Aucun serveur spécifié !");
    return;
  }

  ns.tprint(`🚀 Initialisation du transfert sur ${server}...`);

  // Vérification de l'existence du script source
  if (!ns.fileExists(scriptToExporte, scriptSource)) {
    ns.tprint(`❌ Le script ${scriptToExporte} n'existe pas sur ${scriptSource}.`);
    return;
  }

  // Vérification de l'espace RAM sur le serveur cible
  const maxRam = ns.args[1];
  const usedRam = ns.getServerUsedRam(server);
  const scriptRam = ns.getScriptRam(scriptToExporte, scriptSource);

  if (maxRam === 0) {
    ns.tprint(`❌ Le serveur ${server} n'a pas de RAM disponible.`);
    return;
  }

  // Calcul du nombre maximal de threads pouvant être exécutés
  const availableRam = maxRam - usedRam;
  const maxThreads = Math.floor(availableRam / scriptRam);

  if (maxThreads <= 0) {
    ns.tprint(`⚠️ RAM insuffisante sur ${server}. Aucune thread ne peut être exécutée.`);
    return;
  }

  // Transfert du script sur la racine du serveur cible
  try {
    if (!ns.fileExists(scriptToExporte, server)) {
      ns.tprint(`Script ${scriptToExporte}`);
      await ns.scp(scriptToExporte, server, scriptSource);
      ns.tprint(`✅ Script ${scriptToExporte} transféré vers ${server}.`);

    }
  } catch (error) {
    ns.tprint(`❌ Erreur lors du transfert ou du renommage du script : ${error} File : ${scriptToExporte}`);
    return;
  }


}

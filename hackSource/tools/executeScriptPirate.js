/** @param {NS} ns */
export async function main(ns) {
  const server = ns.args[0]; // Serveur cible
  const scriptToRun = "hackSource/action/hack.js";

  // Vérification de l'espace RAM sur le serveur cible
  const maxRam = ns.getServerMaxRam(server);

  if (maxRam === 0) {
    ns.tprint(`❌ Le serveur ${server} n'a pas de RAM disponible.`);
    return;
  }

  const usedRam = ns.getServerUsedRam(server);
  const scriptRam = ns.getScriptRam(scriptToRun, server);
  // Calcul du nombre maximal de threads pouvant être exécutés
  const availableRam = maxRam - usedRam;
  const maxThreads = Math.floor(availableRam / scriptRam);

  if (maxThreads <= 0) {
    ns.tprint(`⚠️ RAM insuffisante sur ${server}. Aucune thread ne peut être exécutée.`);
    return;
  }

  try {
    // Exécution du script avec le nombre maximal de threads possibles
    const pid = ns.run(scriptToRun, server, maxThreads);
    if (pid === 0) {
      ns.tprint(`❌ Échec de l'exécution de ${scriptToRun} sur ${server}.`);
    } else {
      ns.tprint(`✅ Script ${scriptToRun} exécuté sur ${server} avec ${maxThreads} threads (PID : ${pid}).`);
    }
  } catch (error) {
    ns.tprint(`❌ Erreur lors de l'execution du script : ${error.message}`);
    return;
  }
}
export var ServeurParent = "home"

/** @param {NS} ns **/
export async function mainMenu(ns) {
  let menuListe = []; // Initialisation du tableau de menu

  let description = `🎮 === INTERFACE 8GO === 🎮\n` +
    `Sélectionnez une option :\n`;

  // 📌 Ajout des options du menu principal
  menuListe.push({
    name: "🚀 Start",
    action: () => detailServer(ns) // Démarrer avec l'affichage des détails du serveur
  }, {
    name: "❌ Exit",
    action: () => quit(ns) // Affichage avant de quitter
  });

  // 🏗️ Lancement du menu interactif
  await menuLoop(ns, menuListe, description);
}


export async function menuLoop(ns, menu, description = "") {
  while (true) {
    let menuText = "";
    if (description != "") {
      menuText += description + "\n"
    }
    menuText += "==== Menu ====\n";
    menu.forEach((cmd, index) => {
      if (cmd.name && typeof cmd.name === "string" && cmd.name.trim() !== "") {
        menuText += `${index + 1}. ${cmd.name}\n`;
      }
    });
    menuText += "================\n";
    menuText += "Choisissez une option :";

    const choice = await ns.prompt(menuText, { type: "text" });
    const index = parseInt(choice) - 1;

    if (index >= 0 && index < menu.length) {
      const command = menu[index];
      clearConsole(ns)
      await command.action(ns);
    } else {
      ns.tprint("Choix invalide. Essayez encore !");
    }
  }
}

export async function executionScript(ns, server, scriptToRun, scriptArgs = []) {
  // Vérifier l'existence du script
  if (!ns.fileExists(scriptToRun, server)) {
    ns.tprint(`Le script ${scriptToRun} n'existe pas dans "${server}".`);
    return;
  }

  try {
    // Exécution du script avec un seul thread (1)
    const pid = ns.exec(scriptToRun, server, 1, ...scriptArgs);

    // Vérification si le script a bien démarré
    if (pid === 0) {
      ns.tprint(`Échec de l'exécution du script ${scriptToRun}. Vérifiez qu'il existe et qu'il est disponible.`);
      return;
    }

    ns.tprint(`✔ Script ${scriptToRun} lancé avec PID ${pid}.`);

    // Attendre la fin du script
    while (ns.isRunning(pid, server)) {
      await ns.sleep(500); // Pause de 0.5 seconde pour vérifier régulièrement
    }

    ns.tprint(`✔ Script ${scriptToRun} terminé.`);
  } catch (error) {
    ns.tprint(`❌ Erreur lors de l'exécution du script : ${error}`);
  }
}



export async function executeProgrammeDistant(ns, server, scriptToRun) {

  if (!ns.fileExists(scriptToRun, server)) {
    ns.tprint(`Le script ${scriptToRun} n'existe pas dans ${server}.`);
    return;
  }
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
    const pid = ns.exec(scriptToRun, server, maxThreads, server);
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

export async function quit(ns) {
  ns.tprint("👋 Fermeture du programme...")
  ns.exit();
}

/** @param {NS} ns **/
export async function listServers(ns, serverTarget = "home") {
  ns.tprint(`\n🌍 [Scan des serveurs depuis : ${serverTarget}]`);

  const servers = scanServers(ns, serverTarget); // Fonction qui récupère tous les serveurs connectés
  let menuListe = []; // Initialisation du menu

  // 🏠 Option de retour au serveur précédent
  menuListe.push({
    name: "↩️ Retour",
    action: () => detailServer(ns, serverTarget)
  });

  // 📜 Ajout des serveurs trouvés dans le menu
  servers.forEach(server => {
    const serverInfo = ns.getServer(server);
    const isHacked = serverInfo.hasAdminRights;
    const statusIcon = isHacked ? "🔓" : "❌";

    menuListe.push({
      name: `${statusIcon} ${server}`,
      action: () => detailServer(ns, server, serverTarget)
    });
  });

  // 🏗️ Lancement du menu interactif
  await menuLoop(ns, menuListe, `🌐 Liste des serveurs accessibles depuis ${serverTarget}`);
}



/** @param {NS} ns **/
export async function detailServer(ns, server = "home", serverTarget = null) {
  // 📊 Récupération des infos du serveur
  const serverInfo = ns.getServer(server);
  const hacked = serverInfo.hasAdminRights;
  let description = `==== 📡 Server : ${server} ====\n`;
  description += `🔓 Accès administrateur : ${hacked ? "✅ Oui" : "❌ Non"}\n`;

  let menuListe = []; // Initialisation du menu

  // 🏠 Retour à la maison
  if (server !== "home") {
    menuListe.push({
      name: "🏠 Retour HOME",
      action: () => detailServer(ns, "home")
    });
  } else {
    menuListe.push({
      name: "🚪 Quitter le programme",
      action: () => quit(ns)
    });
  }

  // 🔍 Analyse du serveur
  menuListe.push({
    name: "🛠️ Analyser le serveur",
    action: () => analyseServeur(ns, server)
  });

  // 📜 Si le serveur est piraté, afficher plus d'infos
  if (hacked) {
    description += `💾 RAM totale : ${serverInfo.maxRam} GB\n`;
    description += `📊 RAM utilisée : ${serverInfo.ramUsed} GB\n`;

    if (server !== "home") {
      let script = "hackSource/tools/scriptPirate.js";

      menuListe.push({
        name: "💀 Exécuter le script pirate",
        action: () => scriptPirate(ns, server, script)
      });
      menuListe.push({
        name: "📂 Gestion des scripts",
        action: () => gestionScriptServer(ns, server)
      });
    }
  } else {
    menuListe.push({
      name: "🚀 Auto-hack du serveur",
      action: () => autoHacked(ns, server)
    });
  }

  // 🌐 Scanner les serveurs
  menuListe.push({
    name: "🔍 Scanner les serveurs",
    action: () => listServers(ns, server)
  });

  // 📜 Exécution du menu interactif
  await menuLoop(ns, menuListe, description);
}



/** @param {NS} ns **/
export async function gestionScriptServer(ns, server = "home") {
  // 📂 Liste des fichiers à vérifier
  const filesToTransfer = [
    "hackSource/action/hack.js",
  ];

  let missingFiles = []; // Fichiers manquants
  let existingFiles = []; // Fichiers déjà présents

  for (let file of filesToTransfer) {
    if (ns.fileExists(file, server)) {
      existingFiles.push(file);
    } else {
      missingFiles.push(file);
    }
  }
  var description = `==== Server ${server} ====\n`
  // 🔍 Affichage du statut des fichiers
  if (existingFiles.length > 0) {

    description += `✅ Fichiers existants :\n`;
    existingFiles.forEach(file => description += `📂 ${file}\n`);
  } else {
    description += `⚠️ Aucun fichier trouvé sur ${server}\n`;
  }

  if (missingFiles.length > 0) {
    description += `❌ Fichiers manquants :\n`;
    missingFiles.forEach(file => description += `🚫 ${file}\n`);
  }

  // 🛠️ Création du menu
  let menuListe = [
    {
      name: `↩️ Retour`,
      action: () => detailServer(ns, server) // Retour aux détails du serveur
    },
    {
      name: "🔄️ Refresh Scripts",
      action: () => refreshScriptPirate(ns, server) // Transfert des scripts
    },
    {
      name: "📤 Transférer Scripts",
      action: () => transfertScriptPirate(ns, server) // Transfert des scripts
    },
    {
      name: "🗑️ Effacer Scripts",
      action: () => clearScriptPirate(ns, server) // Supprime les scripts du serveur
    },
    {
      name: "🛑 Arrêter tous les scripts",
      action: () => killAllScript(ns, server) // Kill tous les scripts en cours
    }
  ];

  await menuLoop(ns, menuListe, description);
}



/** @param {NS} ns **/
export async function analyseServeur(ns, server) {
  let infoServeur = ns.getServer(server);

  ns.tprint(`\n🖥️ [Analyse du serveur: ${server}]`);

  if (server != 'home') {
    // 🛠️ Statut des ports
    ns.tprint(`🔌 SSH Port  : ${infoServeur.sshPortOpen ? "✅ Open" : "❌ Closed"}`);
    ns.tprint(`🔌 FTP Port  : ${infoServeur.ftpPortOpen ? "✅ Open" : "❌ Closed"}`);
    ns.tprint(`🔌 SMTP Port : ${infoServeur.smtpPortOpen ? "✅ Open" : "❌ Closed"}`);
    ns.tprint(`🔌 HTTP Port : ${infoServeur.httpPortOpen ? "✅ Open" : "❌ Closed"}`);
    ns.tprint(`🔌 SQL Port  : ${infoServeur.sqlPortOpen ? "✅ Open" : "❌ Closed"}`);

    // ⚠️ Nombre de ports requis pour le piratage
    ns.tprint(`\n🔒 Nombre de ports requis pour pirater: ${infoServeur.numOpenPortsRequired}`);
  }

  // 🔎 Vérification des outils de hacking disponibles
  let openPorts = checkToolsHack(ns);
  ns.tprint(`\n🛠️ Nombre d'outils disponibles : ${openPorts}`);

  // 📂 Vérification de la présence des outils
  const hackingTools = {
    "BruteSSH.exe": "🔑 BruteSSH",
    "FTPCrack.exe": "📂 FTPCrack",
    "RelaySMTP.exe": "📨 RelaySMTP",
    "HTTPWorm.exe": "🌐 HTTPWorm",
    "SQLInject.exe": "💾 SQLInject"
  };

  for (const [file, toolName] of Object.entries(hackingTools)) {
    ns.tprint(`${toolName} : ${ns.fileExists(file, "home") ? "✅ Disponible" : "❌ Non trouvé"}`);
  }

  if (server != 'home') {
    const hacked = infoServeur.hasAdminRights;
    // ✅ Peut-on hacker ce serveur ?
    if (hacked) {
      ns.tprint(`\n🚀 ✅ Ce serveur est piraté !`);
    } else if (openPorts >= infoServeur.numOpenPortsRequired) {
      ns.tprint(`\n🚀 ✅ Ce serveur **peut être piraté** !`);
    } else {
      ns.tprint(`\n⚠️ ❌ Ce serveur **ne peut pas être piraté** (ports insuffisants).`);
    }
  }
}

function checkToolsHack(ns) {
  let server = "home";
  let openPorts = 0;
  if (ns.fileExists("brutessh.exe", server)) openPorts++;
  if (ns.fileExists("ftpcrack.exe", server)) openPorts++;
  if (ns.fileExists("relaysmtp.exe", server)) openPorts++;
  if (ns.fileExists("httpworm.exe", server)) openPorts++;
  if (ns.fileExists("sqlinject.exe", server)) openPorts++;

  return openPorts
}

export function scanServers(ns, current = "home", liste = new Set()) {
  const servers = ns.scan(current);
  servers.forEach(server => liste.add(server));
  return liste;
}


async function autoHacked(ns, server) {
  // Définir le chemin du script d'automatisation
  const scriptToRun = "hackSource/tools/autoHacked.js"; 
  var infoServeur = ns.getServer(server);

  // Arguments à passer au script (serveur, outils disponibles, ports nécessaires, serveur parent)
  const scriptArgs = [server, checkToolsHack(ns), infoServeur.numOpenPortsRequired, ServeurParent];

  // Exécution du script d'automatisation sur le serveur parent
  await executionScript(ns, ServeurParent, scriptToRun, scriptArgs);

  // Reprendre les détails du serveur après l'exécution du script
  await detailServer(ns, server);
}

async function scriptPirate(ns, server, scriptPirate) {
  // Récupère la RAM maximale du serveur cible
  const maxRam = ns.getServerMaxRam(server);

  // Arguments à passer au script (serveur, RAM disponible)
  const scriptArgs = [server, maxRam];

  // Exécute le script de piratage sur le serveur parent
  await executionScript(ns, ServeurParent, scriptPirate, scriptArgs);

  // Définir le chemin du fichier hack.js
  const scriptToRun = "hackSource/action/hack.js";

  // Vérifier si le fichier hack.js est déjà sur le serveur cible
  if (ns.fileExists(scriptToRun, server)) {
    // Si le fichier hack.js n'existe pas, le transférer
    await executeProgrammeDistant(ns, server, scriptToRun);
    await detailServer(ns, server); // Afficher les détails du serveur après l'exécution
  } else {
    // Si le fichier hack.js existe déjà, afficher un message d'avertissement
    ns.tprint('⚠️ Fichier Hack.js introuvable sur le serveur cible ⚠️');
    ns.tprint('⚠️ Transfert des fichiers nécessaires... ⚠️');

    // Gérer les scripts nécessaires sur le serveur
    await gestionScriptServer(ns, server);
  }

  // Reprise après l'exécution du script
}



async function transfertScriptPirate(ns, server) {
  // Chemin du script à exécuter
  const transfereScriptPirate = "hackSource/tools/transfereScriptPirate.js"; // Adaptez selon l'arborescence
  // const maxRam = ns.getServerMaxRam(serverDestinataire);
  const scriptArgs = [ServeurParent, server];
  // const scriptArgs = [];
  await executionScript(ns, ServeurParent, transfereScriptPirate, scriptArgs)

  // Reprise après la fin du script
  await gestionScriptServer(ns, server);
}

async function clearScriptPirate(ns, server) {
  // Chemin du script à exécuter
  const transfereScriptPirate = "hackSource/tools/clearScriptPirate.js"; // Adaptez selon l'arborescence
  // const maxRam = ns.getServerMaxRam(serverDestinataire);
  const scriptArgs = [server];
  // const scriptArgs = [];
  await executionScript(ns, ServeurParent, transfereScriptPirate, scriptArgs)

  // Reprise après la fin du script
  await gestionScriptServer(ns, server);
}

async function killAllScript(ns, server) {
  // Chemin du script à exécuter
  const transfereScriptPirate = "hackSource/tools/killAllScript.js"; // Adaptez selon l'arborescence
  // const maxRam = ns.getServerMaxRam(serverDestinataire);
  const scriptArgs = [server];
  // const scriptArgs = [];
  await executionScript(ns, ServeurParent, transfereScriptPirate, scriptArgs)

  // Reprise après la fin du script
  await gestionScriptServer(ns, server);
}


async function refreshScriptPirate(ns, server) {
  // Chemin du script à exécuter pour nettoyer le serveur cible
  let transfereScriptPirate = "hackSource/tools/clearScriptPirate.js"; 

  // Paramètres pour l'exécution du script de nettoyage (passage du serveur cible en argument)
  let scriptArgs = [server]; 
  
  // Exécuter le script de nettoyage sur le serveur cible
  await executionScript(ns, ServeurParent, transfereScriptPirate, scriptArgs);

  // Chemin du script à exécuter pour transférer les fichiers nécessaires sur le serveur cible
  transfereScriptPirate = "hackSource/tools/transfereScriptPirate.js"; 

  // Paramètres pour l'exécution du script de transfert (Serveur Parent et serveur cible)
  scriptArgs = [ServeurParent, server];

  // Exécuter le script de transfert des fichiers sur le serveur cible
  await executionScript(ns, ServeurParent, transfereScriptPirate, scriptArgs);

  // Affichage de la mise à jour
  ns.tprint('Fichiers mis à jour avec succès !');

  // Appel de la fonction pour reprendre la gestion des scripts sur le serveur cible après la mise à jour
  await gestionScriptServer(ns, server);
}


export function clearConsole(ns, max = 100) {
  let text = ''; // On commence avec une chaîne vide
  for (let i = 0; i < max; i++) {
    text += '\n'; // Ajoute un saut de ligne à chaque itération
  }
  ns.tprint(text); // Affiche plusieurs lignes vides dans la console
}


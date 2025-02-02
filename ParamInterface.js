/** @param {NS} ns **/

export async function main(ns) {
  if (!ns.fileExists("hackSource/Json/Interface.json", "home")) {
    ns.tprint("Fichier Interface.json introuvable !");
    return;
  }

  const interfaceData = JSON.parse(ns.read("hackSource/Json/Interface.json")); // Charger le JSON
  let menuListe = [];
  let description = "==== Sélection d'Interface ====\n";

  menuListe.push({
    name: "Retour",
    action: () => quit(ns)
  });

  interfaceData.forEach((interfaceConfig) => {
    if (ns.getServerMaxRam('home') >= interfaceConfig.ramUse ) {
      menuListe.push({
        name: interfaceConfig.name,
        action: () => saveInterface(ns, interfaceConfig.code) // Enregistrer et charger l'interface sélectionnée
      });
    }else{
      menuListe.push({
        name: interfaceConfig.name+ " RAM Insuffisant",
        action: () => ramInsuffisant(ns) // Enregistrer et charger l'interface sélectionnée
      });
    }
  });

  await menuLoop(ns, menuListe, description);
}

async function menuLoop(ns, menu, description = "") {
  while (true) {
    ns.clearLog();
    let menuText = "";
    if (description != "") {
      menuText += description + "\n";
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
      await command.action(ns);
    } else {
      ns.tprint("Choix invalide. Essayez encore !");
    }
  }
}

async function quit(ns) {
  ns.tprint("Arrêt du script.");
  ns.exit();
}

async function ramInsuffisant(ns) {
  ns.tprint(`RAM INSUFFISANT`);
}

async function saveInterface(ns, code) {
  const filename = "Interface.js"; // Nom du fichier où sera écrit le code
  ns.write(filename, code, "w"); // Écriture du code dans le fichier
  ns.tprint(`✔ Interface mise à jour`);
}

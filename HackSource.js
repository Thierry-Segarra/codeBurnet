/** @param {NS} ns **/
export async function main(ns) {
    // Liste d'URLs à télécharger
    const filesToDownload = [
        { url: "https://raw.githubusercontent.com/Thierry-Segarra/codeBurnet/refs/heads/main/Interface.js",
         target: "Interface.js" },
        { url: "https://raw.githubusercontent.com/Thierry-Segarra/codeBurnet/refs/heads/main/Interface.json",
         target: "Interface.json" },
        { url: "https://raw.githubusercontent.com/Thierry-Segarra/codeBurnet/refs/heads/main/ParamInterface.js",
         target: "ParamInterface.js" },
        { url: "https://raw.githubusercontent.com/Thierry-Segarra/codeBurnet/refs/heads/main/hackSource/Interface_8Go.js",
         target: "hackSource/Interface_8Go.js" },
        { url: "https://raw.githubusercontent.com/Thierry-Segarra/codeBurnet/refs/heads/main/hackSource/menuConfig.js",
         target: "hackSource/menuConfig.js" },
        { url: "https://raw.githubusercontent.com/Thierry-Segarra/codeBurnet/refs/heads/main/hackSource/tools/autoHacked.js",
         target: "hackSource/tools/autoHacked.js" },
        { url: "https://raw.githubusercontent.com/Thierry-Segarra/codeBurnet/refs/heads/main/hackSource/tools/clearScriptPirate.js",
         target: "hackSource/tools/clearScriptPirate.js" },
        { url: "https://raw.githubusercontent.com/Thierry-Segarra/codeBurnet/refs/heads/main/hackSource/tools/executeScriptPirate.js",
         target: "hackSource/tools/executeScriptPirate.js" },
        { url: "https://raw.githubusercontent.com/Thierry-Segarra/codeBurnet/refs/heads/main/hackSource/tools/killAllScript.js",
         target: "hackSource/tools/killAllScript.js" },
        { url: "https://raw.githubusercontent.com/Thierry-Segarra/codeBurnet/refs/heads/main/hackSource/tools/scriptPirate.js",
         target: "hackSource/tools/scriptPirate.js" },
        { url: "https://raw.githubusercontent.com/Thierry-Segarra/codeBurnet/refs/heads/main/hackSource/tools/transfereScriptPirate.js",
         target: "hackSource/tools/transfereScriptPirate.js" },
        { url: "https://raw.githubusercontent.com/Thierry-Segarra/codeBurnet/refs/heads/main/hackSource/action/hack.js",
         target: "hackSource/action/hack.js" },
    ];

    // Télécharger chaque fichier
    for (const file of filesToDownload) {
        ns.tprint(`Téléchargement de ${file.url} vers ${file.target}...`);
        await ns.wget(file.url, file.target);  // Téléchargement du fichier
        ns.tprint(`Fichier téléchargé : ${file.target}`);
    }

    ns.tprint("Tous les fichiers ont été téléchargés.");
}

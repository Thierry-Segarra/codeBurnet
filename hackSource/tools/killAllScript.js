/** @param {NS} ns */
export async function main(ns) {
  var server = ns.args[0]
  ns.killall(server);
  ns.tprint(`✅ KillAll avec succès sur le serveur ${server} !`)
}
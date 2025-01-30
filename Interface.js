/** @param {NS} ns **/
import { mainMenu } from "hackSource/menuConfig.js";
//import { mainMenu } from "hackSource/menuConfig.js";

/** @param {NS} ns **/
export async function main(ns) {
    // Charge le JSON contenant les informations
    await mainMenu(ns);
}

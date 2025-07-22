import "dotenv/config";
import inquirer from "inquirer";
import { AppDataSource } from "./src/services/db";
import { getAllSites, createSite, updateSite, deleteSite } from "./src/services/siteService";

async function main() {
  await AppDataSource.initialize();
  let exit = false;

  while (!exit) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Выберите действие:",
        choices: [
          { name: "Посмотреть сайты", value: "list" },
          { name: "Добавить сайт", value: "add" },
          { name: "Изменить сайт", value: "update" },
          { name: "Удалить сайт", value: "remove" },
          { name: "Выйти", value: "exit" },
        ],
      },
    ]);

    switch (action) {
      case "list": {
        const sites = await getAllSites();
        console.table(sites);
        break;
      }
      case "add": {
        const newSiteData = await inquirer.prompt([
          { type: "input", name: "name", message: "Название сайта:" },
          { type: "input", name: "url", message: "URL сайта (например, https://google.com):" },
          { type: "input", name: "cronInterval", message: "Интервал cron:", default: "*/5 * * * *" },
        ]);
        await createSite(newSiteData);
        console.log("Сайт добавлен!");
        break;
      }
      case "update": {
        const sitesToUpdate = await getAllSites();
        if (sitesToUpdate.length === 0) {
          console.log("Нет сайтов для изменения.");
          break;
        }
        const { siteToUpdateId } = await inquirer.prompt([
          {
            type: "list",
            name: "siteToUpdateId",
            message: "Выберите сайт для изменения:",
            choices: sitesToUpdate.map((s) => ({
              name: `${s.name} (${s.url})`,
              value: s.id,
            })),
          },
        ]);

        const siteDataToUpdate = await inquirer.prompt([
          { type: "input", name: "name", message: "Новое название (оставьте пустым, чтобы не менять):" },
          { type: "input", name: "url", message: "Новый URL (оставьте пустым, чтобы не менять):" },
          { type: "input", name: "cronInterval", message: "Новый интервал cron (оставьте пустым, чтобы не менять):" },
          { type: "confirm", name: "enabled", message: "Включить мониторинг?", default: true },
        ]);
        
        const updateData: any = {};
        if (siteDataToUpdate.name) updateData.name = siteDataToUpdate.name;
        if (siteDataToUpdate.url) updateData.url = siteDataToUpdate.url;
        if (siteDataToUpdate.cronInterval) updateData.cronInterval = siteDataToUpdate.cronInterval;
        updateData.enabled = siteDataToUpdate.enabled;

        await updateSite(siteToUpdateId, updateData);
        console.log("Сайт обновлен!");
        break;
      }
      case "remove": {
        const sitesToRemove = await getAllSites();
        if (sitesToRemove.length === 0) {
          console.log("Нет сайтов для удаления.");
          break;
        }
        const { siteToRemoveId } = await inquirer.prompt([
          {
            type: "list",
            name: "siteToRemoveId",
            message: "Выберите сайт для удаления:",
            choices: sitesToRemove.map((s) => ({
              name: `${s.name} (${s.url})`,
              value: s.id,
            })),
          },
        ]);
        await deleteSite(siteToRemoveId);
        console.log("Сайт удалён!");
        break;
      }
      case "exit":
        exit = true;
        break;
    }
  }
  await AppDataSource.destroy();
}

main(); 
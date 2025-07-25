import "dotenv/config";
import inquirer from "inquirer";
import { AppDataSource } from "./src/services/db.js";
import { Site } from "./src/entities/Site.js";
import {
  getAllSites,
  createSite,
  updateSite,
  deleteSite,
} from "./src/services/siteService.js";
import { getAllLogs, getLogsBySite } from "./src/services/logService.js";
import { getActiveCrons, createCron } from "./src/services/cronService.js";

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
          { name: "Посмотреть логи", value: "logs" },
          { name: "Создать cronJob для сайта", value: "createCronJob" },
          { name: "Посмотреть активные cron-задачи", value: "crons" },
          { name: "Выйти", value: "exit" },
        ],
      },
    ]);

    switch (action) {
      case "list":
        const sites = await getAllSites();
        console.table(sites);
        break;

      case "add":
        const newSiteData = await inquirer.prompt([
          { name: "name", message: "Название сайта:" },
          { name: "url", message: "URL сайта (например, https://google.com):" },
          {
            name: "cronInterval",
            message: "Интервал cron:",
            default: "*/5 * * * *",
          },
        ]);
        await createSite(newSiteData);
        console.log("Сайт добавлен!");
        break;

      case "update":
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
          { name: "name", message: "Новое название (оставьте пустым, чтобы не менять):" },
          { name: "url", message: "Новый URL (оставьте пустым, чтобы не менять):" },
          { name: "cronInterval", message: "Новый интервал cron (оставьте пустым, чтобы не менять):" },
          { type: 'confirm', name: 'enabled', message: 'Включить мониторинг?', default: true },
        ]);
        
        const updateData = {};
        if (siteDataToUpdate.name) updateData.name = siteDataToUpdate.name;
        if (siteDataToUpdate.url) updateData.url = siteDataToUpdate.url;
        if (siteDataToUpdate.cronInterval) updateData.cronInterval = siteDataToUpdate.cronInterval;
        updateData.enabled = siteDataToUpdate.enabled;

        await updateSite(siteToUpdateId, updateData);
        console.log("Сайт обновлен!");
        break;

      case "remove":
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

      case "logs":
        const { logViewType } = await inquirer.prompt([
          {
            type: "list",
            name: "logViewType",
            message: "Показать логи:",
            choices: [
              { name: "Все логи", value: "all" },
              { name: "По сайту", value: "bySite" },
            ],
          },
        ]);
        if (logViewType === "all") {
          const logs = await getAllLogs({ limit: 100 });
          if (logs.length === 0) {
            console.log("Логи отсутствуют.");
          } else {
            console.table(logs.map(l => ({
              id: l.id,
              siteId: l.siteId,
              status: l.status,
              createdAt: l.createdAt
            })));
          }
        } else {
          const sitesForLogs = await getAllSites();
          if (sitesForLogs.length === 0) {
            console.log("Нет сайтов для отображения логов.");
            break;
          }
          const { siteIdForLogs } = await inquirer.prompt([
            {
              type: "list",
              name: "siteIdForLogs",
              message: "Выберите сайт:",
              choices: sitesForLogs.map((s) => ({
                name: `${s.name} (${s.url})`,
                value: s.id,
              })),
            },
          ]);
          const logs = await getLogsBySite(siteIdForLogs, { limit: 100 });
          if (logs.length === 0) {
            console.log("Логи для этого сайта отсутствуют.");
          } else {
            console.table(logs.map(l => ({
              id: l.id,
              siteId: l.siteId,
              status: l.status,
              createdAt: l.createdAt
            })));
          }
        }
        break;

      case "crons":
        const crons = await getActiveCrons();
        if (crons.length === 0) {
          console.log("Нет активных cron-задач.");
        } else {
          // Попробуем сопоставить siteId с именем сайта для удобства
          const sites = await getAllSites();
          const siteMap = Object.fromEntries(sites.map(s => [s.id, s.name]));
          console.table(crons.map(c => ({
            siteId: c.siteId,
            siteName: siteMap[c.siteId] || '',
            running: c.status === 1 ? 'Да' : 'Нет'
          })));
        }
        break;

      case "createCronJob":
        const sitesToCreateCron = await getAllSites();
        if (sitesToCreateCron.length === 0) {
          console.log("Нет сайтов для создания cronJob.");
          break;
        }
        const { siteIdToCreateCron } = await inquirer.prompt([
          {
            type: "list",
            name: "siteIdToCreateCron",
            message: "Выберите сайт для создания задачи:",
            choices: sitesToCreateCron.map((s) => ({
              name: `${s.name} (${s.url}) — текущий интервал: ${s.cronInterval}`,
              value: s.id,
            })),
          },
        ]);
        // Находим выбранный сайт, чтобы получить его интервал
        const siteIntervalToCreateCron = sitesToCreateCron.find(site => site.id === siteIdToCreateCron);
        await createCron(siteIdToCreateCron, siteIntervalToCreateCron.cronInterval);
        console.log("Cron усешно создан!");
        break;

      case "exit":
        exit = true;
        break;
    }
  }
  await AppDataSource.destroy();
}

main();

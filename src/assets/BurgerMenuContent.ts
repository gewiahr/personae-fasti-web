import { BurgerMenuItem, BurgerMenuItemCallable, BurgerMenuItemCategory, BurgerMenuItemLink } from "../components/BurgerMenuItems";
import { CharMetaData, LocationMetaData, NPCMetaData } from "../types/entities";
import { config } from "../utils/config";

const compendiumPath = config.compendiumBaseUrl;
const indent = '\xa0\xa0\xa0\xa0\xa0\xa0';

export const burgerMenuItems: (BurgerMenuItem | BurgerMenuItemLink | BurgerMenuItemCategory | BurgerMenuItemCallable)[] = [
  { name: `${indent}События`, internal: true, path: '/' } as BurgerMenuItemLink,

  {
    name: `${indent}Сущности`, foldable: true, open: false, children: [
      { name: `${CharMetaData.Icon} Герои`, path: '/chars', internal: true } as BurgerMenuItemLink,
      { name: `${NPCMetaData.Icon} Персонажи`, path: '/npcs', internal: true } as BurgerMenuItemLink,
      { name: `${LocationMetaData.Icon} Локации`, path: '/locations', internal: true } as BurgerMenuItemLink,
    ]
  } as BurgerMenuItemCategory,

  { name: `📜 Квесты`, path: '/quests', internal: true } as BurgerMenuItemLink,
  { name: `${indent}Настройки`, path: '/settings', internal: true } as BurgerMenuItemLink,
  { name: `📚 Правила`, path: `${compendiumPath}/`, internal: false } as BurgerMenuItemLink,
  { name: `🔨 Предметы`, path: `${compendiumPath}/things`, internal: false } as BurgerMenuItemLink,
];
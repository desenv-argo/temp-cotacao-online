import type { AppSidebarGroup, AppSidebarItem } from '../ui/layout/AppSidebar';

export interface MenuSearchEntry {
  label: string;
  path: string;
  icon?: string;
  groupLabel: string;
}

function normalizeSearchText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function flattenNavigableMenuItems(
  homeItem: AppSidebarItem | undefined,
  quickAccessItems: AppSidebarItem[],
  groups: AppSidebarGroup[]
): MenuSearchEntry[] {
  const raw: MenuSearchEntry[] = [];

  if (homeItem?.path && !homeItem.disabled) {
    raw.push({
      label: homeItem.label,
      path: homeItem.path,
      icon: homeItem.icon,
      groupLabel: 'Início',
    });
  }

  for (const item of quickAccessItems) {
    if (item.path && !item.disabled) {
      raw.push({
        label: item.label,
        path: item.path,
        icon: item.icon,
        groupLabel: 'Acesso rápido',
      });
    }
  }

  for (const group of groups) {
    for (const item of group.items) {
      if (item.path && !item.disabled) {
        raw.push({
          label: item.label,
          path: item.path,
          icon: item.icon,
          groupLabel: group.label,
        });
      }
      if (item.items) {
        for (const sub of item.items) {
          if (sub.path && !sub.disabled) {
            raw.push({
              label: sub.label,
              path: sub.path,
              icon: sub.icon,
              groupLabel: group.label,
            });
          }
        }
      }
    }
  }

  const seen = new Set<string>();
  return raw.filter((e) => {
    if (seen.has(e.path)) return false;
    seen.add(e.path);
    return true;
  });
}

const MAX_RESULTS = 14;

export function filterMenuSearchEntries(entries: MenuSearchEntry[], query: string): MenuSearchEntry[] {
  const q = normalizeSearchText(query.trim());
  if (!q) return [];

  return entries
    .filter((e) => {
      const label = normalizeSearchText(e.label);
      const group = normalizeSearchText(e.groupLabel);
      return label.includes(q) || group.includes(q);
    })
    .slice(0, MAX_RESULTS);
}

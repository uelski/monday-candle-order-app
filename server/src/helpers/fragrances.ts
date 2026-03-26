import mondaySdk from 'monday-sdk-js';
import {Logger} from '@mondaycom/apps-sdk';

const logger = new Logger('fragrances');

const monday = mondaySdk({ token: process.env.MONDAY_API_TOKEN });

// ── helpers ──────────────────────────────────────────────────────────────────

const getDropdownSettings = async (boardId: string) => {
    const result = await monday.api(`
      query {
        boards(ids: [${boardId}]) {
          columns(ids: ["dropdown"]) {
            settings
            revision
          }
        }
      }
    `);
    const column = result.data.boards[0].columns[0];
    logger.info(`Column: ${JSON.stringify(column)}`);
    const settings = column.settings;
    logger.info(`Settings: ${JSON.stringify(settings)}`);
    return {
      settings,                                                    // ← return full settings
      labels: settings.labels as { id: number; label: string }[],
      revision: column.revision as string
    };
};

const updateDropdownColumn = async (
    boardId: string,
    revision: string,
    existingSettings: Record<string, any>,                        // ← accept full settings
    labels: { id: number; label: string; is_deactivated?: boolean }[]
  ) => {
    const { labels: _labels, ...restSettings } = existingSettings;
    return monday.api(`
      mutation($settings: DropdownColumnSettingsInput!) {
        update_dropdown_column(
          board_id: ${boardId},
          id: "dropdown",
          revision: "${revision}",
          settings: $settings
        ) { id }
      }
    `, {
      variables: {
        settings: {
          ...restSettings,  // ← preserve all existing settings
          labels               // ← only override labels
        }
      }
    });
};

// ── operations ───────────────────────────────────────────────────────────────

export const addDropdownLabel = async (boardId: string, name: string) => {
    const { settings, labels, revision } = await getDropdownSettings(boardId);
    const nextId = labels.length > 0 ? Math.max(...labels.map(l => l.id)) + 1 : 1;
    await updateDropdownColumn(boardId, revision, settings, [
      ...labels,
      { id: nextId, label: name }
    ]);
};
  
  export const renameDropdownLabel = async (boardId: string, oldName: string, newName: string) => {
    const { settings, labels, revision } = await getDropdownSettings(boardId);
    const updated = labels.map(l =>
      l.label === oldName ? { ...l, label: newName } : l
    );
    await updateDropdownColumn(boardId, revision, settings, updated);
};
  
  export const deactivateDropdownLabel = async (boardId: string, name: string) => {
    const { settings, labels, revision } = await getDropdownSettings(boardId);
    const updated = labels.map(l =>
      l.label === name ? { ...l, is_deactivated: true } : l
    );
    await updateDropdownColumn(boardId, revision, settings, updated);
};
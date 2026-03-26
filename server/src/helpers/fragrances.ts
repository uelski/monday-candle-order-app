import {Logger} from '@mondaycom/apps-sdk';

const logger = new Logger('fragrances');

// ── helpers ──────────────────────────────────────────────────────────────────

const mondayFetch = async (query: string, variables?: Record<string, any>) => {
    const res = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.MONDAY_API_TOKEN!,
        'API-Version': '2025-10'
      },
      body: JSON.stringify({ query, variables })
    });
    return res.json();
};

const getDropdownSettings = async (boardId: string) => {
    const result = await mondayFetch(`
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
    const settings = column.settings;
    logger.info(`Labels in get settings: ${JSON.stringify(settings.labels)}`);
    return {
      settings,                                                    // ← return full settings
      labels: settings.labels as { id: number; label: string }[],
      revision: column.revision as string
    };
};

const updateDropdownColumn = async (
    boardId: string,
    revision: string,
    existingSettings: Record<string, any>,
    labels: { id?: number; label: string; is_deactivated?: boolean }[]
  ) => {
    const { labels: _labels, ...restSettings } = existingSettings;
    logger.info(`Labels in update dropdown column: ${JSON.stringify(labels)}`);
    return mondayFetch(`
      mutation($settings: UpdateDropdownColumnSettingsInput!) {
        update_dropdown_column(
          board_id: ${boardId},
          id: "dropdown",
          revision: "${revision}",
          settings: $settings
        ) { id }
      }
    `, {
      settings: {        // ← directly, no wrapping in { variables: }
        labels
      }
    });
};

// ── operations ───────────────────────────────────────────────────────────────

export const addDropdownLabel = async (boardId: string, name: string) => {
    const { settings, labels, revision } = await getDropdownSettings(boardId);
    const updateResult = await updateDropdownColumn(boardId, revision, settings, [
      ...labels,
      { label: name }
    ]);
    logger.error(`Update error: ${JSON.stringify(updateResult.errors)}`);
};
  
export const renameDropdownLabel = async (boardId: string, oldName: string, newName: string) => {
    const { settings, labels, revision } = await getDropdownSettings(boardId);
    const index = labels.findIndex(l => l.label === oldName);
    if (index === -1) return;
    labels[index] = { ...labels[index], label: newName }; 
    const updateResult = await updateDropdownColumn(boardId, revision, settings, labels);
    logger.error(`Update error: ${JSON.stringify(updateResult.errors)}`);
    await getDropdownSettings(boardId);
};
  
export const deactivateDropdownLabel = async (boardId: string, name: string) => {
    const { settings, labels, revision } = await getDropdownSettings(boardId);
    const updated = labels.map(l =>
      l.label === name ? { ...l, is_deactivated: true } : l
    );
    const updateResult = await updateDropdownColumn(boardId, revision, settings, updated);
    logger.error(`Update error: ${JSON.stringify(updateResult.errors)}`);
};
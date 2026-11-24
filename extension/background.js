const LIVE_PWA =
  "https://khyejqvutrjwxljuhmot.supabase.co/functions/v1/swipe-app/";

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(() => {});

chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (tab?.windowId != null) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
      return;
    }
  } catch (err) {
    /* fall through to live PWA tab */
  }
  await chrome.tabs.create({ url: LIVE_PWA });
});

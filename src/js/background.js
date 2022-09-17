import ChromeExecuter from './chromeExtecuter';

const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

const capture = async (options) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(null, { format: 'jpeg' }, (base64Data) => {
      return resolve(base64Data);
    });
  });
};

chrome.action.onClicked.addListener(async (tab) => {
  console.log('onclicked', tab);
  ChromeExecuter.executeScript({
    target: { tabId: tab.id },
    files: ['build/js/contents.bundle.js'],
  }).then((res) => console.log(res));
});

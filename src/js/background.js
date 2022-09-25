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

const goToNextPage = ({ tabId }) => {
  // console.log('goToNextPage', { tabId });
  // chrome.debugger.sendCommand({
  //   target: { tabId },
  //   method: 'Input.dispatchMouseEvent',
  //   commandParams: {
  //     type: 'mouseWheel',
  //     deltaY: 800,
  //   },
  //   callback: function () {
  //     console.log('wheeled', tabId);
  //   },
  // });
  // const screen = document.querySelector('.currentScreen');
  // const e = document.createEvent('MouseEvents');
  // e.initEvent('wheel', true, true);
  // e.deltaY = +800;
  // if (e.isTrusted) {
  //   screen.dispatchEvent(e);
  //   console.log(screen);
  // }
};

chrome.action.onClicked.addListener(async (tab) => {
  console.log('onclicked', tab);
  chrome.debugger.attach({ tabId: tab.id }, '1.2', function (debugg) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log(request);
      console.log(sender);
      if (request === 'goToNextPage') {
        goToNextPage({ tabId: tab.id });
        sendResponse({}); // 送り返すべきものがなければ空のObjectを返す
      } else {
        sendResponse({}); // 送り返すべきものがなければ空のObjectを返す
      }
    });
  });
  ChromeExecuter.executeScript({
    target: { tabId: tab.id },
    files: ['build/js/contents.bundle.js'],
  }).then((res) => console.log(res));
});

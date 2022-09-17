export default class ChromeExecuter {
  static executeScript(params) {
    return new Promise((resolve) =>
      chrome.scripting.executeScript(params, () => resolve('ok'))
    );
  }

  static insertCSS(params) {
    return new Promise((resolve) =>
      chrome.tabs.insertCSS(null, params, () => resolve('ok'))
    );
  }
}

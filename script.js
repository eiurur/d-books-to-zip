const INTERVAL_MS = 1500;

const loadModules = () => {
  const modules = [
    'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  ];
  modules.forEach((url) => {
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  });
};

const capture = (currentPage) => {
  return new Promise((resolve) => {
    const filename = `${currentPage}.jpg`;
    const canvas = document.querySelector('.currentScreen canvas');
    canvas.toBlob((blob) => {
      resolve({ filename, blob });
    });
  });
};

const zipGenerateAsync = (zip) => {
  return new Promise((resolve, reject) => {
    zip.generateAsync({ type: 'blob' }).then(resolve);
  });
};

const createZipBlob = async (images) => {
  const zip = new JSZip();

  images.forEach((image) => {
    zip.file(image.filename, image.blob, { binary: true });
  });

  return await zipGenerateAsync(zip);
};

const download = async (captures) => {
  const zipBlob = await createZipBlob(captures);
  const zipUrl = window.URL.createObjectURL(zipBlob);
  const bookTitle = document.title;
  const zipName = `${bookTitle}.zip`;
  saveAs(zipBlob, zipName);
  window.URL.revokeObjectURL(zipUrl);
};

const goToNextPage = () => {
  const screen = document.querySelector('.currentScreen');
  screen.click();
  const e = document.createEvent('MouseEvents');
  e.initEvent('wheel', true, true);
  e.deltaY = 800;
  screen.dispatchEvent(e);
};

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
const isShownEndDialog = () =>
  document.querySelector('#endOfBook').offsetParent !== null;

(async () => {
  loadModules();

  const captures = [];
  while (1) {
    const counter = document.querySelector('#pageSliderCounter');
    const [current, tail] = counter.textContent.split('/');
    console.log(current, tail);

    captures.push(await capture(current));
    await goToNextPage();
    await sleep(INTERVAL_MS);

    if (Number(current) >= Number(tail)) break;
    if (isShownEndDialog()) break;
  }

  console.log('END', captures);
  await download(captures);
})();

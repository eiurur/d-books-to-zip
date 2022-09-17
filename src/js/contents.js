import JSZip from 'jszip';
import saveAs from 'file-saver';

console.log('content.js');

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
  const zipName = 'aaa.zip';
  saveAs(zipBlob, zipName);
  window.URL.revokeObjectURL(zipUrl);
};

const goToNextPage = () => {
  const screen = document.querySelector('.currentScreen');
  const e = document.createEvent('MouseEvents');
  e.initEvent('wheel', true, true);
  e.deltaY = +800;
  screen.dispatchEvent(e);
  console.log(screen);
};
const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

(async () => {
  const captures = [];
  const counter = document.querySelector('#pageSliderCounter');
  const [current, tail] = counter.textContent.split('/');
  console.log(current, tail);
  for (let i = Number(current); i < Number(tail); i++) {
    console.log(i);
    await sleep(1000);
    captures.push(await capture(i));
    goToNextPage();
    await sleep(2000);
  }
  console.log('END', captures);
  download(captures);
})();

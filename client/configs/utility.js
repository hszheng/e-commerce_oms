import Configuration from './config';
import Collections from '/lib';

/**
 * 上传文件到阿里云OSS
 *
 * @param  {Object} file      文件对象
 * @param  {Object} callbacks 回调函数
 *
 * @return {Void}
 */
const uploadFileToOSS = (file, callbacks) => {
    // console.log('file', file);
    const formData = new FormData();
    const key = `files/${Date.now()}_${file.name.substr(file.name.lastIndexOf('.'))}`;
    formData.append('key', key);
    formData.append('Content-Type', 'text/plain');
    formData.append('OSSAccessKeyId', Configuration.OSS_ACCESS_KEY_ID);
    formData.append('policy', Configuration.OSS_POLICY);
    formData.append('Signature', Configuration.OSS_SIGNATURE);
    formData.append('file', file);

    let xhr = null;
    if (window.ActiveXObject) {
        xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
    } else if (window.XMLHttpRequest) {
        xhr = new window.XMLHttpRequest();
    }

    // progress事件
    if (callbacks && callbacks.progress) {
        xhr.upload.addEventListener('progress', callbacks.progress, false);
    }

    // 上传完成事件
    xhr.addEventListener('load', (e) => {
        if (callbacks && callbacks.uploaded) {
            if (/^image\/*/.test(file.type)) {
                callbacks.uploaded(e, `${Configuration.OSS_IMG_HOST}/${key}`);
            } else {
                callbacks.uploaded(e, `${Configuration.OSS_HOST}/${key}`);
            }
        }
    }, false);

    // 上传出错事件
    if (callbacks && callbacks.failed) {
        xhr.addEventListener('error', callbacks.failed, false);
    }

    // 取消上传事件
    if (callbacks && callbacks.canceled) {
        xhr.addEventListener('abort', callbacks.canceled, false);
    }

    xhr.open('POST', Configuration.OSS_URL, true);
    xhr.send(formData);
};

/**
 * 将base64转换为blob对象
 *
 * @param  {String} dataURI 文件base64
 *
 * @return {Object}         blob对象
 */
const dataURIToBlob = (dataURI) => {
    let byteString = '';
    let mimeString = '';
    let ia = '';

    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
    } else {
        byteString = unescape(dataURI.split(',')[1]);
    }

    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    ia = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
};

/**
 * 压缩图片并且上传至阿里云OSS
 *
 * @param  {Object} file      文件对象
 * @param  {Object} callbacks 回调函数
 *
 * @return {Void}
 */
const resizeImageAndUploadToOSS = (file, callbacks) => {
    // console.log('file.type', file.type);
    if (typeof file === 'string') {
        const img = new Image();
        img.onload = () => {
            let canvas = $('#resizeUploadImage')[0];
            if (!canvas) {
                $('body').append('<canvas id="resizeUploadImage" style="display: none;"></canvas>');
                canvas = $('#resizeUploadImage')[0];
            }
            const context = canvas.getContext('2d');

            if (img.width > img.height) {
                img.height = img.height * 800 / img.width;
                img.width = 800;
            } else {
                img.width = img.width * 800 / img.height;
                img.height = 800;
            }
            canvas.width = img.width;
            canvas.height = img.height;
            context.clearRect(0, 0, img.width, img.height);
            context.drawImage(img, 0, 0, img.width, img.height);
            const blob = dataURIToBlob(canvas.toDataURL('image/png'));
            blob.name = 'base64.png';
            blob.type = 'image/png';
            uploadFileToOSS(blob, callbacks);
        };
        img.src = file;
    } else if (!/^image*/.test(file.type)) {
        uploadFileToOSS(file, callbacks);
    } else {
        const reader = new FileReader();
        reader.onload = (e) => {
            // console.log('e', e);
            const img = new Image();
            img.onload = () => {
                let canvas = $('#resizeUploadImage')[0];
                if (!canvas) {
                    $('body').append('<canvas id="resizeUploadImage" style="display: none;"></canvas>');
                    canvas = $('#resizeUploadImage')[0];
                }
                const context = canvas.getContext('2d');

                if (img.width > img.height) {
                    img.height = img.height * 800 / img.width;
                    img.width = 800;
                } else {
                    img.width = img.width * 800 / img.height;
                    img.height = 800;
                }
                canvas.width = img.width;
                canvas.height = img.height;
                context.clearRect(0, 0, img.width, img.height);
                context.drawImage(img, 0, 0, img.width, img.height);
                const blob = dataURIToBlob(canvas.toDataURL());
                blob.name = file.name;
                blob.type = file.type;
                uploadFileToOSS(blob, callbacks);
                // console.log('blob', dataURIToBlob(canvas.toDataURL()));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        // console.log('reader.readAsDataURL(file)', reader.readAsDataURL(file));
    }
};

/**
 * 获取URL中的参数的值
 *
 * @param  {String} key 参数
 *
 * @return {String}     值
 */
const parse = (key) => {
    let result = '';
    let tmp = [];
    location.search
        .substr(1)
        .split('&')
        .forEach((item) => {
            tmp = item.split('=');
            if (tmp[0] === key) {
                result = decodeURIComponent(tmp[1]);
            }
        });
    return result;
};

export default {
    uploadFileToOSS,
    dataURIToBlob,
    resizeImageAndUploadToOSS,
    parse,
};

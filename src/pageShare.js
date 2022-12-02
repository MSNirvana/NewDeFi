import { useState ,useEffect} from 'react';
import './pageshare.css';
import QRCode from 'qrcode.react';
import {message} from 'antd';
import copy from "copy-to-clipboard";
import domtoimage from 'dom-to-image';
import tp from'tp-js-sdk';
import { useTranslation } from 'react-i18next';
// import * as htmlToImage from 'html-to-image';
// import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

import FileSaver from 'file-saver';
import FomoProxy from "./abi/FomoProxy.json";

function App() {
  const { t,i18n} = useTranslation();
  useEffect(()=>{
    window.ethereum.enable().then(()=>{
      let u = 'https://www.ndfdao.net?t='+window.dapp.currentAccount.address;
      changeurl(u)

    })
  },[])
  const [url,checkurl] = useState("");
  const changeurl = (item) => {
    checkurl(url => item)
  };
  const formDete10 = (str) => {
    return str.substr(0,28)+"***"+str.substr(-12);
  };
  const Clickcopy = () => {
    let u = 'https://www.ndfdao.net/?t='+window.dapp.currentAccount.address;
    message.success('Success copy');
    copy(u)
  }
  const htmltoJpeg = () => {
    domtoimage.toJpeg(document.getElementById('pageshare'), { quality: 0.95 })
      .then(function (dataUrl) {
        // var link = document.createElement('a');
        // link.download = 'my-image-name.jpeg';
        // link.href = dataUrl;
        // link.click();
        tp.saveImage({
          url:dataUrl
        });
      });
  }
  // const htmltoJpeg = () => {
  //   htmlToImage.toJpeg(document.getElementById('pageshare'), { quality: 0.95 })
  //     .then(function (dataUrl) {
  //       var link = document.createElement('a');
  //       link.download = 'my-image-name.jpeg';
  //       link.href = dataUrl;
  //       link.click();
  //
  //     });
  // }


  const [imgUrl,checkimgUrl] = useState("");

  return (
    <div className="pageshare" id="pageshare">
      <div className="index">
        <div className="top">
          <div className="t1">{t('t1')}</div>
          <div className="t2">{t('t2')}</div>
          <div className="t3"><span>{t('t72')}</span></div>
          <div className="img"><QRCode  value={url} size={360} /></div>
          <canvas hidden={true} id="canvas" style={{width:300,height:300}}/>
          <div className="t4">
            <div className="t4_1">{t('t73')}</div>
            <div className="t4_2">{url}</div>
          </div>
          {/*<div className="t5"></div>*/}
        </div>
      </div>
      <div className="index_bottom">
        <div onClick={Clickcopy.bind(this)}><span>{t('t74')}</span></div>
        <div onClick={htmltoJpeg}><span>{t('t75')}</span></div>
      </div>
    </div>
  );
}

export default App;

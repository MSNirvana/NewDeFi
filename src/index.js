import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'lib-flexible';
import './i18n';

window.FomoToken = "0x865816E67dc4DEd5a528265BfAcBDDC9B7951913";
window.FomoProxy = "0x65C5CB52cb365008d633044D9ae74A080301484a";
window.LP = "0xF049fCE1b935f79C334CEaE9BDf9857660e27DCf";
window.SwapBridge = "0xcd2e0EfE8Ea77C2a328F1250e0Afb956f70Fd00f";
window.usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
window.SwapRouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
window.uintmax = " ";
window.buyback = "0x549D3F545FCacbDE152f67A6508F092700023aE8";

window.NFT = "0xae3E875f441C5723745302667D9bA5874f070Dea";
window.NFTFarm = "0xA9F1f87eeBd9D2A40Be70f11687D006e6934b5e1";
window.CoreFarm = "0x298399a470f5711a086f28a1A9520cbBe5c2032C";

window.oldLP = "0xeAB7339f187AbF3C9C145D97590d4C92479F6490";
window.LpSwapTool = "0x75799ce35cC6E4964ED109A5555D4A14f15Adc3e";

window.panaddress = "0x227B93ea1A0505b36E832A5A7B5B5D1305B76ee0";
window.racaAddress = "0x55d398326f99059fF775485246999027B3197955";
window.uintmax = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
window.networkEnv = "mian";
window.ReadySwapRouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

// // test
// window.FomoToken = "0xfA806133b061F14dF9Fb017Be3c7b497625a89aE";
// window.FomoProxy = "0xb630e57ff5f8f4532246288C89B1d85540328123";
// window.LP = "0xeB36c543ED14040FB563ACcB541f02FA481059a8";
// window.SwapBridge = "0x62C4c32fe8Ac93Cac0444137A919631d328c7C51";
// window.usdtAddress = "0x70F4a22074B66D72B1fc2bFfaa85270f8980B21A";
// window.SwapRouter = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
// window.uintmax = " ";
// window.buyback = "0x549D3F545FCacbDE152f67A6508F092700023aE8";
//
// window.NFT = "0x38714Ebb949eBD8374aBf4278B862BDc62f7543C";
// window.NFTFarm = "0x4DF8e4ECc43c6ce51D9c24b7cdB3310C2a9F1FB6";
// window.CoreFarm = "0x0943119F1cb15710e76D202D6991dF5EE21DF705";
//
// window.oldLP = "0xeB36c543ED14040FB563ACcB541f02FA481059a8";
// window.LpSwapTool = "0x75799ce35cC6E4964ED109A5555D4A14f15Adc3e";
//
// window.panaddress = "0x227B93ea1A0505b36E832A5A7B5B5D1305B76ee0";
// window.racaAddress = "0x55d398326f99059fF775485246999027B3197955";
// window.uintmax = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
// window.networkEnv = "test";
// window.ReadySwapRouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E";


window.text = "暂未开始";
window.statusTime = true;
window.isprice = true;
window.isGlobalReward = false;
window.ismoduan = true;
window.isbandleater = false;
window.isbuycount = false;
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

import {useEffect, useState} from 'react';
import {Button, Dropdown, Menu, message, Modal, Progress, Spin} from 'antd';
import $ from 'jquery';
import {useMount} from 'ahooks';
import Dapp from '@hightall/dapp-lib'
import './App.css';
import {reloadDapp} from "./dapp";
import v2Abi from "./abi/ERC20.json";
import Sell from "./sell";
import Buy from "./buy";
import PageShare from "./pageShare";
import Volunteer from "./volunteer";
import Goals from "./Goals";
import BigNumber from 'bignumber.js';
import Countdown from 'react-countdown';
import FomoProxy from "./abi/FomoProxy.json";
import CoreFarm from "./abi/CoreFarm.json";
import FomoToken from "./abi/FomoToken.json";
import LPToken from "./abi/LP.json";
import SwapBridge from "./abi/FomoSwapBridge.json";
import copy from 'copy-to-clipboard';
import {ethers} from "ethers";
import {useTranslation} from 'react-i18next';

const {confirm} = Modal;
const price = 3000;

function App() {
  const [pancake, changepancake] = useState(0.00);
  const [pasct, changepasct] = useState(0);
  const [isfot, changeisfot] = useState(false);
  const pushAddress = () => {
    $.ajax({
      url: 'https://api.pancakeswap.info/api/v2/tokens/0x865816E67dc4DEd5a528265BfAcBDDC9B7951913',
      type: 'GET',
      dataType: 'json',
      success: function (res) {
        let it = res.data.price;
        changepancake(NumFixedPrice(it))
        setTimeout(function () {
          pushAddress();
        }, 30000)
      }
    });
  };
  const {t, i18n} = useTranslation();
  let f;
  const [isloading, checkloading] = useState(1);
  const changeloading = (item) => {
    checkloading(isloading => item)
  };
  const onDappEnabled = (account) => {

    localStorage.setItem('account-address', account.address);
    let location = window.location.href;
    changeshareUrl(location + '?t=' + account.address)

  }
  const [tokenuser, checktokenuser] = useState("");
  useEffect(() => {
    window.ethereum.enable().then(() => {
      pushAddress();
      clearInterval(f);
      if (!window._fomo) {
        window._fomo = {};
        window._fomo.followSet = new Map();
        window._fomo.buyFollowSet = new Map();
        window._fomo.sVipSet = new Map();
      }
      // ----gong gao---
      ChangeshowClock(true)
      if (window.statusTime) {
        ChangeshowPlus(true)
        ChangeshowClock(true)
      }
      loaddata(0);
      f = setInterval(function () {
        queryData();
        // loaddata();
      }, 10000)
    })
  }, [])
  useMount(() => {
    reloadDapp(onDappEnabled);
  })
  const [urlsc, urlscchange] = useState("");
  const Clickcopy = () => {
    let u = window.location.href + '?t=' + window.dapp.currentAccount.address;
    message.success('Success copy');
    copy(u)
  }
  const getQueryString = (name) => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  }
  const loginoutres = () => {
    localStorage.clear();
    window.location.reload();
  }
  const setUserLeader = async () => {
    if (window.dapp) {
      let userToken = getQueryString("t");

      try {
        // let sprs = window.dapp.parseEther('0.1')
        await window.dapp.executeContract(window.FomoProxy, FomoProxy, "setUserLeader", [userToken])
        let url = window.location.href;
        let returnUrl = url.split("?")[0];
        window.location = returnUrl
      } catch (e) {
        let sst = t("t43")
        message.error(sst);
      }
    } else {
      setTimeout(function () {
        setUserLeader();
      }, 1000)
    }
  }
  const [totalCount, checktotalCount] = useState(0);
  const changetotalCount = (item) => {
    // if(item > 10000){
    //   let i = item%10000;
    //   item = item - 10000*i;
    // }
    // let Bign = new BigNumber(item.toString());
    // console.log("====",Bign)
    // let item1 = 100000 - Bign.div(10**18).toString();
    // item = Number(item1).toFixed(2);
    // item = 10000-item

    let Bign = new BigNumber(item.toString());
    let mycoin = 100000 - Bign.div(10 ** 18).toString();
    item = Number(mycoin).toFixed(2);
    checktotalCount(totalCount => item)
  };
  const [totalUsdt, checktotalUsdt] = useState(0);
  const changetotalUsdt = (item) => {
    let r = (item.toString()).split(".");
    if (r.length == 2) {
      let b = r[0] + '.' + r[1].substr(0, 2)
      checktotalUsdt(totalUsdt => b)
    } else {
      checktotalUsdt(totalUsdt => item)
    }

  };
  const [burn, checkburn] = useState(0.00);
  const changeburn = (item) => {
    let Bign = new BigNumber(item.toString());
    let mycoin = 10000000000 - Bign.div(10 ** 18).toString();
    item = Number(mycoin).toFixed(2);
    checkburn(burn => item)
  };
  const [mobility, checkmobility] = useState(0);
  const changemobility = (item) => {
    checkmobility(mobility => item)
  };
  const [shareLP, checkshareLP] = useState(0);
  const changeshareLP = (item) => {
    item = (item * 100).toFixed(2).toString() + "%"
    checkshareLP(shareLP => item)
  };
  const [reducefomom, checkreducefomom] = useState(0);
  const changereducefomom = (item) => {
    if (item == 0) {
      item = item.toFixed(2)
    }
    checkreducefomom(reducefomom => item)
  };
  const [shareUsdt, checkshareUsdt] = useState(0);
  const changeshareUsdt = (item) => {
    if (item == 0) {
      item = item.toFixed(2)
    }
    checkshareUsdt(shareUsdt => item)
  };

  const [userType, setUserType] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [SVipCount, setSVipCount] = useState(0);

  const closeShare = () => {
    showshareHide()
  }
  const dateFormat = (time) => {
    time = time + "000"
    time = parseInt(time)

    const t = new Date(time)
    // 日期格式
    const format = 'Y-m-d h:i:s'
    // const format = 'm-d'
    const year = t.getFullYear()
    // 由于 getMonth 返回值会比正常月份小 1
    const month = t.getMonth() + 1
    const day = t.getDate()
    const hours = t.getHours()
    const minutes = t.getMinutes()
    const seconds = t.getSeconds()
    const hash = {
      'Y': year,
      'm': month,
      'd': day,
      'h': hours,
      'i': minutes,
      's': seconds
    }
    return format.replace(/\w/g, o => {
      return hash[o]
    })
  }

  const [showList, setShowlist] = useState([]);
  const showlistuserchange = (xset) => {
    let listArr = [];
    xset.forEach((item) => {
      listArr.push(
        <div className="userInfo">
          {item.user ? <div className="sss">
            <span>{item.time}</span>
            <span className={item.isUserBuy ? "" : "filterGray"}><a
              href={"https://bscscan.com/address/" + item.user}>{formDete8(item.user)}</a></span>
          </div> : <div>{t("t66")}</div>
          }
        </div>
      )
    })

    setShowlist(listArr)
  };
  const changeuserlis = () => {
    showlistuserchange(window._fomo.followSet)
  };
  const changeuserlismvp = () => {
    showlistuserchange(window._fomo.sVipSet)
  };
  const NumFixed = (item) => {
    let slp = item.split(".");
    if (slp.length > 1) {
      let pock = slp[0] + '.' + slp[1].substr(0, 2)
      pock = Number(pock);
      return pock;
    } else {
      let st = slp[0];
      st = Number(st)
      return st
    }
  };
  const NumFixedPrice = (item) => {
    let slp = item.split(".");
    if (slp.length > 1) {
      let pock = slp[0] + '.' + slp[1].substr(0, 7)
      pock = Number(pock);
      return pock;
    } else {
      let st = slp[0] + '.00';

      return st
    }
  };
  const [showClock, ChangeshowClock] = useState(false);
  const [showPlus, ChangeshowPlus] = useState(false);

  const loaddata = async (flag) => {

    if (window.dapp) {
      let isInit = localStorage.getItem(window.dapp.currentAccount.address.toString() + 'init');
      if (isInit !== '1') {
        await queryData()
      }
      changeloading(0)

      let self = this;
      let u = window.location.href + '?t=' + window.dapp.currentAccount.address;
      // console.log("-----", u);
      urlscchange(u)
      //NFT
      const x = window.dapp.onAccountChanged(function (res) {
        reloadDapp(onDappEnabled(res));
        loaddata()
      });

      const starttime = await window.dapp.queryContract(window.FomoProxy, FomoProxy, "gameStartTimestamp", [])
      if (parseInt(starttime.toString()) != 0) {
        changestarttime(parseInt(starttime.toString() + '000'))
        let nowTM = new Date().getTime();
        let snTM = parseInt(starttime.toString() + '000');
        if (window.statusTime && nowTM < snTM) {
          if (window.statusTime) {
            ChangeshowClock(true)
          }
        } else {
          window.text = 'network is busy!'
        }
      } else {

        if (window.statusTime) {
          ChangeshowPlus(true)
          ChangeshowClock(true)
        }

        window.text = '暂未开始！'
      }

      // // ----gong gao---
      // ChangeshowClock(true)
      // if(window.statusTime){
      //   ChangeshowPlus(true)
      //   ChangeshowClock(true)
      // }

      let myredeem = localStorage.getItem('myredeem');
      changemobility(myredeem)

      let share = localStorage.getItem('share');
      changeshareLP(share)

      let pan = localStorage.getItem('pan');
      pan = NumFixed(pan.toString())
      pan = Number(pan)
      changereducefomom(pan)

      let panUsdt = localStorage.getItem('panUsdt');
      panUsdt = NumFixed(panUsdt.toString())
      panUsdt = Number(panUsdt)
      changeshareUsdt(panUsdt)

      // let Count = await window.dapp.queryContract(window.FomoProxy,FomoProxy,"totalUsdt",[])
      // changetotalCount(Count.toString())
      // console.log("---43--",Count.toString());

      let rect = new BigNumber(localStorage.getItem('rect'));
      changetotalUsdt(rect)

      const usdtBalance = await window.dapp.queryContract(window.FomoProxy, FomoProxy, "_nextBuyBackTimestamp", [])
      reduceTime(parseInt(usdtBalance.toString() + '000'))

      // changeloading(0)

      // const nftuser = await window.dapp.queryContract(window.FomoProxy,FomoProxy,"getUser",window.dapp.currentAccount.address)
      const nftuser = JSON.parse(localStorage.getItem(window.dapp.currentAccount.address.toString() + 'nftuser'));
      // const nftuser = await window.dapp.queryContract(window.FomoProxy,FomoProxy,"getUser",'0x6732746c6a70Ab5a9cB4d6a9e4Bd5b06cfb54Bb7')
      // console.log('nft-----',nftuser[0])
      let Bignssg = new BigNumber(nftuser[0][8].toString());
      let mycoinssg = Number(Bignssg.div(10 ** 18).toString());
      if (mycoinssg > 5000 && nftuser[0][2]) {
        window.isbuycount = false
      }

      if (nftuser[0][1] == "0x0000000000000000000000000000000000000000") {
        if (getQueryString("t") != undefined) {
          let userToken = getQueryString("t");
          window.isbandleater = true;
          checktokenuser(userToken)
          if (0 === flag) {
            showModal()
          }
        } else {
          window.isbandleater = false;
        }
      } else {
        window.isbandleater = false;
      }

      // const Snftuser = await window.dapp.queryContract(window.FomoProxy,FomoProxy,"getNftFollowerList",window.dapp.currentAccount.address)
      // // const Snftuser = await window.dapp.queryContract(window.FomoProxy,FomoProxy,"getNftFollowerList",'0x6732746c6a70Ab5a9cB4d6a9e4Bd5b06cfb54Bb7')
      let snft = JSON.parse(localStorage.getItem(window.dapp.currentAccount.address.toString() + 'snft'));
      // console.log("//////////////////", snft)

      let userarry = nftuser[0][3];
      let usertime = nftuser[0][4];
      for (var i in userarry) {
        let a = {};
        a.user = userarry[i];
        try {
          a.time = dateFormat(parseInt(usertime[i].hex.toString()).toString());
          if (a.user.toString() === '0x580543193208C83CA4F01026E3bbcc5B2Fb14579' || a.user.toString() === '0x62258f2F2F33A8c59EC21345a4e58dcCb9F2d184') {
            a.time = dateFormat(1661467643);
          }
        } catch (e) {
          a.time = 0
        }
        // let item = await window.dapp.queryContract(window.FomoProxy,FomoProxy,"getUser",userarry[i])
        let item = JSON.parse(localStorage.getItem(userarry[i].toString() + 'item'));

        a.userType = item[0][9];
        a.isUserBuy = item[0][7].toString() !== 'false';

        if (a.isUserBuy) {
          window._fomo.buyFollowSet.set(a.user, a)
        }
        window._fomo.followSet.set(a.user, a)

        if (a.userType === "1" || a.userType === "2") {
          window._fomo.sVipSet.set(a.user, a)
          setSVipCount(window._fomo.sVipSet.size)
        }
      }

      setUserType(nftuser[0][9])
      setFollowerCount(window._fomo.buyFollowSet.size)

      if (0 === flag) {
        changeuserlis()
      }
      let burnCount = localStorage.getItem('burnCount');
      changeburn(burnCount)
      // getbuyLiquidityLogsInit();
      // getbuyLiquidityLogs();

      await queryData();
    } else {
      setTimeout(function () {
        loaddata(flag);
      }, 500)
    }
  }

  const queryData = async (flag) => {

    if (window.dapp) {

      let self = this;
      let u = window.location.href + '?t=' + window.dapp.currentAccount.address;
      urlscchange(u)
      //NFT
      const x = window.dapp.onAccountChanged(function (res) {
        reloadDapp(onDappEnabled(res));
        loaddata()
      });

      // let addrs = `0x539265e20F5a825ABccF5e187ef868d97aaaaD58,0xde28Ac47f8326C4eE2E049700e77409709Bc36A7,0x1a292dc7d651610731EF7f0fA6D13Cee2c44060c,0xFaBBd61F2Ac4354fF52D76b1E4070e73C71a796A,0x5EC1b4e421b565a1D1F078c31E61185f6Da67350,0x47F3E249658A8a0FbFFBF891a166a9DfB7E1B992,0x814705181e114175e718bae6B86DCfd2fE4a7DA9,0x6daE469B97263b564527190603Eb621389c78760,0x9E272DCce89B62EE4e61eA3801499cFf03483a4a,0x1C974f0d67A017146B3a4C0a78989c2E5b234Ba2,0x50fb519f4e0Fb3B750794Fb2722C84f954b7C06b,0xbd23e6Ac3fe026aEb2004B36DDa81C942FD7fC61,0x751B16585A9E7666734A2F87088925323F062c44,0x01F4Dd6671318FDC790C96F13DAdaC800D415aa8,0x17d1D717411F4B7C32D770b84FC97DdD181d4F00,0xCD4BB27E3d7D169E17182985E74043b31B5249bE,0xeD01d0FB9Fc6f103DBDc7184EB5250ea9E6D2a5F,0x36C03c6A9A35717B34B7BFd3132b25C2a059A6Cd,0x4d13c14103f675C99a17AC45f41dEeAd8670a3E3,0x447210009AA50386003b2606D59A5bA4dBeA5A8b,0x310881950b7464c17F917359B67389f134cB88Bf,0x1F2ec9ea97852E11F9d48E4EA8B2ac44E4386df1`
      // let addrsarry = addrs.split(",");
      // let leaders = [];
      // for(let i =0; i< addrsarry.length; i++ ){
      //   const balance = await window.dapp.queryContract(window.CoreFarm,CoreFarm,"balanceOf",addrsarry[i].toString());
      //   // console.log("=====",balance.toString().length-18);
      //   let balance1 = balance.toString().slice(0,balance.toString().length-18);
      //   if (balance1 === ""){
      //     balance1 = "0";
      //   }
      //   leaders.push(balance1)
      // }
      // console.log("-=-=-00000=-=-=-=",leaders.toString());

      // LP总量
      const myredeem1 = await window.dapp.queryContract(window.LP, LPToken, "totalSupply", [])
      let Bignredeem1 = new BigNumber(myredeem1.toString());
      let mycoinredeem1 = Bignredeem1.div(10 ** 18).toString();

      // 当前地址LP余额
      const myredeem = await window.dapp.queryContract(window.LP, LPToken, "balanceOf", window.dapp.currentAccount.address)
      let Bignredeem = new BigNumber(myredeem.toString());
      let mycoinredeem = Bignredeem.div(10 ** 18).toString();
      localStorage.setItem('myredeem', myredeem);
      changemobility(myredeem)

      let share = (Bignredeem.div(Bignredeem1));

      localStorage.setItem('share', share);
      changeshareLP(share)

      // 查看Fomo代币余额
      const fomocion = await window.dapp.queryContract(window.FomoToken, FomoToken, "balanceOf", window.LP)

      var fomoBign = new BigNumber(fomocion.toString());
      let pan = fomoBign.multipliedBy(share);
      pan = pan.div(10 ** 18).toString();

      localStorage.setItem('pan', pan.toString());
      pan = NumFixed(pan.toString())
      pan = Number(pan)
      changereducefomom(pan)

      // 查看
      const myredeem2 = await window.dapp.queryContract(window.usdtAddress, v2Abi, "balanceOf", window.LP)
      let Bignredeem2 = new BigNumber(myredeem2.toString());
      let mycoinredeem2 = Bignredeem2.div(10 ** 18).toString();

      let panUsdt = Bignredeem2.multipliedBy(share);
      panUsdt = panUsdt.div(10 ** 18).toString();
      localStorage.setItem('panUsdt', panUsdt.toString());
      panUsdt = NumFixed(panUsdt.toString())
      panUsdt = Number(panUsdt)
      changeshareUsdt(panUsdt)

      // 查询目前单量
      let Count = await window.dapp.queryContract(window.FomoProxy, FomoProxy, "totalUsdt", [])
      changetotalCount(Count.toString())

      // FomoProxy -- lp  -- usdt  *2
      // 查询奖金池的USDT数量
      let CountUsdt1 = await window.dapp.queryContract(window.LP, LPToken, "balanceOf", window.buyback)

      let Bign1 = new BigNumber(CountUsdt1.toString());
      let mycoin1 = Bign1.div(10 ** 18).toString();

      let CountUsdt = await window.dapp.queryContract(window.usdtAddress, v2Abi, "balanceOf", window.LP)
      let Bign = new BigNumber(CountUsdt.toString());
      let mycoin = Bign.div(10 ** 18).toString();
      let rect = mycoin / mycoinredeem1 * mycoin1

      localStorage.setItem('rect', rect.toString());
      changetotalUsdt(rect)
      // 查询倒计时
      const usdtBalance = await window.dapp.queryContract(window.FomoProxy, FomoProxy, "_nextBuyBackTimestamp", [])
      reduceTime(parseInt(usdtBalance.toString() + '000'))
      const burnCount = await window.dapp.queryContract(window.FomoToken, FomoToken, "totalSupply")
      // console.log("---totalSupply---", burnCount);
      // let newBurnCount = 10000000000 - burnCount

      localStorage.setItem('burnCount', burnCount.toString());
      changeloading(0)

      // 获取当前地址信息
      const nftuser = await window.dapp.queryContract(window.FomoProxy, FomoProxy, "getUser", window.dapp.currentAccount.address)
      // const nftuser = await window.dapp.queryContract(window.FomoProxy,FomoProxy,"getUser",'0x6732746c6a70Ab5a9cB4d6a9e4Bd5b06cfb54Bb7')
      localStorage.setItem(window.dapp.currentAccount.address.toString() + 'nftuser', JSON.stringify(nftuser));
      let nftcount = nftuser[0].userBuy;
      let Bignssg = new BigNumber(nftcount.toString());
      let mycoinssg = Number(Bignssg.div(10 ** 18).toString());
      if (mycoinssg > 5000 && nftuser[0].isTeamLeader) {
        window.isbuycount = false
      }
      if (nftuser[0].leader == "0x0000000000000000000000000000000000000000") {
        if (getQueryString("t") != undefined) {
          let userToken = getQueryString("t");
          window.isbandleater = true;
          checktokenuser(userToken)
          if (0 === flag) {
            showModal()
          }
        } else {
          window.isbandleater = false;
        }
      } else {
        window.isbandleater = false;
      }

      const Snftuser = await window.dapp.queryContract(window.FomoProxy, FomoProxy, "getUser", window.dapp.currentAccount.address)
      // const Snftuser = await window.dapp.queryContract(window.FomoProxy,FomoProxy,"getNftFollowerList",'0x6732746c6a70Ab5a9cB4d6a9e4Bd5b06cfb54Bb7')
      let snft = Snftuser;
      // console.log('----snft----',snft)
      localStorage.setItem(window.dapp.currentAccount.address.toString() + 'snft', JSON.stringify(snft));

      let userarry = nftuser[0].followers;
      let usertime = nftuser[0].followerTimestamps;
      for (var i in userarry) {
        let a = {};
        a.user = userarry[i];
        try {
          a.time = dateFormat(usertime[i].toString());
          if (a.user.toString() === '0x580543193208C83CA4F01026E3bbcc5B2Fb14579' || a.user.toString() === '0x62258f2F2F33A8c59EC21345a4e58dcCb9F2d184') {
            a.time = dateFormat(1661467643);
          }
        } catch (e) {
          a.time = 0
        }
        let item = await window.dapp.queryContract(window.FomoProxy, FomoProxy, "getUser", userarry[i])
        localStorage.setItem(userarry[i].toString() + 'item', JSON.stringify(item));
        a.userType = item[0].userType.toString();
        a.isUserBuy = item[0].isBoughtLiquidity.toString() !== 'false';
        if (a.isUserBuy) {
          window._fomo.buyFollowSet.set(a.user, a)
        }
        window._fomo.followSet.set(a.user, a)

        if (a.userType === "1" || a.userType === "2") {
          window._fomo.sVipSet.set(a.user, a)
          setSVipCount(window._fomo.sVipSet.size)
        }
      }

      setUserType(nftuser[0].userType)
      setFollowerCount(window._fomo.buyFollowSet.size)

      if (0 === flag) {
        changeuserlis()
      }
      changeburn(burnCount)
      // getbuyLiquidityLogs();
    } else {
      setTimeout(function () {
        loaddata(flag);
      }, 5000)
    }

    localStorage.setItem(window.dapp.currentAccount.address.toString() + 'init', '1');
  }

  const connectWallet = async (connectMethod) => {
    const options = {
      extension: connectMethod,
    }
    if (connectMethod === 'WalletConnect') {
      options.providerOptions = {
        rpc: {
          97: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
          56: 'https://bsc-dataseed.binance.org/'
        },
        chainId: window.networkEnv === 'main' ? 56 : 97,
      }
    }
    const dapp = new Dapp(options);
    dapp.onEnabled((account: any) => onDappEnabled(account));
    try {
      await dapp.enableBrowserExtension(window.networkEnv);
    } catch (e) {

    }
    if (dapp.currentAccount && dapp.currentAccount.address) {
      window.dapp = dapp;
      localStorage.setItem('connect-method', connectMethod);
      const balance = await dapp.getBalance(dapp.currentAccount.address, window.racaAddress, v2Abi, 18);

      localStorage.setItem('balance', balance)
      window.location.reload();
    }
  }
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  }
  //28206 280000000000000000
  const redeem = async () => {
    if (window.dapp) {
      changeloading(1)
      let priceWei = mobility.toString();

      let allowance = await window.dapp.getAllowance(window.dapp.currentAccount.address, window.LP, window.SwapBridge, LPToken, 18);

      if (allowance > 0) {
      } else {
        try {
          const valueofapprove = await window.dapp.approve(window.LP, LPToken, window.SwapBridge, window.uintmax)
          let hash = '' + valueofapprove.hash;
          await window.dapp.rpc.waitForTransaction(hash, 1)
        } catch (e) {
          changeloading(0)
          message.error(e.data.data.message);
        }
      }

      let ts = Number((new Date().getTime() + 60000) / 1000).toFixed(0);

      // try {
      //const tx = await window.dapp.executeContract(window.SwapRouter, Uniswap, "removeLiquidity", [window.FomoToken,window.usdtAddress, priceWei,0,0,window.dapp.currentAccount.address, ts])
      const tx = await window.dapp.executeContract(window.SwapBridge, SwapBridge, "withdrawLiquidity", [priceWei, 0, 0])

      let txhash = '' + tx.hash;
      await window.dapp.rpc.waitForTransaction(txhash, 1)
      checkhaxcaeh(txhash)
      loaddata();
      changeloading(0)
      // } catch (e) {
      //   changeloading(0)
      //   message.error(e.data.data.message);
      // }
    }
  }

  const address = localStorage.getItem('account-address')
  const balance = localStorage.getItem('balance')
  const backindex = () => {
    menuHide()
    sellHide()
    buyHide()
    regeitHide()
    showshareHide()
    isforvoluntHide()
  }
  const [langers, changelangers] = useState('en');
  const languagelick = (item, key, keyPath, domEvent) => {
    let itemkey = item.key;
    if (itemkey == 0) {
      changelangers('en')
      i18n.changeLanguage('en')
    }
    if (itemkey == 1) {
      changelangers('zh')
      i18n.changeLanguage('zh')
    }
    if (itemkey == 2) {

      changelangers('ru')
      i18n.changeLanguage('ru')
    }
  }
  const language = (
    <Menu onClick={languagelick}>
      <Menu.Item key="0">
        <a>English</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a>繁體中文</a>
      </Menu.Item>
      {/*<Menu.Item key="2">*/}
      {/*  <a>русский язык</a>*/}
      {/*</Menu.Item>*/}
    </Menu>
  );

  //menu
  const [tabmenu, tabmenuHide] = useState(false);
  const menuHide = () => {
    tabmenuHide(tabTopShow => false)
  };
  const menuShow = (item) => {
    tabmenuHide(tabTopShow => item)
  };
  //sell
  const [showsell, sellclick] = useState(false);
  const sellHide = () => {
    sellclick(tabTopShow => false)
    loaddata();
  };
  const sellShow = (item) => {
    if (window.isbandleater) {
      showModal()
    }
    sellclick(tabTopShow => true)
  };
  //share
  const [showshare, showshareclick] = useState(false);
  const showshareHide = () => {
    showshareclick(showshare => false)
    loaddata();
  };
  const showshareShow = () => {
    menuHide()
    sellHide()
    buyHide()
    regeitHide()

    if (window.isbandleater) {
      showModal()
      return false;
    } else {
      showshareclick(showshare => true)
    }
  };
  //isforvolunt
  const [isforvolunt, isforvoluntclick] = useState(false);
  const isforvoluntHide = () => {
    isforvoluntclick(isforvolunt => false)
    loaddata();
  };
  const isforvoluntShow = (item) => {
    isforvoluntclick(isforvolunt => true)
  };
  //buy
  const [showbuy, buyclick] = useState(false);
  const buyHide = () => {
    buyclick(tabTopShow => false)
    loaddata();
  };
  const buyShow = (item) => {
    if (window.isbandleater) {
      showModal()
    }
    buyclick(tabTopShow => true)
  };
  //buyregeit
  const [regeit, regeitclick] = useState(false);
  const regeitHide = () => {
    regeitclick(regeit => false)
    loaddata();
  };
  const regeitShow = (item) => {
    if (window.isbandleater) {
      showModal();
    }
    regeitclick(regeit => true)
  };

  const [shareUrl, checkshareUrl] = useState(0);
  const changeshareUrl = (item) => {
    checkshareUrl(shareUrl => item)
  };

  const loginlick = (item, key, keyPath, domEvent) => {
    let itemkey = item.key;
    if (itemkey == 0) {
      loginoutres();
    }
  }
  const loginout = (
    <Menu onClick={loginlick}>
      <Menu.Item key="0">
        <a>{t("t28")}</a>
      </Menu.Item>
    </Menu>
  );

  function confirm(e) {
    console.log(e);
  }

  function cancel(e) {
    console.log(e);
  }

  const formDete = (str) => {
    return str.substr(0, 4) + "****" + str.substr(-4);
  };
  const formDete8 = (str) => {
    return str.substr(0, 8) + "****" + str.substr(-8);
  };
  const [showprom, tickprom] = useState(100);
  const tickfunc = (item) => {
    tickprom(item)
  }

  const [starttime, checkstarttime] = useState(Date.UTC(2022, 5, 9, 16, 0));
  const changestarttime = (item) => {
    let now = Date.now();
    let showitem = item - now;

    checkstarttime(starttime => Date.now() + showitem)
  };

  const [showtime, ticktime] = useState(Date.now() + 172800000);
  const reduceTime = (item) => {
    let now = Date.now();
    let showitem = item - now;

    ticktime(showtime => Date.now() + showitem)
    let prom = parseInt((showitem / 172800000) * 100);

    tickfunc(prom)
  };
  const watchtick = (item) => {
    // reduceTime(item.total)
  }


  const [haxcaeh, checkhaxcaeh] = useState("");
  const router = () => {
    window.location = "https://bscscan.com/tx/" + haxcaeh;
  }
  const closepop = () => {
    checkhaxcaeh("")
  }
  const formDete10 = (str) => {
    return str.substr(0, 2) + "****" + str.substr(-6);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeisModalVisible = () => {
    setIsModalVisible(false)
  }
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setUserLeader();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    // let url = window.location.href;
    // let returnUrl  =  url.split("?")[0];
    // window.location = returnUrl;
  };
  const [bgmeaus, setbgmeaus] = useState(false);
  const showbgmeau = () => {
    setbgmeaus(!bgmeaus)
  }
  const closeClock = () => {
    // const [showClock,ChangeshowClock] = useState(false);
    window.statusTime = false;
    ChangeshowClock(!showClock)

  }
  const [showcase, setshowcase] = useState(false);
  const changeCase = () => {
    setshowcase(!showcase)
  }
  const [showresout, setshowresout] = useState(false);
  const changeresout = () => {
    setshowresout(!showresout)
  }
  const changeBigNum = (item) => {
    var Bign = new BigNumber(item.toString());
    var mycoin = Bign.div(10 ** 18).toString();
    return mycoin;
  }
  const getbuyLiquidityLogsInit = async () => {

    // let lastBlocks = await window.dapp.rpc.getBlockNumber();
    // const perBlock =100;//每次查询多少个区块，最大5000
    // let startBlock;
    // let endBlock;
    //
    // startBlock = lastBlocks - perBlock; // 开始块数
    // endBlock = lastBlocks;
    //
    // const FomoProxyContractAddress =window.FomoProxy;
    // const FomoProxyContract = new ethers.Contract(FomoProxyContractAddress,FomoProxy,window.dapp.rpc);
    // let events = [];
    // events = await window.dapp.rpc.send('eth_getLogs', [{
    //   address: [
    //     FomoProxyContract.address
    //   ],
    //   fromBlock: '0x'+(startBlock).toString(16),
    //   toBlock: '0x'+(endBlock).toString(16),
    //   topics: [
    //     [ // topic[0]
    //       FomoProxyContract.filters.BuyLiquidityRecord().topics[0]
    //     ]
    //   ]
    // }]);

    const FomoProxyContractAddress = window.FomoProxy;
    const FomoProxyContract = new ethers.Contract(FomoProxyContractAddress, FomoProxy, window.dapp.rpc);
    let events = JSON.parse(localStorage.getItem(window.dapp.currentAccount.address + 'events'));

    let listArrOnin = events.map((item, index) => { // for is serial, forEach is parallel (i.e. asynchronous)
      const event = events[index];
      const decodedEvent = FomoProxyContract.interface.decodeEventLog(
        "BuyLiquidityRecord",
        event.data,
        event.topics
      );

      if (decodedEvent.category == 10) {

        sethxas(decodedEvent.inout[1]);
        sethxastext("获得满单奖")
        changopenPrice()
      }
      if (decodedEvent.category == 8) {

        sethxas(decodedEvent.inout[1]);
        sethxastext("获得末单奖")
        changopenPrice()
      }

      return (
        {}
      )
    })

    // for(var i in events){
    //   console.log(events[i])
    // }
  }

  const getbuyLiquidityLogs = async () => {

    let lastBlocks = await window.dapp.rpc.getBlockNumber();
    const perBlock = 100;//每次查询多少个区块，最大5000
    let startBlock;
    let endBlock;

    startBlock = lastBlocks - perBlock; // 开始块数
    endBlock = lastBlocks;

    const FomoProxyContractAddress = window.FomoProxy;
    const FomoProxyContract = new ethers.Contract(FomoProxyContractAddress, FomoProxy, window.dapp.rpc);
    let events = [];
    events = await window.dapp.rpc.send('eth_getLogs', [{
      address: [
        FomoProxyContract.address
      ],
      fromBlock: '0x' + (startBlock).toString(16),
      toBlock: '0x' + (endBlock).toString(16),
      topics: [
        [ // topic[0]
          FomoProxyContract.filters.BuyLiquidityRecord().topics[0]
        ]
      ]
    }]);

    // localStorage.setItem(window.dapp.currentAccount.address + 'events', JSON.stringify(events));
    // console.log("-----------event---------",events);

    // let listArrOnin = events.map((item,index)=>{ // for is serial, forEach is parallel (i.e. asynchronous)
    //   const event = events[index];
    //   const decodedEvent = FomoProxyContract.interface.decodeEventLog(
    //     "BuyLiquidityRecord",
    //     event.data,
    //     event.topics
    //   );
    //
    //   if(decodedEvent.category == 10){
    //
    //     sethxas(decodedEvent.inout[1]);
    //     sethxastext("获得满单奖")
    //     changopenPrice()
    //   }
    //   if(decodedEvent.category == 8){
    //
    //     sethxas(decodedEvent.inout[1]);
    //     sethxastext("获得末单奖")
    //     changopenPrice()
    //   }
    //
    //   return(
    //     {}
    //   )
    // })

    // for(var i in events){
    //   console.log(events[i])
    // }
  }
  const [showopenPrice, setopenPrice] = useState(false);
  const changopenPrice = () => {
    if (window.isprice) {
      setopenPrice(!showopenPrice)
    }
  }
  const changclosePrice = () => {
    window.isprice = false;

    setopenPrice(!showopenPrice)
  }
  const [hxas, sethxas] = useState("");
  const [hxastext, sethxastext] = useState("获得满单奖");
  return (
    <div className="App">
      {showopenPrice ? <div className="openPrice animated fadeIn">
        <div className="openC">
          <div className="tsp">{t('t44')}</div>
          <div className="tsp1">{formDete(hxas)}</div>
          {hxastext == "获得满单奖" ? <div className="tsp2">{t('t45')}</div> : <div className="tsp2">{t('t46')}</div>}
          <div className="openspbtn" onClick={changclosePrice.bind(this)}>{t('t47')}</div>
        </div>
      </div> : ""
      }
      {showcase ? <div className="showCode animated fadeIn" onClick={changeCase}>
        <div className="codecontent">
          <div className="sp">{t('t6')}</div>
          <div className="sp nomal">{t('t7')}</div>
        </div>
      </div> : ""
      }
      {showresout ? <div className="showCode animated fadeIn" onClick={changeresout}>
        <div className="codecontent resout">
          <div className="sp">{t('t8')}</div>
          <div className="sp">{t('t9')}</div>
          <div className="sl">{t('t7')}</div>
        </div>
      </div> : ""
      }
      {
        isModalVisible ? <div className="shoumodal animated fadeIn">
          <div className="codecontent">
            <div className="sp"><span>{t('t48')}</span>：{formDete10(tokenuser)}</div>
            <div className="btn_cs">
              <div className="btn_no" onClick={handleCancel.bind(this)}>NO</div>
              <div className="btn_yes" onClick={handleOk.bind(this)}>YES</div>
            </div>
          </div>
        </div> : ""
      }

      {/*{showClock?<div className="gameStart">*/}
      {/*  <div className="start">*/}
      {/*    /!*<div className="startimg"></div>*!/*/}
      {/*    {showPlus?<div className="st22">{t('t50')}</div>:""}*/}
      {/*    <br/>*/}
      {/*    /!*{!showPlus?<div className="st2">{t('t94')}</div>:""}*!/*/}
      {/*    <div className="announcement">{t('t49')}</div>*/}
      {/*    /!*<div className="announcement">{t('t491')}</div>*!/*/}
      {/*    /!*<div className="announcement">{t('t492')}</div>*!/*/}
      {/*    /!*<div className="announcement">{t('t493')}</div>*!/*/}
      {/*    /!*{showPlus?<div className="st2"><Countdown onTick={watchtick} date={starttime} /></div>:""}*!/*/}
      {/*    <div className="startbtns" onClick={closeClock}>{t('t47')}</div>*/}
      {/*  </div>*/}
      {/*</div>:""*/}
      {/*}*/}

      {/*{showClock?<div className="gameStart">*/}
      {/*  <div className="start">*/}
      {/*    <div className="startimg"></div>*/}
      {/*    <div className="st1">{t('t49')}</div>*/}
      {/*    /!*{showPlus?<div className="st2">{t('t50')}</div>:""}*!/*/}
      {/*    {showPlus?<div className="st2"><Countdown onTick={watchtick} date={starttime} /></div>:""}*/}
      {/*    /!*{!showPlus?<div className="st2">{t('t94')}</div>:""}*!/*/}
      {/*    <div className="startbtns" onClick={closeClock}>{t('t47')}</div>*/}
      {/*  </div>*/}
      {/*</div>:""*/}
      {/*}*/}

      <div className="index">
        {bgmeaus ?
          <div className="bgmeau animated fadeIn" onClick={showbgmeau.bind(this)}>
            <div className="leftmeau">
              <div className="close">×</div>
              <div className="meauli">
                {langers == 'en' ? <a target="_self" href="https://solidity.finance/audits/NDF/">{t('t21')}</a> : ''}
                {langers == 'zh' ? <a target="_self" href="https://solidity.finance/audits/NDF/">{t('t21')}</a> : ''}
                {langers == 'ru' ? <a target="_self" href="https://solidity.finance/audits/NDF/">{t('t21')}</a> : ''}
              </div>
              <div className="meauli">
                {langers == 'en' ? <a target="_self"
                                      href="https://ndfdao.gitbook.io/new-defi/part.2/mechanism-analysis">{t('t22')}</a> : ''}
                {langers == 'zh' ? <a target="_self"
                                      href="https://ndfdao.gitbook.io/new-defi/part.2/mechanism-analysis">{t('t22')}</a> : ''}
                {langers == 'ru' ? <a target="_self"
                                      href="https://ndfdao.gitbook.io/new-defi/part.2/mechanism-analysis">{t('t22')}</a> : ''}
              </div>
              <div className="meauli">
                {langers == 'en' ? <a target="_self"
                                      href="https://ndfdao.gitbook.io/new-defi/part.2-1/new-defi-tips">{t('t23')}</a> : ''}
                {langers == 'zh' ? <a target="_self"
                                      href="https://ndfdao.gitbook.io/new-defi/part.2-1/new-defi-tips">{t('t23')}</a> : ''}
                {langers == 'ru' ? <a target="_self"
                                      href="https://ndfdao.gitbook.io/new-defi/part.2-1/new-defi-tips">{t('t23')}</a> : ''}
              </div>
              <div className="meauli">
                {langers == 'en' ? <a target="_self"
                                      href="https://drive.google.com/file/d/1fVP7fww4RqAquO56C-XVvUSwgUtzp3WA/view?usp=sharing">{t('t24')}</a> : ''}
                {langers == 'zh' ? <a target="_self"
                                      href="https://drive.google.com/file/d/1fVP7fww4RqAquO56C-XVvUSwgUtzp3WA/view?usp=sharing">{t('t24')}</a> : ''}
                {langers == 'ru' ? <a target="_self"
                                      href="https://drive.google.com/file/d/1fVP7fww4RqAquO56C-XVvUSwgUtzp3WA/view?usp=sharing">{t('t24')}</a> : ''}
              </div>
              <div className="meauli">
                {langers == 'en' ? <a target="_self"
                                      href="https://drive.google.com/file/d/1clCESMKqN1SnaMmag3R5Bfxx9hPrcfpr/view?usp=sharing">{t('t25')}</a> : ''}
                {langers == 'zh' ? <a target="_self"
                                      href="https://drive.google.com/file/d/1clCESMKqN1SnaMmag3R5Bfxx9hPrcfpr/view?usp=sharing">{t('t25')}</a> : ''}
                {langers == 'ru' ? <a target="_self"
                                      href="https://drive.google.com/file/d/1clCESMKqN1SnaMmag3R5Bfxx9hPrcfpr/view?usp=sharing">{t('t25')}</a> : ''}
              </div>
              <div className="meauli">
                {langers == 'en' ? <a target="_self" href="https://t.me/+7G0KBI1zJdhmNzc0">{t('t26')}</a> : ''}
                {langers == 'zh' ? <a target="_self" href="https://t.me/+7G0KBI1zJdhmNzc0">{t('t26')}</a> : ''}
                {langers == 'ru' ? <a target="_self" href="https://t.me/+7G0KBI1zJdhmNzc0">{t('t26')}</a> : ''}
              </div>
              <div className="meauli">
                {langers == 'en' ? <a target="_self" href="https://twitter.com/NewDeFi2022">{t('t261')}</a> : ''}
                {langers == 'zh' ? <a target="_self" href="https://twitter.com/NewDeFi2022">{t('t261')}</a> : ''}
                {langers == 'ru' ? <a target="_self" href="https://twitter.com/NewDeFi2022">{t('t261')}</a> : ''}
              </div>
              {/*<div className="meauli" onClick={isforvoluntShow}>*/}
              {/*  {t('t27')}*/}
              {/*</div>*/}
            </div>
          </div> : ""
        }
        {haxcaeh != "" ?
          <div className="logs animated fadeIn">
            <span></span>
            <div className="tit">{t('t51')}</div>
            <div className="tis" onClick={router.bind(this)}>On BscScan：{formDete10(haxcaeh)}</div>
            <div className="close" onClick={closepop.bind(this)}>X</div>
          </div> : ""
        }
        {showshare ?
          <div id="printHtml" className="PageShare animated fadeIn">
            <PageShare></PageShare>
          </div> : ""
        }

        <div className="header">
          {!tabmenu && !showsell && !showbuy && !regeit && !isforvolunt ?
            <div className="logo" onClick={loaddata}></div> : <div className="back" onClick={backindex}></div>}
          <div className="r">
            <div className="language">
              <Dropdown overlay={language} trigger={['click']} overlayClassName="downupli">
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}></a>
              </Dropdown>
            </div>
            <div className="action">
              <div className="wallet"></div>

              <div className="address">{address ? formDete(address) : ""}</div>

              <div className="accter">
                <Dropdown overlay={loginout} trigger={['click']}>
                  <a className="ant-dropdown-link" onClick={e => e.preventDefault()}></a>
                </Dropdown>
              </div>
            </div>
            <div className="menu" onClick={showbgmeau.bind(this)}>
              {/*<Dropdown overlay={menu} trigger={['click']} overlayClassName="topLeft">*/}
              {/*  <a className="ant-dropdown-link" onClick={e => e.preventDefault()}></a>*/}
              {/*</Dropdown>*/}
            </div>
          </div>
        </div>
        {
          isforvolunt ?
            <div className="volunteer animated fadeIn" style={{marginTop: "-40px"}}>
              <Volunteer></Volunteer>
            </div> : ""
        }
        {regeit ?
          <div className="Goals animated fadeIn" style={{marginTop: "-40px"}}>
            <Goals></Goals>
          </div> : ""
        }
        {showsell ?
          <div className="sellpage animated fadeIn" style={{marginTop: "-40px"}}>
            <Sell></Sell>
          </div> : ""
        }
        {showbuy ?
          <div className="buypage animated fadeIn" style={{marginTop: "-40px"}}>
            <Buy></Buy>
          </div> : ""
        }

        {!tabmenu && !showsell && !showbuy && !regeit && !showshare && !isforvolunt ?
          <div className="animated fadeIn">
            <div className="index_fititle">{t('t1')}</div>
            <div className="index_setitle">{t('t2')}</div>
            <div className="indexpart">
              <div className="secsen">
                <div className="secfititle">{t('t3')}
                  <a href="#" onClick={changeCase}></a>
                </div>
                <div className="secsetitle">$ {totalUsdt * 2}</div>
                <div className="pro">
                  <Progress percent={showprom} showInfo={false}/>
                </div>
                <div className="sectime"><Countdown onTick={watchtick} date={showtime} daysInHours={true}/></div>
                {/*<div className="sectime">24:00:00</div>*/}
              </div>
              <div className="parline">
                <span>NDF/USDT</span>
                {/*{isfot?<span className="red">{pasct}%</span>:<span>{pasct}%</span>}*/}
                <span><a href={"https://avedex.cc/token/" + window.FomoToken + "-bsc"}></a></span>
                <span>{pancake}</span>
              </div>
              {/*<div className="parlinek tipcool">*/}
              {/*  <div>{t('t4')}</div>*/}
              {/*  <div>*/}
              {/*    <span>{totalCount}</span>{t('t76')}*/}
              {/*    <a href="#" onClick={changeresout}></a>*/}
              {/*  </div>*/}
              {/*</div>*/}
              <div className="parlinek">
                <div>{t('t5')}</div>
                <div><span>{burn}</span>NDF</div>
              </div>
              <div className="btn">
                <div onClick={buyShow}>{t('t65')}</div>
                <div onClick={sellShow}>{t('t37')}</div>
              </div>
            </div>
            <div className="indexpart">
              <div className="fit">{t('t10')} {/*<span onClick={regeitShow}>{t('t11')}</span>*/}</div>
              <div className="parlinek k1">
                <div>{t('t12')}</div>
                <div><span>{shareLP}</span></div>
              </div>
              <div className="parlinek k2">
                <div>LP Token</div>
                <div><span>${(shareUsdt * 2).toFixed(2)}</span></div>
              </div>
              {/*<div className="parlinek k3"><div>{t('t13')}</div><div><span>{reducefomom}</span></div></div>*/}
              <div className="parlinek k4">
                <div>{t('t14')}</div>
                <div><span>{shareUsdt}</span></div>
              </div>
              {mobility > 0 ? <div className="btns green" onClick={redeem}>{t('t15')}</div> :
                <div className="btns">{t('t15')}</div>}
            </div>
            <div className="indexpart">
              <div className="kosctie">{t('t19')}</div>
              <div className="pslist">
                <div className="vip" onClick={changeuserlis}>
                  {userType > 0 ? <div className="img light"></div> : <div className="img"></div>}
                  <div className="fot">{t('t19')}</div>
                  <div className="fon">{t('t18')}: {followerCount}</div>
                </div>
                {/*<div className="mvip" onClick={changeuserlismvp}>*/}

                {/*  {userType > 1 ? <div className="img light"></div> : <div className="img"></div>}*/}
                {/*  <div className="fot">{t('t17')}</div>*/}
                {/*  <div className="fon">{t('t19')}: {SVipCount}</div>*/}
                {/*</div>*/}
              </div>
              <div className="userlist">
                <div className="userInfo item">
                  <span>{t('t20')}</span>
                  <span>{t('t18')}</span>
                </div>
                <div>
                  {showList.length == 0 ? <div className="userInfo">
                    <div>{t('t66')}</div>
                  </div> : showList}
                </div>
              </div>
            </div>
          </div> : ""
        }
        {!address ? <div className="propmain">
          <div className="mian_content">
            <Button onClick={() => connectWallet('MetaMask')}>
              <img
                src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjM1NSIgdmlld0JveD0iMCAwIDM5NyAzNTUiIHdpZHRoPSIzOTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMSAtMSkiPjxwYXRoIGQ9Im0xMTQuNjIyNjQ0IDMyNy4xOTU0NzIgNTIuMDA0NzE3IDEzLjgxMDE5OHYtMTguMDU5NDlsNC4yNDUyODMtNC4yNDkyOTJoMjkuNzE2OTgydjIxLjI0NjQ1OSAxNC44NzI1MjNoLTMxLjgzOTYyNGwtMzkuMjY4ODY4LTE2Ljk5NzE2OXoiIGZpbGw9IiNjZGJkYjIiLz48cGF0aCBkPSJtMTk5LjUyODMwNSAzMjcuMTk1NDcyIDUwLjk0MzM5NyAxMy44MTAxOTh2LTE4LjA1OTQ5bDQuMjQ1MjgzLTQuMjQ5MjkyaDI5LjcxNjk4MXYyMS4yNDY0NTkgMTQuODcyNTIzaC0zMS44Mzk2MjNsLTM5LjI2ODg2OC0xNi45OTcxNjl6IiBmaWxsPSIjY2RiZGIyIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSA0ODMuOTYyMjcgMCkiLz48cGF0aCBkPSJtMTcwLjg3MjY0NCAyODcuODg5NTIzLTQuMjQ1MjgzIDM1LjA1NjY1NyA1LjMwNjYwNC00LjI0OTI5Mmg1NS4xODg2OGw2LjM2NzkyNSA0LjI0OTI5Mi00LjI0NTI4NC0zNS4wNTY2NTctOC40OTA1NjUtNS4zMTE2MTUtNDIuNDUyODMyIDEuMDYyMzIzeiIgZmlsbD0iIzM5MzkzOSIvPjxwYXRoIGQ9Im0xNDIuMjE2OTg0IDUwLjk5MTUwMjIgMjUuNDcxNjk4IDU5LjQ5MDA4NTggMTEuNjc0NTI4IDE3My4xNTg2NDNoNDEuMzkxNTExbDEyLjczNTg0OS0xNzMuMTU4NjQzIDIzLjM0OTA1Ni01OS40OTAwODU4eiIgZmlsbD0iI2Y4OWMzNSIvPjxwYXRoIGQ9Im0zMC43NzgzMDIzIDE4MS42NTcyMjYtMjkuNzE2OTgxNTMgODYuMDQ4MTYxIDc0LjI5MjQ1MzkzLTQuMjQ5MjkzaDQ3Ljc1OTQzNDN2LTM3LjE4MTMwM2wtMi4xMjI2NDEtNzYuNDg3MjUzLTEwLjYxMzIwOCA4LjQ5ODU4M3oiIGZpbGw9IiNmODlkMzUiLz48cGF0aCBkPSJtODcuMDI4MzAzMiAxOTEuMjE4MTM0IDg3LjAyODMwMjggMi4xMjQ2NDYtOS41NTE4ODYgNDQuNjE3NTYzLTQxLjM5MTUxMS0xMC42MjMyMjl6IiBmaWxsPSIjZDg3YzMwIi8+PHBhdGggZD0ibTg3LjAyODMwMzIgMTkyLjI4MDQ1NyAzNi4wODQ5MDU4IDMzLjk5NDMzNHYzMy45OTQzMzR6IiBmaWxsPSIjZWE4ZDNhIi8+PHBhdGggZD0ibTEyMy4xMTMyMDkgMjI3LjMzNzExNCA0Mi40NTI4MzEgMTAuNjIzMjI5IDEzLjc5NzE3IDQ1LjY3OTg4OC05LjU1MTg4NiA1LjMxMTYxNS00Ni42OTgxMTUtMjcuNjIwMzk4eiIgZmlsbD0iI2Y4OWQzNSIvPjxwYXRoIGQ9Im0xMjMuMTEzMjA5IDI2MS4zMzE0NDgtOC40OTA1NjUgNjUuODY0MDI0IDU2LjI1LTM5LjMwNTk0OXoiIGZpbGw9IiNlYjhmMzUiLz48cGF0aCBkPSJtMTc0LjA1NjYwNiAxOTMuMzQyNzggNS4zMDY2MDQgOTAuMjk3NDUxLTE1LjkxOTgxMi00Ni4yMTEwNDl6IiBmaWxsPSIjZWE4ZTNhIi8+PHBhdGggZD0ibTc0LjI5MjQ1MzkgMjYyLjM5Mzc3MSA0OC44MjA3NTUxLTEuMDYyMzIzLTguNDkwNTY1IDY1Ljg2NDAyNHoiIGZpbGw9IiNkODdjMzAiLz48cGF0aCBkPSJtMjQuNDEwMzc3NyAzNTUuODc4MTkzIDkwLjIxMjI2NjMtMjguNjgyNzIxLTQwLjMzMDE5MDEtNjQuODAxNzAxLTczLjIzMTEzMzEzIDUuMzExNjE2eiIgZmlsbD0iI2ViOGYzNSIvPjxwYXRoIGQ9Im0xNjcuNjg4NjgyIDExMC40ODE1ODgtNDUuNjM2NzkzIDM4LjI0MzYyNy0zNS4wMjM1ODU4IDQyLjQ5MjkxOSA4Ny4wMjgzMDI4IDMuMTg2OTY5eiIgZmlsbD0iI2U4ODIxZSIvPjxwYXRoIGQ9Im0xMTQuNjIyNjQ0IDMyNy4xOTU0NzIgNTYuMjUtMzkuMzA1OTQ5LTQuMjQ1MjgzIDMzLjk5NDMzNHYxOS4xMjE4MTNsLTM4LjIwNzU0OC03LjQzNjI2eiIgZmlsbD0iI2RmY2VjMyIvPjxwYXRoIGQ9Im0yMjkuMjQ1Mjg2IDMyNy4xOTU0NzIgNTUuMTg4NjgtMzkuMzA1OTQ5LTQuMjQ1MjgzIDMzLjk5NDMzNHYxOS4xMjE4MTNsLTM4LjIwNzU0OC03LjQzNjI2eiIgZmlsbD0iI2RmY2VjMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgNTEzLjY3OTI1MiAwKSIvPjxwYXRoIGQ9Im0xMzIuNjY1MDk2IDIxMi40NjQ1OTMtMTEuNjc0NTI4IDI0LjQzMzQyNyA0MS4zOTE1MS0xMC42MjMyMjl6IiBmaWxsPSIjMzkzOTM5IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyODMuMzcyNjQ2IDApIi8+PHBhdGggZD0ibTIzLjM0OTA1NyAxLjA2MjMyMjk2IDE0NC4zMzk2MjUgMTA5LjQxOTI2NTA0LTI0LjQxMDM3OC01OS40OTAwODU4eiIgZmlsbD0iI2U4OGYzNSIvPjxwYXRoIGQ9Im0yMy4zNDkwNTcgMS4wNjIzMjI5Ni0xOS4xMDM3NzM5MiA1OC40Mjc3NjI5NCAxMC42MTMyMDc3MiA2My43MzkzNzgxLTcuNDI5MjQ1NDEgNC4yNDkyOTIgMTAuNjEzMjA3NzEgOS41NjA5MDYtOC40OTA1NjYxNyA3LjQzNjI2MSAxMS42NzQ1Mjg0NyAxMC42MjMyMjktNy40MjkyNDU0IDYuMzczOTM4IDE2Ljk4MTEzMjMgMjEuMjQ2NDU5IDc5LjU5OTA1NzctMjQuNDMzNDI4YzM4LjkxNTA5Ni0zMS4xNjE0NzMgNTguMDE4ODY5LTQ3LjA5NjMxOCA1Ny4zMTEzMjItNDcuODA0NTMzLS43MDc1NDgtLjcwODIxNS00OC44MjA3NTYtMzcuMTgxMzAzNi0xNDQuMzM5NjI1LTEwOS40MTkyNjUwNHoiIGZpbGw9IiM4ZTVhMzAiLz48ZyB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAzOTkuMDU2NjExIDApIj48cGF0aCBkPSJtMzAuNzc4MzAyMyAxODEuNjU3MjI2LTI5LjcxNjk4MTUzIDg2LjA0ODE2MSA3NC4yOTI0NTM5My00LjI0OTI5M2g0Ny43NTk0MzQzdi0zNy4xODEzMDNsLTIuMTIyNjQxLTc2LjQ4NzI1My0xMC42MTMyMDggOC40OTg1ODN6IiBmaWxsPSIjZjg5ZDM1Ii8+PHBhdGggZD0ibTg3LjAyODMwMzIgMTkxLjIxODEzNCA4Ny4wMjgzMDI4IDIuMTI0NjQ2LTkuNTUxODg2IDQ0LjYxNzU2My00MS4zOTE1MTEtMTAuNjIzMjI5eiIgZmlsbD0iI2Q4N2MzMCIvPjxwYXRoIGQ9Im04Ny4wMjgzMDMyIDE5Mi4yODA0NTcgMzYuMDg0OTA1OCAzMy45OTQzMzR2MzMuOTk0MzM0eiIgZmlsbD0iI2VhOGQzYSIvPjxwYXRoIGQ9Im0xMjMuMTEzMjA5IDIyNy4zMzcxMTQgNDIuNDUyODMxIDEwLjYyMzIyOSAxMy43OTcxNyA0NS42Nzk4ODgtOS41NTE4ODYgNS4zMTE2MTUtNDYuNjk4MTE1LTI3LjYyMDM5OHoiIGZpbGw9IiNmODlkMzUiLz48cGF0aCBkPSJtMTIzLjExMzIwOSAyNjEuMzMxNDQ4LTguNDkwNTY1IDY1Ljg2NDAyNCA1NS4xODg2OC0zOC4yNDM2MjZ6IiBmaWxsPSIjZWI4ZjM1Ii8+PHBhdGggZD0ibTE3NC4wNTY2MDYgMTkzLjM0Mjc4IDUuMzA2NjA0IDkwLjI5NzQ1MS0xNS45MTk4MTItNDYuMjExMDQ5eiIgZmlsbD0iI2VhOGUzYSIvPjxwYXRoIGQ9Im03NC4yOTI0NTM5IDI2Mi4zOTM3NzEgNDguODIwNzU1MS0xLjA2MjMyMy04LjQ5MDU2NSA2NS44NjQwMjR6IiBmaWxsPSIjZDg3YzMwIi8+PHBhdGggZD0ibTI0LjQxMDM3NzcgMzU1Ljg3ODE5MyA5MC4yMTIyNjYzLTI4LjY4MjcyMS00MC4zMzAxOTAxLTY0LjgwMTcwMS03My4yMzExMzMxMyA1LjMxMTYxNnoiIGZpbGw9IiNlYjhmMzUiLz48cGF0aCBkPSJtMTY3LjY4ODY4MiAxMTAuNDgxNTg4LTQ1LjYzNjc5MyAzOC4yNDM2MjctMzUuMDIzNTg1OCA0Mi40OTI5MTkgODcuMDI4MzAyOCAzLjE4Njk2OXoiIGZpbGw9IiNlODgyMWUiLz48cGF0aCBkPSJtMTMyLjY2NTA5NiAyMTIuNDY0NTkzLTExLjY3NDUyOCAyNC40MzM0MjcgNDEuMzkxNTEtMTAuNjIzMjI5eiIgZmlsbD0iIzM5MzkzOSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjgzLjM3MjY0NiAwKSIvPjxwYXRoIGQ9Im0yMy4zNDkwNTcgMS4wNjIzMjI5NiAxNDQuMzM5NjI1IDEwOS40MTkyNjUwNC0yNC40MTAzNzgtNTkuNDkwMDg1OHoiIGZpbGw9IiNlODhmMzUiLz48cGF0aCBkPSJtMjMuMzQ5MDU3IDEuMDYyMzIyOTYtMTkuMTAzNzczOTIgNTguNDI3NzYyOTQgMTAuNjEzMjA3NzIgNjMuNzM5Mzc4MS03LjQyOTI0NTQxIDQuMjQ5MjkyIDEwLjYxMzIwNzcxIDkuNTYwOTA2LTguNDkwNTY2MTcgNy40MzYyNjEgMTEuNjc0NTI4NDcgMTAuNjIzMjI5LTcuNDI5MjQ1NCA2LjM3MzkzOCAxNi45ODExMzIzIDIxLjI0NjQ1OSA3OS41OTkwNTc3LTI0LjQzMzQyOGMzOC45MTUwOTYtMzEuMTYxNDczIDU4LjAxODg2OS00Ny4wOTYzMTggNTcuMzExMzIyLTQ3LjgwNDUzMy0uNzA3NTQ4LS43MDgyMTUtNDguODIwNzU2LTM3LjE4MTMwMzYtMTQ0LjMzOTYyNS0xMDkuNDE5MjY1MDR6IiBmaWxsPSIjOGU1YTMwIi8+PC9nPjwvZz48L3N2Zz4="
                alt="MetaMask"/>
            </Button>
            <Button onClick={() => connectWallet('WalletConnect')}>
              <img
                src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjAlIiBjeT0iNTAlIiByPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1ZDlkZjYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDZmZmYiLz48L3JhZGlhbEdyYWRpZW50PjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0ibTI1NiAwYzE0MS4zODQ4OTYgMCAyNTYgMTE0LjYxNTEwNCAyNTYgMjU2cy0xMTQuNjE1MTA0IDI1Ni0yNTYgMjU2LTI1Ni0xMTQuNjE1MTA0LTI1Ni0yNTYgMTE0LjYxNTEwNC0yNTYgMjU2LTI1NnoiIGZpbGw9InVybCgjYSkiLz48cGF0aCBkPSJtNjQuNjkxNzU1OCAzNy43MDg4Mjk4YzUxLjUzMjgwNzItNTAuMjc4NDM5NyAxMzUuMDgzOTk0Mi01MC4yNzg0Mzk3IDE4Ni42MTY3OTkyIDBsNi4yMDIwNTcgNi4wNTEwOTA2YzIuNTc2NjQgMi41MTM5MjE4IDIuNTc2NjQgNi41ODk3OTQ4IDAgOS4xMDM3MTc3bC0yMS4yMTU5OTggMjAuNjk5NTc1OWMtMS4yODgzMjEgMS4yNTY5NjE5LTMuMzc3MSAxLjI1Njk2MTktNC42NjU0MjEgMGwtOC41MzQ3NjYtOC4zMjcwMjA1Yy0zNS45NTA1NzMtMzUuMDc1NDk2Mi05NC4yMzc5NjktMzUuMDc1NDk2Mi0xMzAuMTg4NTQ0IDBsLTkuMTQwMDI4MiA4LjkxNzU1MTljLTEuMjg4MzIxNyAxLjI1Njk2MDktMy4zNzcxMDE2IDEuMjU2OTYwOS00LjY2NTQyMDggMGwtMjEuMjE1OTk3My0yMC42OTk1NzU5Yy0yLjU3NjY0MDMtMi41MTM5MjI5LTIuNTc2NjQwMy02LjU4OTc5NTggMC05LjEwMzcxNzd6bTIzMC40OTM0ODUyIDQyLjgwODkxMTcgMTguODgyMjc5IDE4LjQyMjcyNjJjMi41NzY2MjcgMi41MTM5MTAzIDIuNTc2NjQyIDYuNTg5NzU5My4wMDAwMzIgOS4xMDM2ODYzbC04NS4xNDE0OTggODMuMDcwMzU4Yy0yLjU3NjYyMyAyLjUxMzk0MS02Ljc1NDE4MiAyLjUxMzk2OS05LjMzMDg0LjAwMDA2Ni0uMDAwMDEtLjAwMDAxLS4wMDAwMjMtLjAwMDAyMy0uMDAwMDMzLS4wMDAwMzRsLTYwLjQyODI1Ni01OC45NTc0NTFjLS42NDQxNi0uNjI4NDgxLTEuNjg4NTUtLjYyODQ4MS0yLjMzMjcxIDAtLjAwMDAwNC4wMDAwMDQtLjAwMDAwOC4wMDAwMDctLjAwMDAxMi4wMDAwMTFsLTYwLjQyNjk2ODMgNTguOTU3NDA4Yy0yLjU3NjYxNDEgMi41MTM5NDctNi43NTQxNzQ2IDIuNTEzOTktOS4zMzA4NDA4LjAwMDA5Mi0uMDAwMDE1MS0uMDAwMDE0LS4wMDAwMzA5LS4wMDAwMjktLjAwMDA0NjctLjAwMDA0NmwtODUuMTQzODY3NzQtODMuMDcxNDYzYy0yLjU3NjYzOTI4LTIuNTEzOTIxLTIuNTc2NjM5MjgtNi41ODk3OTUgMC05LjEwMzcxNjNsMTguODgyMzEyNjQtMTguNDIyNjk1NWMyLjU3NjYzOTMtMi41MTM5MjIyIDYuNzU0MTk5My0yLjUxMzkyMjIgOS4zMzA4Mzk3IDBsNjAuNDI5MTM0NyA1OC45NTgyNzU4Yy42NDQxNjA4LjYyODQ4IDEuNjg4NTQ5NS42Mjg0OCAyLjMzMjcxMDMgMCAuMDAwMDA5NS0uMDAwMDA5LjAwMDAxODItLjAwMDAxOC4wMDAwMjc3LS4wMDAwMjVsNjAuNDI2MTA2NS01OC45NTgyNTA4YzIuNTc2NTgxLTIuNTEzOTggNi43NTQxNDItMi41MTQwNzQzIDkuMzMwODQtLjAwMDIxMDMuMDAwMDM3LjAwMDAzNTQuMDAwMDcyLjAwMDA3MDkuMDAwMTA3LjAwMDEwNjNsNjAuNDI5MDU2IDU4Ljk1ODM1NDhjLjY0NDE1OS42Mjg0NzkgMS42ODg1NDkuNjI4NDc5IDIuMzMyNzA5IDBsNjAuNDI4MDc5LTU4Ljk1NzE5MjVjMi41NzY2NC0yLjUxMzkyMzEgNi43NTQxOTktMi41MTM5MjMxIDkuMzMwODM5IDB6IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk4IDE2MCkiLz48L2c+PC9zdmc+"
                alt="WalletConnect"/>
            </Button>
          </div>
        </div> : <div></div>
        }
        {
          isloading ? <div className="loading">
            <Spin tip="Loading..." size="large"></Spin>
          </div> : ""
        }
        <div className="share" onClick={showshareShow}></div>
        {showshare ?
          <div className="callsback" onClick={backindex}></div> : ""
        }

      </div>

      {/*<header className="App-header">*/}
      {/*  {address ? <div>*/}
      {/*    <div>*/}
      {/*      {address}*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      {balance}*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <Button onClick={buy}>Buy now</Button>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <Button onClick={logout}>logout</Button>*/}
      {/*    </div>*/}
      {/*    </div> :*/}
      {/*    <div>*/}
      {/*      <Button onClick={() => connectWallet('MetaMask')}>Metamask</Button>*/}
      {/*      <Button onClick={() => connectWallet('WalletConnect')}>Wallnet Connect</Button>*/}
      {/*    </div>*/}
      {/*  }*/}
      {/*</header>*/}
    </div>
  );
}

export default App;

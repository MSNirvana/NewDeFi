import React, {useEffect, useState} from "react"
import {message, Modal, Spin, Statistic} from 'antd';
import './sell.css';
import v2Abi from "./abi/ERC20.json";
import CoreFarmAbi from "./abi/CoreFarm.json";
import LPSwapTool from "./abi/LPSwapTool.json";
import NFT from "./abi/NFT.json";
import NFTFarm from "./abi/NFTFarm.json";
import BigNumber from 'bignumber.js'
import LPToken from "./abi/LP.json";
import {LoadingOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import FomoProxy from "./abi/FomoProxy.json";

const {confirm} = Modal;

function App() {
  const {t, i18n} = useTranslation();
  const [isloading, checkloading] = useState(1);
  const changeloading = (item) => {
    checkloading(isloading => item)
  };

  useEffect(() => {
    window.ethereum.enable().then(() => {
      loaddata();
    })
  }, [])

  const NumFixed = (item) => {
    let Bignredeem = new BigNumber(item.toString());
    let mycoinredeem = Bignredeem.div(10 ** 18).toString();
    let slp = mycoinredeem.split(".");
    if (slp.length > 1) {
      let pock = slp[0] + '.' + slp[1].substr(0, 2)
      return pock;
    } else {
      return slp[0]
    }
  }

  //totalUsdt
  const [totalUsdt, checktotalUsdt] = useState(0);
  const changetotalUsdt = (item) => {
    item = Number(item).toFixed(2)
    checktotalUsdt(totalUsdt => item)
  };

  // ---- Core Farm ---- //
  //my Power
  const [myPower, checkMyPower] = useState(0);
  const changeMyPower = (item) => {
    item = Number(item).toFixed(2)
    checkMyPower(myPower => item)
  };

  //my Reward
  const [myReward, checkMyReward] = useState(0);
  const changeMyReward = (item) => {
    item = Number(item).toFixed(2)
    checkMyReward(myReward => item)
  };

  //my Dividend
  const [myDividend, checkMyDividendReward] = useState(0);
  const changeMyDividendReward = (item) => {
    item = Number(item).toFixed(2)
    checkMyDividendReward(myDividend => item)
  };

  // ---- NFT Farm ---- //
  //NFT Total
  const [totalNFT, checkTotalNFT] = useState(0);
  const changeTotalNFT = (item) => {
    checkTotalNFT(totalNFT => item)
  };

  //NFT Total Stake
  const [totalStake, checkTotalStake] = useState(0);
  const changeTotalStake = (item) => {
    checkTotalStake(totalStake => item)
  };

  //My NFT
  const [myNFT, checkMyNFT] = useState(0);
  const changeMyNFT = (item) => {
    checkMyNFT(myNFT => item)
  };

  //My NFT Power
  const [myNFTPower, checkMyNFTPower] = useState(0);
  const changeMyNFTPower = (item) => {
    checkMyNFTPower(myNFTPower => item)
  };

  //My NFT Reward
  const [myNFTReward, checkMyNFTReward] = useState(0);
  const changeMyNFTReward = (item) => {
    item = Number(item).toFixed(2)
    checkMyNFTReward(myNFTReward => item)
  };

  //stat
  const [stat, checkstat] = useState("wait");
  const changestat = (item) => {
    checkstat(stat => item)
  };

  // ---- LP Swap ---- //
  //your old LP
  // const [oldLP, checkOldLP] = useState(0);
  // const [oldLPSwap, checkOldLPSwap] = useState(0);
  // const changeOldLP = (item) => {
  //   checkOldLPSwap(item)
  //   item = Number(item).toFixed(2)
  //   checkOldLP(oldLP => item)
  // };
  //
  // //your new LP
  // const [newLP, checkNewLP] = useState(0);
  // const changeNewLP = (item) => {
  //   item = Number(item).toFixed(2)
  //   checkNewLP(newLP => item)
  // };

  //lp swap stat
  // const [statLP, checkstatLP] = useState("wait");
  // const changestatLP = (item) => {
  //   checkstatLP(statLP => item)
  // };

  const loaddata = async () => {
    if (window.dapp) {
      changeloading(1)
      let allowance = await window.dapp.queryContract(window.NFT, NFT, "isApprovedForAll", window.dapp.currentAccount.address, window.NFTFarm);

      allowance = parseInt(allowance)
      if (allowance > 0) {
        checkstat("approve")
      } else {
        checkstat("wait")
      }

      // let allowanceLPSwap = await window.dapp.getAllowance(window.dapp.currentAccount.address, window.oldLP, window.LpSwapTool, LPToken, 18);
      //
      // allowanceLPSwap = parseInt(allowanceLPSwap)
      // if (allowanceLPSwap > 0) {
      //   changestatLP("wait")
      // } else {
      //   changestatLP("approve")
      // }

      //shareUsdt
      try {
        const myredeem2 = await window.dapp.queryContract(window.usdtAddress, v2Abi, "balanceOf", window.LP)
        let Bignredeem2 = new BigNumber(myredeem2.toString());
        let mycoinredeem2 = Bignredeem2.div(10 ** 18).toString();
        changetotalUsdt(mycoinredeem2)
      } catch (e) {
        changeloading(0)
        message.error(e.message);
      }

      //myPower
      try {
        const myPower = await window.dapp.queryContract(window.CoreFarm, CoreFarmAbi, "balanceOf", window.dapp.currentAccount.address)
        let myPower1 = new BigNumber(myPower.toString());
        let myPower2 = myPower1.div(10 ** 18).toString();
        changeMyPower(myPower2)
      } catch (e) {
        changeloading(0)
        message.error(e.message);
      }

      //myReward
      try {
        const myReward = await window.dapp.queryContract(window.CoreFarm, CoreFarmAbi, "earned", window.dapp.currentAccount.address)
        let myReward1 = new BigNumber(myReward.toString());
        let myReward2 = myReward1.div(10 ** 18).toString();
        changeMyReward(myReward2)
      } catch (e) {
        changeloading(0)
        message.error(e.message);
      }

      //myDividendReward
      const myDividendReward = await window.dapp.queryContract(window.FomoProxy, FomoProxy, "_globalReward", window.dapp.currentAccount.address)
      let myDividendReward1 = new BigNumber(myDividendReward.toString());
      let myDividendReward2 = myDividendReward1.div(10 ** 18).toString();
      changeMyDividendReward(myDividendReward2)

      //LP
      const myredeem1 = await window.dapp.queryContract(window.LP, LPToken, "totalSupply", [])
      let Bignredeem1 = new BigNumber(myredeem1.toString());
      let mycoinredeem1 = Bignredeem1.div(10 ** 18).toString();
      changetotalLP(mycoinredeem1)

      // Farm All LP
      const FarmLP = await window.dapp.queryContract(window.LP, LPToken, "balanceOf", window.FomoProxy)
      let FarmLP1 = new BigNumber(FarmLP.toString());
      let newFarmLP = FarmLP1.div(10 ** 18).toString();
      changeFarmLP(newFarmLP)

      // ---- NFT Farm ---- //
      // Total NFT
      const totalNFT = await window.dapp.queryContract(window.NFT, NFT, "totalSupply", [])
      let totalNFT1 = new BigNumber(totalNFT.toString());
      changeTotalNFT(totalNFT1)

      // Total Stake
      const totalStake = await window.dapp.queryContract(window.NFTFarm, NFTFarm, "totalPower", [])
      let totalStake1 = new BigNumber(totalStake.toString());
      let totalStake2 = totalStake1.div(10 ** 2).toString();
      changeTotalStake(totalStake2)

      const myNFTBalance = await window.dapp.queryContract(window.NFT, NFT, "balanceOf", window.dapp.currentAccount.address)
      changeMyNFT(myNFTBalance.toString())

      // My Power
      const NFTPower = await window.dapp.queryContract(window.NFTFarm, NFTFarm, "balanceOfPower", window.dapp.currentAccount.address)
      let NFTPower1 = new BigNumber(NFTPower.toString());
      let NFTPower2 = NFTPower1.toString();
      changeMyNFTPower(NFTPower2)

      // My Reward
      const myNFTReward = await window.dapp.queryContract(window.NFTFarm, NFTFarm, "earned", window.dapp.currentAccount.address)
      let myNFTReward1 = new BigNumber(myNFTReward.toString());
      let myNFTReward2 = myNFTReward1.div(10 ** 18).toString();
      changeMyNFTReward(myNFTReward2)

      // checkApprove
      const isApproved = await window.dapp.queryContract(window.NFT, NFT, "isApprovedForAll", window.dapp.currentAccount.address, window.NFTFarm)
      if (isApproved.toString() === "false") {
        changestat("approve");
      }

      // ---- LP Swap ---- //
      // your old lp
      // const old = await window.dapp.queryContract(window.oldLP, LPToken, "balanceOf", window.dapp.currentAccount.address)
      // let old1 = new BigNumber(old.toString());
      // let old2 = old1.div(10 ** 18).toString();
      // changeOldLP(old2)
      //
      // // your new lp
      // const New = await window.dapp.queryContract(window.LP, LPToken, "balanceOf", window.dapp.currentAccount.address)
      // let New1 = new BigNumber(New.toString());
      // let New2 = New1.div(10 ** 18).toString();
      // changeNewLP(New2)

      changeloading(0)
    } else {
      let self = this;
      setTimeout(function () {
        loaddata();
      }, 100)
    }
  }

  const approveNFTStake = async () => {
    changeloading(1)
    if (window.dapp) {
      try {
        const valueofapprove = await window.dapp.executeContract(window.NFT, NFT, "setApprovalForAll", [window.NFTFarm, true]);
        let hash = '' + valueofapprove.hash;
        await window.dapp.rpc.waitForTransaction(hash, 1)
        checkstat("wait")
        loaddata();
        changeloading(0)
      } catch (e) {
        changeloading(0)
        message.error(e.message);
        checkstat("approve")
      }
    }
  }

  // const approveLPSwap = async () => {
  //   changeloading(1)
  //   if (window.dapp) {
  //     try {
  //       const valueofapprove = await window.dapp.approve(window.oldLP, LPToken, window.LpSwapTool, window.uintmax)
  //       let hash = '' + valueofapprove.hash;
  //       await window.dapp.rpc.waitForTransaction(hash, 1)
  //       checkstat("wait")
  //       loaddata();
  //       changeloading(0)
  //     } catch (e) {
  //       changeloading(0)
  //       message.error(e.message);
  //       checkstat("approve")
  //     }
  //   }
  // }

  // const LPSawp = async () => {
  //   if (window.dapp) {
  //     if (oldLP == "0" || oldLP == " " || oldLP == "") {
  //       message.error("You have no old LP");
  //       changeloading(0)
  //       return false;
  //     }
  //     changeloading(1)
  //     try {
  //       console.log("oldLP", oldLP)
  //       let oldLPAmount = window.dapp.parseEther((oldLPSwap).toString());
  //       console.log("oldLPAmount", oldLPAmount)
  //       const txs = await window.dapp.executeContract(window.LpSwapTool, LPSwapTool, "swapLP", [oldLPAmount])
  //       let txhash = '' + txs.hash;
  //       await window.dapp.rpc.waitForTransaction(txhash, 1)
  //       checkhaxcaeh(txhash)
  //       loaddata();
  //       changeOldLP(0)
  //       changeloading(0)
  //     } catch (e) {
  //       changeloading(0)
  //       message.error(e.message);
  //     }
  //   }
  // }

  const formDete10 = (str) => {
    return str.substr(0, 2) + "****" + str.substr(-6);
  };

  const getReward = async () => {
    if (window.dapp) {
      if (myReward == "0" || myReward == " " || myReward == "") {
        message.error("You have no rewards");
        changeloading(0)
        return false;
      }
      changeloading(1)
      try {
        const txs = await window.dapp.executeContract(window.CoreFarm, CoreFarmAbi, "getReward", [window.dapp.currentAccount.address])
        let txhash = '' + txs.hash;
        await window.dapp.rpc.waitForTransaction(txhash, 1)
        checkhaxcaeh(txhash)
        loaddata();
        changeMyReward(0)
        changeloading(0)
      } catch (e) {
        changeloading(0)
        message.error(e.message);
      }
    }
  }

  const getDividend = async () => {
    if (window.dapp) {
      if (myDividend == "0" || myDividend == " " || myDividend == "") {
        message.error("You have no dividend");
        changeloading(0)
        return false;
      }
      changeloading(1)
      try {
        const txs = await window.dapp.executeContract(window.FomoProxy, FomoProxy, "getGlobalReward", [window.dapp.currentAccount.address])
        let txhash = '' + txs.hash;
        await window.dapp.rpc.waitForTransaction(txhash, 1)
        checkhaxcaeh(txhash)
        loaddata();
        changeMyDividendReward(0)
        changeloading(0)
      } catch (e) {
        changeloading(0)
        message.error(e.message);
      }
    }
  }

  const mintNFT = async () => {
    if (window.dapp) {
      changeloading(1)
      try {
        const txs = await window.dapp.executeContract(window.NFTFarm, NFTFarm, "mintGenesisNFT", [window.dapp.currentAccount.address])
        let txhash = '' + txs.hash;
        await window.dapp.rpc.waitForTransaction(txhash, 1)
        checkhaxcaeh(txhash)
        loaddata();
        changeMyReward(0)
        changeloading(0)
      } catch (e) {
        changeloading(0)
        message.error(e.message + "Account not be nft node");
      }
    }
  }

  const stakeNFT = async () => {
    if (window.dapp) {
      changeloading(1)
      try {
        let NFTID = 0;
        try {
          const id = await window.dapp.queryContract(window.NFT, NFT, "tokenOfOwnerByIndex", window.dapp.currentAccount.address, 0)
          NFTID = id;
        } catch (e) {
          message.error(e.message + "You don't have Genesis NFT");
        }
        const txs = await window.dapp.executeContract(window.NFTFarm, NFTFarm, "stake", [Number(NFTID)])
        let txhash = '' + txs.hash;
        await window.dapp.rpc.waitForTransaction(txhash, 1)
        checkhaxcaeh(txhash)
        loaddata();
        changeMyNFTReward(0)
        changeloading(0)
      } catch (e) {
        changeloading(0)
        message.error(e.message + "NFT stake failed");
      }
    }
  }

  const getNFTReward = async () => {
    if (window.dapp) {
      if (myNFTReward == "0" || myNFTReward == " " || myNFTReward == "") {
        message.error("You have no rewards");
        changeloading(0)
        return false;
      }
      changeloading(1)
      try {
        const txs = await window.dapp.executeContract(window.NFTFarm, NFTFarm, "getReward")
        let txhash = '' + txs.hash;
        await window.dapp.rpc.waitForTransaction(txhash, 1)
        checkhaxcaeh(txhash)
        loaddata();
        changeMyNFTReward(0)
        changeloading(0)
      } catch (e) {
        changeloading(0)
        message.error(e.message);
      }
    }
  }

  const exitNFT = async () => {
    if (window.dapp) {
      changeloading(1)
      try {
        const txs = await window.dapp.executeContract(window.NFTFarm, NFTFarm, "exit")
        let txhash = '' + txs.hash;
        await window.dapp.rpc.waitForTransaction(txhash, 1)
        checkhaxcaeh(txhash)
        loaddata();
        changeMyNFTReward(0)
        changeloading(0)
      } catch (e) {
        changeloading(0)
        message.error(e.message + "exit NFT stake failed");
      }
    }
  }

  //totalLP
  const [totalLP, checktotalLP] = useState(0);
  const changetotalLP = (item) => {
    item = Number(item).toFixed(2)
    checktotalLP(totalLP => item)
  };

  // Farm all LP
  const [FarmLP, checkFarmLP] = useState(0);
  const changeFarmLP = (item) => {
    item = Number(item).toFixed(2)
    checkFarmLP(totalLP => item)
  };

  const [haxcaeh, checkhaxcaeh] = useState("");
  const router = () => {
    window.location = "https://bscscan.com/tx/" + haxcaeh;
  }
  const closepop = () => {
    checkhaxcaeh("")
  }
  const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;
  return (
    <div className="sell">
      <div className="index">
        {haxcaeh != "" ?
          <div className="logs animated fadeIn">
            <span></span>
            <div className="tit">{t('t51')}</div>
            <div className="tis" onClick={router.bind(this)}>On BscScan：{formDete10(haxcaeh)}</div>
            <div className="close" onClick={closepop.bind(this)}>X</div>
          </div> : ""
        }

        <div className="indexpart">
          <div className="fit">{t('t101')} </div>
          <div className="parlinek k3">
            <div>{t('t301')}</div>
            <div><span>$<Statistic value={(totalUsdt * 2 / totalLP * FarmLP).toFixed(2)}/></span></div>
          </div>
          <div className="parlinek k2">
            <div>NDF/USDT LP</div>
            <div><span>$<Statistic value={(totalUsdt * 2 / totalLP).toFixed(5)}/></span></div>
          </div>
          <div className="sellbox">
            <div className="line1"><span>{t('t341')}</span> <span><Statistic value={(myPower)}/></span></div>
            <div className="line1"><span>{t('t342')}</span> <span><Statistic value={(myReward)}/></span></div>
            <div className="line1"><span>{t('t34')}</span> <span><Statistic
              value={(totalUsdt * 2 / totalLP * myReward).toFixed(5)}/></span></div>
            <div className="line1"><span>{t('t343')}</span> <span><Statistic value={(myDividend)}/></span></div>
          </div>
          {/*<div className="btns" onClick={getReward}>{t('t371')}</div>*/}
          <div className="btn">
            <div onClick={getReward}>{t('t371')}</div>
            <div onClick={getDividend}>{t('t3711')}</div>
          </div>
        </div>

        <div className="indexpart">
          <div className="fit">{t('t102')} </div>
          <div className="nft"></div>
          <div className="parlinek k3">
            <div>{t('t303')}</div>
            <div><span><Statistic value={333 - totalNFT}/></span></div>
          </div>
          <div className="parlinek k3">
            <div>{t('t304')}</div>
            <div><span><Statistic value={totalStake}/></span></div>
          </div>
          {/*<div ><img src="./images/NFT.png" width="250px" height="250px" alt=""/></div>*/}

          <div className="sellbox">
            <div className="line1"><span>{t('t931')}</span> <span><Statistic value={(myNFT)}/></span></div>
            <div className="line1"><span>{t('t932')}</span> <span><Statistic value={(myNFTPower)}/></span></div>
            <div className="line1"><span>{t('t933')}</span> <span><Statistic value={(myNFTReward)}/></span></div>
          </div>
          {stat == "approve" ?
            <div className="btn">
              <div onClick={mintNFT}>{t('t305')}</div>
              <div onClick={approveNFTStake}>{t('t306')}</div>
            </div> : ""
          }
          {stat == "wait" ?
            // <div className="btns btnsauthor" onClick={approveNFTStake}>{t('t351')}</div>:""
            <div className="btn">
              <div onClick={mintNFT}>{t('t305')}</div>
              <div onClick={stakeNFT}>{t('t307')}</div>
            </div> : ""
          }
          {/*{stat == "desable" ?*/}
          {/*  <div className="btns desable">{t('t371')}</div> : ""*/}
          {/*}*/}

          <div className="btn">
            <div onClick={getNFTReward}>{t('t371')}</div>
            <div onClick={exitNFT}>{t('t308')}</div>
          </div>
        </div>

        {/*<div className="indexpart">*/}
        {/*  <div className="fit">{t('t103')} </div>*/}
        {/*  <div className="sellbox">*/}
        {/*    <div className="line1"><span>{t('t344')}</span> <span><Statistic value={(oldLP)}/></span></div>*/}
        {/*    <div className="line1"><span>{t('t345')}</span> <span><Statistic value={(newLP)}/></span></div>*/}
        {/*  </div>*/}
        {/*  /!*<div className="btns" onClick={getReward}>{t('t371')}</div>*!/*/}
        {/*  {statLP == "approve" ?*/}
        {/*    <div className="btn">*/}
        {/*      <div onClick={approveLPSwap}>{t('t306')}</div>*/}
        {/*    </div> : ""*/}
        {/*  }*/}
        {/*  {statLP == "wait" ?*/}
        {/*    // <div className="btns btnsauthor" onClick={approveNFTStake}>{t('t351')}</div>:""*/}
        {/*    <div className="btn">*/}
        {/*      <div onClick={LPSawp}>{t('t309')}</div>*/}
        {/*    </div> : ""*/}
        {/*  }*/}
        {/*</div>*/}

      </div>
      {
        isloading ? <div className="loading">
          <Spin tip="Loading..." size="large"></Spin>
        </div> : ""
      }
    </div>
  );
}

export default App;

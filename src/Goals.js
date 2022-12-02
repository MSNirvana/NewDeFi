import { useState ,useEffect} from 'react';
import {Input, Modal, notification, message, Spin} from 'antd';
import {ethers} from 'ethers';
import v2Abi from "./abi/ERC20.json";
import BigNumber from 'bignumber.js'
import FomoProxy from "./abi/FomoProxy.json";
import FomoToken from "./abi/FomoToken.json";
import buyAbi from "./abi/Buy.json";
import LPToken from "./abi/LP.json";
import './about.css';
import { Tabs } from 'antd';
import SwapBridge from "./abi/FomoSwapBridge.json";
import copy from 'copy-to-clipboard';
import { BorderTopOutlined,LoadingOutlined} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
const { TabPane } = Tabs;
function Goals() {
  const { t,i18n} = useTranslation();
  useEffect(()=>{
    window.ethereum.enable().then(()=>{
      getbuyLiquidityLogs(0);
    })
  },[])
  const handleClick = (e) => {
    copy(e.target.value)
  }
  const [isloading,checkloading] = useState(0);
  const changeloading = (item) => {
    checkloading(isloading => item)
  };
  const formDete10 = (str) => {
    return str.substr(0,2)+"***"+str.substr(-5);
  };
  const formDete4 = (str) => {
    return str.substr(0,4)+"****"+str.substr(-4);
  };
  const dateFormat =  (time) => {
    time = time + "000"
    time = parseInt(time)

    const t = new Date(time)
    // 日期格式
    const format = 'm-d'
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
  const dateFormattime =  (time) => {
    time = time + "000"
    time = parseInt(time)

    const t = new Date(time)
    // 日期格式
    const format = 'h:i:s'
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
  const fixednub = (str) => {
    return Number(str).toFixed(2);
  };
  let cstss= t('t42');
  const [buytip,checkbuytip] = useState(cstss);
  const [redeemtip,checkredeemtip] = useState(cstss);
  const [buyhistory,checkbuyhistory] = useState([]);
  const changebuyhistory = (item) => {
    checkbuyhistory(buyhistory => item)
  };
  const [redeemhistory,checkredeemhistory] = useState([]);
  const changeredeemhistory = (item) => {
    checkredeemhistory(redeemhistory => item)
  };
  const [arry,checkarry] = useState([]);
  const changearry = (item) => {
    let comen = arry;
    comen.push(item)
    checkarry(arry => comen)
  };
  const [arryredeem,checkarryredeem] = useState([]);
  const changearryredeem = (item) => {
    let comen = arryredeem;
    comen.push(item)
    checkarryredeem(arryredeem => comen)
  };
  const [cobopl,checkstartBlock] = useState(0);
  const changestartBlock = (item) => {
    checkstartBlock(cobopl => item)
  };
  let btbus = [];
  //赎回
  const getredeemLogs = async (item) => {

    let csts= t('t42');
    checkbuytip(csts)
    let lastBlocks = 0;
    const perBlock =5000;//每次查询多少个区块，最大5000
    let startBlock;
    let endBlock;
    if(item != 0){
      lastBlocks = item -perBlock;
      endBlock = lastBlocks;
      startBlock =lastBlocks-perBlock; // 开始块数
      changestartBlock(lastBlocks);
    }else{
      lastBlocks = await window.dapp.rpc.getBlockNumber();
      changestartBlock(lastBlocks);
      startBlock = lastBlocks - perBlock; // 开始块数
      endBlock = lastBlocks;
    }
    const FomoProxyContractAddress =window.SwapBridge;
    const FomoProxyContract = new ethers.Contract(FomoProxyContractAddress,SwapBridge,window.dapp.rpc);
    const events = await window.dapp.rpc.send('eth_getLogs', [{
      address: [
        FomoProxyContract.address
      ],
      fromBlock: '0x'+(startBlock).toString(16),
      toBlock: '0x'+(endBlock).toString(16),
      topics: [
        [ // topic[0]
          FomoProxyContract.filters.BuyLiquidityRecord().topics[0]
        ]
      ]
    }]);


    let listArrOnin = events.map((item,index)=>{ // for is serial, forEach is parallel (i.e. asynchronous)
      const event = events[index];
      const decodedEvent = FomoProxyContract.interface.decodeEventLog(
        "BuyLiquidityRecord",
        event.data,
        event.topics
      );

      let pusharry = {
        hx:"",
        ts:"",
        hxto:"",
        info:{}
      };

      pusharry.hx = decodedEvent.inout[0].toUpperCase();
      pusharry.hxto = decodedEvent.inout[1].toUpperCase();
      pusharry.ts =decodedEvent.timestamp.toString();
      pusharry.type = decodedEvent.category;
      pusharry.info.tokenAmount = Number(changeBigNum(decodedEvent.amounts[0]));
      pusharry.info.usdtAmount = Number(changeBigNum(decodedEvent.amounts[1]));
      console.log("decodedEvent.category=",decodedEvent.category)

        btbus.push(pusharry);
      return(
        {}
      )

    })

    console.log(btbus)


    // btbus.splice(btbus.findIndex(item => item === undefined), 1)
    btbus.sort(function(a, b) {
      return b.ts < a.ts ? -1 : 1
    })

    let redeemlogs1 = [];
    let redeemlogs2 = [];
    redeemlogs1 = JSON.parse(localStorage.getItem(window.dapp.currentAccount.address+'redeemlogs1'));
    redeemlogs2 = JSON.parse(localStorage.getItem(window.dapp.currentAccount.address+'redeemlogs2'));
    if(redeemlogs1.length > 0){
      let its = redeemlogs1;
      its = its.concat(redeemlogs2);
      changeredeemhistory(its)
      console.log(its)
      console.log(typeof its)
    }else{
      changeredeemhistory(redeemlogs2)
      console.log(typeof redeemlogs2)
    }

    console.log(btbus)
    let castback= btbus.map((item,index)=>{
      if((item.hxto).toUpperCase() == (window.dapp.currentAccount.address).toUpperCase() || (item.hx).toUpperCase() == (window.dapp.currentAccount.address).toUpperCase() || (item.hxto).toUpperCase() == "0X0000000000000000000000000000000000000000"){
        console.log(window.isGlobalReward)
        return(
          <div className="historylistli">
            {(item.hxto).toUpperCase() == "0X0000000000000000000000000000000000000000" && (item.hx).toUpperCase() == (window.dapp.currentAccount.address).toUpperCase()?
              <div className="ril">
                <div className="cor">
                  <div>{dateFormat(item.ts)}</div>
                  {item.type == 0? <div>{t('t52')}</div>:""}
                  {item.type == 1? <div>{t('t53')}</div>:""}
                  {item.type == 2? <div>{t('t54')}</div>:""}
                  {item.type == 3? <div>{t('t55')}</div>:""}
                  {item.type == 4? <div>{t('t56')}</div>:""}
                  {item.type == 5? <div>{t('t57')}</div>:""}
                  {item.type == 6? <div>{t('t58')}</div>:""}
                  {item.type == 7? <div>{t('t59')}</div>:""}
                  {item.type == 8? <div>{t('t60')}</div>:""}
                  {item.type == 9? <div>{t('t61')}</div>:""}
                  {item.type == 10? <div>{t('t62')}</div>:""}
                  {item.type == 11? <div>{t('t63')}</div>:""}
                  {item.type == 12? <div>{t('t64')}</div>:""}
                  {item.type == 13? <div>{t('t68')}</div>:""}
                  {item.type == 14? <div>{t('t69')}</div>:""}
                  {item.type == 15? <div>{t('t70')}</div>:""}
                  <div><span className="red">{(item.info.tokenAmount).toFixed(2)}</span><span className="pandt">FOMO</span></div>
                  <div>{(item.info.usdtAmount).toFixed(2)}</div>

                  <div><a href={"https://bscscan.com/address/"+item.hxto}>{formDete10(item.hxto)}</a></div>
                </div>
                <div className="cor">
                  <div>{dateFormattime(item.ts)}</div>
                  <div></div>
                  <div><span className="red">0.00</span><span className="pandt">USDT</span></div>
                  <div></div>
                  <div></div>
                </div>
              </div>:""
            }
            {(item.hxto).toUpperCase() == "0X0000000000000000000000000000000000000000" && window.isGlobalReward &&item.type == 13?
              <div className="ril">
                <div className="cor">
                  <div>{dateFormat(item.ts)}</div>
                  {item.type == 0? <div>{t('t52')}</div>:""}
                  {item.type == 1? <div>{t('t53')}</div>:""}
                  {item.type == 2? <div>{t('t54')}</div>:""}
                  {item.type == 3? <div>{t('t55')}</div>:""}
                  {item.type == 4? <div>{t('t56')}</div>:""}
                  {item.type == 5? <div>{t('t57')}</div>:""}
                  {item.type == 6? <div>{t('t58')}</div>:""}
                  {item.type == 7? <div>{t('t59')}</div>:""}
                  {item.type == 8? <div>{t('t60')}</div>:""}
                  {item.type == 9? <div>{t('t61')}</div>:""}
                  {item.type == 10? <div>{t('t62')}</div>:""}
                  {item.type == 11? <div>{t('t63')}</div>:""}
                  {item.type == 12? <div>{t('t64')}</div>:""}
                  {item.type == 13? <div>{t('t68')}</div>:""}
                  {item.type == 14? <div>{t('t69')}</div>:""}
                  {item.type == 15? <div>{t('t70')}</div>:""}
                  <div><span className="red">{(item.info.tokenAmount).toFixed(2)}</span><span className="pandt">FOMO</span></div>
                  <div>{(item.info.usdtAmount).toFixed(2)}</div>

                  <div><a href={"https://bscscan.com/address/"+item.hxto}>{formDete10(item.hxto)}</a></div>
                </div>
                <div className="cor">
                  <div>{dateFormattime(item.ts)}</div>
                  <div></div>
                  <div><span className="red">0.00</span><span className="pandt">USDT</span></div>
                  <div></div>
                  <div></div>
                </div>
              </div>:""
            }
            {(item.hxto).toUpperCase() == (window.dapp.currentAccount.address).toUpperCase()?
              <div className="ril">
                <div className="cor">
                  <div>{dateFormat(item.ts)}</div>
                  {item.type == 0? <div>{t('t52')}</div>:""}
                  {item.type == 1? <div>{t('t53')}</div>:""}
                  {item.type == 2? <div>{t('t54')}</div>:""}
                  {item.type == 3? <div>{t('t55')}</div>:""}
                  {item.type == 4? <div>{t('t56')}</div>:""}
                  {item.type == 5? <div>{t('t57')}</div>:""}
                  {item.type == 6? <div>{t('t58')}</div>:""}
                  {item.type == 7? <div>{t('t59')}</div>:""}
                  {item.type == 8? <div>{t('t60')}</div>:""}
                  {item.type == 9? <div>{t('t61')}</div>:""}
                  {item.type == 10? <div>{t('t62')}</div>:""}
                  {item.type == 11? <div>{t('t63')}</div>:""}
                  {item.type == 12? <div>{t('t64')}</div>:""}
                  {item.type == 13? <div>{t('t68')}</div>:""}
                  {item.type == 14? <div>{t('t69')}</div>:""}
                  {item.type == 15? <div>{t('t70')}</div>:""}
                  <div><span className="green">{(item.info.tokenAmount).toFixed(2)}</span><span className="pandt">FOMO</span></div>
                  {item.type == 14 ?<div>{(item.info.usdtAmount*2).toFixed(2)}</div>:<div>{(item.info.usdtAmount).toFixed(2)}</div>}
                  {/*<div>{(item.info.usdtAmount).toFixed(2)}</div>*/}
                  <div><a href={"https://bscscan.com/address/"+item.hxto}>{formDete10(item.hxto)}</a></div>
                </div>
                <div className="cor">
                  <div>{dateFormattime(item.ts)}</div>
                  <div></div>
                  {item.type == 14|| item.type == 8 || item.type == 10 || item.type == 12 ?<div><span className="green">{(item.info.usdtAmount).toFixed(2)}</span><span className="pandt">USDT</span></div>:<div><span className="green">{(item.info.usdtAmount/2).toFixed(2)}</span><span className="pandt">USDT</span></div>}
                  <div></div>
                  <div></div>
                </div>
              </div>:""
            }
            {(item.hx).toUpperCase() == (window.dapp.currentAccount.address).toUpperCase() && (item.type == 0)?
              <div className="ril">
                <div className="cor">
                  <div>{dateFormat(item.ts)}</div>
                  {item.type == 0? <div>{t('t52')}</div>:""}
                  {item.type == 1? <div>{t('t53')}</div>:""}
                  {item.type == 2? <div>{t('t54')}</div>:""}
                  {item.type == 3? <div>{t('t55')}</div>:""}
                  {item.type == 4? <div>{t('t56')}</div>:""}
                  {item.type == 5? <div>{t('t57')}</div>:""}
                  {item.type == 6? <div>{t('t58')}</div>:""}
                  {item.type == 7? <div>{t('t59')}</div>:""}
                  {item.type == 8? <div>{t('t60')}</div>:""}
                  {item.type == 9? <div>{t('t61')}</div>:""}
                  {item.type == 10? <div>{t('t62')}</div>:""}
                  {item.type == 11? <div>{t('t63')}</div>:""}
                  {item.type == 12? <div>{t('t64')}</div>:""}
                  {item.type == 13? <div>{t('t68')}</div>:""}
                  {item.type == 14? <div>{t('t69')}</div>:""}
                  {item.type == 15? <div>{t('t70')}</div>:""}
                  <div><span className="red">{(item.info.tokenAmount).toFixed(2)}</span><span className="pandt">FOMO</span></div>
                  <div>{(item.info.usdtAmount).toFixed(2)}</div>
                  <div><a href={"https://bscscan.com/address/"+item.hxto}>{formDete10(item.hxto)}</a></div>
                </div>
                <div className="cor">
                  <div>{dateFormattime(item.ts)}</div>
                  <div></div>
                  {item.type == 14 ? <div><span className="red">{(item.info.usdtAmount).toFixed(2)}</span><span className="pandt">USDT</span></div> :
                    <div><span className="red">{(item.info.usdtAmount / 2).toFixed(2)}</span><span className="pandt">USDT</span></div>}
                  <div></div>
                  <div></div>
                </div>
              </div>:""
            }
          </div>
        )
      }
    })
    for (let i = 0; i < castback.length; i++) {
      if (castback[i] === undefined) {
        castback.splice(i, 1)
        i = i - 1          // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位
      }
    }
    if(castback.length == 0){
      setTimeout(function (){
        getbuyLiquidityLogs(lastBlocks);
      },1000)
      return false;
    }
    console.log(castback);
    console.log(redeemhistory);
    if(redeemhistory.length > 0){
      let its = redeemhistory;
      its = its.concat(castback);
      changeredeemhistory(its)
      console.log(its)
      console.log(typeof its)
      localStorage.setItem(window.dapp.currentAccount.address+'redeemlogs1', JSON.stringify(its));
    }else{
      changeredeemhistory(castback)
      console.log(typeof castback)
      localStorage.setItem(window.dapp.currentAccount.address+'redeemlogs2', JSON.stringify(castback));
    }
    let scst = t('t41')
    checkredeemtip(scst)
  }
  const changeBigNum = (item) => {
    var Bign = new BigNumber(item.toString());
    var mycoin = Bign.div(10**18).toString();

    let l = mycoin.split(".");
    if(l.length == 1){
      return l[0]+'.00';
    }else{
      return l[0]+'.'+l[1].substr(0,2)
    }
  }

  const [coboplss,checkcoboplss] = useState(0);
  const changecoboplss = (item) => {
    checkcoboplss(coboplss => item)
  };
  const moreload = () => {
    getbuyLiquidityLogs(cobopl)
  }
  //购买
  const getbuyLiquidityLogs = async (item) => {
    let scsts = t('t42')
    checkredeemtip(scsts)
    let lastBlocks = 0;
    const perBlock =5000;//每次查询多少个区块，最大5000
    let startBlock,endBlock;
    if(item != 0){
      lastBlocks = item -perBlock;
      endBlock = lastBlocks;
      startBlock =lastBlocks-perBlock; // 开始块数
      changecoboplss(lastBlocks);
    }else{
      lastBlocks = await window.dapp.rpc.getBlockNumber();
      startBlock = lastBlocks - perBlock; // 开始块数
      endBlock = lastBlocks;
      changecoboplss(lastBlocks);
    }


    const FomoProxyContractAddress =window.FomoProxy;
    const FomoProxyContract = new ethers.Contract(FomoProxyContractAddress,FomoProxy,window.dapp.rpc);
    let events = [];
    events = await window.dapp.rpc.send('eth_getLogs', [{
      address: [
        FomoProxyContract.address
      ],
      fromBlock: '0x'+(startBlock).toString(16),
      toBlock: '0x'+(endBlock).toString(16),
      topics: [
        [ // topic[0]
          FomoProxyContract.filters.BuyLiquidityRecord().topics[0]
        ]
      ]
    }]);
    let listArrOnin = events.map((item,index)=>{ // for is serial, forEach is parallel (i.e. asynchronous)
      const event = events[index];
      const decodedEvent = FomoProxyContract.interface.decodeEventLog(
        "BuyLiquidityRecord",
        event.data,
        event.topics
      );
      let pusharry = {
        hx:"",
        ts:"",
        info:{},
        hxto:"",
      };
      // console.log(decodedEvent)
      pusharry.hxto = decodedEvent.inout[1].toUpperCase();
      pusharry.hx = decodedEvent.inout[0].toUpperCase();
      pusharry.ts =decodedEvent.timestamp.toString();
      pusharry.type = decodedEvent.category;
      pusharry.info.tokenAmount = Number(changeBigNum(decodedEvent.amounts[0]));
      pusharry.info.usdtAmount = Number(changeBigNum(decodedEvent.amounts[1]));
      if(pusharry.type == 12 && (pusharry.hxto).toUpperCase() == (window.dapp.currentAccount.address).toUpperCase()){
        window.isGlobalReward = true;
      }
      btbus.push(pusharry);
      return(
        {}

      )

    })
    listArrOnin.reverse();
    getredeemLogs(lastBlocks+5000)
  }
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  return (
    <div className="about">
      <div className="index">
        <div className="indexpart">
            <div className="relist">
              <div className="historylist">
                <div>{t('t20')}</div>
                <div>{t('t67')}</div>
                <div>{t('t32')}</div>
                <div>{t('t33')}</div>
                <div>{t('t18')}</div>
              </div>
              {redeemhistory!=""?redeemhistory:<Spin indicator={antIcon} />}
              <div className="nodate" onClick={moreload}>{redeemtip}</div>
            </div>
        </div>
      </div>
      {
        isloading?<div className="loading">
          <Spin tip="Loading..." size="large"></Spin>
        </div>:""
      }
    </div>
  );
}

export default Goals;

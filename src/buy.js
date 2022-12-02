import { useState ,useEffect} from 'react';
import {Input, Modal, notification, message, Spin,Button, Divider, Space,Statistic} from 'antd';
import { BorderTopOutlined,LoadingOutlined} from '@ant-design/icons';
import {ethers} from 'ethers';
import './buy.css';
import v2Abi from "./abi/ERC20.json";
import BigNumber from 'bignumber.js'
import FomoProxy from "./abi/FomoProxy.json";
import FomoToken from "./abi/FomoToken.json";
import buyAbi from "./abi/Buy.json";
import LPToken from "./abi/LP.json";
import { useTranslation } from 'react-i18next';
const { confirm } = Modal;


function App() {
  const { t,i18n} = useTranslation();
  const routertoBsc = (item) => {
      window.location = 'https://bscscan.com/tx/'+item
  }
  const [isloading,checkloading] = useState(1);
  const changeloading = (item) => {
    checkloading(isloading => item)
  };
  useEffect(()=>{
    window.ethereum.enable().then(()=>{
      loaddata();

    })
  },[])

  //stat
  const [stat,checkstat] = useState("wait");
  const changestat = (item) => {
    checkstat(stat => item)
  };
  //usdt
  const [wonusdt,checkUsdt] = useState(0);
  const changeUsdt = (item) => {
    item = Number(item).toFixed(2)
    if(item < 100){
      changestat("desable")
    }
    checkUsdt(wonusdt => item)
  };
  //payprice
  const [payprice,checkprice] = useState(100);
  const addPrice = () => {
    if(payprice*100 + 100 > wonusdt){
      let value = parseInt(wonusdt/100);
      checkprice(payprice => value)
    }else{
      checkprice(payprice => payprice+100)
    }
  };
  const reducePrice = (item) => {
    if(payprice <= 100){
      checkprice(payprice => 100)
    }else{
      checkprice(payprice => payprice - 100)
    }
  };
  const editPrice = (item) => {
    console.log(item)

    checkprice(payprice => item)
  };

  //FOMO
  const [totalfomo,checktotalfomo] = useState(0);
  const changetotalfomo = (item) => {
    item = Number(item).toFixed(2)
    checktotalfomo(totalfomo => item)
  };
  //totalUsdt
  const [totalUsdt,checktotalUsdt] = useState(0);
  const changetotalUsdt = (item) => {
    item = Number(item).toFixed(2)
    checktotalUsdt(totalUsdt => item)
  };
  //totalLP
  const [totalLP,checktotalLP] = useState(0);
  const changetotalLP = (item) => {
    item = Number(item).toFixed(2)
    checktotalLP(totalLP => item)
  };
  //myaddress
  const [myd,checkmyd] = useState("");

  const loaddata = async() => {
    if (window.dapp) {
      checkmyd(window.dapp.currentAccount.address)
      let allowance = await window.dapp.getAllowance(window.dapp.currentAccount.address, window.usdtAddress, window.FomoProxy, v2Abi, 18);

      if (allowance > 0 ) {
        checkstat("approve")
      }
      getbuyLiquidityLogs(0);
      //USDT
      const wonrUsdt = await window.dapp.queryContract(window.usdtAddress, v2Abi, "balanceOf",window.dapp.currentAccount.address)
      // console.log('USDT:',wonrUsdt)
      var Bign = new BigNumber(wonrUsdt.toString());
      var mycoin = Bign.div(10**18).toString();
      changeUsdt(mycoin)

      //FOMO
      const fomocion = await window.dapp.queryContract(window.FomoToken, FomoToken, "balanceOf",window.LP)
      var fomoBign = new BigNumber(fomocion.toString());
      var fomomycoin = fomoBign.div(10**18).toString();
      changetotalfomo(fomomycoin)
      //LP
      const myredeem1 = await window.dapp.queryContract(window.LP,LPToken,"totalSupply",[])
      let Bignredeem1 = new BigNumber(myredeem1.toString());
      let mycoinredeem1 =Bignredeem1.div(10**18).toString();
      changetotalLP(mycoinredeem1)

      //shareUsdt
      const myredeem2 = await window.dapp.queryContract(window.usdtAddress,v2Abi,"balanceOf",window.LP)
      let Bignredeem2 = new BigNumber(myredeem2.toString());
      let mycoinredeem2 = Bignredeem2.div(10**18).toString();
      changetotalUsdt(mycoinredeem2)

      changeloading(0)
    }else{
      let self = this;
      setTimeout(function (){
        loaddata();
      },1000)
    }
  }
  const formDete4 = (str) => {
    return str.substr(0,4)+"****"+str.substr(-4);
  };
  const dateFormat =  (time) => {
    time = time + "000"
    time = parseInt(time)

    const t = new Date(time)
    // 日期格式
    // const format = 'Y-m-d h:i:s'
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
  const formDete10 = (str) => {
    return str.substr(0,2)+"***"+str.substr(-5);
  };
  const fixednub = (str) => {
    return Number(str).toFixed(2);
  };
  const [buyhistory,checkbuyhistory] = useState([]);
  const changebuyhistory = (item) => {
    checkbuyhistory(buyhistory => item)
  };


  const loadmore = () => {
    let csts = t('t42')
    changemore(csts)
    console.log(cobopl)
    getbuyLiquidityLogs(cobopl)
  }
  let cstss = t('t41')
  let [more,checkmore] = useState(cstss);
  const changemore = (item) => {
    checkmore(more => item)
  };
  const [arry,checkarry] = useState([]);
  const changearry = (item) => {
    let comen = arry;
    comen.push(item)
    checkarry(arry => comen)
  };
  const [gitftype,checkgitftype] = useState("");
  const closegift = () => {
    checkgitftype("")
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
  let pusharry = {};
  const [cobopl,checkstartBlock] = useState(0);
  const changestartBlock = (item) => {
    checkstartBlock(cobopl => item)
  };

  const getbuyLiquidityLogs = async (item) => {
    let csts = t('t42')
    changemore(csts)

    let lastBlocks = 0;
    const perBlock =5000;//每次查询多少个区块，最大5000
    let startBlock;
    let endBlock;
    if(item != 0){
      console.log(item)
      lastBlocks = item -perBlock;
      endBlock = lastBlocks;
      startBlock =lastBlocks-perBlock; // 开始块数
      changestartBlock(lastBlocks);

      // if(lastBlocks<=5000){
      //   endBlock = lastBlocks;
      //   startBlock =0; // 开始块数
      //   changestartBlock(0);
      //   changemore("已加载全部数据")
      // }else{
      //
      // }
    }else{
      lastBlocks = await window.dapp.rpc.getBlockNumber();
      changestartBlock(lastBlocks);
      // console.log(item)
      startBlock = lastBlocks - perBlock; // 开始块数
      endBlock = lastBlocks;
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
    console.log('events',events)
    if(events.length == 0){
      setTimeout(function (){
        getbuyLiquidityLogs(lastBlocks);
      },1000)
      return  false;
      // changemore("暂无数据")
    }else{
      let csts = t('t41')
      changemore(csts)
    }
    let its = buyhistory;
    let listArrOnin = events.map((item,index)=>{ // for is serial, forEach is parallel (i.e. asynchronous)
      const event = events[index];
        const decodedEvent = FomoProxyContract.interface.decodeEventLog(
          "BuyLiquidityRecord",
          event.data,
          event.topics
        );

      console.log(decodedEvent)
      pusharry = {};
      pusharry.hx = decodedEvent.inout[1];
      pusharry.ts =decodedEvent.timestamp.toString();
      pusharry.type =decodedEvent.category;
      pusharry.tokenAmount = Number(changeBigNum(decodedEvent.amounts[0]));
      pusharry.usdtAmount = Number(changeBigNum(decodedEvent.amounts[1]));
      return(
        <div className="historylistli">
          {(pusharry.hx).toUpperCase() == (window.FomoProxy).toUpperCase()?
            <div className="ril">
              <div className="cor">
                <div>{dateFormat(pusharry.ts)}</div>
                <div><span className="green">{(pusharry.tokenAmount).toFixed(2)}</span><span className="pandt">NDF</span></div>
                <div>{(pusharry.usdtAmount).toFixed(2)}</div>
                <div className="blue"><a href={"https://bscscan.com/address/"+pusharry.hx}>{formDete10(pusharry.hx)}</a></div>
              </div>
              <div className="cor">
                <div>{dateFormattime(pusharry.ts)}</div>
                <div>
                  {pusharry.type == 8?<span className="green">{(pusharry.usdtAmount).toFixed(2)}</span>:<span className="green">{(pusharry.usdtAmount/2).toFixed(2)}</span>
                  }
                  <span className="pandt">USDT</span>
                </div>
              </div>
            </div>:""
          }
          {(pusharry.hx).toUpperCase() != (window.FomoProxy).toUpperCase()?
            <div className="ril">
              <div className="cor">
                <div>{dateFormat(pusharry.ts)}</div>
                <div><span className="red">{(pusharry.tokenAmount).toFixed(2)}</span><span className="pandt">NDF</span></div>
                <div>{(pusharry.usdtAmount).toFixed(2)}</div>
                <div className="blue"><a href={"https://bscscan.com/address/"+pusharry.hx}>{formDete10(pusharry.hx)}</a></div>
              </div>
              <div className="cor">
                <div>{dateFormattime(pusharry.ts)}</div>
                <div>
                  {pusharry.type == 8 || pusharry.type == 10 || pusharry.type == 12?
                    <span className="red">{(pusharry.usdtAmount).toFixed(2)}</span>:""
                  }
                  {pusharry.type == 9 || pusharry.type == 11 || pusharry.type == 13?
                    <span className="red">0.00</span>:""
                  }
                  {pusharry.type != 8 && pusharry.type != 9&& pusharry.type != 10 && pusharry.type != 11&& pusharry.type != 13 && pusharry.type != 12?
                    <span className="red">{(pusharry.usdtAmount/2).toFixed(2)}</span>:""
                  }
                  {/*<span className="red">{(pusharry.usdtAmount/2).toFixed(2)}</span>*/}
                  <span className="pandt">USDT</span>
                </div>
              </div>
            </div>:""
          }
        </div>

      )
    })
    listArrOnin.reverse();
    if(buyhistory.length > 0){
      console.log(its.concat(listArrOnin))
      checkbuyhistory(its.concat(listArrOnin))
    }else{
      checkbuyhistory(listArrOnin)
    }
    let cstssd = t('t41')
    changemore(cstssd)
    changeloading(0)
  }
  const [haxcaeh,checkhaxcaeh] = useState("");
  const router = () => {
    window.location = "https://bscscan.com/tx/"+haxcaeh;
  }
  const closepop = () => {
    checkhaxcaeh("")
  }
  const approvebtn = async () => {
    changeloading(1)
    if (window.dapp) {
      changeloading(1)
      try {
        const valueofapprove = await window.dapp.approve(window.usdtAddress, v2Abi, window.FomoProxy, window.uintmax);
        let hash = '' + valueofapprove.hash;
        await window.dapp.rpc.waitForTransaction(hash, 1)
        checkstat("approve")
        changeloading(0)
      } catch (e) {
        changeloading(0)
        message.error('network is busy');
      }
    }
  }
  const buy = async () => {
    if (window.dapp) {
      if(stat == "approve") {
        // if(!window.isbuycount){
        //   let tesxt = t('t97')
        //   message.error(tesxt);
        //   return  false;
        // }
        if(isNaN(payprice)){
          message.error('please enter a number');
          return false;
        }
        changeloading(1)
        let priceWei = window.dapp.parseEther((payprice).toString());

        try {
          const tx = await window.dapp.executeContract(window.FomoProxy, FomoProxy, "buyLiquidity", [priceWei])
          console.log(tx);
          let hash = ''+tx.hash;
          const th =  await window.dapp.rpc.waitForTransaction(hash,1)
          checkhaxcaeh(hash);
          // const tts = await window.dapp.rpc.getTransaction(tx.hash)
          // console.log("tts:",tts)
          loaddata();
          changeloading(0)
          checkstat("wait")
        } catch (e) {

          changeloading(0)
          // message.error(e.data.data.message);

        }
      }
    }
  }
  const inputchange = (e) => {
    let it = e.target.value;
    if(it.length > 5){
      return false;
    }
    editPrice(it)
  }
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  return (
    <div className="buy">
      <div className="index">
        {haxcaeh!=""?
          <div className="logs animated fadeIn">
            <span></span>
            <div className="tit">{t('t51')}</div>
            <div className="tis" onClick={router.bind(this)}>On BscScan：{formDete10(haxcaeh)}</div>
            <div className="close" onClick={closepop.bind(this)}>X</div>
          </div>:""
        }
        <div className="indexpart">
          <div className="parlinek k2"><div>NDF/USDT</div><div><span>$<Statistic  value={(totalUsdt*2).toFixed(2)} /></span></div></div>
          <div className="parlinek k3"><div>{t('t29')}</div><div><span><Statistic  value={totalfomo} /></span></div></div>
          <div className="parlinek k4"><div>{t('t30')}</div><div><span><Statistic  value={totalUsdt} /></span></div></div>
          <div className="sellbox">
            <div className="line3">
              <Input addonAfter=" USDT"   type="number" value={payprice} onChange={inputchange}/>
              {/*<Input disabled={true} value={payprice+"USDT"}/>*/}
              <div className="reduce" onClick={addPrice}>＋</div>
              <div className="add" onClick={reducePrice}>－</div>
            </div>
            <div className="line1"><span>USDT</span> <span><Statistic  value={wonusdt}/></span></div>
            {/*<div className="line1"><span>消耗</span> <span>{payprice*100} USDT</span></div>*/}
          </div>
          {stat=="approve"?
            <div className="btns btnsbuy" onClick={buy}>{t('t31')}</div>:""
          }
          {stat=="wait"?
            <div className="btns btnsauthor" onClick={approvebtn}>{t('t36')}</div>:""
          }
          {stat=="desable"?
            <div className="btns desable">{t('t36')}</div>:""
          }
        </div>
        <div className="indexpart loadData">
          <div className="historylist">
            <div>{t('t20')}</div>
            <div>{t('t32')}</div>
            <div>{t('t33')}</div>
            <div>{t('t18')}</div>
          </div>
          {/*{buyhistory!=""?*/}
          {/*  buyhistory:<div className="nodate">{more}</div>*/}
          {/*}*/}
          {
            buyhistory.length > 0?buyhistory:<Spin indicator={antIcon} />
          }
          <div className="more" onClick={loadmore}>{more}</div>
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

export default App;

import { useState ,useEffect} from 'react';
import { message, Button, Space } from 'antd';
import {ethers} from 'ethers';
import v2Abi from "./abi/ERC20.json";
import './volunteer.css';
import { useTranslation } from 'react-i18next';
import BigNumber from "bignumber.js";
import FomoToken from "./abi/FomoToken.json";
import LPToken from "./abi/LP.json";
import $ from 'jquery'


function Volunteer() {
  const {t,i18n} = useTranslation();
  useEffect(()=>{
    window.ethereum.enable().then(()=>{
      loaddata()
    })
  },[])
  const pushAddress = () => {
    $.ajax({
      url: 'https://fomo-dao.com/prod-api/public/client/addWhite',
      type: 'POST',
      data: {
        wallet:window.dapp.currentAccount.address,
        eth:eth,
        usdt:usdtCont
      },
      dataType: 'json', // 用于设置响应体的类型 注意 跟 data 参数没关系！！！
      success: function (res) {
        if(res.code == 502){
          let tx = t('t89')
          message.error(tx);
        }
        if(res.code == 501){
          let tx = t('t90')
          message.error(tx);
        }
        if(res.code == 200){
          let tx = t('t88')
          message.success(tx);
        }
      }
    });
  }
  const [eth,checketh] = useState(0);
  const [isblol,checkisblol] = useState(true);
  const [usdtCont,checkusdtCont] = useState(0);
  const [isSubmit,checkisSubmit] = useState(true);
  const [total,checktotal] = useState(0);
  const getinfo = (mycoin) => {
    $.ajax({
      url: 'https://fomo-dao.com/prod-api/public/client/getWhite',
      type: 'POST',
      data: {
        wallet:window.dapp.currentAccount.address
      },
      dataType: 'json', // 用于设置响应体的类型 注意 跟 data 参数没关系！！！
      success: function (res) {
        checktotal(res.data.total)
        if(!res.data.isSubmit){
          checkisblol(false)
          if(Number(res.data.total) > 500){
            res.data.total = 500
            checkisSubmit(true)
          }else{
            console.log(Number(mycoin))
            if(Number(mycoin) >= 5000){

              checkisSubmit(false)
            }else{
              checkisSubmit(true)
            }
          }
        }else{
          checkisblol(true)
          checkisSubmit(true)
        }
      }
    });
  }
  const loaddata = async() => {
    if (window.dapp) {
      //USDT
      const etcprice = await window.dapp.rpc.getBalance(window.dapp.currentAccount.address);
      checketh(etcprice.toString())
      const wonrUsdt = await window.dapp.queryContract(window.usdtAddress, v2Abi, "balanceOf",window.dapp.currentAccount.address)
      console.log(wonrUsdt.toString())
      checkusdtCont(wonrUsdt.toString())
      var Bign = new BigNumber(wonrUsdt.toString());
      var mycoin = Bign.div(10**18).toString();
      getinfo(mycoin);
    }
  }
  const sendmessage = () => {
    if(isblol){
      let tx = t('t93')
      message.warning(tx);
      return false;
    }
    if(total < 500){
      let tx = t('t91')
      message.warning(tx);
    }else{
      let tx = t('t92')
      message.warning(tx);
    }

  }
  return (
    <div className="Volunteer">

        <div className="indexpart">
          <div className="titst">{t('t77')}</div>
          {/*<div className="total">*/}
          {/*  <span>{t('t78')}</span>*/}
          {/*  <span>{total}/500</span>*/}
          {/*</div>*/}
          <div className="list">
            <div className="li">
              <div className="vt">1.{t('t79')}：</div>
              <div className="tx">{t('t80')}</div>
            </div>
            <div className="li">
              <div className="vt">2.{t('t81')}：</div>
              <div className="tx">{t('t82')}</div>
            </div>
            <div className="li">
              <div className="vt">3.{t('t83')}：</div>
              <div className="tx">{t('t84')}</div>
            </div>
            <div className="li">
              <div className="vt">4.{t('t85')}：</div>
              <div className="tx">{t('t86')}</div>
            </div>
            <div className="li">
              <div className="vt">5.{t('t95')}：</div>
              <div className="tx">{t('t96')}</div>
            </div>
          </div>
          {
            isblol && isSubmit?<div className="btnfsr" onClick={sendmessage} >{t('t87')}</div>:""
          }
          {
            !isSubmit?<div className="btnf" onClick={pushAddress} >{t('t87')}</div>:""
          }
          {
            isSubmit && !isblol?<div className="btnfs" onClick={sendmessage} >{t('t87')}</div>:""
          }
        </div>
    </div>
  );
}

export default Volunteer;

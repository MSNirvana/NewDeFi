// import Dapp from './lib/dapp'
// import Dapp from './dapp-lib'
import Dapp from '@hightall/dapp-lib';
import v2Abi from "./abi/ERC20.json";

export const reloadDapp = async (onEnabled) => {
  if (window.dapp || !localStorage.getItem('account-address')) return;
  // const onDappEnabled = (account) => {
  //   localStorage.setItem('account-address', account.address);
  // }
  const onDappEnabled = onEnabled;
  const connectMethod = localStorage.getItem('connect-method');
  const options = {
    extension: connectMethod,
  }
  if (connectMethod === 'WalletConnect') {
    options.providerOptions = {
      rpc: {
        97: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
        56: 'https://bsc-dataseed.binance.org/'
      },
      // rpc: {
      //   97: 'https://apis.ankr.com/8f01c7c249604ae7b2cff135785e8a72/a0667bce47e179be0dd991453cc8b1ab/binance/full/test/',
      //   56: 'https://apis.ankr.com/b91f6a003a2e4de3a106b2abc52b8c39/a0667bce47e179be0dd991453cc8b1ab/binance/full/main/'
      // },
      chainId: window.networkEnv === 'main' ? 56 : 97,
    }
  }
  const dapp = new Dapp(options);
  dapp.onEnabled((account) => onDappEnabled(account));
  try {
    await dapp.enableBrowserExtension(window.networkEnv);
  } catch (e) {
    console.log(e);
  }
  if (dapp.currentAccount && dapp.currentAccount.address) {
    window.dapp = dapp;
    const balance = await dapp.getBalance(dapp.currentAccount.address, window.usdtAddress, v2Abi, 18);
    localStorage.setItem('balance', balance)
  }
}

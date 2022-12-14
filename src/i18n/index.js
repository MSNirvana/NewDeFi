import i18n from 'i18next';
import {
  initReactI18next
} from 'react-i18next';
const lng = 'en';
i18n.use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          t1: 'Global originality based on AMM',
          t2: 'Operated in New DeFi',
          t3:'NDF Buyback Pool',
          t4:'Dividend still need',
          t5:'Total coin burn',
          t6:'100% of the LP in the repo pool will be used to repurchase NDF and destroy it.',
          t7:'Destruction of NDF',
          t8:'Users who trigger global bonuses will receive 5 USDT Gas subsidy',
          t9:'20% LP in the reward pool will be allocated after completion of each super node',
          t10:'Holding assets',
          t101:'Core Farm',
          t102:'NFT Farm',
          t103:'LP Replacement',
          t11:'Liquidity record',
          t12:'Share of the liquidity pool',
          t13:'Redeemable USDT',
          t14:'Redeemable USDT',
          t15:'Redeem',
          t16:'Node',
          t17:'Super Node',
          t18:'User',
          t19:'Node',
          t20:'Time',
          t21:'Audit',
          t22:'Mechanism Analysis',
          t23:'New DeFi Tips',
          t24:'PPT Introduction',
          t25:'Video Introduction',
          t26:'Telegram',
          t261:'Twitter',
          t27:'Volunteer Application',
          t28:'Log out',
          t29:'Total NDF',
          t30:'Total USDT',
          t301:'Total Value',
          t302:'Your Power',
          t303:'Remaining',
          t304:'Total Stake',
          t305:'Mint',
          t306:'Approve',
          t307:'Stake',
          t308:'Exit',
          t309:'Swap',
          t31:'Add Liquidity',
          t32:'Amount',
          t33:'Sum (USDT)',
          // t34:'Estimated profits',
          t341:'Your Power',
          t342:'Your Reward',
          t343:'Your Dividend(USDT)',
          t344:'Your Old LP',
          t345:'Your New LP',
          t931:'Your NFT',
          t932:'Your Power',
          t933:'Your Reward',
          t34:'Estimated Value',
          t35:'Approve NDF',
          t351:'Approve NFT',
          t36:'Approve USDT',
          // t37:'Sell',
          t37:'Farm',
          t371:'Claim',
          t3711:'Dividend',
          t372:'Stake',
          t38:'Transaction price',
          t39:'Trading volume (NDF)',
          t40:'GMV (USDT)',
          t41:'More',
          t42:'Loading',
          t43:'Invalid binding',
          t44:'Congratulations',
          t45:'Received the reward for achieving goals',
          t46:'Received the Ultimate reward',
          // t47:'Got it',
          t47:'关 闭',
          t48:'Address of the Inviter',
          t49:'Time to release',
          // t49:'因NDF Dao被恶意攻击，目前尚在追查及联系原技术团队排查原因，先暂停市场进单，有后续结果第一时间公布社区；问题根本原因查明之后，责任会一追到底；同时，十大社区不会放弃市场付出的每一位成员，无论如何都会给市场一个明确的交代，请各位安心等待。',
          // t49:'为更公平起见, 更为了从根本上解决AMM机制的缺陷, 用代码约束人性的弱点, 从而实现只涨不跌的币价以及强制暴富, 社区将对NDF Dao进行创新式升级, 自北京时间6月10日00:00起执行以下策略: ',
          // t491:'1.关闭NDF卖出功能, 赎回LP时对应的$NDF将会被销毁 (营销多签的NDF将被保留用于社区奖励及生态运营);',
          // t492:'2.修改满单奖执行条件, 触发单量: 1000单; 奖励: 1000U (超级节点分红同步执行);',
          // t493:'注: 北京时间6月10日之前所有私人地址的NDF可以全部卖出或者通过薄饼交易所添加流动池，6月10日之后所有私人地址的NDF将无法卖出.',
          // t50:'Not start yet',
          t50:'公告',
          t51:'Transaction receipt',
          t52:'Add LP',
          t53:'Users reward',
          t54:'Sharing reward',
          t55:'Reward for pioneers',
          t56:'Public platoon reward',
          t57:'Node reward',
          t58:'Reward pool deposit',
          t59:'Maintenance costs',
          t60:'Ultimate reward',
          t61:'Last order burn',
          t62:'Target order award',
          t63:'target order burn',
          t64:'Super node reward',
          t65:'Liquidity',
          t66:'No data',
          t67:'reward',
          t68:'Super node burn',
          t69:'Redeem LP',
          t70:'Global dividends ',
          t71:'Rewards',
          t72:'Open, fair and equal; independent, safe and free from any third party',
          t73:'Link of invitation',
          t74:'Copy',
          t75:'Save',
          t76:'USDT',
          t77:'pioneer Application',
          t78:'Limit',
          t79:'Introduction of pioneer',
          t80:'Community pioneers are entitled to receive the commission rewards of selling network.',
          t81:'How to become a pioneer',
          t82:'Add 5000USDT liquidity through DAPP in one go',
          t83:'Restriction',
          t84:'Adding the aforesaid 5000USDT liquidity is only entitled to 100% of LP profits. The restriction is only applicable to these 5000USDT, the subsequent adding of liquidity is still entitled to 140% of LP profits.',
          t85:'Rights and interests of pioneer',
          t86:'When the users application is approved and the users become pioneer, they will be able to share link and establish selling network through DAPP. Once users on the selling network add liquidity, pioneers will receive 3% of the LP rewards.',
          t87:'apply',
          t88:'Submitted successfully',
          t89:'Duplicate submission',
          t90:'Missing amount',
          t91:'Your wallet is less than 5000usdt!',
          t92:'not enough！',
          t93:'Submitted！',
          t94:'In the contract audit, please look forward to it!',
          t95:'Whitelist end time',
          t96:'The whitelist application will be terminated when the online countdown is "00:01:00:00"',
          t97:'You have become a pioneer of the community, no need to place an order again, it will not affect your income!'
        },
      },
      zh: {
        translation: {
          t1: '基於AMM的全球獨創',
          t2: '加密自治社區',
          t3:'末單回購池',
          t4:'獎勵還差',
          t5:'累計銷毀',
          t6:'回购池中100%的LP将解除流动性回购NDF并销毁',
          t7:'NDF銷毀',
          t8:'触发全球红利的用户将获得5 USDT Gas补贴,',
          t9:'每100000USDT結束，超級節點可分配獎池20%的LP（自行提取奖励）,',
          t10:'持有資產',
          t103:'LP 置換',
          t11:'流動性記錄',
          t12:'流動性池的份額',
          t13:'可贖回NDF',
          t14:'可贖回USDT',
          t15:'贖回',
          t16:'節點',
          t17:'超級節點',
          t18:'用戶',
          t19:'節點',
          t20:'時間',
          t21:'審計報告',
          t22:'機制解析',
          t23:'New DeFi小知識',
          t24:'PPT介紹',
          t25:'視頻介紹',
          t26:'電報社區',
          t261:'推特社區',
          t27:'先锋申請',
          t28:'退出登录',
          t29:'總入池NDF',
          t30:'總入池USDT',
          t31:'添加流動性',
          t32:'數量',
          t33:'金額(USDT)',
          t34:'預計收入(USDT)',
          t341:'你的算力',
          t342:'你的獎勵(LP)',
          t343:'超級節點分紅(USDT)',
          t344:'你的舊LP',
          t345:'你的新LP',
          t931:'你的NFT',
          t932:'你的權重',
          t933:'你的獎勵',
          t371:'收益',
          t3711:'分紅',
          t305:'鑄造',
          t303:'剩餘',
          t304:'總質押',
          t307:'質押',
          t308:'退出',
          t309:'置換',
          t306:'授權',
          t35:'授權NDF',
          t36:'授權USDT',
          t37:'農場',
          t38:'成交價',
          t39:'成交量(NDF)',
          t40:'成交額(USDT)',
          t41:'查看更多',
          t42:'加載中',
          t43:'無效綁定',
          t44:'恭喜',
          t45:'獲得滿單獎',
          t46:'獲得末單獎',
          t47:'知道了',
          t48:'邀請人地址',
          t49:'距離上線',
          t50:'暫未開始',
          t51:'交易收據',
          t52:'添加LP',
          t53:'用戶獎勵',
          t54:'分享獎勵',
          t55:'覈心志願者獎勵',
          t56:'公排獎勵',
          t57:'節點獎勵',
          t58:'獎池沉澱',
          t59:'維護費用',
          t60:'末單獎勵',
          t61:'末單銷毀',
          t62:'滿單獎勵',
          t63:'滿單銷毀',
          t64:'超級節點獎勵',
          t65:'流動性',
          t66:'暫無數據',
          t67:'獎勵',
          t68:'超級節點銷毀',
          t69:'贖回LP',
          t70:'全球分紅',
          t71:'獎勵',
          t72:'公開、公平、公正且具有獨立性、安全性和完全沒有協力廠商',
          t73:'邀請連結',
          t74:'複製',
          t75:'保存',
          t76:'USDT',
          t77:'先鋒申請',
          t78:'限量',
          t79:'核心志願者說明',
          t80:'社區核心志願者名單，擁有銷售網絡平台佣金分润。',
          t81:'成為核心志願者條件',
          t82:'需要通過dapp一次性添加流動性5000USDT。',
          t83:'相關限制',
          t84:'添加流動性的5000USDT只能獲得100%的LP收益。僅限制此5000USDT，後續添加流動性依然享受140%的LP收益。',
          t85:'核心志願者權益',
          t86:'用戶申請成為了核心志願者，通過DAPP分享鏈接建立銷售網絡，銷售網絡中用戶添加流動性，核心志願者都可以獲得3%的LP獎勵。',
          t87:'申請',
          t88:'提交成功',
          t89:'重複提交',
          t90:'缺少金額',
          t91:'您的錢包金額不足5000USDT！',
          t92:'售罄！',
          t93:'已提交！',
          t94:'合约审计中，敬请期待！',
          t95:'白名单结束时间',
          t96:'上线倒计时在"00:01:00:00"的时候将中止白名单申请',
          t97:'您已成为社区先锋，无需再次下单，将不影响您的收益！'
        },
      },
      ru: {
        translation: {
          t1: 'Первое в мире работающее в сфере DeFi',
          t2: 'крипто-автономное сообщество',
          t3:'пул скопившихся контрактов',
          t4:'для получения вознаграждения еще не хватало',
          t5:'уничтожение',
          t6:'на последний заказ могут выделены 50% LP от пула скопивших контрактов',
          t7:'уничтожение NDF',
          t8:'LP в размере 5000U в пуле скопивших контрактов могут быть выделены на возграждение заказа, достигшего цели,',
          t9:'В конце каждого раунда суперузлы могут выделять 20% LP пула бонусов,',
          t10:'владения',
          t11:'ликвидности',
          t12:'Доля пула ликвидности',
          t13:'выкупаемый NDF',
          t14:'выкупаемый USDT',
          t15:'выкупить',
          t16:'узел',
          t17:'суперузел',
          t18:'абонент',
          t19:'узла',
          t20:'время',
          t21:'Аудиторские отчеты',
          t22:'Википедия',
          t23:'Введение',
          t24:'Презентация',
          t25:'Видео',
          t26:'Сообщество Telegram',
          t27:'Заявка на основных волонтеров',
          t28:'выйти',
          t29:'общее NDF в пуле',
          t30:'общее USDT в пуле',
          t31:'добавить ликвидность',
          t32:'количество',
          t33:'сумма(U)',
          t34:'предполагаемый доход',
          t35:'авторизация',
          t36:'авторизация',
          t37:'продать',
          t38:'покупная цена',
          t39:'торговый оборот',
          t40:'торговый оборот',
          t41:'узнать больше',
          t42:'загрузка',
          t43:'недействительная привязка',
          t44:'поздравляем!',
          t45:'получили вознаграждение заказа, достигшего цели',
          t46:'получили вознаграждение последнего заказа',
          t47:'ясно',
          t48:'адрес приглашающего',
          t49:'до запуска DAPP',
          t50:'еще не началось',
          t51:'квитанция о транзакции',
          t52:'добавить LP',
          t53:'вознаграждение пользователей',
          t54:'совместное использование',
          t55:'основных волонтеров',
          t56:'публичной очереди',
          t57:'узлов',
          t58:'скопление контрактов',
          t59:'Расходы  обслуживание',
          t60:'последнего заказа',
          t61:'уничтожение',
          t62:'Вознаграждение заказа',
          t63:'уничтожение заказа',
          t64:'вознаграждение',
          t65:'текучесть',
          t66:'Пока нет данных',
          t67:'награда',
          t68:'уничтожение',
          t69:'выкупить LP',
          t70:'глобальные дивиденды',
          t71:'вознаграждение',
          t72:'октрытость, справедливость, независимость, безопасность и нет третьего лица',
          t73:'ссылка для приглашения',
          t74:'копировать',
          t75:'сохранить',
          t76:'лист',
          t77:'Заявка на основных волонтеров',
          t78:'лимит',
          t79:'описание основных волонтеров',
          t80:'Стать основным волонтером сообщества, получить комиссионные вознаграждения от онлайн-платформы торговли',
          t81:'Условия для получения статуса основного волонтера',
          t82:'Необходимо добавить ликвидность 5000USDT за один раз через Dapp',
          t83:'соответствующие ограничения',
          t84:'добавленная ликвидность 5000USDT только может получить доход в размере 100% LP. Ограничены только эти 5000USDT,последующие пополнения ликвидности будут по-прежнему получать  доход в размере 140% LP.',
          t85:'Основные льготы для волонтеров',
          t86:'Пользователи подают заявки на участие в качестве основных волонтеров, обмениваются ссылками через DAPP для создания сети продаж,добавляют ликвидность пользователям в сети продаж, основные волонтеры имеют право на бонус LP в размере 3%.',
          t87:'заявка',
          t88:'передача успешно завершена',
          t89:'повторное представление',
          t90:'Недостающая сумма',
          t91:'у вас недостаточно бумажника！',
          t92:'распродать！',
          t93:'Представлено！',
          t94:'в аудите контракта, пожалуйста, ждите!',
          t95:'Время окончания белого списка',
          t96:'Приложение белого списка будет прекращено, когда обратный отсчет онлайн будет «00:01:00:00».',
          t97:'Вы стали активным волонтером сообщества, не нужно снова оформлять заказ, это не повлияет на ваш доход!'
        },
      }
    },
    lng: lng,
    fallbackLng: lng,
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n

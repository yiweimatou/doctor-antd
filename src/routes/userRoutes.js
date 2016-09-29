import Bill from '../components/User/Bill'
import SetAlipay from '../components/User/SetAlipay'
import Recharge from '../containers/user/rechargeContainer'
import Deposit from '../components/User/Deposit'
import { ACCOUNT } from '../constants/api'

const depositRoute = () => ({
    path: 'deposit',
    component: Deposit
})

const moneyRoute = store => ({
    path: 'bill',
    component: Bill,
    onEnter() {
        const userId = store.getState().auth.key
        store.dispatch({
            type: 'bill/info',
            payload: {
                 params: {
                    category_id: ACCOUNT,
                    foreign_id: userId
                }
            }
        }),
        store.dispatch({
            type: 'bill/list',
            payload: {
                params:{
                    limit: 9,
                    offset: 1,
                    category_id: ACCOUNT,
                    foreign_id: userId
                }
            }
        })
    }
})

const accountSettingRoute = () => ({
    path: 'bill/alipay/set',
    component:SetAlipay
})

const rechargeRoute = () => ({
  path: 'recharge',
  component: Recharge,
})

const userRoutes = store => ({
    path: 'user',
    childRoutes: [
        moneyRoute(store),
        accountSettingRoute(),
        rechargeRoute(),
        depositRoute()
    ]
})

export default userRoutes

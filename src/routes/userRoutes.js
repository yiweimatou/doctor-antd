import Money from '../components/User/Money'
import SetAlipay from '../components/User/SetAlipay'
import Recharge from '../containers/user/rechargeContainer'

const moneyRoute = store => ({
    path: 'money',
    component: Money,
    onEnter() {
        store.dispatch({
            type: 'money/info',
            payload: {}
        }),
        store.dispatch({
            type: 'money/fetchlist',
            payload: {
                limit: 6,
                offset: 1,
                type: 3
            }
        })
    }
})

const accountSettingRoute = () => ({
    path: 'money/alipay/set',
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
        rechargeRoute()
    ]
})

export default userRoutes

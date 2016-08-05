import Money from '../components/User/Money'
import SetAlipay from '../components/User/SetAlipay'

const moneyRoute = store => ({
    path: 'money',
    component: Money,
    onEnter() {
        store.dispatch({
            type: 'user/money/info',
            payload: {}
        }),
        store.dispatch({
            type: 'user/money/list',
            payload: {
                limit: 6,
                offset: 1
            }
        })
    }
})

const accountSettingRoute = () => ({
    path: 'money/alipay/set',
    component:SetAlipay
})

const userRoutes = store => ({
    path: 'user',
    childRoutes: [
        moneyRoute(store),
        accountSettingRoute()
    ]
})

export default userRoutes
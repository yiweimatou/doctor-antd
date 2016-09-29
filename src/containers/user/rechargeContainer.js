import { connect } from 'react-redux'
import Recharge from '../../components/Recharge'
import { ACCOUNT } from '../../constants/api'

export default connect(
  state => ({
    foreignId: state.auth.key
  }),
  dispatch => ({
    recharge: (params, resolve, reject)  => dispatch({
      type: 'bill/add',
      payload: {
        params: {
          ...params,
          category_id: ACCOUNT
        }, resolve, reject
      }
    }),
    fetch: (params, resolve, reject) => dispatch({
      type: 'bill/get',
      payload: {
        params, resolve, reject
      }
    })
  })
)(Recharge)

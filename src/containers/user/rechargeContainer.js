import { connect } from 'react-redux'
import Recharge from '../../components/Recharge'

export default connect(
  state => ({
    foreignId: state.auth.key,
    status: state.money.actionStatus.add,
    record: state.money.user.record
  }),
  dispatch => ({
    recharge: params => dispatch({
      type: 'money/add',
      payload: {
        ...params,
        type: 3
      }
    }),
    fetchOne: params => dispatch({
      type: 'money/fetchone',
      payload: params
    })
  })
)(Recharge)

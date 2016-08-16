import { connect } from 'react-redux'
import Recharge from '../../components/Recharge'

export default connect(
  state => ({
    foreignId: state.organize.entity && state.organize.entity.id,
    status: state.money.actionStatus.add,
    record: state.money.organize.record
  }),
  dispatch => ({
    recharge: params => dispatch({
      type: 'money/add',
      payload: {
        ...params,
        type: 1
      }
    }),
    fetchOne: params => dispatch({
      type: 'money/fetchone',
      payload: params
    })
  })
)(Recharge)

import { connect } from 'react-redux'
import Recharge from '../../components/Recharge'

export default connect(
  state => ({
    organize: state.organize.entity
  })
)(Recharge)

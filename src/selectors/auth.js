import { createSelector } from 'reselect'

const authSelector = createSelector( 
    state => state.auth,
    auth => auth    
)

export default authSelector
import { createSelector } from 'reselect'

const loadingSelector = createSelector(
    state => state.lesson.loading,
    loading => loading
)

export default loadingSelector


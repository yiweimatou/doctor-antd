import {
    createSelector
} from 'reselect'
import array from 'lodash/array'

const lessonSelector = state => state.lesson.list.data
const userSelector = state => state.user.list
const getTeams = state => state.lessonTeam.list
export const teamListSelector = createSelector(
    lessonSelector,
    userSelector,
    getTeams,
    (lessons, users, teams) => {
       const list =teams.map(team => ({
            id: team.id,
            add_ms: team.add_ms,
            cet: team.cet,
            lesson_name: lessons&&lessons[array.findIndex(lessons, {
                id: team.lesson_id
            })].title,
            user: users&&users[array.findIndex(users, {
                id: team.account_id
            })]
        }))
        return list
    }
)
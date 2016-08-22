import { handleActions } from 'redux-actions'

const initialState = {
  user: {
    record: null,
    records: null,
    params: { limit: 6, offset: 1 },
    total: 0
  },
  lesson: {
    record: null,
    records: null,
    params: { limit: 6, offset: 1 },
    total: 0
  },
  organize: {
    record: null,
    records: null,
    params: { limit: 6, offset: 1 },
    total: 0
  },
  actionStatus: {
    add: {
      pending: false,
      error: null,
      isSuccess: false
    },
    fetch: {
      pending: false,
      error: null
    }
  }
}

const money = handleActions({
  ['money/info'](state, action) {
    //类型：0未知,1机构,2课程,3账号
    switch (action.payload.type) {
      case 1:
        return {
          ...state,
          organize:{
            ...state.organize,
            total: 0
          }
        }
      case 2:
        return {
          ...state,
          lesson: {
            ...state.lesson,
            total: 0
          }
        }
      case 3:
        return {
          ...state,
          user: {
            ...state.user,
            total: 0
          }
        }
      default:
        return state
    }
  },
  ['money/info/success'](state, action) {
    switch (action.payload.params.type) {
      case 1:
        return {
          ...state,
          organize: {
            ...state.organize,
            total: action.payload.total
          }
        }
      case 2:
        return {
          ...state,
          lesson: {
            ...state.organize,
            total: action.payload.total
          }
        }
      case 3:
        return {
          ...state,
          user: {
            ...state.organize,
            total: action.payload.total
          }
        }
      default:
        return state
    }
  },
  ['money/fetchone'](state) {
    return {
      ...state,
      actionStatus: {
        ...state.actionStatus,
        fetch: {
          pending: true
        }
      }
    }
  },
  ['money/fetchone/success'](state, action) {
    switch (action.payload.type) {
      case 1:
        return {
          ...state,
          organize: {
            ...state.organize,
            record:action.payload
          },
          actionStatus: {
            ...state.actionStatus,
            fetch: {
              pending: false
            }
          }
        }
      case 2:
        return {
          ...state,
          lesson: {
            ...state.lesson,
            record: action.payload,
            actionStatus: {
              ...state.actionStatus,
              fetch: {
                pending: false
              }
            }
          }
        }
      case 3:
        return {
          ...state,
          user: {
            ...state.user,
            record: action.payload,
            actionStatus: {
              ...state.actionStatus,
              fetch: {
                pending: false
              }
            }
          }
        }
      default:
        return state
    }
  },
  ['money/fetchone/failure'](state, action) {
    return {
      ...state,
      actionStatus: {
        ...state.actionStatus,
        fetch: {
          pending: false,
          error: action.payload
        }
      }
    }
  },
  ['money/fetchlist'](state) {
    return {
      ...state,
      actionStatus: {
        ...state.actionStatus,
        fetch: {
          pending: true
        }
      }
    }
  },
  ['money/fetchlist/success'](state, action) {
    switch (action.payload.params.type) {
      case 1:
        return {
            ...state,
            organize: {
              ...state.organize,
              records: action.payload.data,
              params: action.payload.params
            },
            actionStatus: {
              ...state.actionStatus,
              fetch: {
                pending: false
              }
            }
        }
    case 2:
      return {
          ...state,
          lesson: {
            ...state.lesson,
            records: action.payload.data,
            params: action.payload.params
          },
          actionStatus: {
            ...state.actionStatus,
            fetch: {
              pending: false
            }
          }
      }
      case 3:
        return {
            ...state,
            user: {
              ...state.user,
              records: action.payload.data,
              params: action.payload.params
            },
            actionStatus: {
              ...state.actionStatus,
              fetch: {
                pending: false
              }
            }
        }
      default:
        return state
    }
  },
  ['money/fetchlist/failure'](state, action) {
    return {
      ...state,
      actionStatus: {
        ...state.actionStatus,
        fetch: {
          pending: false,
          error: action.payload
        }
      }
    }
  },
  ['money/add'](state) {
    return {
      ...state,
      actionStatus: {
        add: {
          pending: true,
          isSuccess: false
        }
      }
    }
  },
  ['money/add/success'](state, action) {
    switch (action.payload.type) {
      case 1:
        return {
          ...state,
          organize: {
            ...state.organize,
            record: action.payload
          },
          actionStatus: {
            ...state.actionStatus,
            add: {
              pending: false,
              isSuccess: true
            }
          }
        }
    case 2:
      return {
        ...state,
        lesson: {
          ...state.lesson,
          record: action.payload
        },
        actionStatus: {
          ...state.actionStatus,
          add: {
            pending: false,
            isSuccess: true
          }
        }
      }
    case 3:
      return {
        ...state,
        user: {
          ...state.user,
          record: action.payload
        },
        actionStatus: {
          ...state.actionStatus,
          add: {
            pending: false,
            isSuccess: true
          }
        }
      }
      default:
        return state
    }
  },
  ['money/add/failure'](state, action) {
    return {
      ...state,
      actionStatus: {
        ...state.actionStatus,
        add: {
          pending: false,
          isSuccess: false,
          error: action.payload
        }
      }
    }
  }
}, initialState)

export default money

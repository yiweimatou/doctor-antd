export function fetchCollection(model: string, path: string, params: Object = {}, opts
                                  ) {
  const method = opts.method || 'get'
  return {
    type: 'FETCH',
    meta: {
      success: 'FETCH_SUCCESS',
      failure: 'FETCH_ERROR',
      params,
      model
    },
    payload: {
      method,
      path,
      params
    }
  }
}

export function fetchRecord(model: string, id, path: string,
                               params: Object = {}, opts
                              ) {
  const method = opts.method || 'get'
  return {
    type: 'FETCH_ONE',
    meta: {
      success: 'FETCH_ONE_SUCCESS',
      failure: 'FETCH_ONE_ERROR',
      model,
      id
    },
    payload: {
      method,
      path,
      params
    }
  }
}

export function createRecord(model: string, path: string, data,
                                params: Object = {}, opts
                               ) {
  const method = opts.method || 'post'
  return {
    type: 'CREATE',
    meta: {
      success: 'CREATE_SUCCESS',
      failure: 'CREATE_ERROR',
      model
    },
    payload: {
      method,
      path,
      data,
      params
    }
  }
}

export function updateRecord(model: string, id, path: string, data,
                                params: Object = {}, opts
                               ) {
  const method = opts.method || 'put'
  return {
    type: 'UPDATE',
    meta: {
      success: 'UPDATE_SUCCESS',
      failure: 'UPDATE_ERROR',
      model,
      id
    },
    payload: {
      method,
      path,
      data,
      params
    }
  }
}

export function deleteRecord(model: string, id, path: string,
                             params: Object = {}, opts
                            ) {
  const method = opts.method || 'delete'
  return {
    type: 'DELETE',
    meta: {
      success: 'DELETE_SUCCESS',
      failure: 'DELETE_ERROR',
      model,
      id
    },
    payload: {
      method,
      path,
      params
    }
  }
}

export function clearActionStatus(model: string, action: 'create' | 'update' | 'delete'
                                 ) {
  return {
    type: 'CLEAR_ACTION_STATUS',
    payload: { model, action }
  }
}

export function apiCall(success: string, failure: string, method, path: string,
                           params: Object = {}, data, opts: Object = {}
                          ) {
  const meta = opts.meta || {}
  return {
    type: 'API_CALL',
    meta: {
      ...meta,
      success,
      failure
    },
    payload: {
      method,
      path,
      params,
      data
    }
  }
}

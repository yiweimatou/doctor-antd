export function fetchCollection(model: string, url: string, params: Object = {}, opts
                                  ) {
  const method = opts.method || 'get'
  return {
    type: 'FETCH',
    payload: {
      success: 'FETCH_SUCCESS',
      failure: 'FETCH_ERROR',
      params,
      model,
      method,
      url
    }
  }
}

export function fetchRecord(model: string, url: string,
                               params: Object = {}, opts
                              ) {
  const method = opts.method || 'get'
  return {
    type: 'FETCH_ONE',
    payload: {
      success: 'FETCH_ONE_SUCCESS',
      failure: 'FETCH_ONE_ERROR',
      model,
      method,
      url,
      params
    }
  }
}

export function createRecord(model: string, url: string,
                                params: Object = {}, opts
                               ) {
  const method = opts.method || 'post'
  return {
    type: 'CREATE',
    payload: {
      success: 'CREATE_SUCCESS',
      failure: 'CREATE_ERROR',
      model,
      method,
      url,
      params
    }
  }
}

export function updateRecord(model: string, url: string, data,
                                params: Object = {}, opts
                               ) {
  const method = opts.method || 'put'
  return {
    type: 'UPDATE',
    payload: {
      success: 'UPDATE_SUCCESS',
      failure: 'UPDATE_ERROR',
      model,
      method,
      url,
      data,
      params
    }
  }
}

export function deleteRecord(model: string, url: string,
                             params: Object = {}, opts
                            ) {
  const method = opts.method || 'delete'
  return {
    type: 'DELETE',
    payload: {
      success: 'DELETE_SUCCESS',
      failure: 'DELETE_ERROR',
      model,
      method,
      url,
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

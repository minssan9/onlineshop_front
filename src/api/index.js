import axios from 'axios'
import router from '../router'
import qs from 'qs'

// const DOMAIN = 'http://shop.voyagerss.com' 
const DOMAIN =  '/api/shop' 

const BadRequest = 400
const Unauthorized = 401
const Forbidden = 403
const NotFound = 404


export const setAuthInHeader = token => {
  axios.defaults.headers.common['Authorization'] = token ? 'Bearer ${token}' : null
}

const onUnauthorized = () => {
  router.push('/login?returnPath=${encodeURIComponent(location.pathname)}')
  throw Error(response)
}
const onForbidden = (response) => {
  alert('권한이 없습니다.')
  router.push('/')
  throw Error(response)
}

const onBadRequest = (response) => {
  alert('잘못된요청입니다.')
  throw Error(response)
}

const onNotFound = (response) => {
  alert('잘못된 접근입니다.')
  throw Error(response)
}


const authRequest = (method, url, data) => {
  return axios({
    headers: {
      'Authorization': 'Basic aWQ6c2VjcmV0',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method,
    url: DOMAIN + url,
    data: qs.stringify(data)
  }).then(result => result)
    .catch(({response}) => {
      if (response.status === Unauthorized) return onUnauthorized()
      else if (response.status == Forbidden) return onForbidden(response)
      else if (response.status == BadRequest) return onBadRequest(response)
      else if (response.status == NotFound) return onNotFound(response)
      throw Error(response)
    })
}

const request = (method, url, data) => {
  return axios({
    method,
    url: DOMAIN + url,
    data,

  }).then(result => result)
    .catch(error => error.response)
}

const requestFile = (method, url, data) => {
  return axios({
    method,
    url: DOMAIN + url,
    data,
    processData: false,
    contentType: false

  }).then(result => result)
    .catch(error => error.response)
}

export const auth = {
  login(playload) {
    return authRequest('post', DOMAIN + '/oauth/token', playload)
  }
}

export const account = {
  fetch() {
    return request('get', DOMAIN + '/accounts')
  },
  create(playload) {
    return request('post', DOMAIN + '/accounts', playload)
  },
  put(playload) {
    return request('put', DOMAIN + '/accounts', playload)
  },
  fetchManager(playload) {
    return request('get', DOMAIN + '/accounts/manager?page=${playload.page}&size=10&sort=id,DESC')
  },
  fetchManagerSearch(playload) {
    return request('get', DOMAIN + '/accounts/manager/${playload.option}/${playload.keyword}?page=${playload.page}&size=10&sort=id,DESC')
  },
  idCheck(playload) {
    return request('post', DOMAIN + '/accounts/join/check', playload)
  },
  createFiles(playload) {
    return requestFile('post', DOMAIN + '/accounts/files/${playload.accountId}', playload.formData)
  }
}

export const cart = {
  fetch() {
    return request('get', DOMAIN + '/carts')
  },
  create(playload) {
    return request('post', DOMAIN + '/carts/${playload.itemId}')
  },
  destroy(playload) {
    return request('delete', DOMAIN + '/carts/${playload.id}')
  },
  destroyAll() {
    return request('delete', DOMAIN + '/carts/all')
  }
}

// 주문리스트
export const order = {
  fetchAccount(page) {
    return request('get', DOMAIN + '/orders/?page=${page.id}&size=10&sort=id,DESC')
  },
  fetchManager(page) {
    return request('get', DOMAIN + '/orders/manager?page=${page.id}&size=10&sort=id,DESC')
  },
  create(playload) {
    return request('post', DOMAIN + '/orders', playload)
  },
  put(playload) {
    return request('put', DOMAIN + '/orders', playload)
  },
  fetchManagerSearch(playload) {
    return request('get', DOMAIN + '/orders/manager/${playload.option}/${playload.keyword}?page=${playload.page}&size=10&sort=id,DESC')
  },
  fetchOperationStatus() {
    return request('get', DOMAIN + '/orders/operation/status')
  },
  fetchOperationStatusSerach(playload) {
    return request('get', DOMAIN + '/orders/operation/status/${playload.yy}/${playload.mm}/${playload.dd}')
  }
}

export const item = {
  fetch(id) {
    return request('get', DOMAIN + '/items/${id}')
  },
  // DESC
  fetchList(playload) {
    return request('get', DOMAIN + '/items?page=${playload.page}&size=${playload.size}&sort=${playload.option},${playload.sort}')
  },
  create(playload) {
    return request('post', DOMAIN + '/items', playload)
  },
  put(playload) {
    return request('put', DOMAIN + '/items/${playload.id}', playload.item)
  },
  destroy(playload) {
    return request('delete', DOMAIN + '/items/${playload.id}')
  },
  fetchSearch(playload) {
    return request('get', DOMAIN + '/items/search/${playload.keyword}?page=${playload.page}&size=16&sort=${playload.option},${playload.sort}')
  },
  createFiles(playload) {
    return requestFile('post', DOMAIN + '/items/files', playload)
  }
}

// 상품문의
export const qna = {

  fetch(playload) {
    return request('get', DOMAIN + '/qna/${playload.itemId}?page=${playload.page}&size=5&sort=id,DESC')
  },
  fetchManager(playload) {
    return request('get', DOMAIN + '/qna?page=${playload.page}&size=10&sort=id,DESC')
  },
  create(playload) {
    return request('post', DOMAIN + '/qna/${playload.itemId}', playload.qna)
  },
  put(playload) {
    return request('put', DOMAIN + '/qna/${playload.itemId}', {content: playload.content})
  },
  destroy(playload) {
    return request('delete', DOMAIN + '/qna/${playload.qnaId}');
  },
  fetchManagerSearch(playload) {
    return request('get', DOMAIN + '/qna/manager/${playload.option}/${playload.keyword}?page=${playload.page}&size=10&sort=id,DESC')
  },
}

export const review = {

  fetch(playload) {
    return request('get', DOMAIN + '/reviews/${playload.itemId}?page=${playload.page}&size=5&sort=id,DESC')
  },
  fetchManager(playload) {
    return request('get', DOMAIN + '/reviews?page=${playload.page}&size=10&sort=id,DESC')
  },
  fetchManagerSearch(playload) {
    return request('get', DOMAIN + '/reviews/manager/${playload.option}/${playload.keyword}?page=${playload.page}&size=10&sort=id,DESC')
  },
  create(playload) {
    return request('post', DOMAIN + '/reviews/${playload.itemId}', playload.review)
  },
  createFiles(playload) {
    return requestFile('post', DOMAIN + '/reviews/files', playload)
  }
}

export const chat = {
  fetch(playload) {
    return request('get', DOMAIN + '/chats/${playload.id}')
  },
  fetchList() {
    return request('get', DOMAIN + '/chats?sort=unRead,DESC')
  },
  read(playload) {
    return request('get', DOMAIN + '/chats/read/${playload.id}')
  }
}

export const mail = {
  mailSend(playload) {
    return request('post', DOMAIN + '/mails', {title: playload.title, content: playload.content})
  },
}




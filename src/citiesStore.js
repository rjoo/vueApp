import { Promise } from 'es6-promise'
import request from 'superagent'
import jsonp from 'superagent-jsonp'

const url = 'http://gd.geobytes.com/AutoCompleteCity?filter=US&template=<geobytes%20city>,%20<geobytes%20code>&q='
let store = {}

export default store

store.getCities = (q) => {
  return new Promise((resolve, reject) => {
    if (q && q.length > 3) {
      request
        .get(url + q)
        .use(jsonp)
        .end((err, res) => {
          console.log('getCities done, resolving with: ', res)
          if (err) reject(err)
          else resolve(res.body)
        })
    } else {
      resolve([])
    }
  })
}

import { Promise } from 'es6-promise'
import request from 'superagent'
// import searchData from './search.json'
import jsonp from 'superagent-jsonp'

const apiKey = '5PH94nd78H3jTvmC'
const url = 'https://api.eventful.com/json'
let store = {}

export default store

/**
*   Search for events and returns an object
*   @params q - expects date 'YYYYMMDD00-YYYYMMDD00', pageSize, and pageNumber
*/
store.searchEvents = (q) => {
  var search = url +
    '/events/search?app_key=' + apiKey +
    '&date=' + q.date +
    '&page_size=' + q.pageSize +
    '&page_number=' + q.pageNumber +
    '&location=' + q.location +
    '&within=10' +
    '&units=mi'

  return new Promise((resolve, reject) => {
    request
      .get(search)
      .use(jsonp)
      .end((err, res) => {
        if (err) reject(err)
        else resolve(res.body)
      })
  })
}

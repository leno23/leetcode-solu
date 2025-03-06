// 应用场景： 插件适配(接口参数适配)   promisify  jquery  computed

// let $ = require('jquery')

// 使用fetch适配老的jquery的写法
window.$ = {
  ajax(options) {
    return fetch(options.url, {
      method: options.type || 'GET',
      body: JSON.stringify(options.data || {})
    })
  }
}

$.ajax({
  url: 'http://www.baidu.com',
  type: 'POST',
  dataType: 'json',
  data: { id: 1 }
}).then(function (data) {
  console.log(data)
})

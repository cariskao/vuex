'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// 設定「Vue 出一個電商網站」第11章節 講座82的環境變數
// 這裡是開發時的設定,到時記得在prod.env.js也要設定
// 注意這裡涵蓋單雙引號,並且記得修改完要重啓
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
})

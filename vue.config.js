/**
 * vue.config 配置
 * @author maybe
 */
const path = require('path')
// const fs = require('fs')
// __dirname 总是指向被执行 js 文件的绝对路径
const resolve = dir => {
  return path.join(__dirname, dir)
}
// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/web'
  : '/'
const mockIndexData = require("./mock/swipe.json");
module.exports = {
//   baseUrl: BASE_URL,
  lintOnSave:false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))
  },
  assetsDir: 'assets', //静态资源目录(js,css,img,fonts)这些文件都可以写里面
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 输出文件目录
  outputDir: 'maybe',
  // webpack-dev-server 相关配置
  devServer: {
      port: 8080,
      before(app) {
          app.get("/news/index", (req, res) => {
              res.json(mockIndexData);
          });
      }
  }
}
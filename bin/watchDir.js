/** 
 * watch 文件夹内容变化，并实时跟踪编译
 */

const path = require('path')
const chokidar = require('chokidar')
const { buildFile } = require('./buildFile')
const chalk = require('chalk')


function resolve(path_){
  return path.join(path.resolve(), path_)
}


function addFileListener(path_){
  console.log(chalk.gray.bgGreen(' add '), path_.replace(path.resolve(),''))
  buildFile(path_, true)
}

function fileChangeListener(path_){
  console.log(chalk.gray.bgCyan(' change '), path_.replace(path.resolve(),''))
  
  buildFile(path_, true)
}

function errorListener(err){
  console.log(chalk.gray.bgRed(err))
}

function watchFile(options){
  const dirPath = resolve(options.path)
  global.watcher = chokidar
    .watch(dirPath, {
      ignored: (filepath, stat)=>{
        const reg = /(node_modules)|((^|[\/\\])\..)/
        if(reg.test(filepath))return true
        if(/.*\.wcp$/.test(filepath)){
          return false
        }else{
          const lastPath = filepath.replace('\\','/').split('/').pop()
          const reg2 = /.*\..*$/
          return reg2.test(lastPath)
        }
      },
      persistent: true,
    })
    .on('add', addFileListener)
    .on('change', fileChangeListener)
    .on('error', errorListener)
}

module.exports = {
  watchFile
}


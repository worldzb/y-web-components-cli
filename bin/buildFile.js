/**
 * wcp 文件编译主文件
 */

const fs = require('fs')
const path = require('path')
const {compileScss} = require('./compileScss')

/**
 * 路径解析
 * @param {*} filePath 
 * @returns 
 */
function resolve(filePath){
  return path.join(path.resolve(), filePath)
}

/**
 * 获取模版
 * @param {*} content 
 */
function getTemplate(content){
  const reg = /(?<=<template.*>)([^]+)(?=<\/template>)/
  return content.match(reg) && content.match(reg)[0]
}

/**
 * 获取 style
 * @param {*} content 
 */
function getStyle(content, filePath){
  // 获取带有 <style></style> 的样式
  const reg0 = /<style.*>([^]+)<\/style>/
  // 获取不带 <style></style> 的样式
  const reg1 = /(?<=<style.*>)([^]+)(?=<\/style>)/ 
  // 获取样式使用语言
  const reg2 = /(?<=<style\s+lang.*=.*")([^]+)(?=".*>)/ 
  // 先匹配 所有 style 内容，再去细分匹配，优化匹配速度
  const styleAll = content.match(reg0) && content.match(reg0)[0]
  const stylePure = styleAll.match(reg1) && styleAll.match(reg1)[0]
  const styleLang = styleAll.match(reg2) && styleAll.match(reg2)[0]

  // 获取 style lang， 以便调用预编译器进行编译
  if(styleLang==='scss'){
    return compileScss(stylePure, filePath)
  }
  return stylePure
}

/**
 * 获取 Script
 * @param {*} content 
 */
function getScript(content){
  const reg = /(?<=<script.*>)([^]+)(?=<\/script>)/
  return content.match(reg) && content.match(reg)[0]
}

/**
 * 获取组件类名
 * @param {*} content 
 */
function getClassName(script){
  const reg = /(?<=class)([^]*)(?=extends)/
  return script.match(reg) && script.match(reg)[0].trim()
}

/**
 * 类名转换为组件名
 * @param {*} classname 
 */
function className2ComponentName(classname){
  const reg = /([A-Z]+)([^A-Z]*)(?<![A-Z])/g
  let res = classname.match(reg)
  if(Array.isArray(res)){
    res = res.map(item=>item.toLocaleLowerCase())
    return res.join('-')
  }
  return ''
}

/**
 * 组合 template
 * @param {*} template 
 * @param {*} style 
 * @returns 
 */
function combinTemplate(template, style, componentName){
  let temp = 'const __template__ = `'
  temp += `\n<style>\n${style}\n</style>${template}`
  temp += '`'
  return temp
}

/**
 * 组合 JS
 * @param {*} script 
 * @param {*} template 
 */
function combinScript(script){
  const reg = /(?<=constructor\(\)\{[^]*super\(.*\))(\n|\s|)(?=[^]*\})/
  const createDom = `
    this._rootShadow = this.attachShadow({mode:'open'})
    this._rootShadow.innerHTML = __template__
  `
  if(script.match(reg)){
    script = script.replace(reg, createDom)
  }else{
    const reg = /(?<=constructor\(\)\{)([^]*?)(?=\})/
    let constructorDom = script.match(reg) && script.match(reg)[0]
    if(constructorDom){
      script = script.replace(reg, constructorDom + '\n' + createDom)
    }else{
      throw new Error('模版替换错误')
    }
  }
  return script
}

/**
 * 文件组合
 * @param {*} script 
 * @param {*} template 
 * @param {*} style 
 */
function combinContent(script, template, style){
  const className = getClassName(script)
  const componentName = className2ComponentName(className)
  let component = '\n'
  component += combinTemplate(template, style, componentName)
  component+= '\n'
  component+= combinScript(script)
  component+= '\n'
  component += `customElements.define("${componentName}", ${className})`
  return component
}

/**
 * 生成组件
 * @param {*} component
 * @param {*} filePath 
 */
function createComponent(component, filePath){
  const jsFilePath = filePath.replace('wcp', 'js')
  try{
    fs.writeFileSync(jsFilePath, component)
  }catch(err){}
}

function buildFile(filename){
  const filePath = resolve(filename)
  const content = fs.readFileSync(filePath, 'utf-8')
  const script = getScript(content)
  const template = getTemplate(content)
  const style = getStyle(content, filePath)
  const component = combinContent(script, template, style)
  createComponent(component, filePath)
}

module.exports = {
  buildFile,
  createComponent,
  combinContent,
  getTemplate,
  getStyle,
  getScript,
  getClassName,
  className2ComponentName,
  combinTemplate,
  combinScript,
  combinContent,
}



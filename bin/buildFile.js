
const fs = require('fs')
const path = require('path')

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
  // console.log('content',content)
  const reg = /(?<=<template.*>)([^]+)(?=<\/template>)/
  console.log("template",content.match(reg))
  return content.match(reg) && content.match(reg)[0]
}

/**
 * 获取 style
 * @param {*} content 
 */
function getStyle(content){
  const reg = /(?<=<style.*>)([^]+)(?=<\/style>)/
  // console.log(content.match(reg)[0])
  return content.match(reg) && content.match(reg)[0]
}

/**
 * 获取 style
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
function getClassName(content){
  
}


/**
 * 文件组合
 * @param {*} script 
 * @param {*} template 
 * @param {*} style 
 */
function combinContent(script, template, style){

  const className = getClassName(script)

  let component = '\n'
  component += 'const shadowDom = `'
  component +=`<style>${style}</style>\n<template>${template}</template>`
  component +='`'
  component+= '\n'
  component+= script
  component+= '\n'
  component += `customElements.define('red-box', ${className})`

  console.log('script', script)
  console.log('template', template)
  console.log('style', style)
  return component
}

/**
 * 生成组件
 * @param {*} component 
 */
function createComponent(component, filePath){
  console.log('filePath', filePath)
  const jsFilePath = filePath.replace('wcp', 'js')
  try{
    const res = fs.writeFileSync(jsFilePath, component)
  }catch(err){}
}

function buildFile(filename){
  const filePath = resolve(filename)
  const content = fs.readFileSync(filePath, 'utf-8')
  const script = getScript(content)
  const template = getTemplate(content)
  const style = getStyle(content)
  const component = combinContent(script, template, style)
  createComponent(component, filePath)
}

module.exports = buildFile



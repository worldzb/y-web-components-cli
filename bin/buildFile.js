
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
  const reg = /(?<=<template.*>)([^]+)(?=<\/template>)/
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
  let temp = 'const __shadowDom__ = `'
  temp += `
  <style>${style}</style>${template}
  `
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
    this._rootShadow.innerHTML = __shadowDom__
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



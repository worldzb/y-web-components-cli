const { text } = require('figlet');
const { getTemplate, className2ComponentName } = require('../bin/buildFile');
 

test('base template', ()=>{
  const testTemplate = `<template>fasdf</template>`
  const result = `fasdf`
  expect(getTemplate(testTemplate)).toBe(result);
})

test('base template2', ()=>{
  const testTemplate = `
    <template  >fasdf</template>
    <script>

    </script>
    <style>
    </style>
  `
  const result = `fasdf`
  expect(getTemplate(testTemplate)).toBe(result);
})

test('base template3', ()=>{
  const testTemplate = `
    <template  ><template  >fasdf</template></template>
    <script>

    </script>
    <style>
    </style>
  `
  const result = `<template  >fasdf</template>`
  expect(getTemplate(testTemplate)).toBe(result);
})

test('className2ComponentName', ()=>{
  expect(className2ComponentName('RedBox')).toBe('red-box')
})

test('className2ComponentName2', ()=>{
  expect(className2ComponentName('RedBoxAddBase')).toBe('red-box-add-base')
})




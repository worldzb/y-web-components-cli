#!/usr/bin/env node
const {program} = require('commander')
const chalk = require('chalk');
const figlet = require('figlet');

const fs = require('fs')
const path = require('path')

const {buildFile} = require('./bin/buildFile')
const {watchFile} = require('./bin/watchDir')

function readVersion(){
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, './package.json'), 'utf-8'))
  return config.version
}

program
  .version(readVersion())

program
  .command('build <filename>')
  .description('show options')
  .action((name) => {
    buildFile(name)
  })

program
  .command('watch')
  .option('-p, --path <items1>', '文件路径', '.')
  .description('监听文件变化')
  .action((options)=>{
    watchFile(options)
  })


if (process.argv.length <= 2) {
  let arr = ['Electronic', '3D Diagonal', '3D-ASCII', 'Coinstak', 'Fraktur', 'Puffy', 'Tanja', 'Trek', 'Wet Letter']
　let index = Math.floor((Math.random()*arr.length))
  console.log(chalk.red(figlet.textSync("YWCP", arr[index])))
  console.log()
} 
program.parse();
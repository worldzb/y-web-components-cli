#!/usr/bin/env node
const {program} = require('commander')
const chalk = require('chalk');
const figlet = require('figlet');

const fs = require('fs')
const path = require('path')

const {buildFile} = require('./bin/buildFile')

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

if (process.argv.length <= 2) {
  let arr = ['Electronic', '3D Diagonal', '3D-ASCII', 'Coinstak', 'Fraktur', 'Puffy', 'Tanja', 'Trek', 'Wet Letter']
　let index = Math.floor((Math.random()*arr.length))
  console.log(chalk.red(figlet.textSync("YWCP", arr[index])))
  console.log()
} 
program.parse();
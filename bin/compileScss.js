/**
 * Scss 编译
 */
const sass = require('sass')
const fs = require('fs')


function compileScss(style, filePath){
  const tempFilePath = filePath.replace('wcp', 'temp.scss')
  // console.log(tempFilePath)
  fs.writeFileSync(tempFilePath, style)
  var result = sass.renderSync({
    file: tempFilePath
  });
  fs.unlinkSync(tempFilePath)
  return result.css.toString()
}

module.exports = {
  compileScss
}

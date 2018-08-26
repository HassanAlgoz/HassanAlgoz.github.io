const ejs = require('ejs')
const fs = require('fs')


const dataFile = 'index.json'
const templateFile = 'index.ejs'
const outputFile = '../index.html'

let data = (() => {
    let data;
    try {
        data = fs.readFileSync(dataFile, {encoding: 'utf8'})
    } catch (err) {
        console.error(`couldn't readFile "${dataFile}"`, err);
        process.exit(1)
    }
    return JSON.parse(data);
})()


ejs.renderFile(templateFile, {data: data}, (err, html) => {
    if (err) {
        console.error(`could not renderFile "${templateFile}"`, err)
        process.exit(1)
    }
    try {
        fs.writeFileSync(outputFile, html, {encoding: 'utf8'})
        console.log(`file "${outputFile}" written successfully`)
    } catch (err) {
        console.error(`could not writeFile "${outputFile}"`, err)
        process.exit(1)
    }
})


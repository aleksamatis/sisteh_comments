
// const data = ['Саша', 'Сергей']

// const data = require('./data.json')

//  const fs = require('fs')//название модуля fs для работы с файловой системой компьютора
//  const path = require('path')//эти библиотека для работы с путями
//  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')).toString())

// const dataJson = '["Саша", "Сергей"]'
// const data = JSON.parse(dataJson)

// const data = ['Саша', 'Сергей']

// data.push('Андрей')

const data = {
    name: 'Саша',
    get status () {
        return this.name === 'Сергей'
    },
    age: 11
} // new Object()

// data.name = 'Сергей'
// const key = 'name'
// data[key] = 'Сергей'

console.log(data.status)

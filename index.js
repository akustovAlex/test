const express = require('express') //Подключение фреймворка express
const app = express()
const db = require('./db.js')
const ru = require('./ru.json')

app.set('view engine', 'ejs') //Установка шаблонизатора(работает с папкой views и расширением ejs, вместо метода sendFile используется render)
app.use(express.urlencoded({extended: false})) //Необходимо для правильной работы body-parser
app.use(express.static('public')) //Назначение папки для статических файлов

app.get('/', (req,res) => {
    res.render('index')
})

app.get('/char/:charname', (req,res) => {
    let key = req.params.charname.toLowerCase().replace(/ /g,'')    //Преобразование полученного от пользователя имени(удаление пробелов и "уменьшение букв")

if (key == 'empty') res.render('char', {charname : "Пусто"}) 
else if (ru.hasOwnProperty(key)) {
    let ruPath = eval("ru." + key)  //Встроенная функция eval позволяет выполнять строку кода.
    let dbPath = eval("db." + ruPath)
    res.render('char', {char : dbPath})
}
    else res.render('char', {charname : req.params.charname})  
    //Метод render может передавать локальный объект с данными. ОБЪЕКТ вида {что-то : что-то}
})

app.post('/check', (req,res) => {
    if (req.body.charname == '') res.redirect('/char/empty')
    else res.redirect('/char/' + req.body.charname) //С помощью метода redirect создаются новый url, который обрабтывает сервер
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server start: http://localhost:${PORT}`)
})
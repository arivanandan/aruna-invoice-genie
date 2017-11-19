import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import r from './routes'

const app = express()

app.use(cors())
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static(path.resolve(__dirname, '../..')))

app.get('/api/invoice/:id', r.invoice.get)
app.post('/api/invoice/create', r.invoice.put)
app.get('/api/product/delete/:id', r.product.remove)
app.post('/api/product/update', r.product.update)
app.post('/api/product/create', r.product.put)
app.get('/api/product', r.product.get)
app.get('/api/customer', r.customer.get)
app.get('/api/report/:from/:to', r.report.get)


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../..', 'index.html'));
});

app.listen(process.env.PORT || 9000, () => {
  console.log(`App listening on port probably 9k!`)
})



















// const http = require('http').createServer()
// const express = require('express')
// const pg = require('pg')
// const bodyParser = require('body-parser')
// const logger = require('morgan')
// const app = express()
// const session = require('express-session')
// const uuid = require('node-uuid')
// const pgsqlStore = require('connect-pg-simple')
// const multer = require('multer')
// const dotenv = require('dotenv')
// const fs = require('fs')
// const Guid = require('guid')
// const Mustache = require('mustache')
// const Request = require('request')
// const Querystring = require('querystring')
// const path = require('path')
// const formidable = require('formidable')
//
// dotenv.load()
//
// pg.defaults.ssl = true
//
// const sessionStore = new (pgsqlStore(session))()
//
// app.use(session({
//   key: process.env.SES_KEY,
//   secret: process.env.SES_SECRET,
//   genid: req => uuid.v4(),
//   cookie: { maxAge: 48 * 60 * 60 * 1000},
//   pruneSessionInterval: 48 * 60 * 60 * 1000,
//   resave: false,
//   saveUninitialized: false,
//   store: sessionStore,
//   httpOnly: true,
//   secure: true,
//   ephemeral: true
// }))
//
// app.use(logger('dev'))
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json())
// app.use(express.static(__dirname + '/public'))
//
// app.post('/sendcode', login)
// app.get('*', initialize)
//
// app.listen(process.env.PORT || 3000, () => console.log(`Listening at port idk`))
//
// loadLogin = () => fs.readFileSync('public/login.html').toString()
// loadLoginSuccess = () => fs.readFileSync('public/login_success.html').toString()
// loadRegister = () => fs.readFileSync('public/register.html').toString()
// loadHomePage = () => fs.readFileSync('public/home.html').toString()
// loadUploadError = () => fs.readFileSync('public/errorUpl.html').toString()
// loadAddError = () => fs.readFileSync('public/errorAdd.html').toString()
// loadAddEmptyError = () => fs.readFileSync('public/errorAddEmpty.html').toString()
//
// function displayTx (req, res) {
//   const id = req.session.user
//   pg.connect(process.env.DATABASE_URL, (err, connection) => {
//     if (err) { connectError(err) }
//     else {
//       connection.query(`SELECT * FROM axis WHERE fbSign = ${id}
//         UNION
//         SELECT * FROM icici WHERE fbSign = ${id}
//         UNION
//         SELECT * FROM federal WHERE fbSign = ${id}
//         ORDER BY tDate DESC
//         `, (err, rows) => {
//         if (err) { connectError() }
//         if (rows.rowCount === 0) {
//           console.log('No transaction data available')
//           return null
//         }
//         res.send({
//           transactions: rows.rows
//         })
//       })
//     }
//   })
// }
//
// function uploadFiles (req, res) {
//   const bank = req.body.bank
//   const fbSign = req.session.user
//   const fileType = req.body.filetype
//   let  tdate, ttype, tamount, tdetails, bal, tcr, tdb, parser
//
//   if (fileType == 'csv') parser = require(__dirname + '/scripts/csvParser')
//   else parser = require(__dirname + '/scripts/xmlParser')
//   const data = parser()
//
//   pg.connect(process.env.DATABASE_URL, (err, connection) => {
//       if (err) { connectError(err, res) }
//       else {
//         connection.query(`SELECT tDate FROM ${bank} WHERE fbSign = ${fbSign} ORDER BY tDate DESC LIMIT 1`,
//           (err, rows) => {
//             if (err) { connectError(err, res) }
//             else if (rows.rowCount === 0 || parseInt(rows.rows[0].tdate) < parseInt(dateFixer(dateReturn(data, bank)))) {
//               for (let i = 0; i < data.length; i++) {
//                 if (bank === 'icici') [ , , tdate, , tdetails, tdb, tcr, bal] = data[i];
//                 if (bank === 'federal') [ , tdate, tdetails, , , , , tdb, tcr, bal] = data[i];
//                 if (bank === 'axis') [ , tdate, , tdetails, tdb, tcr, bal, ] = data[i];
//                 if (tdb == 0) {
//                 ttype = 'CREDIT'
//                 tamount = stripCommas(tcr)
//                 } else {
//                 ttype = 'DEBIT'
//                 tamount = stripCommas(tdb)
//                 }
//                 bal = stripCommas(bal)
//                 tdate = dateFixer(tdate)
//                 connection.query(`INSERT INTO ${bank} (fbSign, tDate, tDetails, tAmount, tType, bal)
//                   VALUES (${fbSign}, '${tdate}', '${tdetails}', ${tamount}, '${ttype}', ${bal})`,
//                   (err, rows) => {
//                     if (err || rows.rowCount === 0) {
//                       let html = Mustache.to_html(loadUploadError())
//                       res.send(html)
//                       return err
//                     }
//                   })
//                 }
//                 let html = Mustache.to_html(loadHomePage())
//                 res.send(html)
//               } else {
//                 let html = Mustache.to_html(loadUploadError())
//                 res.send(html)
//               }
//             })
//           }
//         })
//       }
//
// function addTx (req, res) {
//   const data = req.body
//   let [fbSign, tDate1, tDate2, tDate3, toAcc, fromAcc, tType, tAmount, tDetails]
//   = [req.session.user, data.tDate1, data.tDate2, data.tDate3, data.toAcc, data.fromAcc, data.tType, data.tAmount, data.tDetails]
//   let bal = 0
//   if (!addTxValidator(tDate1, tDate2, tDate3, tAmount)) {
//     let html = Mustache.to_html(loadAddError())
//     res.send(html)
//     return null
//   }
//   if (tDate1.length != 2) tDate1 = datePad(tDate1, 2)
//   if (tDate2.length != 2) tDate2 = datePad(tDate2, 2)
//   if (tDate3.length != 4) tDate3 = datePad(tDate3, 4)
//   let tDate = dateFixer(`${tDate1}-${tDate2}-${tDate3}`)
//   let bank = fromAcc.toLowerCase()
//   pg.connect(process.env.DATABASE_URL, (err, connection) => {
//     if (err) connectError()
//     else {
//       connection.query(`SELECT bal FROM ${bank} WHERE fbSign = ${fbSign}
//         ORDER BY tID DESC LIMIT 1`,
//         (err, rows) => {
//           if (err) { connectError(err) }
//           if (rows.rowCount === 0) {
//             let html = Mustache.to_html(loadAddEmptyError())
//             res.send(html)
//             return null
//           } else bal = parseInt(rows.rows[0].bal)
//           if (tType == 'Credit') bal += parseInt(stripCommas(tAmount))
//           else bal -= parseInt(stripCommas(tAmount))
//           connection.query(`INSERT INTO ${bank} (fbSign, tDate, fromAcc, toAcc, tType, tAmount, tDetails, bal)
//             VALUES (${fbSign}, '${tDate}', '${fromAcc}', '${toAcc}', '${tType}', ${tAmount}, '${tDetails}', ${bal})`,
//           (err, rows) => {
//             if (err || rows.rowCount === 0) {
//               let html = Mustache.to_html(loadAddError())
//               res.send(html)
//              }
//             else {
//               let html = Mustache.to_html(loadHomePage())
//               res.send(html)
//             }
//           })
//         })
//       }
//     })
//   }
//
// function updateTo (req, res) {
//   const id = req.session.user
//   let {tid, fromacc, toacc} = req.body
//   pg.connect(process.env.DATABASE_URL, (err, connection) => {
//     if (err) { connectError(err) }
//     connection.query(`UPDATE ${fromacc} SET toAcc = '${toacc}' WHERE fbSign = ${id} AND tID = ${tid}`,
//     (err, rows) => {
//         if (err) { connectError(err) }
//         else {
//           let html = Mustache.to_html(loadHomePage())
//           res.send(html)
//         }
//       })
//   })
// }
//
// function userDetails (req, res) {
//   const id = req.session.user
//   pg.connect(process.env.DATABASE_URL, function (err, connection) {
//     connection.query(`SELECT name, primaryBank FROM userDetails WHERE fbSign = ${id}`, (err, rows) => {
//       if (err) { connectError(err) }
//       else {
//         res.send({
//           name: rows.rows[0].name,
//           bank: rows.rows[0].primarybank
//         })
//       }
//     })
//   })
// }
//
// function graphData (req, res) {
//   const id = req.session.user
//   pg.connect(process.env.DATABASE_URL, function (err, connection) {
//     connection.query(`SELECT * FROM(
//       SELECT bal, fromAcc FROM axis WHERE fbSign = ${id} ORDER BY tID DESC LIMIT 1) AS axis
//       UNION ALL
//       SELECT * FROM(
//         SELECT bal, fromAcc FROM icici WHERE fbSign = ${id} ORDER BY tID DESC LIMIT 1) AS icici
//       UNION ALL
//       SELECT * FROM(
//         SELECT bal, fromAcc FROM federal WHERE fbSign = ${id} ORDER BY tID DESC LIMIT 1) AS federal`,
//         (err, rows) => {
//           if (err) connectError(err, res)
//           else res.send(rows.rows)
//         })
//   })
// }
//
// function ensureLoggedIn (req, res, next) {
//   if (req.session.user) next()
//   else {
//     res.redirect('/')
//   }
// }
//
// function logout (req, res) {
//   pg.connect(process.env.DATABASE_URL, function (err, connection) {
//     connection.query(`UPDATE login SET sID = null WHERE sID = ${req.session.id}`, (err, result) => {
//       req.session.destroy(function () {
//         delete req.session
//         res.redirect('/')
//       })
//     })
//   })
// }
//
// function connectError (err, res) {
//   console.log('\nConnection Error. Please try again later.\n______________________\n' + err + '\n______________________\n\n')
//   let html = Mustache.to_html(loadHomePage())
//   return res.send(html)
// }
//
// function stripCommas(amount) {
//   return  parseInt(amount.replace(/,/g, ''))
// }
//
// function dateFixer (date) {
//   return date.replace(/\//g, '-')
//   .split('-')
//   .reverse()
//   .reduce((acc, cur) => acc + cur, '')
// }
//
// function dateReturn (data, bank) {
//   let tDate
//   if (bank === 'icici') [ , , tDate, , , , , ] = data[0];
//   if (bank === 'federal') [ , tDate, , , , , , , , ] = data[0];
//   if (bank === 'axis') [ , tDate, , , , , , ] = data[0];
//   return tDate
// }
//
// function addTxValidator (tDate1, tDate2, tDate3, tAmount) {
//   if (tDate1.length > 2) return false
//   if (tDate2.length > 2) return false
//   if (tDate3.length > 4) return false
//
//   if ((parseInt(stripCommas(tAmount))).toString() === 'NaN') return false
//
//   return true
// }
//
// function datePad (date, number) {
//   return number === 2 ? new Array (number - date.length + 1).join('0') + date
//   : 2017
// }

const express=require('express')
const app=express()




const path=require('path')
const hbs= require('hbs')

const geocode= require('./utils/geocode.js')
const forecast= require('./utils/forecast.js') 

const port=process.env.PORT || 3000
const { get } = require('http')



//Define paths for express config
const viewsPath= path.join(__dirname,'../templates/views')
const partialsPath= path.join(__dirname,'../templates/partials')
const publicDirectoryPath=path.join(__dirname,'../public')


//set handlebars and views location
app.set('view engine', 'hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)


//set up static directory to serve from
app.use(express.static(publicDirectoryPath))


app.get('',(req,res)=>{ 
     res.render('index',{
         title:'Weather',       
         name: 'Daniel'
     })
 })

app.get('/about',(req,res)=>{

    res.render('about',{title:'About',name:'Daniel'})
})

app.get('/weather', (req,res)=>{

    if (!req.query.address){
        return res.send({
            error:'please provide an address'
        })

    }

    geocode(req.query.address, (error, {latitude, longitude, location}={})=>{

        if (error){
            return res.send({error})
        }
        forecast(latitude,longitude,(error,forecastData)=>{
            if (error){
                return res.send({error})
            }
            res.send ({
                location,
                address: req.query.address,
                forecastData,
                
            })


        })


    })









    
})

app.get('/help',(req,res)=>{
    res.render('Help',{
        title:'Help page',
        help:'this is very useful help for you',
        name: 'Daniel'
    })
})

app.get('/help*',(req, res)=>{
    res.render('404 page' ,{
        title: '404 page',
        message:'sorry, we could not find what you where looking for in help :(',
        name: 'Daniel'
    })
})

app.get('/*',(req, res)=>{
    res.render('404 page' ,{
        title: '404 page',
        message:'sorry, we could not find what you where looking for :(',
        name: 'Daniel'
    })
})
app.listen(port,()=>{console.log('SERVER IS RUNNING IN PORT'+port)})
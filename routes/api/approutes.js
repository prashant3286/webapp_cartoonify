const express = require('express');
const multer=require('multer');
const path = require('path');
const router=express.Router();
const mongoose=require('mongoose');
const resultdb = require('../../models/resultdb');

// public folder
router.use(express.static('./public/'))
// router.use("/outputs", express.static(path.join("public/outputs"))); 

// set storage engine
const storage = multer.diskStorage({
    destination: './public/inputs/',
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

// Init Upload
const upload = multer({
    storage: storage, 
    limits: {fileSize: 1000000}, 
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
}).single('Image')

// Check File Type
function checkFileType(file, cb){
    // Allowed extension
    const filetypes = /jpeg|jpg|png|gif/
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    // Check mime 
    const mimetype = filetypes.test(file.mimetype)

    if(mimetype && extname){
        return cb(null, true)
    } else {
        cb('Error: No Images detected!')
    }
}

router.get('/', (req, res) => {
    res.render('index')
})

router.post('/cartoonify', (req, res) => {
    upload(req, res, (err) => {  
        // console.log(req.file);
        if(err){
        res.render('index', {
            msg: err
        });
    }
    else if(req.file == undefined){
        res.render('index', {
        msg: 'Error: No File Selected!'
        });
    }
    else {
            // child process for cartoonify script
            medianblurval = req.body['medianblurval']; 
            console.log(medianblurval);
            const exec = require('child_process').exec;
            const childPython = `python3 script.py ${req.file.path} ${medianblurval}`
            exec(childPython,(err,stdout,stderr)=>{
                py_data = JSON.parse(stdout)
                if(py_data.err === 'oops'){
                    res.render('index', {
                        msg: 'Error: No images detected!'
                    })
                }
                else {
                
                    const history = resultdb.create({
                        history_id: new mongoose.Types.ObjectId(),
                        input_img_path: `inputs/${req.file.filename}`,
                        output_img_path: py_data.output_img_path
                    })
                    res.render('index', {
                        msg: 'Cartoonify images',
                        file: `inputs/${req.file.filename}`,
                        CartoonifyImage: py_data.output_img_path
                    
                    })
                }
            })    
        }
    });
});  

// Get method for history page
router.get('/result', async (req, res) =>{
    try {
        const data = await resultdb.find({});
        res.render('result', {title: 'Image Details', records: data})
    }catch (error) {
        res.json({
            status: 'Fail',
            error
        })
    }
})

module.exports= router


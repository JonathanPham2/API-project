const express = require("express");
const router = express.Router();
const apiRouter = require("./api");


router.use("/api", apiRouter)

//static routes
//Serve React build files in production
if(process.env.NODE_ENV === 'production'){
    const path = require('path');
    // Serve the frontend's index.html file at the root routes
    router.get('/', (req, res) => {
        res.cookie ('XSRF-TOKEN', req.csrfToken());
        res.sendFile(
            path.resolve(__dirname, '../../frontend', 'dist','index.html')
        )
    }
    )
}

// Serve the static assets in the frontend's build folder
router.use(express.static(path.resolve('../frontend/dist')));

//Serve the frontend's index.html file at all other routes 
//Not starting with /api
router.get(/^(?!\/?api).*/, (req,res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(
        path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
    )
});

// Add a Xsrf- Token cookie in development
if(process.env.NODE_ENV !== 'production'){
    router.get('api/csrf/restore', (req, res) => {
        const csrfToken = rq.cstfToken();
        res.status(200).json({
            'XSRFF-Token':csrfToken
        })
    })
}


router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN",  req.csrfToken());
    res.status(200).json({
        "XSRF-TOKEN": csrfToken
    })
})

module.exports = router


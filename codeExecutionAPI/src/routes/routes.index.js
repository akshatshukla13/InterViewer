import express from 'express';
import { getHomePage } from '../controllers/controller.index.js';
import { executeCode } from '../controllers/controller.index.js';

const Router = express.Router();


Router.route("/")
.get(getHomePage)

Router.route("/api")
.get((req,res)=>{
    res.redirect('/')
})
.post(executeCode)

export default Router;

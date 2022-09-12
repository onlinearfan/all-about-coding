//index.js setup of react app:
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	//your work will be here,
    <React.StrictMode>
        <App />
    </React.StrictMode>
);


//add tailwind css into react app : 
---------------------------------------------
-)install tailwindCSS by 

Terminal

npm install -D tailwindcss
npx tailwindcss init = make tailwind config, 

tailwind.config.js = add this on config js,

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}


src/input.css = add this on index.css file and index.css add on index.js file,


@tailwind base;
@tailwind components;
@tailwind utilities;

-)use tailwind cssclass : 
<h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>

link : https://tailwindcss.com/docs/installation

*)How to add hot toast on react app :
========================================
-)add yarn add react-hot-toast ;
-)add the toast html where will show, 
-)call toast function :

link : https://react-hot-toast.com/

*)how to use React-icons 
================================
-)npm install react-icons run 
-)add on markup file,
import { FaBeer } from 'react-icons/fa';
class Question extends React.Component {
  render() {
    return <h3> Lets go for a <FiPenTool />? </h3>

  }
}

*)how to use Private route on React project : 
=====================================================
-)pass the child private of route and RequiedAuth : 
-)RequiredAuth logic will be (if not login then(navigate('/login',{state:useLocation()}))) return children;

*)React Router important method: 
=====================================
BrowserRouter, Routes, Route to='/' element="<h1>";
Link to="/" , NavLink to="/" , useClass, styles, 
*)action class added,
*)nested route with children style,
*)useParams, useLocation, useNavigate, 

*)Add firebase and use email and google auth , 
========================================================
-)use formHOOk with yup, 
-)after validate pass the form data into firebase auth, 
-)useFirebase hook, 

*)add any package on react 
================================
-)yarn add packageName , 
-)add it into files and if html add and function add, 

*)add bootstrap on react : 
===============================
-)yarn add bootstrap , then index.js import 'bootstrap.css';

*)add daisy ui into react project : 
=========================================
npm i daisyui
Then add daisyUI to your tailwind.config.js files:
module.exports = {
  //...
  plugins: [require("daisyui")],
}

learn daisyui by docs:

*)upload react project on netlify if no have firebase thinks:
==========================
-)yarn build and add build folder  on netlify 

*)add redux vanilla on react : 
============================
-)yarn add redux react-redux,

*)add react hooks for using multiple times, 




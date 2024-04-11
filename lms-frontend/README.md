# LMS Frontend

### Setup instruction

1.Clone the Project
  
  git clone  https://github.com/akkuacr/lms-frontend-hn.git

2.Move into the directory
   
   cd lms-frontend

3 . install Dependencies
    npm i
    
4. run the server
   npm run dev 


### Setup instruction for Tailwind
[Tailwind official instruction doc ](https://tailwindcss.com/docs/installation)

1. Install tailwind css
 npm install -D tailwindcss
 npm install postcss autoprefixer

2. Create Tailwind config
npx tailwindcss init

3. Add file Extensions to tailwind config file
"./index.html","./src/**/*.{html,js,jsx,ts,tsx}"

4. Add the tailwind directives at the top of the "index.css" file
@tailwind base;
@tailwind components;
@tailwind utilities;


5. Add the following details in the plugin property of tailwind config

....

       [require("daisyui"),require("@tailwindcss/line-clamp")]

......

5. Dependencies and plugins for the project
npm install @reduxjs/toolkit react-redux react-router-dom react-icons react-chartjs-2 chart.js daisyui axios react-hot-toast @tailwindcss/line-clamp

 






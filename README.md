# PKD-Project-JobFinder
Repo for the JobFinder project in the PKD course
Supports Mac OS X, Linux and Windows
Requirements:<br/>
-Selenium<br/>
-Axios<br/>
-Cheerio<br/>


1. Install libraries and dependencies:<br/>
1.1 run the following commands:<br/>
    -npm install selenium<br/>
    -npm install cheerio<br/>
    -npm install axios<br/>
    (you may need to add sudo before "npm" if you run into permission issues)<br/>
<br/>
2. Make sure you are in the folder of the main file.<br/>
2.1 Run the following command:
   tsc main.ts && node main.js<br/>

3. Follow the instructions of the program<br/>

4. If jest tescases are to be run, you must remove the 'normaliseInput' function call in main.ts

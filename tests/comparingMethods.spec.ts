import {test,expect,Locator} from '@playwright/test';

test("comparing methods",async({page})=>{

    await page.goto("https://demowebshop.tricentis.com/");

    const products:Locator= await page.locator('.product-title'); //6


    //1. innertext() vs textContent()

    console.log(await products.nth(1).innerText()); //14.1-inch Laptop
    console.log(await products.nth(1).textContent()); //            14.1-inch Laptop

    /*OUTPUT:

PS C:\Users\n646802\OneDrive - CVS Health\SatyaWS> npx playwright test comparingMethods.spec.ts

Running 1 test using 1 worker
[chromium] › tests\comparingMethods.spec.ts:3:5 › comparing methods
14.1-inch Laptop
                                                                                                                                                
            14.1-inch Laptop

  1 passed (10.3s)

To open last HTML report run:

  npx playwright show-report


  THERE IS A DIFFERENCE IN OUTPUT
  innerText()- '14.1-inch Laptop' which is actual text of element, visible on webpage
  textContent()- '            14.1-inch Laptop' THERE ARE SOME SPACE

*/


const count:number= await products.count();

console.log(count);

for(let i =0;i<count;i++){


    // const productNameInnertext:string = await products.nth(i).innerText(); //Extract plain text, eliminates line break
    // console.log(productNameInnertext);
    
    const productNameTextContent:string|null = await products.nth(i).textContent(); //Extract texts including hidden elements, including line breaks
    // console.log(productNameTextContent);

/*
$25 Virtual Gift Card
                                                                                                                                                
            $25 Virtual Gift Card

14.1-inch Laptop
                                                                                                                                                
            14.1-inch Laptop

Build your own cheap computer                                                                                                                   
                                                                                                                                                
            Build your own cheap computer

Build your own computer                                                                                                                         
                                                                                                                                                
            Build your own computer

Build your own expensive computer                                                                                                               
                                                                                                                                                
            Build your own expensive computer

Simple Computer                                                                                                                                 
                                                                                                                                                
            Simple Computer

*/

console.log(productNameTextContent?.trim()); // ? is a  optional parameter, because 'productNameTextContent' variable returns string OR null

/*OUTPUT:
$25 Virtual Gift Card                                                                                                                           
14.1-inch Laptop                                                                                                                                
Build your own cheap computer                                                                                                                   
Build your own computer
Build your own expensive computer
Simple Computer  
*/

//FOR INTERVIEW PERSPECTIVE the diff between innerText() and textContents() are important
}

//2. allInnerText() vs allTextContent()

console.log ( "----------comparing between allInnerText() vs allTextContent()----------");

const productNames:string[]= await products.allInnerTexts();
console.log("Product names captured by allInnertext(): ",productNames);






})
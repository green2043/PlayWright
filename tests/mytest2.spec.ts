import {test,expect} from '@playwright/test';

//syntax
/*
test("Title of the test",()=>{

    //step1
    //step2
    //step3

    //every steps returns a promise, either promise resolved or promise rejected
    
})

*/

//fixture - global variable : page, browser

test("verify page url",async({page})=>{

await page.goto("https://qacloudmbuapps.aetna.com/ProviderRoster/home");

let pageURL : string=await page.url();
console.log("URL : ",pageURL);

await expect(page).toHaveURL(/ProviderRoster/); // here I am verifying part of url


})  
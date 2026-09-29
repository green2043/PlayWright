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

test("verify page title",async({page})=>{

await page.goto("https://qacloudmbuapps.aetna.com/ProviderRoster/home");

let pageTitle : string=await page.title();
console.log("Title of page : ",pageTitle);

//console.log("Title of page : ",page.title());  //Title of page :  Promise { <pending> } , becase await is not there

await expect(page).toHaveTitle("Provider Roster");



})
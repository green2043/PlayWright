import {test, expect, Locator} from "@playwright/test";

test ("Handle dynamic elements using xpath and css in Playwright", async ({page})=>{

    test.setTimeout(120000); // increase timeout since this test has multiple 2s waits across two loops

    await page.goto("http://127.0.0.1:5500/practice-app/frontend/pages/dynamic.html");

    //using xpath

    for(let i=0;i<=5;i++){

        let button:Locator = page.locator("//button[text()='START' or text()='STOP']");

        await button.click();

        await page.waitForTimeout(2000);
    }

    //using css


    for(let i=0;i<=5;i++){

        const button:Locator =  page.locator("button[name='startState'] , button[name='stopState']"); //here ',' is used as or operator

        await button.click();

        await page.waitForTimeout(2000);
    }

    

    //Using playwright specific locators

    for(let i=0;i<=5;i++){
        const button:Locator = page.getByRole("button", { name: /^(START|STOP)$/i }); 

        await button.click();

        await page.waitForTimeout(2000);


    }




})
import{test,expect,Locator} from '@playwright/test';

test(" Bootstrap hidden dropdown", async({page})=>{

    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

    //login steps
    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.locator('button[type="submit"]').click();

    //click on PIM
    await page.getByText('PIM').click();


    //click on job title dropdown ( ' i ' is an icon tag, whose parent is 'form')
    await page.locator("form i").nth(2).click();
    await page.waitForTimeout(3000);

    //capture all dropdown elements by Ctrl+shift+P - Emulate a focused page and count the elements
    //here dropdown elements are div>span type elements, but span are not child elements of div, so search as below i did using css

    const options:Locator= page.locator("div[role='listbox'] span");
    let count:number = await options.count(); 



    console.log("number option in a dropdown: ",count)

    //print all options
    for(let i = 1;i<count;i++){

       console.log("option text of ",i," :", await options.nth(i).innerText());
    //   console.log("option text of ",i," :", await options.nth(i).allTextContents());
       const text:string = await options.nth(i).innerText();

       if(text==="QA Lead"){
        await options.nth(i).click(); //select optin method won't work, only work for static or traditional dropdown

        break;
       }

       


    }

     await page.waitForTimeout(5000);

     //Assignement:
     /*
     go to myntra.com
     searchbox> type some keyword> try to find auto suggest elements
     Right click inspect won't work, Press F2 to open DOM

     
     
     
     
     */ 


  


 



});


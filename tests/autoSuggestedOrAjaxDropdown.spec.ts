import { test, expect,Locator } from '@playwright/test';


test("Auto suggest or Ajax dropdown handelling in playwright",async({page})=>{


    await page.goto("https://www.flipkart.com/");

    const loginPopUp:Locator= page.locator('.b3wTlE');

    await loginPopUp.click();
    

/*

Locator Type: CSS Locator
CSS Selector: form input[name='q']
Explanation:
- 'form' targets the parent <form> element.
- A space (' ') is a CSS descendant combinator.
- It finds input[name='q'] at any level inside the form.
Actual DOM:
form
└── div
└── input[name='q']
Note:
- 'form > input[name="q"]' did not work because '>' is a direct-child combinator and the input is wrapped inside a div.
- Therefore, the descendant CSS selector is used instead.
*/
    const searchBox:Locator = page.locator("form input[name='q']");

    await searchBox.fill("smart");  //search text

    await page.waitForTimeout(3000);

    //Get all the suggested option element ---> Ctrl+Shift+P ( it will freeze the page and you will be able to find ajax)
    //Then type 'Emulate a focused page' and select it, then you will be able to see the ajax dropdown in the DOM

    const ajaxOptions:Locator = page.locator("ul>li") ; //css locator

    const numberOfAjaxOptions :number = await ajaxOptions.count();
    console.log("Number of ajax options : ",numberOfAjaxOptions);

    //Printing all the suggested option in the console

    /*
    -----------
    innerText() :
    ----------- 

    <span>abc</span> -> innerText() returns "abc" (visible text inside the span)

    <span label="abc">name:</span> -> innerText() returns "name:" (reads element text, not attribute values)

    <input value="abc" /> -> innerText() returns "" (input elements do not contain inner text; use inputValue())

    <span data-testid="x">abc</span> -> innerText() returns "abc" (data-testid is ignored)

    -------------
    textContent() :
    -------------
    <span>abc</span> -> textContent() returns "abc" (raw text node content)

    <span label="abc">name:</span> -> textContent() returns "name:" (attributes are not included)

    <input value="abc" /> -> textContent() returns null (input has no text node; use inputValue())

    <span data-testid="x">abc</span> -> textContent() returns "abc" (returns text node content only)

    */

    console.log("text of 5th option using innerText(): ",await ajaxOptions.nth(5).innerText());
    console.log("text of 5th option using textContent(): ",await ajaxOptions.nth(5).textContent());

    console.log("-----------------------Capturing all ajax text-----------------------------------------")

    for(let i =0;i<numberOfAjaxOptions;i++)
    {
        console.log("text of "+i+"th option using innerText(): ",await ajaxOptions.nth(i).innerText());
        
        console.log("text of "+i+"th option using textContent(): ",await ajaxOptions.nth(i).textContent());
        console.log("----------------------------------------------------------------")

        const text:string = await ajaxOptions.nth(i).innerText();
        if (text==='smartpohone')
        {

           await ajaxOptions.nth(i).click();
            break;
        }

    }

    await page.waitForTimeout(5000);













})













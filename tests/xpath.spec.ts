// xpath : xpath stands for XML Path Language
// - it is a syntax used to navigate through elements and attributes in an XML document
// - In web automation, xpath is used to locate elements on a web page by thier structure and attributes

// Two types of xpath:
// 1. Absolute xpath: It provides the full path from the root element to the target element. 
//                    It starts with /, which represents the root node and doesn't use attributes.
//                    Example: /html/body/div[1]/h1
// 2. Relative xpath: It is more flexible way of finding an element, it directly jumps to the target element using attributes, without starting from the root.
//                    It starts with //, which allows Xpath to search for the element anywhere in the document.
//                    Example: //h1[@name='search']

//Which Xpath should be preferred ?
// - Relative xpath is preferred because it is shorter, easier to maintain, and less likely to break if the webpage structure changes.

import {test, expect, Locator} from "@playwright/test";

test ("Xpath Demo in Playwright", async ({page})=>{

    await page.goto("http://127.0.0.1:5500/practice-app/frontend/pages/locators.html");

    //1.Absolute Xpath
    //if you write like this as xpath, by defult PW will consider as css selector and test will fail
   // const absoluteSubmitBtn:Locator =  page.locator("/html[1]/body[1]/main[1]/section[8]/div[1]/button[1]");
   //to resolve this issue, either use // or use page.locator("xpath=your_xpath") to tell PW that this is xpath
    const absoluteSubmitBtn:Locator =  page.locator("xpath=/html[1]/body[1]/main[1]/section[8]/div[1]/button[1]");
    await absoluteSubmitBtn.click();

    expect(absoluteSubmitBtn).toBeVisible();


    //2. Relative Xpath
    const relativeSubmitBtn:Locator = page.locator("//button[@class='ambiguous-btn' and text()='Submit'][1]");
    await relativeSubmitBtn.click();

    expect(relativeSubmitBtn).toBeVisible();


    //3. contains()
    const hrefElements:Locator = page.locator("//a[contains(@href,'.html')]");
    const hrefCount:number = await hrefElements.count();
    console.log("Number of href elements: " + hrefCount);

    expect(hrefCount).toBeGreaterThan(0);


    //4. textContent() returns the text content of the first element in the locator
    //console.log(await hrefElements.textContent()); // Error: strict mode violation : Playwright will throw an error if the locator matches more than one element, so we need to use first() to get the first element
    console.log("first element text : "+await hrefElements.first().textContent()); 
    console.log("last element text : "+await hrefElements.last().textContent()); 
    console.log("nth=3rd element text : "+await hrefElements.nth(3).textContent()); //indexing is starting from 0, so nth(3) will return the 4th element

    let elementTexts: string[]= await hrefElements.allTextContents(); //getting all the matched element texts in to an array

    //printing all the matched element texts
    console.log("All element texts : "+elementTexts); 

    for(let texts of elementTexts){
        console.log("element text : "+texts);
    }

    //interview question: difference between textContent and AllTextContents



    //5. starts-with()

    //- Matches elements whose attribute values start with a specified string.
    //- Xpath format: //*[starts-with(@id,'user')]
    //- Example Xpath: //a[starts-with(@href,'popups')]
    //NOTE: The starts-with() function is helpful for dynamic elements whose IDs or classes are partially consistent.

    await page.goto("http://127.0.0.1:5500/practice-app/frontend/pages/locators.html")

    const ambiguousButton:Locator =  page.locator("//button[starts-with(@class,'ambiguous')]");
    const countButtons:number=await ambiguousButton.count();

    console.log("number of ambiguous buttons: "+countButtons)

    expect(countButtons).toBeGreaterThan(0);

    //6. text()

    const multiStrategyButton:Locator = page.locator("//button[text()='Multi Strategy Button']");
    await expect(multiStrategyButton).toBeVisible();


    //7. last()

    await page.goto("http://127.0.0.1:5500/practice-app/frontend/pages/forms.html")
    const lastOption:Locator = page.locator("//select[@id='skills']//option[last()]");
    await expect(lastOption).toBeVisible();
    console.log("text content of last option: "+ await lastOption.textContent());


    //8. position()
    await page.goto("http://127.0.0.1:5500/practice-app/frontend/pages/forms.html")
    const positionItem:Locator = page.locator("//select[@id='skills']//option[position()=3]");
    await expect(positionItem).toBeVisible();
    console.log("text content of position item: "+ await positionItem.textContent())
})

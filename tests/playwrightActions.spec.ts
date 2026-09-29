import{test,expect,Locator} from "@playwright/test";

//REFER : https://playwright.dev/docs/input


//NOTE: Every test title should be unique, otherwise playwright will run only the first test and ignore the rest of the tests with same title

//Text input/ Text Box/ Input Box
test("test input actions for text box in playwright",async({page})=>{

    await page.goto("http://localhost:3000/pages/forms.html");

    const textBox:Locator= page.locator("#fullName");
    await textBox.fill("Satya"); // Fill the text box with the value "Satya", fil() is an action method

    await expect(textBox).toBeVisible();   
    await expect(textBox).toBeEnabled();

    const textboxPlaceholder: any =await textBox.getAttribute("placeholder"); // Return value of placeholder attribute
    console.log("Placeholder text is: " + textboxPlaceholder) ;

    expect (textboxPlaceholder).toBe("Enter your full name");

   // console.log("Text box value: " + await textBox.textContent()); // Return empty string since text box is an input element, not a container element
   const enteredvalue:string =  await textBox.inputValue();//Return the input value of text box, inputValue() is an action method
   console.log("Text box value: " + enteredvalue); 

   expect(enteredvalue).toBe("Satya");

   await page.waitForTimeout(2000);

   
})

//Radio Buttons
test("test input actions for radio  buttons in playwright",async({page})=>{
// test.only("test input actions for radio  buttons in playwright",async({page})=>{  //here .only is used to run only this test and ignore all other tests in the file

    await page.goto("http://localhost:3000/pages/forms.html");

    const maleradioButton:Locator=  page.getByTestId('radio-male'); //getByTestId() is a playwright specific locator, it is used to locate elements by their data-testid attribute
    expect(await maleradioButton.isChecked()).toBe(false);
    await maleradioButton.check(); // Check the radio button, check() is an action method

    await expect(maleradioButton).toBeVisible();   
    await expect(maleradioButton).toBeEnabled();

    expect(await maleradioButton.isChecked()).toBe(true); //inside expect() we can use any action method like isChecked(), isDisabled(), isEditable(), isEnabled(), isHidden(), isVisible() etc
    await expect(maleradioButton).toBeChecked(); // toBeChecked() is an assertion method, it is used to check if the radio button is checked or not
    await page.waitForTimeout(2000); // it's like Thread.sleep() in java

   
})

test.only("checkbox actions", async ({page})=>{

    await page.goto("http://localhost:3000/pages/forms.html");

    //1.select specific checkbox using getByLabel() and assert
    const codingCheckBox:Locator = page.getByLabel("Coding",{exact:true}); //exact:true means the label text should match exactly
   // codingCheckBox.check(); // check the checkbox

   // await expect(codingCheckBox).toBeChecked();

    //2. select all checkboxes and assert each is checked
   /* const interests:string[] = ['Coding','Testing','Reading'];

    const checkBoxes:Locator[]= interests.map(interest=>page.getByLabel(interest)); //map function is used to iterate over the array and return a new array of locators

    expect(checkBoxes.length).toBe(3);

    */

     //3. select all checkboxes and assert each is checked
     const  languages:string[] = ['Java','Python','TypeScript','JavaScript','Ruby','C#','.NET','C++','HTML','C'];

    const checkboxes: Locator[] = languages.map(language=>page.getByLabel(language,{exact:true}))
/*
    for(const checkBox of checkboxes){
       await checkBox.check();
       await expect(checkBox).toBeChecked();
    }


    await page.waitForTimeout(2000);

    */

    

    //4. Uncheck last 3 checkboxes and assert
/*
    for (const checkbox of checkboxes.slice(-3)) // slice () method is used to get the desired portion of the array, here -3 means last 3 elements of the array
    {
        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();  // not operator is used to negate the assertion, so it will check if the checkbox is not checked
    }
    
    await page.waitForTimeout(5000);
*/

    //5. Toggle checkboxes: if checked , uncheck. if unchecked, check. assert state flipped
/*
    for (const checkbox of checkboxes)
    {

        if(await checkbox.isChecked())
        {

        //only if checked
        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();


        }
        else {
        //only if not checked
        await checkbox.check();
        await expect(checkbox).toBeChecked();

       }

    }

    await page.waitForTimeout(3000);*/


    //6. randomly select checkboxes - Select checkboxes by index (1,3,6) and assert

/*
    const indexes:number []= [1,3,6];

    for(const i of indexes){

        await checkboxes[i].check();
        await expect(checkboxes[i]).toBeChecked();
    }

     await page.waitForTimeout(3000);

     */


     //7. Select the checkbox based on the label
     const programmingLanguageName:string="Ruby";

     for(const label of languages){     

        if(label.toLowerCase()===programmingLanguageName.toLowerCase()){
           const checkbox:Locator  =page.getByLabel(label);

           await checkbox.check();
           await expect(checkbox).toBeChecked();
        }

    }
    await page.waitForTimeout(3000);

})










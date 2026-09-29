import{test,expect,Locator} from "@playwright/test";

test("Handle multi select dropdowns in playwright",async({page})=>{

await page.goto("http://127.0.0.1:5500/practice-app/frontend/pages/forms.html");

//1. select multiple options from the dropdown ( 4 ways):

// await page.locator('#techStackMultiSelect').selectOption(['Playwright','Selenium','C#']); // using visisble text
//await page.locator('#techStackMultiSelect').selectOption(['playwright','selenium','csharp']); // using value attribute
//await page.locator('#techStackMultiSelect').selectOption([{label:'Playwright'},{label:'Selenium'},{label:'C#'}]); // using label
await page.locator('#techStackMultiSelect').selectOption([{index:0},{index:1},{index:4}]); // using index








//2. check number of options in the dropdown (count)

const dropdownOptions:Locator =  page.locator("#techStackMultiSelect>option"); //in css locator, ">" means direct child
await expect(dropdownOptions).toHaveCount(8);




//3. Check an option present in the dropdown
const optionsText:string [] =(await dropdownOptions.allTextContents()).map(text=>text.trim()); //trim() is used to remove any leading or trailing whitespace from the text content of each option element.
console.log(optionsText);

expect(optionsText).toContain("Selenium");





//4. print options from the dropdown

for (const option of optionsText){
    console.log(option);
}





await page.waitForTimeout(3000);


})
import{test,expect,Locator} from "@playwright/test";

test("Handle single select dropdowns in playwright",async({page})=>{

await page.goto("http://127.0.0.1:5500/practice-app/frontend/pages/forms.html");

//1. select option from the dropdown ( 4 ways):

// await page.locator("#addrCountry").selectOption("India"); //visible text
// await page.locator("#addrCountry").selectOption({value:'uk'}); //by using value attribute
// await page.locator("#addrCountry").selectOption({label:'Belgium'}); //by using label 
// await page.locator("#addrCountry").selectOption({index:2}); //by using index 


//2. check number of options in the dropdown (count)
const dropdownOptions:Locator =  page.locator("#addrCountry>option"); //in css locator, ">" means direct child
await expect(dropdownOptions).toHaveCount(196);
//always focus more on assertion rather than just printing the count to console. Assertion will fail if the count is not as expected.


//3. Check an option present in the dropdown
const optionsText:string [] =(await dropdownOptions.allTextContents()).map(text=>text.trim()); //trim() is used to remove any leading or trailing whitespace from the text content of each option element.
console.log(optionsText);

expect(optionsText).toContain("Japan");

//4. Printing options from the dropdown

for(const option of optionsText){

    console.log(option);
}

//



await page.waitForTimeout(5000); 



})
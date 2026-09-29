import{test, expect, Locator} from "@playwright/test";


test("verify dropdown contains duplicates",async({page})=>{

await page.goto("http://127.0.0.1:5500/practice-app/frontend/pages/forms.html");


const dropdownOptions:Locator = page.locator('#techStackMultiSelect>option');


const optiontext:string [] = (await dropdownOptions.allTextContents()).map(text=>text.trim());

const mySet = new Set<string>; // Set - duplicate not allowed, only unique elements

const duplicates:string [] = []; //array - duplicates allowed

/*

* Iterate through each dropdown option text.

* The Set acts as a collection of values already encountered.


* 1. Check whether the current text already exists in the Set.

* 2. If it exists, it means the value has appeared before, so it's a duplicate.

* Store it in the duplicates array.

* 3. If it does not exist, add it to the Set so future iterations can detect it as a duplicate.
* Example:
* Options = ["Java", "Python", "Java"]

* Iteration 1: "Java" -> not in Set -> add to Set

* Iteration 2: "Python" -> not in Set -> add to Set

* Iteration 3: "Java" -> already in Set -> duplicate found

*/



for (const text of optiontext){

    if(mySet.has(text))
    { 
        duplicates.push(text); // push() adds an element to an array, similar to add() in Java's ArrayList

    }
    else{

        mySet.add(text);


    }
}

console.log("duplicate options are: ",duplicates);  // ['Playwright', 'C#', 'Python' ]

if(duplicates.length>0){
    console.log("Duplicate options found, ",duplicates);

}
else{

    console.log("Duplicate options not found, ", duplicates)
}

//This assertion will fail
// expect(duplicates.length).toBe(0);

//store unique element text directly in set 


/*
const uniqueOptionTextSet =  new Set (optiontext.map(text=>text.trim()));

const uniqueOptionTextArray:string [] = [...uniqueOptionTextSet];

for (const text of uniqueOptionTextSet){

    console.log(text)

   

}

for (let i=0;i<=optiontext.length;i++){

   /* for(let j=0;j<=uniqueOptionTextArray.length;j++){

        if (optiontext[i]===uniqueOptionTextArray[j])
        {

            console.log("option text at "+i+" is "+optiontext[i]+" and unique Option Text at "+j+" is "+uniqueOptionTextArray[j]+" are same");
        }
        else 
        {
            console.log("option text at "+i+" is "+optiontext[i]+" and unique Option Text at "+j+" is "+uniqueOptionTextArray[j]+" are different");
        }
    }

 


    if(optiontext[i]===uniqueOptionTextArray[i]){

        console.log("option text at "+i+" is "+optiontext[i]+" and unique Option Text at "+i+" is "+uniqueOptionTextArray[i]+" are same");


    }
    else
    {
         console.log("option text at "+i+" is "+optiontext[i]+" and unique Option Text at "+i+" is "+uniqueOptionTextArray[i]+" are different"+" hence "+optiontext[i]+ "  is duplicate element");
    }


 }
*/





})
import{test, expect, Locator} from "@playwright/test";


test("verify dropdown is sorted",async({page})=>{

await page.goto("http://127.0.0.1:5500/practice-app/frontend/pages/forms.html");


//const dropdownOptions:Locator = page.locator('#addrCountry>option');
const dropdownOptions:Locator = page.locator('#techStackMultiSelect>option');
console.log(await dropdownOptions.allTextContents()) //not sorted



const optionsText :string [] = (await dropdownOptions.allTextContents()).map(text=>text.trim());


/*
const originalList:string[]=optionsText; // you will get already sorted list because of below sort method in code
const sortedList:string[]=optionsText.sort(); // here sort method is impacting originalList, because in array concept sort is mutable, means original list is also sorting


console.log("original list: ", originalList);
console.log("sorted list: ", sortedList);


*/


//How to avoid impact on original list while sorting ?
//Must use spread operator- spread operator is a '...' (three dots), is a special type of operator in JS/TS which allows an iterable such as an array or string to be expanded in places where zero or more arguments (for function calls) or elements (for array literals) are expected, or an object expression to be expanded in places where zero or more key-value pairs (for object literals) are expected.
// this is important interview question

const originalList:string[]=[...optionsText]; // not sorted list
const sortedList:string[]=[...optionsText].sort(); // sorted list


console.log("original list: ", originalList);
console.log("sorted list: ", sortedList);


expect(originalList).toEqual(sortedList); // assertion will fail

await page.waitForTimeout(5000);

})

test.only("verify dropdown is sorted for sorted list",async({page})=>{

await page.goto("http://127.0.0.1:5500/practice-app/frontend/pages/forms.html");


const dropdownOptions:Locator = page.locator('#addrCountry>option');
console.log(await dropdownOptions.allTextContents()) //not sorted

const optionsText :string [] = (await dropdownOptions.allTextContents()).map(text=>text.trim());

const originalList:string[]=[...optionsText]; // not sorted list
const sortedList:string[]=[...optionsText].sort(); // sorted list


console.log("original list: ", originalList);
console.log("sorted list: ", sortedList);


// ❌ FAILS: expect(originalList).toEqual(sortedList);
//
// WHY IT FAILS (interview takeaway):
// -----------------------------------------------------------------------
// Array.prototype.sort() with NO compare function does a plain UNICODE
// CODE-POINT sort (comparing raw character codes), NOT a human/locale-
// aware alphabetical sort.
//
// Example: "Côte d'Ivoire" contains the accented letter "ô" (U+00F4 = 244),
// whose numeric code point is HIGHER than every plain A-Z letter
// (e.g. "z" = 122). So default .sort() shoves "Côte d'Ivoire" AFTER
// "Czechia" and "Denmark" - even though a human (and our real country
// dropdown, which IS properly alphabetised) would place it between
// "Costa Rica" and "Croatia".
//
// Net result: originalList (the real, correctly-alphabetised DOM order)
// and sortedList (JS's naive re-sort) disagree ONLY on where the accented
// name lands - so toEqual() reports a mismatch, even though the page
// itself is not actually "unsorted".
//
// THE FIX: use localeCompare() as the compare function, which sorts the
// way a human reading that language actually would (locale/linguistic
// rules), instead of comparing raw character codes.
// -----------------------------------------------------------------------
// Full breakdown of: [...optionsText].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
//
//   [...optionsText]
//     - spread operator copies the array first (see note above) so the
//       original, real DOM-order array is never mutated by .sort().
//
//   .sort(compareFn)
//     - Array.prototype.sort() rearranges the array IN PLACE, using
//       whatever function you pass it (compareFn) to decide the order of
//       every pair of elements it compares.
//     - If compareFn is OMITTED (like plain optionsText.sort()), JS falls
//       back to comparing elements as raw UTF-16 code units - which is
//       exactly what caused the original bug.
//
//   (a, b) => ...
//     - compareFn always receives TWO array elements at a time: "a" and
//       "b" - two candidate strings currently being compared to each
//       other to decide which should come first.
//     - compareFn's return value tells .sort() what to do with that pair:
//         negative number -> "a" should come BEFORE "b"
//         positive number -> "a" should come AFTER "b"
//         zero            -> "a" and "b" are considered EQUAL/unchanged
//
//   a.localeCompare(b, 'en', { sensitivity: 'base' })
//     - localeCompare() is a built-in STRING method (called on "a", with
//       "b" passed in as the string to compare against). It already
//       returns exactly the -1 / 0 / 1-style number that .sort() expects,
//       so we don't need to write any if/else comparison logic ourselves.
//     - 1st argument passed to localeCompare() is "b" - the OTHER string
//       being compared against "a".
//     - 2nd argument, 'en', is the LOCALE code (English) - it tells
//       localeCompare() to use English-language alphabetical/linguistic
//       ordering rules (where accented letters like "ô", "é" sort next to
//       their plain base letter "o", "e"), instead of comparing raw
//       Unicode numeric code points like default .sort() does.
//     - 3rd argument, { sensitivity: 'base' }, is an OPTIONS object with
//       one property, "sensitivity", set to 'base'. This controls HOW
//       strict the comparison is:
//         'base'      -> ignores BOTH case AND accents/diacritics, so
//                        "cote", "Côte", "COTE" are all treated as equal
//                        for ordering purposes (falls back to plain
//                        letter order: c-o-t-e).
//         'accent'    -> ignores case but NOT accents (Côte != Cote).
//         'case'      -> ignores accents but NOT case.
//         'variant'   -> (default) case AND accents both matter.
//       We deliberately chose 'base' here so an accented country name
//       sorts purely by its base letters, landing in the same position a
//       human reading an alphabetised list would expect.

const sortedListLocaleAware:string[] = [...optionsText].sort((a, b) =>a.localeCompare(b, 'en', { sensitivity: 'base' }));

console.log("sorted list (locale-aware): ", sortedListLocaleAware);

// ✅ PASSES: locale-aware sort matches the real, human-alphabetised DOM order.
expect(originalList).toEqual(sortedListLocaleAware);

await page.waitForTimeout(5000);




})
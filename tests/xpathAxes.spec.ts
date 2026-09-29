import{test,expect,Locator}from "@playwright/test";

test("Handle elements using axes like parent child sibling etc in playwright",async({page})=>{

    await page.goto("http://127.0.0.1:5500/practice-app/frontend/pages/tables.html");

    //1. parent - syntax "//child::tagname/parent::tagname" OR simply "//child::tagname/.."
    // Static table (data-testid="static-table") -> go from the "Alice Admin" cell up to its parent <tr>
    const parentRow:Locator = page.locator("//td[text()='Alice Admin']/parent::tr");
    await expect(parentRow).toHaveAttribute("data-testid","static-row-1");

    //2. child - syntax "//parent::tagname/child::tagname"
    // From <tbody> get all its direct <tr> children
    const tbodyRows:Locator = page.locator("//table[@data-testid='static-table']/tbody/child::tr");
    await expect(tbodyRows).toHaveCount(3);

    //3. self - syntax "//tagname[@attr='value']/self::tagname"
    // Confirms the current node itself matches the given tag (rarely used alone, but valid axis)
    const selfRow:Locator = page.locator("//tr[@data-testid='static-row-2']/self::tr");
    await expect(selfRow).toHaveAttribute("data-testid","static-row-2");

    //4. following-sibling - syntax "//tagname[@attr='value']/following-sibling::tagname"
    // From row 1, get all rows that come AFTER it at the same level
    const followingRows:Locator = page.locator("//tr[@data-testid='static-row-1']/following-sibling::tr");
    await expect(followingRows).toHaveCount(2);

    //5. preceding-sibling - syntax "//tagname[@attr='value']/preceding-sibling::tagname"
    // From row 3, get all rows that come BEFORE it at the same level
    const precedingRows:Locator = page.locator("//tr[@data-testid='static-row-3']/preceding-sibling::tr");
    await expect(precedingRows).toHaveCount(2);

    //6. following - syntax "//tagname[@attr='value']/following::tagname"
    // From row 1, get every <td> that appears ANYWHERE after it in document order (not just siblings)
    const followingCells:Locator = page.locator("//tr[@data-testid='static-row-1']/following::td");
    const followingCellsCount:number = await followingCells.count();
    expect(followingCellsCount).toBeGreaterThan(0);

    //7. preceding - syntax "//tagname[@attr='value']/preceding::tagname"
    // From row 3, get every <th> that appears ANYWHERE before it in document order
    const precedingHeaders:Locator = page.locator("//tr[@data-testid='static-row-3']/preceding::th");
    const precedingHeadersCount:number = await precedingHeaders.count();
    expect(precedingHeadersCount).toBe(3);

    //8. ancestor - syntax "//tagname[@attr='value']/ancestor::tagname"
    // From the "Alice Admin" cell, walk UP through every ancestor level and find the enclosing <table>
    const ancestorTable:Locator = page.locator("//td[text()='Alice Admin']/ancestor::table");
    await expect(ancestorTable).toHaveAttribute("data-testid","static-table");

    //9. ancestor-or-self - syntax "//tagname[@attr='value']/ancestor-or-self::tagname"
    // Same as ancestor, but also matches the current node itself if it satisfies the condition
    const ancestorOrSelfRow:Locator = page.locator("//tr[@data-testid='static-row-1']/ancestor-or-self::tr");
    await expect(ancestorOrSelfRow).toHaveAttribute("data-testid","static-row-1");

    //10. descendant - syntax "//tagname[@attr='value']/descendant::tagname"
    // From the <table>, find every <td> nested anywhere inside it (any depth)
    const descendantCells:Locator = page.locator("//table[@data-testid='static-table']/descendant::td");
    await expect(descendantCells).toHaveCount(9); // 3 rows x 3 cols

    //11. descendant-or-self - syntax "//tagname[@attr='value']/descendant-or-self::tagname"
    // Same as descendant, but also matches the current node itself if it satisfies the condition
    const descendantOrSelfRows:Locator = page.locator("//tbody/descendant-or-self::tr");
    await expect(descendantOrSelfRows).toHaveCount(3);

    //12. child::text() - syntax "//tagname/child::text()"
    // Grabs the direct text node child of an element (useful when element has no nested tags)
    const cellText:Locator = page.locator("//td[text()='Bob User']");
    await expect(cellText).toHaveText("Bob User");

    //13. attribute - syntax "//tagname/attribute::attributename" OR "//tagname/@attributename"
    // Reads an attribute value directly via the attribute:: axis
    const rowWithAttribute:Locator = page.locator("//tr[attribute::data-testid='static-row-2']");
    await expect(rowWithAttribute).toBeVisible();

    //14. Combining axes - parent + following-sibling together
    // From "Carla Tester" cell -> go to parent <tr> -> then get its preceding-sibling rows
    const combinedAxes:Locator = page.locator("//td[text()='Carla Tester']/parent::tr/preceding-sibling::tr");
    await expect(combinedAxes).toHaveCount(2);

    //15. Using dynamic.html - parent/ancestor axes on the Start/Stop toggle button
    await page.goto("http://127.0.0.1:5500/practice-app/frontend/pages/dynamic.html");

    // parent - from the toggle button go up to its immediate parent <section class="card">
    const toggleBtnParent:Locator = page.locator("//button[@data-testid='btn-toggle-start-stop']/parent::section");
    await expect(toggleBtnParent).toHaveClass("card");

    // ancestor - from the toggle button walk all the way up to the <main> container
    const toggleBtnAncestorMain:Locator = page.locator("//button[@data-testid='btn-toggle-start-stop']/ancestor::main");
    await expect(toggleBtnAncestorMain).toBeVisible();

    // following-sibling - from the "Progress Bar" heading, get its following-sibling <button> (Start Progress)
    const progressBarNextButton:Locator = page.locator("//h2[text()='Progress Bar (dynamic updates)']/following-sibling::button");
    await expect(progressBarNextButton).toHaveText("Start Progress");

})




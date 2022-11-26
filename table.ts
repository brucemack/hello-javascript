function clearChildren(el:Element) {
    while (el.firstChild) el.removeChild(el.firstChild);
}

function setText(el: Element, text: string) {
    el.appendChild(document.createTextNode(text))
}

function create_table_row(tbodyEl: Element, item:any , depth:number) {
    var trEl:Element = document.createElement("tr");
    tbodyEl.appendChild(trEl);

    // Temp
    var tdEl:Element = document.createElement("td");
    trEl.appendChild(tdEl);

    // Setup the indent
    var spanEl:Element = document.createElement("span");
    spanEl.setAttribute("style","visibility: hidden;")
    var padding:string = ""
    for (var i = 0; i < depth; i++)
        padding += "&#9658;"
    spanEl.innerHTML = padding
    tdEl.appendChild(spanEl);

    // Setup the arrow
    spanEl = document.createElement("span");
    if (item.children) {
        if (item.closed) {
            spanEl.classList.add("t4-arrow-closed")
        } else {
            spanEl.classList.add("t4-arrow-open")
        }
    } else {
        spanEl.classList.add("t4-arrow-none")
    }
    tdEl.appendChild(spanEl);

    spanEl = document.createElement("span");
    spanEl.innerHTML = item.name
    tdEl.appendChild(spanEl);

    tdEl = document.createElement("td");
    trEl.appendChild(tdEl);
    setText(tdEl, "Second " + depth);

    if (item.children) {
        item.children.forEach(function (child: any, index: number) {
            create_table_row(tbodyEl, child, depth + 1);
        });
    }
}

function draw_table(root:Element, tableDef:any, tableData: any) {
    // Clear existing table
    clearChildren(root);
    // Create the table
    var tableEl:Element = document.createElement("table");
    tableEl.classList.add("t4-table");
    root.appendChild(tableEl);
    // Add header
    var headEl:Element = document.createElement("thead");
    tableEl.appendChild(headEl);

    // Iterate across the definition and create the column headers
    tableDef.columns.forEach(function (item: any, index: number) {
        var thEl:Element = document.createElement("th");
        headEl.appendChild(thEl);
        if (item.title)
            setText(thEl,item.title)
    });

    // Iterate across the data and create rows
    var bodyEl:Element = document.createElement("tbody");
    tableEl.appendChild(bodyEl);
    create_table_row(bodyEl, tableData.root, 0);
}

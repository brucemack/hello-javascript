function setText(el, text) {
    el.appendChild(document.createTextNode(text));
}
function create_table_row(tbodyEl, item, depth) {
    trEl = document.createElement("tr");
    tbodyEl.appendChild(trEl);
    // Temp
    tdEl = document.createElement("td");
    trEl.appendChild(tdEl);
    // Setup the indent
    spanEl = document.createElement("span");
    spanEl.setAttribute("style", "visibility: hidden;");
    padding = "";
    for (var i = 0; i < depth; i++)
        padding += "&#9658;";
    spanEl.innerHTML = padding;
    tdEl.appendChild(spanEl);
    // Setup the arrow
    spanEl = document.createElement("span");
    if (item.children) {
        if (item.closed) {
            spanEl.classList.add("t4-arrow-closed");
        }
        else {
            spanEl.classList.add("t4-arrow-open");
        }
    }
    else {
        spanEl.classList.add("t4-arrow-none");
    }
    tdEl.appendChild(spanEl);
    spanEl = document.createElement("span");
    spanEl.innerHTML = item.name;
    tdEl.appendChild(spanEl);
    tdEl = document.createElement("td");
    trEl.appendChild(tdEl);
    setText(tdEl, "Second " + depth);
    if (item.children) {
        item.children.forEach(function (child, index) {
            create_table_row(tbodyEl, child, depth + 1);
        });
    }
}
function draw_table(root, tableDef, tableData) {
    // Clear existing table
    root.clearChildren();
    // Create the table
    tableEl = document.createElement("table");
    tableEl.classList.add("t4-table");
    root.appendChild(tableEl);
    // Add header
    headEl = document.createElement("thead");
    tableEl.appendChild(headEl);
    // Iterate across the definition and create the column headers
    tableDef.columns.forEach(function (item, index) {
        thEl = document.createElement("th");
        headEl.appendChild(thEl);
        if (item.title)
            setText(thEl, item.title);
    });
    // Iterate across the data and create rows
    bodyEl = document.createElement("tbody");
    tableEl.appendChild(bodyEl);
    create_table_row(bodyEl, tableData.root, 0);
}

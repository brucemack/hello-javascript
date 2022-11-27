
// Structure for column definition

export interface ColumnDefinition {
    title: string;
};

export interface ColumnDefinitions {
    columns: ColumnDefinition[]
};

// Structure for data

export interface TreeItem {
    title?: string,
    closed?: boolean,
    children?: TreeItem[]
};

export interface TreeData {
    root: TreeItem
};

function visitDepthFirst(item: TreeItem, depth: number, 
    visitor: (item: TreeItem, depth: number, isLeaf:boolean) => void) {
    // Determine if this is the leaf in the hierarchy
    var isLeaf: boolean = !item.children || item.children.length == 0;
    // Fire on the current node
    visitor(item, depth, isLeaf)
    // Visit children
    if (item.children && !item.closed)
        item.children.forEach((item: TreeItem, index: number) => visitDepthFirst(item, depth + 1 , visitor))
}

function clearChildren(el:Element) {
    while (el.firstChild) el.removeChild(el.firstChild);
}

function setText(el: Element, text: string) {
    el.appendChild(document.createTextNode(text))
}

export function draw_table(root: Element | null, tableDef: ColumnDefinitions, tableData: TreeData) {
    if (!root)
        return;
    // Clear existing table
    clearChildren(root);

    // Create the table element
    var tableEl:Element = document.createElement("table");
    tableEl.classList.add("t4-table");
    root.appendChild(tableEl);
    // Add header
    var headEl:Element = document.createElement("thead");
    tableEl.appendChild(headEl);

    // Iterate across the definition and create the column headers
    tableDef.columns.forEach(function (def: ColumnDefinition, index: number) {
        var thEl:Element = document.createElement("th");
        headEl.appendChild(thEl);
        if (def.title)
            setText(thEl,def.title)
    });

    // Iterate across the data and create rows
    var tbodyEl:Element = document.createElement("tbody");
    tableEl.appendChild(tbodyEl);

    // Now visit the entire hierarchy and create the table rows
    visitDepthFirst(tableData.root, 0, (item: TreeItem, depth: number, isLeaf: boolean) => {

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
        spanEl.innerHTML = item.title
        tdEl.appendChild(spanEl);

        tdEl = document.createElement("td");
        trEl.appendChild(tdEl);
        setText(tdEl, "Second " + depth);
    });
}

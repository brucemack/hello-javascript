// Structure for column definition

export interface ColumnDefinition {
    // Displayed on the column header
    title: string,
    // Creates the <td> element for the specified column
    cellGenerator: (definition: TableDefinition,
        item: Readonly<TreeItem>, 
        depth: number, 
        path: readonly number[]) => HTMLTableCellElement
};

export interface TableDefinition {
    columns: ColumnDefinition[],
    // An optional function that should be called when the hierarchy
    // is expanded/collpased be the end user.
    onOpenClose?: (path: readonly number[]) => void
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

function visitDepthFirst(item: TreeItem, 
    depth: number, 
    path: readonly number[], 
    visitor: (item: TreeItem, depth: number, isLeaf:boolean, path: readonly number[]) => void) {
    // Determine if this is the leaf in the hierarchy
    var isLeaf: boolean = !item.children || item.children.length == 0;
    // Fire on the current node
    visitor(item, depth, isLeaf, path)
    // Visit children
    if (item.children && !item.closed) {
        item.children.forEach((item: TreeItem, index: number) => {
            // Copy the path and extend it
            var extendedPath: number[] = [...path];
            extendedPath.push(index)
            visitDepthFirst(item, depth + 1 , extendedPath, visitor)
        });
    }
}

function clearChildren(el:Element) {
    while (el.firstChild) el.removeChild(el.firstChild);
}

function setText(el: Element, text: string) {
    el.appendChild(document.createTextNode(text))
}

export function titleCellGenerator(tabelDef: TableDefinition,
    item: Readonly<TreeItem>, depth: number, 
    path: readonly number[]) {

    var tdEl:HTMLTableCellElement = document.createElement("td");

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
        spanEl.addEventListener("click", (ev: Event) => {
            // Fire the callback
            if (tabelDef.onOpenClose) {
                tabelDef.onOpenClose(path);
            }
        });
    } else {
        spanEl.classList.add("t4-arrow-none")
    }
    tdEl.appendChild(spanEl);

    spanEl = document.createElement("span");
    spanEl.innerHTML = item.title
    tdEl.appendChild(spanEl);

    return tdEl;
}

/**
 * Returns the TreeItem that corresponds to the specified path.
 * 
 * @param root 
 * @param path 
 */
export function resolvePath(root: TreeItem, path: readonly number[]): TreeItem {
    if (path.length == 0) {
        return root;
    } else {
        // Shorten the list
        var shortenedPath: number[] = [...path];
        var i = shortenedPath.shift();
        if (!root.children || i >= root.children.length) {
            return null;
        } else {
            return resolvePath(root.children[i], shortenedPath);
        }
    }
}

export function render(root: HTMLElement | null, 
    tableDef: TableDefinition, tableData: TreeData) {
    
    if (!root)
        return;
    
    // Clear existing table
    clearChildren(root);

    // Create the table element
    var tableEl:HTMLTableElement = document.createElement("table");
    tableEl.classList.add("t4-table");
    root.appendChild(tableEl);

    // Add header
    var theadEl:Element = document.createElement("thead");
    tableEl.appendChild(theadEl);

    var trEl:Element = document.createElement("tr");
    theadEl.appendChild(trEl);

    // Iterate across the definition and create the column headers
    tableDef.columns.forEach(function (def: ColumnDefinition, index: number) {
        var thEl:Element = document.createElement("th");
        trEl.appendChild(thEl);
        if (def.title)
            setText(thEl,def.title)
    });

    // Iterate across the data and create rows
    var tbodyEl:Element = document.createElement("tbody");
    tableEl.appendChild(tbodyEl);

    var rowCount: number = 0;
    var rootPath: number[] = [];

    // Now visit the entire hierarchy and create the table rows
    visitDepthFirst(tableData.root, 0, rootPath,  
        (item: TreeItem, depth: number, isLeaf: boolean, path: readonly number[]) => {

            var trEl:HTMLTableRowElement = document.createElement("tr");
            if (rowCount % 2 == 0) {
                trEl.classList.add("even");
            } else {
                trEl.classList.add("odd");
            }

            // Generate cells (one for each column)
            tableDef.columns.forEach(function (def: ColumnDefinition, index: number) {
                var tdEl:HTMLTableCellElement = def.cellGenerator(tableDef, item, depth, path);
                trEl.appendChild(tdEl);
            });

            tbodyEl.appendChild(trEl);
            rowCount++;
        }
    );
}

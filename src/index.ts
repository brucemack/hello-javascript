import * as t4 from "./table"

var tableData: t4.TreeData = {
    root: {
        title: "Total",
        children: [
            {
                title: "Level 1a",
                closed: false,
                children: [
                    {
                        title: "Level 2a"
                    }
                ]
            },
            {
                title: "Level 1b"
            }
        ]
    }
};

var tableDef: t4.TableDefinition = {
    columns: [
        {
            width: 200,
            title: "Other",
            cellGenerator: (tableDef: t4.TableDefinition, 
                item: Readonly<t4.TreeItem>, depth: number, path: readonly number[]) => {
                var tdEl: HTMLTableCellElement = document.createElement("td");
                var t:string = "Hello ";
                path.forEach((item, ix) => {
                    t += "" + item + ",";
                });
                tdEl.innerHTML = t;
                return tdEl;
            }
        },
        {
            title: "Hi",
            cellGenerator: t4.titleCellGenerator
        },
        {
            title: "Izzy",
            cellGenerator: (tableDef: t4.TableDefinition, 
                item: Readonly<t4.TreeItem>, depth: number, path: readonly number[]) => {
                var tdEl: HTMLTableCellElement = document.createElement("td");
                tdEl.innerHTML = "Second " + depth;
                return tdEl;
            }
        }
    ],
    // Callback used to handle the open/close events
    onOpenClose: (path: readonly number[]) => {
        var item: t4.TreeItem = t4.resolvePath(tableData.root, path);
        if (item) {
            item.closed = !item.closed;
            // Redraw
            t4.render(document.getElementById("table1"), tableDef, tableData);
        }
    }
};

(function() {
    t4.render(document.getElementById("table1"), tableDef, tableData);
})();


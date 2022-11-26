import * as t4 from "./table"

var tableDef: t4.ColumnDefinitions = {
    columns: [
        {
            title: "Hi"
        },
        {
            title: "Izzy"
        }
    ]
};

var tableData = {
    root: {
        name: "Total",
        children: [
            {
                name: "Level 1a",
                closed: true,
                children: [
                    {
                        name: "Level 2a"
                    }
                ]
            },
            {
                name: "Level 1b"
            }
        ]
    }
};

(function() {
    console.log("Loaded")
    t4.draw_table(document.getElementById("table1"), tableDef, tableData);
})();


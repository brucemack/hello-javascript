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

(function() {
    t4.draw_table(document.getElementById("table1"), tableDef, tableData);
})();


/* =====================================
   HELPER
===================================== */

const $ = (id) => {
    return document.getElementById(id);
};


/* =====================================
   ALL BASIC FIELDS
===================================== */

const fields = [

    "companyName",
    "companyAddress",
    "payMonth",

    "employeeId",
    "employeeName",
    "designation",
    "band",
    "department",
    "pan",
    "location",
    "jobGrade",
    "pfNo",
    "dob",
    "doj",
    "uan",
    "gender",
    "medIns",
    "esiNo",

    "bankName",
    "ifsc",
    "bankAc",

    "daysMonth",
    "arrearDays",
    "loprDays",
    "lopDays",

    "loanType",
    "loanAmount",
    "emiTill",
    "balanceMonth",

    "additional",
    "footer"
];


/* =====================================
   DEFAULT DATA
===================================== */

let data = {

    earnings: [

        [
            "Basic",
            "27575.00",
            "82725.00"
        ],

        [
            "House Rent Allowance",
            "13788.00",
            "41364.00"
        ],

        [
            "Conveyance Allowance",
            "9294.00",
            "27882.00"
        ]

    ],


    deductions: [

        [
            "Provident Fund",
            "1800.00",
            "5400.00"
        ],

        [
            "Labour Welfare Fund",
            "15.00",
            "15.00"
        ],

        [
            "Dining Hall Deduction",
            "1000.00",
            "3000.00"
        ],

        [
            "Electricity Deduction",
            "260.00",
            "685.00"
        ]

    ]

};


/* =====================================
   NUMBER FORMAT
===================================== */

function money(value) {

    return Number(value || 0)
        .toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
}


/* =====================================
   HTML ESCAPE
===================================== */

function esc(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;");
}


/* =====================================
   RENDER EDITOR ROWS
===================================== */

function renderEditors() {

    const types = [
        "earnings",
        "deductions"
    ];


    types.forEach(
        (type) => {

            const box =
                $(type + "Editor");

            box.innerHTML = "";


            data[type].forEach(
                (row, index) => {

                    const div =
                        document.createElement("div");

                    div.className =
                        "row-edit";


                    div.innerHTML = `

                        <input
                            value="${esc(row[0])}"
                            data-t="${type}"
                            data-i="${index}"
                            data-k="0"
                            placeholder="Name"
                        >

                        <input
                            value="${row[1]}"
                            data-t="${type}"
                            data-i="${index}"
                            data-k="1"
                            placeholder="Amount"
                        >

                        <input
                            value="${row[2]}"
                            data-t="${type}"
                            data-i="${index}"
                            data-k="2"
                            placeholder="YTD"
                        >

                        <button
                            data-del="${type}"
                            data-i="${index}"
                            title="Delete"
                        >
                            ×
                        </button>

                    `;


                    box.appendChild(div);

                }
            );

        }
    );

}


/* =====================================
   UPDATE BASIC FIELD OUTPUT
===================================== */

function updateBasicFields() {

    fields.forEach(
        (id) => {

            const input = $(id);

            if (!input) {
                return;
            }


            const outputs =
                document.querySelectorAll(
                    `[data-out="${id}"]`
                );


            outputs.forEach(
                (output) => {

                    output.textContent =
                        input.value;

                }
            );

        }
    );

}


/* =====================================
   UPDATE PAY TABLE
===================================== */

function updatePayTable() {

    let html = "";

    let totalEarnings = 0;
    let totalEarningsYtd = 0;

    let totalDeductions = 0;
    let totalDeductionsYtd = 0;


    const maxRows =
        Math.max(
            data.earnings.length,
            data.deductions.length
        );


    for (
        let i = 0;
        i < maxRows;
        i++
    ) {

        const earning =
            data.earnings[i] ||
            ["", "0", "0"];


        const deduction =
            data.deductions[i] ||
            ["", "0", "0"];


        totalEarnings +=
            Number(earning[1]) || 0;


        totalEarningsYtd +=
            Number(earning[2]) || 0;


        totalDeductions +=
            Number(deduction[1]) || 0;


        totalDeductionsYtd +=
            Number(deduction[2]) || 0;


        html += `

            <tr>

                <td>
                    ${esc(earning[0])}
                </td>

                <td>
                    ${money(earning[1])}
                </td>

                <td>
                    ${money(earning[2])}
                </td>

                <td>
                    ${esc(deduction[0])}
                </td>

                <td>
                    ${money(deduction[1])}
                </td>

                <td>
                    ${money(deduction[2])}
                </td>

            </tr>

        `;

    }


    $("payBody").innerHTML =
        html;


    $("totalEarn").textContent =
        money(totalEarnings);


    $("totalEarnYtd").textContent =
        money(totalEarningsYtd);


    $("totalDed").textContent =
        money(totalDeductions);


    $("totalDedYtd").textContent =
        money(totalDeductionsYtd);


    /* NET PAY */

    const netPay =
        totalEarnings -
        totalDeductions;


    $("netPay").textContent =
        "Rs. " + money(netPay);


    $("netWords").textContent =
        numberToWords(
            Math.round(netPay)
        ) + " Only.";

}


/* =====================================
   ATTENDANCE
===================================== */

function updateAttendance() {

    const days =
        Number($("daysMonth").value) || 0;


    const arrear =
        Number($("arrearDays").value) || 0;


    const lopr =
        Number($("loprDays").value) || 0;


    const lop =
        Number($("lopDays").value) || 0;


    const netDays =
        days +
        arrear +
        lopr -
        lop;


    $("daysMonthOut").textContent =
        days;


    $("arrearDaysOut").textContent =
        arrear;


    $("loprDaysOut").textContent =
        lopr;


    $("lopDaysOut").textContent =
        lop;


    $("netDaysOut").textContent =
        netDays;

}


/* =====================================
   LOAN
===================================== */

function updateLoan() {

    $("loanTypeOut").textContent =
        $("loanType").value;


    $("loanAmountOut").textContent =
        $("loanAmount").value;


    $("emiTillOut").textContent =
        $("emiTill").value;


    $("balanceMonthOut").textContent =
        $("balanceMonth").value;

}


/* =====================================
   OTHER
===================================== */

function updateOther() {

    $("additionalOut").textContent =
        $("additional").value;


    $("footerOut").textContent =
        $("footer").value;

}


/* =====================================
   MAIN UPDATE
===================================== */

function update() {

    updateBasicFields();

    updatePayTable();

    updateAttendance();

    updateLoan();

    updateOther();


    saveData();

}


/* =====================================
   SAVE DATA
===================================== */

function saveData() {

    const fieldValues = {};


    fields.forEach(
        (id) => {

            const input = $(id);

            if (input) {

                fieldValues[id] =
                    input.value;

            }

        }
    );


    const saveObject = {

        fields:
            fieldValues,

        earnings:
            data.earnings,

        deductions:
            data.deductions

    };


    localStorage.setItem(
        "payslipData",
        JSON.stringify(saveObject)
    );

}


/* =====================================
   LOAD DATA
===================================== */

function loadData() {

    const saved =
        localStorage.getItem(
            "payslipData"
        );


    if (!saved) {
        return;
    }


    try {

        const object =
            JSON.parse(saved);


        if (object.fields) {

            Object.entries(
                object.fields
            ).forEach(
                ([id, value]) => {

                    const element =
                        $(id);

                    if (element) {

                        element.value =
                            value;

                    }

                }
            );

        }


        if (object.earnings) {

            data.earnings =
                object.earnings;

        }


        if (object.deductions) {

            data.deductions =
                object.deductions;

        }

    }

    catch (error) {

        console.error(
            "Could not load saved data",
            error
        );

    }

}


/* =====================================
   ADD EARNING
===================================== */

$("addEarn").addEventListener(
    "click",
    () => {

        data.earnings.push(
            [
                "New Earning",
                "0.00",
                "0.00"
            ]
        );


        renderEditors();

        update();

    }
);


/* =====================================
   ADD DEDUCTION
===================================== */

$("addDed").addEventListener(
    "click",
    () => {

        data.deductions.push(
            [
                "New Deduction",
                "0.00",
                "0.00"
            ]
        );


        renderEditors();

        update();

    }
);


/* =====================================
   DYNAMIC ROW EDITING
===================================== */

document.addEventListener(
    "input",
    (event) => {

        const element =
            event.target;


        if (!element.dataset.t) {
            return;
        }


        const type =
            element.dataset.t;


        const index =
            Number(
                element.dataset.i
            );


        const key =
            Number(
                element.dataset.k
            );


        data[type][index][key] =
            element.value;


        update();

    }
);


/* =====================================
   DELETE ROW
===================================== */

document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target;


        if (!button.dataset.del) {
            return;
        }


        const type =
            button.dataset.del;


        const index =
            Number(
                button.dataset.i
            );


        data[type].splice(
            index,
            1
        );


        renderEditors();

        update();

    }
);


/* =====================================
   ALL INPUT LISTENERS
===================================== */

fields.forEach(
    (id) => {

        const element =
            $(id);


        if (!element) {
            return;
        }


        element.addEventListener(
            "input",
            update
        );

    }
);


/* =====================================
   PRINT / PDF
===================================== */

$("printBtn").addEventListener(
    "click",
    () => {

        window.print();

    }
);


/* =====================================
   RESET
===================================== */

$("resetBtn").addEventListener(
    "click",
    () => {

        const confirmReset =
            confirm(
                "Reset all payslip data?"
            );


        if (!confirmReset) {
            return;
        }


        localStorage.removeItem(
            "payslipData"
        );


        location.reload();

    }
);


/* =====================================
   NUMBER TO WORDS
===================================== */

function numberToWords(num) {

    if (num === 0) {
        return "Zero Rupees";
    }


    const ones = [

        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen"

    ];


    const tens = [

        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety"

    ];


    function convert(n) {

        if (n < 20) {

            return ones[n];

        }


        if (n < 100) {

            return (
                tens[
                    Math.floor(n / 10)
                ]

                +

                (
                    n % 10
                        ? " " +
                          ones[n % 10]
                        : ""
                )
            );

        }


        if (n < 1000) {

            return (
                ones[
                    Math.floor(n / 100)
                ]

                +

                " Hundred"

                +

                (
                    n % 100
                        ? " " +
                          convert(n % 100)
                        : ""
                )
            );

        }


        if (n < 100000) {

            return (
                convert(
                    Math.floor(
                        n / 1000
                    )
                )

                +

                " Thousand"

                +

                (
                    n % 1000
                        ? " " +
                          convert(n % 1000)
                        : ""
                )
            );

        }


        if (n < 10000000) {

            return (
                convert(
                    Math.floor(
                        n / 100000
                    )
                )

                +

                " Lakh"

                +

                (
                    n % 100000
                        ? " " +
                          convert(n % 100000)
                        : ""
                )
            );

        }


        return (

            convert(
                Math.floor(
                    n / 10000000
                )
            )

            +

            " Crore"

            +

            (
                n % 10000000
                    ? " " +
                      convert(
                          n % 10000000
                      )
                    : ""
            )

        );

    }


    return "Rupees " + convert(num);

}


/* =====================================
   INITIALIZE
===================================== */

loadData();

renderEditors();

update();

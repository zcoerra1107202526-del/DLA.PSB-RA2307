
// Google Apps Script Web App URL
var API_URL = 'https://script.google.com/macros/s/AKfycbz93iSG8p0DVVkfqy9tNVD0HAD7spTg2vpW1a53lVPwbqdsNFjOwnJC2lO4SkgQVlhI/exec';

// Table Column Keys
var KEYS = [
    'srNo',
    'rollNo',
    'name',
    'tenth',
    'twelfth',
    'sem1',
    'sem2'
];

// Column Labels
var LABELS = [
    'Sr No',
    'Roll No',
    'Student Name',
    '10th',
    '12th',
    'Sem 1',
    'Sem 2'
];

// Global Variables
var students = [];
var sortKey = null;
var sortAsc = true;

// HTML Elements
var tbody = document.getElementById('tbody');
var statusEl = document.getElementById('status');
var countEl = document.getElementById('count');
var searchBox = document.getElementById('searchBox');


// 1. Load Data from Google Sheets
function loadData() {

    statusEl.textContent = 'Loading student records...';

    fetch(API_URL)

        .then(function(res) {

            if (!res.ok) {
                throw new Error('Network error');
            }

            return res.json();

        })

        .then(function(data) {

            if (!Array.isArray(data)) {
                throw new Error('Invalid data format');
            }

            students = data;

            statusEl.textContent = '';

            render();

        })

        .catch(function(err) {

            statusEl.textContent =
                'Could not load data. Please check your Apps Script URL.';

            countEl.textContent = 'Records unavailable';

            console.error(err);

        });
}


// 2. Filter, Sort and Display Table
function render() {

    var q = searchBox.value.trim().toLowerCase();

    // Search by Name or Roll Number
    var list = students.filter(function(s) {

        return String(s.rollNo || '')
            .toLowerCase().indexOf(q) !== -1 ||

            String(s.name || '')
            .toLowerCase().indexOf(q) !== -1;

    });


    // Sorting Function
    if (sortKey) {

        list.sort(function(a, b) {

            var x = a[sortKey];
            var y = b[sortKey];

            var nx = parseFloat(x);
            var ny = parseFloat(y);

            var r = (!isNaN(nx) && !isNaN(ny))
                ? nx - ny
                : String(x == null ? '' : x)
                    .localeCompare(
                        String(y == null ? '' : y)
                    );

            return sortAsc ? r : -r;

        });

    }


    // Clear Previous Table Data
    tbody.innerHTML = '';


    // Display Student Records
    list.forEach(function(s) {

        var tr = document.createElement('tr');

        KEYS.forEach(function(k, i) {

            var td = document.createElement('td');

            td.textContent = s[k] == null ? '' : s[k];

            td.setAttribute('data-label', LABELS[i]);

            tr.appendChild(td);

        });

        tbody.appendChild(tr);

    });


    // Update Student Count
    countEl.textContent =
        'Showing ' + list.length +
        ' of ' + students.length + ' students';


    // No Records Message
    if (list.length === 0) {

        statusEl.textContent =
            q ? 'No matching student records found.' :
            'No student records available.';

    } else {

        statusEl.textContent = '';

    }

}


// 3. Search as User Types
searchBox.addEventListener('input', function() {

    render();

});


// 4. Sort When Column Heading is Clicked
document.querySelectorAll('#studentTable th')
    .forEach(function(th) {

        th.addEventListener('click', function() {

            var key = th.getAttribute('data-key');

            if (!key) return;

            if (sortKey === key) {

                sortAsc = !sortAsc;

            } else {

                sortKey = key;
                sortAsc = true;

            }

            render();

        });

    });


// 5. Load Student Data
loadData();

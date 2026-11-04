
var API_URL = 'https://script.google.com/macros/s/AKfycbz93iSG8p0DVVkfqy9tNVD0HAD7spTg2vpW1a53lVPwbqdsNFjOwnJC2lO4SkgQVlhI/exec';

var KEYS = [
  'srNo', 'rollNo', 'name', 'tenth',
  'twelfth', 'sem1', 'sem2'
];

var LABELS = [
  'Sr No', 'Roll No', 'Student Name',
  '10th', '12th', 'Sem 1', 'Sem 2'
];

var students = [];
var sortKey = null;
var sortAsc = true;

var tbody = document.getElementById('tbody');
var statusEl = document.getElementById('status');
var countEl = document.getElementById('count');
var searchBox = document.getElementById('searchBox');

// 1. Load data from the Apps Script URL
function loadData() {
  statusEl.textContent = 'Loading...';

  fetch(API_URL)
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      students = data;
      statusEl.textContent = '';
      render();
    })
    .catch(function(err) {
      statusEl.textContent =
        'Could not load data. Check the URL.';
      console.error(err);
    });
}

// 2. Filter, sort and draw the table
function render() {
  var q = searchBox.value.trim().toLowerCase();

  var list = students.filter(function(s) {
    return String(s.rollNo).toLowerCase().indexOf(q) !== -1 ||
           String(s.name).toLowerCase().indexOf(q) !== -1;
  });

  // Sorting
  if (sortKey) {
    list.sort(function(a, b) {
      var x = a[sortKey];
      var y = b[sortKey];

      var nx = parseFloat(x);
      var ny = parseFloat(y);

      var r = (!isNaN(nx) && !isNaN(ny))
        ? nx - ny
        : String(x).localeCompare(String(y));

      return sortAsc ? r : -r;
    });
  }

  // Display table
  tbody.innerHTML = '';

  list.forEach(function(s) {
    var tr = document.createElement('tr');

    KEYS.forEach(function(k, i) {
      var td = document.createElement('td');

      td.textContent = s[k];
      td.setAttribute('data-label', LABELS[i]);

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  countEl.textContent =
    'Showing ' + list.length +
    ' of ' + students.length + ' students';
}

// 3. Search as the user types
searchBox.addEventListener('input', render);

// 4. Sort when a header is clicked
document.querySelectorAll('th').forEach(function(th) {
  th.addEventListener('click', function() {
    var key = th.getAttribute('data-key');

    if (sortKey === key) {
      sortAsc = !sortAsc;
    } else {
      sortKey = key;
      sortAsc = true;
    }

    render();
  });
});

// 5. Load student data
loadData();

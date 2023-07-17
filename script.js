// Obtener referencias a los elementos del DOM
const textarea = document.getElementById("myTextarea");
const csvButton = document.getElementById("csvButton");
const xlsxButton = document.getElementById("xlsxButton");
const csvButtonMovil = document.getElementById("csvButtonMovil");
const xlsxButtonMovil = document.getElementById("xlsxButtonMovil");

// Esperar a que se cargue el DOM
document.addEventListener("DOMContentLoaded", function () {
  // Enfocar el textarea
  textarea.focus();
  // Deshabilitar botones al inicio
  toggleButtons();
  var form = document.getElementById("myForm");
  // Evitar que el formulario se envíe al presionar Enter
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
});

function test() {
  var textarea = document.getElementById("myTextarea");
  var button = document.getElementById("loadSample");
  var buttonMovil = document.getElementById("loadSampleMovil");

  if (textarea.value.trim() !== "") {
    textarea.value = "";
    button.innerHTML = `<i class="fas fa-upload"></i> Cargar ejemplo`;;
    buttonMovil.innerHTML = `<i class="fas fa-upload"></i> Cargar ejemplo`;
  } else {
    var sampleData = [
      {"id": 1, "nombre": "John", "apellido": "Doe", "email": "john@example.com"},
      {"id": 2, "nombre": "Jane", "apellido": "Smith", "email": "jane@example.com"},
      {"id": 3, "nombre": "Robert", "apellido": "Johnson", "email": "robert@example.com"},
      {"id": 4, "nombre": "Sarah", "apellido": "Williams", "email": "sarah@example.com"},
      {"id": 5, "nombre": "Michael", "apellido": "Brown", "email": "michael@example.com"},
      {"id": 6, "nombre": "Laura", "apellido": "Davis", "email": "laura@example.com"},
      {"id": 7, "nombre": "Daniel", "apellido": "Miller", "email": "daniel@example.com"},
      {"id": 8, "nombre": "Emily", "apellido": "Wilson", "email": "emily@example.com"},
      {"id": 9, "nombre": "James", "apellido": "Taylor", "email": "james@example.com"},
      {"id": 10, "nombre": "Olivia", "apellido": "Anderson", "email": "olivia@example.com"},
      {"id": 11, "nombre": "David", "apellido": "Thomas", "email": "david@example.com"},
      {"id": 12, "nombre": "Sophia", "apellido": "Lee", "email": "sophia@example.com"},
      {"id": 13, "nombre": "Joseph", "apellido": "Harris", "email": "joseph@example.com"},
      {"id": 14, "nombre": "Ava", "apellido": "Clark", "email": "ava@example.com"},
      {"id": 15, "nombre": "Christopher", "apellido": "Lewis", "email": "christopher@example.com"},
      {"id": 16, "nombre": "Emma", "apellido": "Walker", "email": "emma@example.com"},
      {"id": 17, "nombre": "Andrew", "apellido": "Hall", "email": "andrew@example.com"},
      {"id": 18, "nombre": "Isabella", "apellido": "Young", "email": "isabella@example.com"},
      {"id": 19, "nombre": "Matthew", "apellido": "Allen", "email": "matthew@example.com"},
      {"id": 20, "nombre": "Mia", "apellido": "Green", "email": "mia@example.com"}
    ];
    textarea.value = JSON.stringify(sampleData);
    button.innerHTML = `<i class="fas fa-backspace"></i> Limpiar`;
    buttonMovil.innerHTML = `<i class="fas fa-backspace"></i> Limpiar`;
  }

  // Enfocar el textarea
  textarea.focus();
  // Esto es para los botones
  change();
}

function clean() {
  var textarea = document.getElementById("myTextarea");
  var button = document.getElementById("loadSample");
  var buttonMovil = document.getElementById("loadSampleMovil");

  if (textarea.value.trim() !== "") {
    button.innerHTML = `<i class="fas fa-backspace"></i> Limpiar`;
    buttonMovil.innerHTML = `<i class="fas fa-backspace"></i> Limpiar`;
  } else {
    button.innerHTML = `<i class="fas fa-upload"></i> Cargar ejemplo`;;
    buttonMovil.innerHTML = `<i class="fas fa-upload"></i> Cargar ejemplo`;
  }

  // Enfocar el textarea
  textarea.focus();
}

// Función para descargar un archivo CSV
function downloadCSV() {
  var textareaValue = document.getElementById("myTextarea").value;
  var jsonData;

  try {
    jsonData = JSON.parse(textareaValue);
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData]; // Si es solo un objeto, coloca el objeto dentro de un array
    }
  } catch (error) {
    console.log("error", error)
    showError();
    return;
  }

  var flatten = flattenJSON(jsonData);
  var csvData = convertJSONToArrayOfArrays(flatten);
  var csvFile = createCsvFile(csvData);
  downloadFile(csvFile, "data_csv.csv");
}

// Función para descargar un archivo XLSX
function downloadXLSX() {
  var textareaValue = document.getElementById("myTextarea").value;
  var jsonData;

  try {
    jsonData = JSON.parse(textareaValue);
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData]; // Si es solo un objeto, coloca el objeto dentro de un array
    }
  } catch (error) {
    showError();
    return;
  }

  var flatten = flattenJSON(jsonData);
  var csvData = convertJSONToArrayOfArrays(flatten);
  var xlsxFile = createXlsxFile(csvData);
  downloadFile(xlsxFile, "data_excel.xlsx");
}

// Función para crear un archivo XLSX
function createXlsxFile(data) {
  var worksheet = XLSX.utils.aoa_to_sheet(data);
  var workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  var xlsxWriteOptions = { bookType: "xlsx", type: "array" };
  var xlsxFile = XLSX.write(workbook, xlsxWriteOptions);

  return new Blob([xlsxFile], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

// Función para crear un archivo CSV
function createCsvFile(data) {
  var csvContent = "";

  data.forEach(function (row) {
    csvContent += row.join(",") + "\r\n";
  });

  return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
}

// Función para aplanar un JSON anidado
function flattenJSON(jsonArray) {
  var result = [];

  function flatten(obj, parentKey = "") {
    var flattenedObj = {};

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var currentKey = parentKey ? parentKey + "." + key : key;

        if (typeof obj[key] === "object" && obj[key] !== null) {
          var nestedObj = flatten(obj[key], currentKey);
          flattenedObj = { ...flattenedObj, ...nestedObj };
        } else {
          flattenedObj[currentKey] = obj[key];
        }
      }
    }

    return flattenedObj;
  }

  for (var i = 0; i < jsonArray.length; i++) {
    var flattenedJSON = flatten(jsonArray[i]);
    result.push(flattenedJSON);
  }

  return result;
}


function convertJSONToArrayOfArrays(jsonArray) {
  var allKeys = [];

  // Obtener todas las claves de los JSONs
  for (var i = 0; i < jsonArray.length; i++) {
    var keys = Object.keys(jsonArray[i]);
    allKeys = Array.from(new Set([...allKeys, ...keys]));
  }

  var arrayOfArrays = [allKeys];

  // Generar los arrays con los valores correspondientes
  for (var i = 0; i < jsonArray.length; i++) {
    var values = [];

    for (var j = 0; j < allKeys.length; j++) {
      var key = allKeys[j];
      var value = jsonArray[i][key] || "";
      values.push(value);
    }

    arrayOfArrays.push(values);
  }

  // Obtener la referencia del elemento thead de la tabla
  var tableHead = document.getElementById("myTable").getElementsByTagName("thead")[0];

  // Limpiar el contenido anterior del thead
  tableHead.innerHTML = "";

  // Crear los elementos <th> dinámicamente
  var headerRow = document.createElement("tr");
  for (var i = 0; i < arrayOfArrays[0].length; i++) {
    var headerCell = document.createElement("th");
    var headerCellText = document.createTextNode(arrayOfArrays[0][i]);
    headerCell.appendChild(headerCellText);
    headerRow.appendChild(headerCell);
  }
  tableHead.appendChild(headerRow);

  // Obtener la referencia del elemento tbody de la tabla
  var tableBody = document.getElementById("myTable").getElementsByTagName("tbody")[0];

  // Limpiar el contenido anterior del tbody
  tableBody.innerHTML = "";

  // Crear los elementos <tr> y <td> dinámicamente
  for (var i = 1; i < arrayOfArrays.length; i++) {
    var row = document.createElement("tr");

    for (var j = 0; j < arrayOfArrays[i].length; j++) {
      var cell = document.createElement("td");
      var cellText = document.createTextNode(arrayOfArrays[i][j]);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    tableBody.appendChild(row);
  }

  return arrayOfArrays;
}



function downloadFile(file, fileName) {
  var a = document.createElement("a");
  var url = URL.createObjectURL(file);

  a.href = url;
  a.setAttribute("download", fileName);
  a.click();

  URL.revokeObjectURL(url);
}

// Función para verificar si el textarea está vacío
function isTextareaEmpty() {
  const result = textarea.value.trim() === "";
  return result
}

// Función para verificar si el texto en el textarea es un JSON válido
function isTextareaValidJson() {
  try {
    var parsedData = JSON.parse(textarea.value);
    return typeof parsedData === "object" && parsedData !== null;
  } catch (error) {
    return false;
  }
}

// Función para deshabilitar o habilitar los botones según las condiciones
function toggleButtons() {
  if (isTextareaEmpty() || !isTextareaValidJson()) {
    csvButton.disabled = true;
    xlsxButton.disabled = true;
    csvButtonMovil.disabled = true;
    xlsxButtonMovil.disabled = true;
  } else {
    csvButton.disabled = false;
    xlsxButton.disabled = false;
    csvButtonMovil.disabled = false;
    xlsxButtonMovil.disabled = false;
  }
}

// Función para mostrar un mensaje de error
function showError() {
  var errorDiv = document.getElementById("errorDiv");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.id = "errorDiv";
    errorDiv.className = "alert alert-danger";
    errorDiv.textContent = "El texto en el textarea no es un JSON válido.";

    var container = document.querySelector(".container");
    container.insertBefore(errorDiv, document.getElementById("myForm"));
  }
}

// Función para ocultar el error
function hideError() {
  var errorDiv = document.getElementById("errorDiv");
  if (errorDiv) {
    errorDiv.remove();
  }
}

// Agregar el evento onkeyup al textarea
textarea.addEventListener("keyup", function () {
  change();
  clean();
});

function change() {
  toggleButtons();

  if (!isTextareaEmpty() && !isTextareaValidJson()) {
    showError();
    hiddenTable();
  } else {
    showTable();
    hideError();
  }

  // No muestro la tabla si el textarea está vacío
  if (isTextareaEmpty()) {
    hiddenTable();
  }
}

$(document).ready(function() {
  $('#myTable').DataTable();
});

function showTable() {
  $('#tableContainer').removeClass('hidden');

  var textareaValue = document.getElementById("myTextarea").value;
  var jsonData;

  try {
    jsonData = JSON.parse(textareaValue);
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData]; // Si es solo un objeto, coloca el objeto dentro de un array
    }
  } catch (error) {
    showError();
    return;
  }
  // Destruir la instancia actual de DataTables
  if ($.fn.DataTable.isDataTable('#myTable')) {
    $('#myTable').DataTable().destroy();
  }

  var flatten = flattenJSON(jsonData);
  convertJSONToArrayOfArrays(flatten);
  // Inicializar DataTables nuevamente en la nueva tabla
  $('#myTable').DataTable();
}

function hiddenTable() {
  $('#tableContainer').addClass('hidden');
}


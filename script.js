// Esperar a que se cargue el DOM
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("myForm");

  // Evitar que el formulario se envíe al presionar Enter
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
});

// Función para descargar un archivo CSV
function downloadCSV() {
  var textareaValue = document.getElementById("myTextarea").value;
  var jsonData;

  try {
    textareaValue = textareaValue.replace(/'/g, "\"");
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
  var csvFile = createCsvFile(csvData);
  downloadFile(csvFile, "data_csv.csv");
}

// Función para descargar un archivo XLSX
function downloadXLSX() {
  var textareaValue = document.getElementById("myTextarea").value;
  var jsonData;

  try {
    textareaValue = textareaValue.replace(/'/g, "\"");
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


// Función para convertir un JSON a un array de arrays
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

// Obtener referencias a los elementos del DOM
const textarea = document.getElementById("myTextarea");
const csvButton = document.getElementById("csvButton");
const xlsxButton = document.getElementById("xlsxButton");

// Función para verificar si el textarea está vacío
function isTextareaEmpty() {
  return textarea.value.trim() === "";
}

// Función para verificar si el texto en el textarea es un JSON válido
function isTextareaValidJson() {
  try {
    var parsedData = JSON.parse(textarea.value.replace(/'/g, "\""));
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
  } else {
    csvButton.disabled = false;
    xlsxButton.disabled = false;
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
  toggleButtons();

  if (!isTextareaEmpty() && !isTextareaValidJson()) {
    showError();
  } else {
    hideError();
  }
});

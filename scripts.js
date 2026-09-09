const CATEGORIES = ["All", "SPDLo0", "SPDLo3"];

const VARIABLES = [
  "Agg",
  "Counts",
  "DAgg",
  "DFlux",
  "DSST",
  "DVec",
  "Flux",
  "SST",
  "Vec",
  "VertDef1",
  "VertDef2",
  "VertDiv",
  "VertMixLen",
  "VertMixr",
  "VertMixrhdiff",
  "VertMixri",
  "VertMixrl",
  "VertMixrtend",
  "VertMixrvdiff",
  "VertPres",
  "VertPreslap",
  "VertPresx",
  "VertPresy",
  "VertQKE",
  "VertTpot",
  "VertTpothdiff",
  "VertTpotlap",
  "VertTpottend",
  "VertTpotvdiff",
  "VertTpotx",
  "VertTpoty",
  "VertU",
  "VertUadvMixr",
  "VertUadvTpot",
  "VertUadvU",
  "VertUadvV",
  "VertUadvW",
  "VertUageo",
  "VertUgeo",
  "VertUhdiff",
  "VertUtend",
  "VertUvdiff",
  "VertV",
  "VertVadvMixr",
  "VertVadvTpot",
  "VertVadvU",
  "VertVadvV",
  "VertVadvW",
  "VertVageo",
  "VertVgeo",
  "VertVhdiff",
  "VertVort",
  "VertVtend",
  "VertVvdiff",
  "VertW",
  "VertWadvMixr",
  "VertWadvTpot",
  "VertWadvU",
  "VertWadvV",
  "VertWadvW",
  "VertWhdiff",
  "VertWtend",
  "VertWvdiff",
  "VertadvMixr",
  "VertadvTpot",
  "VertadvU",
  "VertadvV",
  "VertadvW",
  "VerthadvMixr",
  "VerthadvTpot",
  "VerthadvU",
  "VerthadvV",
  "VerthadvW",
  "VertnoAdvTpottend",
  "VertnoadvMixrtend",
  "VertnoadvUtend",
  "VertnoadvVtend",
  "VertnoadvWtend",
  "VertxCor",
  "VertxCorrageo",
  "VertxPGF",
  "VertyCor",
  "VertyCorrageo",
  "VertyPGF",
  "VertzCor",
  "VertzPGF"
];

function populateDropdown(selectEl, items) {
  for (const item of items) {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    selectEl.appendChild(option);
  }
}

function updateImage() {
  const variable = document.getElementById("variable-select").value;
  const category = document.getElementById("category-select").value;
  const image = document.getElementById("viewer-image");
  image.src = `static/img/nofilt_unbinned/${category}/${variable}.png`;
  image.alt = `${variable} (${category})`;
}

function init() {
  const variableSelect = document.getElementById("variable-select");
  const categorySelect = document.getElementById("category-select");

  populateDropdown(variableSelect, VARIABLES);
  populateDropdown(categorySelect, CATEGORIES);

  variableSelect.addEventListener("change", updateImage);
  categorySelect.addEventListener("change", updateImage);

  updateImage();
}

document.addEventListener("DOMContentLoaded", init);

// GraniteSky Dispatch Center - Storage Module

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getLoads() {
  return getData("gsLoads");
}

function saveLoads(data) {
  saveData("gsLoads", data);
}

function getDrivers() {
  return getData("gsDrivers");
}

function saveDrivers(data) {
  saveData("gsDrivers", data);
}

function getTrucks() {
  return getData("gsTrucks");
}

function saveTrucks(data) {
  saveData("gsTrucks", data);
}

function getCompanies() {
  return getData("gsCompanies");
}

function saveCompanies(data) {
  saveData("gsCompanies", data);
}

function getCarriers() {
  return getData("gsCarriers");
}

function saveCarriers(data) {
  saveData("gsCarriers", data);
}

function getDocuments() {
  return getData("gsDocuments");
}

function saveDocuments(data) {
  saveData("gsDocuments", data);
}

function getMessages() {
  return getData("gsMessages");
}

function saveMessages(data) {
  saveData("gsMessages", data);
}

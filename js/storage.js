// GraniteSky Dispatch Center - Storage Module with IDs

function generateId(prefix = "gs") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function ensureIds(key, prefix) {
  const records = getData(key);
  let changed = false;

  const updated = records.map(record => {
    if (!record.id) {
      record.id = generateId(prefix);
      changed = true;
    }
    return record;
  });

  if (changed) saveData(key, updated);
  return updated;
}

function getLoads() { return ensureIds("gsLoads", "load"); }
function saveLoads(data) { saveData("gsLoads", data); }

function getDrivers() { return ensureIds("gsDrivers", "driver"); }
function saveDrivers(data) { saveData("gsDrivers", data); }

function getTrucks() { return ensureIds("gsTrucks", "truck"); }
function saveTrucks(data) { saveData("gsTrucks", data); }

function getCompanies() { return ensureIds("gsCompanies", "company"); }
function saveCompanies(data) { saveData("gsCompanies", data); }

function getCarriers() { return ensureIds("gsCarriers", "carrier"); }
function saveCarriers(data) { saveData("gsCarriers", data); }

function getDocuments() { return ensureIds("gsDocuments", "document"); }
function saveDocuments(data) { saveData("gsDocuments", data); }

function getMessages() { return ensureIds("gsMessages", "message"); }
function saveMessages(data) { saveData("gsMessages", data); }

function getUsers() { return ensureIds("gsUsers", "user"); }
function saveUsers(data) { saveData("gsUsers", data); }

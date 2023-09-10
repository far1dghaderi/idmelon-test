var deviceManager = new sdk.DeviceManager();
var configurationFlags = new sdk.ConfigurationFlags();
var idBItCounts = new sdk.IdBItCounts();
var isDeviceConnect = false;
var actConfig;

if (navigator.serviceWorker) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err));
    });
}
async function connect() {
    isDeviceConnect = await deviceManager.connect();
    if (isDeviceConnect) {
        alert("Device Connected!");
        let partnumber = await deviceManager.getPartNumber();
        await deviceManager.readCFG();
        actConfig = await deviceManager.getActConfig();
        document.getElementById('config').value = parseInt(actConfig) - 1;
        await getCfgFlags_bHaltKBSnd();
        await getLeadParityBitCnt();
        await getTrailParityBitCnt();
        WriteLog(partnumber, "vendor");
        WriteLog(actConfig, "actConfigID");
    }
}

async function decreaseLeadParityBitCnt() {
    let currentLPValue = parseInt(document.getElementById('leadParityBitCnt').value);
    if (currentLPValue > 0 && currentLPValue <= 142) {
        document.getElementById('leadParityBitCnt').value = currentLPValue - 1;
        await setLeadParityBitCnt(currentLPValue - 1);
    }
}

async function decreaseTrailParityBitCnt() {
    let currentTPValue = parseInt(document.getElementById('trailParityBitCnt').value);
    if (currentTPValue > 0 && currentTPValue <= 142) {
        document.getElementById('trailParityBitCnt').value = currentTPValue - 1;
        await setTrailParityBitCnt(currentTPValue - 1);
    }
}

async function increaseLeadParityBitCnt() {
    let currentLPValue = parseInt(document.getElementById('leadParityBitCnt').value);
    if (currentLPValue >= 0 && currentLPValue < 142) {
        document.getElementById('leadParityBitCnt').value = currentLPValue + 1;
        await setLeadParityBitCnt(currentLPValue + 1);
        return;
    }
    if (isNaN(currentLPValue)) {
        document.getElementById('leadParityBitCnt').value = 1;
    }
}

async function increaseTrailParityBitCnt() {
    let currentTPValue = parseInt(document.getElementById('trailParityBitCnt').value);
    if (currentTPValue >= 0 && currentTPValue < 142) {
        document.getElementById('trailParityBitCnt').value = currentTPValue + 1;
        await setTrailParityBitCnt(currentTPValue + 1);
        return;
    }
    if (isNaN(currentTPValue)) {
        document.getElementById('trailParityBitCnt').value = 1;
    }
}

async function setLeadParityBitCnt(LPValue) {
    if (isNaN(LPValue)) {
        document.getElementById('leadParityBitCnt').value = 0;
        await idBItCounts.setIDBitCnts_iLeadParityBitCnt(0, actConfig - 1);
        return;
    }
    await idBItCounts.setIDBitCnts_iLeadParityBitCnt(LPValue, actConfig - 1);
}

async function setTrailParityBitCnt(TPValue) {
    if (isNaN(TPValue)) {
        document.getElementById('trailParityBitCnt').value = 0;
        await idBItCounts.setIDBitCnts_iTrailParityBitCnt(0, actConfig - 1);
        return;
    }
    await idBItCounts.setIDBitCnts_iTrailParityBitCnt(TPValue, actConfig - 1);
}

async function getLeadParityBitCnt() {
    let leadValue = await idBItCounts.getIDBitCnts_iLeadParityBitCnt(actConfig - 1);
    document.getElementById('leadParityBitCnt').value = parseInt(leadValue);
}

async function getTrailParityBitCnt() {
    let trailValue = await idBItCounts.getIDBitCnts_iTrailParityBitCnt(actConfig - 1);
    document.getElementById('trailParityBitCnt').value = parseInt(trailValue);
}

async function setActConfig() {
    if (isDeviceConnect) {
        let selectConfig = document.getElementById("config");
        let getConfig = parseInt(selectConfig.value);
        await deviceManager.setActConfig(getConfig);
        actConfig = await deviceManager.getActConfig();
        WriteLog(actConfig, "actConfigID");
        await getLeadParityBitCnt();
        await getTrailParityBitCnt();
        await getCfgFlags_bHaltKBSnd();
    } else {
        alert("No Device Connected");
    }
}

async function getCfgFlags_bHaltKBSnd() {
    let flagValue = await configurationFlags.getCfgFlags_bHaltKBSnd(actConfig - 1);
    document.getElementById('bHaltKBSnd').checked = parseInt(flagValue) ? true : false;
}

async function setCfgFlags_bHaltKBSnd() {
    let bHaltKBSndValue = document.getElementById('bHaltKBSnd').checked;
    await configurationFlags.setCfgFlags_bHaltKBSnd(bHaltKBSndValue, actConfig - 1);
}

async function setCurrActConfig() {
    if (isDeviceConnect) {
        actConfig = parseInt(document.getElementById("config").value) + 1;
        await getLeadParityBitCnt();
        await getTrailParityBitCnt();
        await getCfgFlags_bHaltKBSnd();
    } else {
        alert("No Device Connected");
    }
}

async function writeCFG() {
    if (isDeviceConnect) {
        await setActConfig();
        await deviceManager.writeCFG();
        await deviceManager.readCFG();
        alert("Write Completed!");
    }
    else {
        alert("No Device Connected");
    }
}

async function disconnect() {
    await deviceManager.disconnect();
    resetUI();
    isDeviceConnect = false;
    alert("Device Disconnected!");
}

function resetUI() {
    document.getElementById("vendor").value = '';
    document.getElementById("actConfigID").value = '';
    document.getElementById('bHaltKBSnd').checked = false;
    document.getElementById('trailParityBitCnt').value = '';
    document.getElementById('leadParityBitCnt').value = '';
    document.getElementById('databytes').value = '';
}

async function getActiveID() {
    if (isDeviceConnect) {
        let DataBytes = await deviceManager.getDataBytes();
        if (DataBytes === 0) {
            WriteLog("No Card on Reader", "databytes");
            return;
        }
        let activeID = await deviceManager.getActiveID();
        let cardByte = 'ID:' + DataBytes + " Bits" + '\n' + activeID;
        WriteLog(cardByte, "databytes");
    }
    else {
        alert("No Device Connected");
    }
}

async function getActiveID32() {
    if (isDeviceConnect) {
        let DataBytes = await deviceManager.getDataBytes();
        if (DataBytes === 0) {
            WriteLog("No Card on Reader", "databytes");
            return;
        }
        let getActiveID = await deviceManager.getActiveID32();
        let getActiveIDdata = getActiveID.split('');
        let data1 = getActiveIDdata.splice(0, 23).join('');
        let data2 = getActiveIDdata.splice(1, 23).join('');
        let data3 = getActiveIDdata.splice(2, 23).join('');
        let data4 = getActiveIDdata.splice(3, 23).join('');
        let dataBytes = "ID: " + DataBytes + " Bits" + `\n` + data1 + `\n` + data2 + `\n` + data3 + `\n` + data4;
        WriteLog(dataBytes, "databytes");
    }
    else {
        alert("No Device Connected");
    }
}

function WriteLog(message, id) {
    log = document.getElementById(id);
    log.value = message;
    log.scrollTop = log.scrollHeight;
}

async function getLastLibErr() {
    let errorCode = await deviceManager.getLastLibErr();
    alert(errorCode);
}
var mainbtn = document.getElementById("choosebtn");
var selectedMode = null;

function setBtn(mode) {
    if (selectedMode == mode) {
        mainbtn.innerHTML = `
                <span>Selected</span>
                <i class="msr">radio_button_checked</i>`;
    } else {
        mainbtn.innerHTML = `
                <span>Select</span>
                <i class="msr">radio_button_unchecked</i>`;
    }
}

var thresholdValues = {
    summer: { solar_low: 4.5, samples_solar: 2, samples_moist: 3, temp_req: true, temp_threshold: 30 },
    rainy: { solar_low: 2.5, samples_solar: 5, samples_moist: 2, temp_req: true, temp_threshold: 30 },
    autumn: { solar_low: 4, samples_solar: 3, samples_moist: 4, temp_req: true, temp_threshold: 30 },
    winter: { solar_low: 2, samples_solar: 5, samples_moist: 3, temp_req: true, temp_threshold: 15 },
    default: { solar_low: 2.5, samples_solar: 3, samples_moist: 2, temp_req: true, temp_threshold: 25 }
};

function getThresholds() {
    return thresholdValues[selectedMode || "default"];
}

document.addEventListener('deviceready', () => {
    console.log("Device ready, bluetoothSerial available:", typeof bluetoothSerial);

    const address = document.getElementById("macinput");
    document.getElementById("pairBtn").addEventListener("click", () => {
        bluetoothSerial.connect(address.value,
            () => {
                console.log("Connected");
                document.getElementById("connectstatement").innerText = "Smart system connected!"
                document.getElementById("pairBtn").innerHTML = `<i class="msr">check</i>`
                document.getElementById("connectform").classList.add("connectedstate");
                bluetoothSerial.subscribe('\n', data => {
                    if (data == "solarpumpMalfucnt") {
                        notify(`solar pump`, " 🔵 Solar pump may have a malfunction.")
                    } else if (data == "soilpumpMalfucnt") {
                        notify(`soil pump`, " 🟢 Soil pump may have a malfunction. ")
                    }
                });
            },
            err => console.error("Connection failed", err)
        );
    });

    mainbtn.addEventListener("click", () => {
        selectedMode = selectedMode === window.currentMode ? null : window.currentMode;
        sendThreshold();
        setBtn(window.currentMode);
        logit("Mode changed to " + window.currentMode)
    });

    function sendThreshold() {
        const t = getThresholds();
        const msg = `SOLAR:${t.solar_low},MOIST:${t.samples_moist},TEMP_REQ:${t.temp_req ? 1 : 0},TEMP_TH:${t.temp_threshold}\n`;
        bluetoothSerial.write(msg,
            () => console.log("Sent:", msg),
            err => console.error("Send failed", err)
        );
    }
});

function notify(withwhat, desc) {
    var alerts = document.getElementById("alerts");

    var notif = document.createElement("div");
    notif.classList.add("sing_notif", "sing_alert");

    var title = document.createElement("span");
    title.className = "title";

    var icon = document.createElement("i");
    icon.className = "msr icn";
    icon.textContent = "report";

    var issue = document.createElement("div");
    issue.className = "issue";
    issue.textContent = `Issue detected with ${withwhat}`;

    var closeBtn = document.createElement("div");
    closeBtn.className = "msr";
    closeBtn.textContent = "close";
    closeBtn.onclick = () => {
        notif.remove();
        updateAlertCounter();
    }

    title.appendChild(icon);
    title.appendChild(issue);
    title.appendChild(closeBtn);

    var descP = document.createElement("p");
    descP.textContent = desc;

    notif.appendChild(title);
    notif.appendChild(descP);

    alerts.appendChild(notif);

    alerts.scrollTop = alerts.scrollHeight;

    updateAlertCounter();
}

function logit(text) {
    document.getElementById("logs").innerHTML += `<div class="sing_notif">
                    ${text}
                </div>`
}

function updateAlertCounter() {
    let alertslen = [...document.getElementsByClassName("sing_alert")].length;
    document.getElementById("alertsBadge").innerText = alertslen;
    if (alertslen == 0) {
    document.getElementById("alertsBadge").style.display = "none";
    } else {
    document.getElementById("alertsBadge").style.display = "flex";
    }
}

updateAlertCounter();
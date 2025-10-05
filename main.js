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

mainbtn.addEventListener("click", () => {
    if (selectedMode == currentMode) {
        selectedMode = null;
    } else {
        selectedMode = currentMode;
    }
    setBtn(currentMode);
});

var thresholdValues = {
    "summer": {
        samples_solar: 2,
        samples_moist: 3,
        temp_req: true,
        temp_threshold: 30
    },
    "rainy": {
        samples_solar: 5,
        samples_moist: 2,
        temp_req: true,
        temp_threshold: 30
    },
    "autumn": {
        samples_solar: 3,
        samples_moist: 4,
        temp_req: true,
        temp_threshold: 30
    },
    "winter": {
        samples_solar: 5,
        samples_moist: 3,
        temp_req: true,
        temp_threshold: 15
    },
    "default": {
        samples_solar: 3,
        samples_moist: 2,
        temp_req: true,
        temp_threshold: 25
    }
}

function getThresholds() {
    return thresholdValues[(selectedMode) ? selectedMode : "default"];
}

function pairDevice() {
    document.addEventListener('deviceready', () => {
    const address = document.getElementById("macinput");

    bluetoothSerial.connect(address.value , () => {
        console.log("Connected")
        bluetoothSerial.subscribe('\n', data => {
            console.log("Received:", data)
            document.getElementById('output').textContent += data
        })
    }, err => console.error("Connection failed", err))
});
}

function sendThreshold() {
    const t = getThresholds()
    const msg = `SOLAR:${t.samples_solar},MOIST:${t.samples_moist},TEMP_REQ:${t.temp_req ? 1 : 0},TEMP_TH:${t.temp_threshold}\n`
    bluetoothSerial.write(msg, () => console.log("Sent:", msg), err => console.error("Send failed", err))
}

function showwindow(name) {
    const c = document.getElementById("c")
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        win.style.display = win.id === name ? 'flex' : 'none';
    });
    if (name == "home") {
        c.style.display = "block";
        setGradient(currentMode);
    } else {
        c.style.display = "none";
        document.body.style.backgroundImage = `linear-gradient(rgb(31, 31, 31), rgb(31 31 31))`;
    }
}

showwindow('home');
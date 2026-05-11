// ==========================================
// STATE MANAGEMENT & USER PROFILE
// ==========================================
const State = {
    childName: "Alex",
    childAge: 6,
    guardianPhone: "555-0199",
    
    // Auto Sensor States
    childTemp: 98.4,
    uvIndex: 4.2,
    
    isBreakActive: false,
    isLostActive: false,
    breakTimeRemaining: 0,
    breakInterval: null,
};

// ==========================================
// DOM ELEMENTS
// ==========================================
// Views
const onboardingView = document.getElementById('onboarding-view');
const mainDashboard = document.getElementById('main-dashboard');
const regForm = document.getElementById('registration-form');

// Parent Info Display
const dashChildName = document.getElementById('dash-child-name');
const dashChildAge = document.getElementById('dash-child-age');
const watchParentPhone = document.getElementById('watch-parent-phone');

// Watch Components
const watchTemp = document.getElementById('watch-temp');
const watchUv = document.getElementById('watch-uv');
const watchScreen = document.getElementById('watch-screen');
const watchAlertOverlay = document.getElementById('watch-alert');
const watchTimerOverlay = document.getElementById('watch-timer');
const watchLostOverlay = document.getElementById('watch-lost');
const watchTime = document.getElementById('watch-time');
const mascotIcon = document.getElementById('mascot-icon');
const watchStatusText = document.getElementById('watch-status-text');

// Parent Components
const parentTemp = document.getElementById('parent-temp');
const parentUv = document.getElementById('parent-uv');
const parentTempCard = document.getElementById('parent-temp-card');
const parentUvCard = document.getElementById('parent-uv-card');
const overallStatusLed = document.getElementById('overall-status-led');
const overallStatusText = document.getElementById('overall-status-text');

// ==========================================
// REGISTRATION / ONBOARDING LOGIC
// ==========================================
regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Grab data
    State.childName = document.getElementById('reg-child-name').value;
    State.childAge = document.getElementById('reg-child-age').value;
    State.guardianPhone = document.getElementById('reg-guardian-phone').value;
    
    // Setup Dash
    dashChildName.innerText = State.childName;
    dashChildAge.innerText = State.childAge;
    watchParentPhone.innerText = State.guardianPhone;
    
    // Transition UI
    onboardingView.style.opacity = '0';
    onboardingView.style.transform = 'translateY(-20px) scale(0.95)';
    setTimeout(() => {
        onboardingView.style.display = 'none';
        mainDashboard.style.display = 'flex';
        // Start Hardware Simulation after login
        startHardwareSimulation();
    }, 500);
});

// ==========================================
// WATCH CLOCK LOGIC
// ==========================================
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let mins = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    mins = mins < 10 ? '0' + mins : mins;
    watchTime.innerText = `${hours}:${mins} ${ampm}`;
}
setInterval(updateClock, 30000);
updateClock();

// ==========================================
// HARDWARE SENSOR SIMULATION ENGINE
// ==========================================
let spikeTimer = 0;
const SPIKE_INTERVAL = 45; // seconds between sudden danger demos

function startHardwareSimulation() {
    setInterval(() => {
        if (State.isLostActive || State.isBreakActive) return;

        spikeTimer++;
        
        // Regular gentle drifting physics
        if (spikeTimer < SPIKE_INTERVAL) {
            // Drift towards normal (98.6 and UV 4)
            State.childTemp += (1 - Math.random() * 2) * 0.1; 
            State.uvIndex += (1 - Math.random() * 2) * 0.2;
            
            // Safety bounds for normal play
            if(State.childTemp < 97.5) State.childTemp = 97.5;
            if(State.childTemp > 99.2) State.childTemp = 99.2;
            if(State.uvIndex < 2) State.uvIndex = 2;
            if(State.uvIndex > 5.5) State.uvIndex = 5.5;
        } 
        // Force a spike for presentation purposes
        else if (spikeTimer === SPIKE_INTERVAL) {
            State.childTemp = 101.5; // High fever / heatstroke domain
            State.uvIndex = 9.5;     // Extreme UV
        }
        else if (spikeTimer > SPIKE_INTERVAL + 10) {
            // Reset spike after 10 seconds of danger
            spikeTimer = 0;
            State.childTemp = 98.6;
            State.uvIndex = 4.0;
        }

        updateSystemState();
    }, 1000); // Ticks every 1 second
}

// core sync engine
function updateSystemState() {
    // Update Text Values
    watchTemp.innerText = `${State.childTemp.toFixed(1)}°`;
    watchUv.innerText = `UVI ${State.uvIndex.toFixed(1)}`;
    parentTemp.innerText = `${State.childTemp.toFixed(1)}`;
    parentUv.innerText = State.uvIndex.toFixed(1);

    // Evaluate Risk Levels
    let heatRisk = 'safe';
    if (State.childTemp > 99.5 && State.childTemp <= 100.5) heatRisk = 'warning';
    if (State.childTemp > 100.5) heatRisk = 'danger';

    let uvRisk = 'safe';
    if (State.uvIndex >= 6 && State.uvIndex < 8) uvRisk = 'warning';
    if (State.uvIndex >= 8) uvRisk = 'danger';

    // Update UI Cards
    parentTempCard.className = `vital-item ${heatRisk === 'safe' ? '' : heatRisk}`;
    parentUvCard.className = `vital-item ${uvRisk === 'safe' ? '' : uvRisk}`;

    if (heatRisk === 'danger' || uvRisk === 'danger') {
        overallStatusLed.className = 'status-indicator danger-led';
        overallStatusText.innerText = 'CRITICAL: Heat/UV Hazardous!';
        watchScreen.style.boxShadow = 'inset 0 0 40px rgba(231, 76, 60, 0.8)';
        
        mascotIcon.className = 'ph-fill ph-smiley-sad'; // Change to sad/hot face
        mascotIcon.style.color = '#e74c3c';
        watchStatusText.innerText = "Too Hot!";
        watchStatusText.style.color = '#e74c3c';

        if(!State.isBreakActive && !State.isLostActive && !watchAlertOverlay.classList.contains('active')) {
            window.sendAlert('DANGER!', 'Seek shelter and drink water NOW.', 'ph-warning-circle', 'red');
        }
    } else if (heatRisk === 'warning' || uvRisk === 'warning') {
        overallStatusLed.className = 'status-indicator warn-led';
        overallStatusText.innerText = 'Warning: Condition Elevating';
        watchScreen.style.boxShadow = 'inset 0 0 30px rgba(243, 156, 18, 0.6)';
        
        mascotIcon.className = 'ph-fill ph-smiley-nervous';
        mascotIcon.style.color = '#f39c12';
        watchStatusText.innerText = "Getting Warm...";
        watchStatusText.style.color = '#f39c12';
    } else {
        overallStatusLed.className = 'status-indicator safe';
        overallStatusText.innerText = 'Sensors Nominal / Safe';
        watchScreen.style.boxShadow = 'inset 0 0 25px rgba(0,0,0,0.6)';
        
        mascotIcon.className = 'ph-fill ph-sun';
        mascotIcon.style.color = '#ffb703';
        watchStatusText.innerText = "Playing Safely!";
        watchStatusText.style.color = '#45aaf2';
    }
}

// ==========================================
// FEATURE TRIGGERS
// ==========================================

// Messaging
window.sendAlert = function(title, desc, iconRaw, color) {
    if(State.isBreakActive || State.isLostActive) return;
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-desc').innerText = desc;
    
    const iconEl = document.getElementById('alert-icon');
    iconEl.innerHTML = `<i class="ph-fill ${iconRaw}"></i>`;
    
    if(color === 'red') iconEl.style.color = '#e74c3c';
    else if(color === 'orange') iconEl.style.color = '#e67e22';
    else if(color === 'blue') iconEl.style.color = '#3498db';
    else if(color === 'green') iconEl.style.color = '#2ecc71';
    
    watchAlertOverlay.classList.add('active');
};

document.getElementById('btn-ok').addEventListener('click', () => {
    watchAlertOverlay.classList.remove('active');
    // If the system triggered this auto, reset the spike timer manually
    if(spikeTimer >= SPIKE_INTERVAL) {
        spikeTimer = SPIKE_INTERVAL + 11; // Push it to reset zone
    }
});

// Break Mode
window.triggerBreak = function() {
    if(State.isBreakActive || State.isLostActive) return;
    watchAlertOverlay.classList.remove('active'); // cancel active alerts
    
    State.isBreakActive = true;
    State.breakTimeRemaining = 600; // 10 mins
    watchTimerOverlay.classList.add('active');
    updateTimerUI();
    
    State.breakInterval = setInterval(() => {
        State.breakTimeRemaining--;
        updateTimerUI();
        if(State.breakTimeRemaining <= 0) {
            clearInterval(State.breakInterval);
            State.isBreakActive = false;
            watchTimerOverlay.classList.remove('active');
        }
    }, 1000);
};

function updateTimerUI() {
    const mins = Math.floor(State.breakTimeRemaining / 60);
    const secs = State.breakTimeRemaining % 60;
    document.getElementById('countdown-text').innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    
    const circle = document.querySelector('.progress-ring__circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (State.breakTimeRemaining / 600) * circumference;
    circle.style.strokeDashoffset = offset;
}

// Lost Mode (Triggers from App OR Watch)
window.triggerLostMode = function() {
    State.isLostActive = true;
    watchAlertOverlay.classList.remove('active');
    watchTimerOverlay.classList.remove('active');
    
    watchLostOverlay.classList.add('active');
    overallStatusLed.className = 'status-indicator danger-led';
    overallStatusText.innerText = 'CRITICAL: CHILD LOST MODE ACTIVE';
};

document.getElementById('btn-watch-sos').addEventListener('click', () => {
    triggerLostMode();
});

document.getElementById('btn-found').addEventListener('click', () => {
    State.isLostActive = false;
    watchLostOverlay.classList.remove('active');
    updateSystemState(); // Re-evals the sensors to set LED back to normal
});

// Tabs Logic
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        const targetId = e.target.getAttribute('data-target');
        document.getElementById('camera-view').classList.add('hidden');
        document.getElementById('map-view').classList.add('hidden');
        document.getElementById(targetId).classList.remove('hidden');
    });
});

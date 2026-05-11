document.addEventListener('DOMContentLoaded', () => {

    const btnStart = document.getElementById('btn-start-build');
    const stageBom = document.getElementById('stage-bom');
    const stageBuild = document.getElementById('stage-build');

    // Video Timeline State
    let currentStep = 1;
    const totalSteps = 6;
    
    // UI Elements
    const btnNext = document.getElementById('btn-next');
    const btnBack = document.getElementById('btn-back');
    const progressBar = document.getElementById('vid-progress');
    const stepCountText = document.getElementById('step-count-text');
    const stepTitle = document.getElementById('step-title');
    const stepDescContainer = document.getElementById('step-desc-container');

    // Layers & Wires
    const layerEsp = document.getElementById('layer-esp');
    const layerBatt = document.getElementById('layer-batt');
    const layerGps = document.getElementById('layer-gps');
    const layerTemp = document.getElementById('layer-temp');
    const layerUv = document.getElementById('layer-uv');
    const wireVcc = document.getElementById('wire-vcc');
    const wireGnd = document.getElementById('wire-gnd');

    // Content Database
    const stepData = {
        1: {
            title: "The Foundation: Main Board",
            desc: `
                <div class="micro-detail-box">
                    <p>Place the <strong>ESP32-CAM</strong> board face up.</p>
                    <ul>
                        <li>This board has built-in WiFi, Bluetooth, and handles the Camera.</li>
                        <li><strong>Micro-Detail:</strong> Ensure you do not scratch the tiny golden camera ribbon cable attached to the top.</li>
                    </ul>
                </div>
            `,
            execute: () => {
                layerEsp.classList.add('active');
                layerBatt.classList.remove('active');
                wireVcc.classList.remove('active');
                wireGnd.classList.remove('active');
                wireVcc.classList.add('hidden');
                wireGnd.classList.add('hidden');
            }
        },
        2: {
            title: "Adding Power: LiPo Battery",
            desc: `
                <div class="micro-detail-box">
                    <p>Connect the 3.7V 400mAh LiPo battery.</p>
                    <ul>
                        <li><span class="pin">RED WIRE</span> goes to the <span class="pin">5V / VIN</span> pin.</li>
                        <li><span class="pin">BLACK WIRE</span> goes to any <span class="pin">GND</span> pin.</li>
                        <li><strong>Micro-Detail:</strong> Solder carefully! LiPo batteries are sensitive to heat.</li>
                    </ul>
                </div>
            `,
            execute: () => {
                layerBatt.classList.add('active');
                wireVcc.classList.remove('hidden');
                wireGnd.classList.remove('hidden');
                setTimeout(() => {
                    wireVcc.classList.add('active');
                    wireGnd.classList.add('active');
                }, 200);
                layerGps.classList.remove('active');
            }
        },
        3: {
            title: "Location Tracking: NEO-6M GPS",
            desc: `
                <div class="micro-detail-box">
                    <p>Add the NEO-6M GPS Module. This enables the "Lost Mode" radar.</p>
                    <ul>
                        <li><span class="pin">TXD</span> &rarr; ESP32 <span class="pin">RX (Pin 3)</span></li>
                        <li><span class="pin">RXD</span> &rarr; ESP32 <span class="pin">TX (Pin 1)</span></li>
                        <li><strong>Micro-Detail:</strong> The big square ceramic piece is the antenna. It MUST face directly upwards toward the sky, not blocked by the battery.</li>
                    </ul>
                </div>
            `,
            execute: () => {
                layerGps.classList.add('active');
                layerTemp.classList.remove('active');
            }
        },
        4: {
            title: "Internal Health: Body Temp Sensor",
            desc: `
                <div class="micro-detail-box">
                    <p>Wiring the MAX30205 Body Temp Sensor.</p>
                    <ul>
                        <li><span class="pin">SCL</span> &rarr; ESP32 <span class="pin">Pin 14</span> (I2C Clock)</li>
                        <li><span class="pin">SDA</span> &rarr; ESP32 <span class="pin">Pin 15</span> (I2C Data)</li>
                        <li><strong>Micro-Detail:</strong> Mount this sensor on the bottom of your watch case so it makes direct physical contact with the child's wrist.</li>
                    </ul>
                </div>
            `,
            execute: () => {
                layerTemp.classList.add('active');
                layerUv.classList.remove('active');
            }
        },
        5: {
            title: "External Threat: UV Sensor",
            desc: `
                <div class="micro-detail-box">
                    <p>Finally, we add the VEML6075 UV Sensor to detect sunburn risks.</p>
                    <ul>
                        <li>This is also an I2C device. Wire its <span class="pin">SDA / SCL</span> in parallel with the Temp Sensor to pins 14 and 15 on the ESP32!</li>
                        <li><strong>Micro-Detail:</strong> Cut a small hole in the top of your watch case and cover it with clear acrylic so the UV light can hit the tiny optical chip without getting wet.</li>
                    </ul>
                </div>
            `,
            execute: () => {
                layerUv.classList.add('active');
            }
        },
        6: {
            title: "Assembly Complete!",
            desc: `
                <div class="micro-detail-box">
                    <p><strong>System Ready!</strong></p>
                    <p>All modules are stacked: The ESP32-CAM processes data, the GPS tracks satellites, and the Temp/UV sensors protect the child.</p>
                    <p>Next steps: Solder everything to a perfboard, flash the software, and secure it in a 3D printed smartwatch case!</p>
                </div>
            `,
            execute: () => {
                // Final celebration animations
                layerUv.classList.add('active');
                document.querySelectorAll('.comp-img').forEach(el => {
                    el.style.filter = 'drop-shadow(0 0 20px rgba(16, 172, 132, 0.8))';
                });
            }
        }
    };

    function renderStep() {
        // Boundaries
        if(currentStep < 1) currentStep = 1;
        if(currentStep > totalSteps) currentStep = totalSteps;

        // UI Updates
        stepCountText.innerText = `Phase ${currentStep} of ${totalSteps}`;
        progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
        
        const data = stepData[currentStep];
        stepTitle.innerText = data.title;
        stepDescContainer.innerHTML = data.desc;
        
        // Execute visual canvas updates
        data.execute();

        // Button States
        btnBack.style.opacity = currentStep === 1 ? '0.5' : '1';
        btnNext.innerHTML = currentStep === totalSteps ? 'Finish <i class="ph-bold ph-check"></i>' : 'Next Step <i class="ph-bold ph-skip-forward"></i>';
    }

    // Start Build sequence
    btnStart.addEventListener('click', () => {
        const stageResearch = document.getElementById('stage-research');
        if(stageResearch) {
            stageResearch.style.opacity = '0';
            stageResearch.style.transform = 'scale(0.95)';
        }
        
        stageBom.style.opacity = '0';
        stageBom.style.transform = 'scale(0.95)';
        setTimeout(() => {
            stageBom.classList.add('hidden');
            if(stageResearch) stageResearch.classList.add('hidden');
            
            stageBuild.classList.remove('hidden');
            renderStep();
        }, 500);
    });

    btnNext.addEventListener('click', () => {
        if(currentStep < totalSteps) {
            currentStep++;
            renderStep();
        } else {
            alert("Congratulations! You have completed the ECE Hardware Blueprint for HelioGuard.");
        }
    });

    btnBack.addEventListener('click', () => {
        if(currentStep > 1) {
            currentStep--;
            renderStep();
        }
    });

});

// ==========================================
// AI CHATBOT LOGIC (Mocked Local Brain)
// ==========================================
window.toggleChat = function() {
    const chatWindow = document.getElementById('ai-chat-window');
    chatWindow.classList.toggle('open');
    const icon = document.getElementById('chat-toggle-icon');
    icon.className = chatWindow.classList.contains('open') ? 'ph-bold ph-caret-down' : 'ph-bold ph-caret-up';
};

window.handleChatEnter = function(e) {
    if(e.key === 'Enter') sendChatMessage();
};

window.sendChatMessage = function() {
    const input = document.getElementById('ai-input');
    const text = input.value.trim();
    if(!text) return;

    appendMessage('user-msg', text);
    input.value = '';

    // Scroll to bottom
    const body = document.getElementById('chat-messages');
    body.scrollTop = body.scrollHeight;

    // Simulate thinking delay
    setTimeout(() => {
        const reply = processAiLogic(text.toLowerCase());
        appendMessage('ai-msg', reply);
        body.scrollTop = body.scrollHeight;
    }, 600);
};

function appendMessage(type, htmlContent) {
    const body = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${type}`;
    msgDiv.innerHTML = `<p>${htmlContent}</p>`;
    body.appendChild(msgDiv);
}

// Basic hardcoded AI logic for CSE students learning ECE
function processAiLogic(query) {
    if(query.includes("gnd") || query.includes("ground")) {
        return "<strong>GND (Ground)</strong> is the common return path for electrical current. Think of it as 0 Volts. Every component in your watch MUST connect their GND pins together so they share the same reference voltage!";
    }
    if(query.includes("vcc") || query.includes("vin") || query.includes("power")) {
        return "<strong>VCC / VIN</strong> are power pins. They supply voltage (like 3.3V or 5V) from your battery to the microchip.";
    }
    if(query.includes("i2c") || query.includes("sda") || query.includes("scl")) {
        return "<strong>I2C</strong> is a communication protocol (like a mini-network for chips). <strong>SDA</strong> sends data, and <strong>SCL</strong> is the clock that keeps them synced. Both sensors (UV and Temp) can actually share the EXACT SAME SDA and SCL pins, just wire them in parallel!";
    }
    if(query.includes("gps") || query.includes("location")) {
        return "The NEO-6M GPS Module uses serial communication (TX and RX pins). It needs a clear view of the sky right through the plastic to catch satellite signals. Don't cover the ceramic antenna with battery foil!";
    }
    if(query.includes("camera") || query.includes("esp32-cam")) {
        return "The ESP32-CAM is awesome but power-hungry. If your camera feed drops, it usually means your battery isn't supplying enough Amps. Make sure your LiPo is fully charged.";
    }
    if(query.includes("solder") || query.includes("connect")) {
        return "For soldering: Heat the pin and the pad for 2 seconds, then push the solder wire into the joint, NOT onto the iron. It should flow like liquid silver making a smooth 'volcano' shape.";
    }
    if(query.includes("thank") || query.includes("ok")) {
        return "You're welcome! You've got this. Keep building!";
    }
    
    // Default fallback
    return "That's a great question. Since you are dealing with sensitive micro-components, always triple-check that your VCC (Power) and GND (Ground) aren't mixed up before turning the battery on! What specific module do you need help with?";
}

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin');
const ctx = wheel.getContext('2d');
const optionInput = document.getElementById('option-input');
const addOptionBtn = document.getElementById('add-option');
const optionsList = document.getElementById('options-list');

let options = [];
let isSpinning = false;
let currentRotation = 0;
let targetRotation = 0;

const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
    '#E67E22', '#27AE60', '#CC70AB', '#F1C40F'
];

function drawWheel() {
    ctx.clearRect(0, 0, wheel.width, wheel.height);
    
    if (options.length === 0) {
        ctx.beginPath();
        ctx.arc(wheel.width/2, wheel.height/2, 180, 0, Math.PI * 2);
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#f0f0f0';
        ctx.fill();
        return;
    }

    const sliceAngle = (Math.PI * 2) / options.length;
    const centerX = wheel.width / 2;
    const centerY = wheel.height / 2;
    const radius = 180;

    for (let i = 0; i < options.length; i++) {
        const startAngle = i * sliceAngle + currentRotation;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle/2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(options[i], radius - 10, 5);
        ctx.restore();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function addOption() {
    const value = optionInput.value.trim();
    if (value && !options.includes(value)) {
        options.push(value);
        updateOptionsList();
        drawWheel();
        optionInput.value = '';
    }
}

function updateOptionsList() {
    optionsList.innerHTML = '';
    options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerHTML = `
            <span>${option}</span>
            <button class="delete-btn" data-index="${index}">刪除</button>
        `;
        optionsList.appendChild(div);
    });
}

function spin() {
    if (isSpinning || options.length < 2) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    
    const extraSpins = 5; // Additional full rotations
    const randomSlice = Math.random() * (Math.PI * 2);
    targetRotation = currentRotation + (Math.PI * 2 * extraSpins) + randomSlice;
    
    let startTime = null;
    const animationDuration = 5000; // 5 seconds

    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        // Easing function for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentRotation = currentRotation + (targetRotation - currentRotation) * easeOut;
        
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            
            // Calculate and show result
            const normalizedRotation = currentRotation % (Math.PI * 2);
            const sliceAngle = (Math.PI * 2) / options.length;
            const result = options[Math.floor((-normalizedRotation / sliceAngle) % options.length)];
            alert(`結果是: ${result}`);
        }
    }
    
    requestAnimationFrame(animate);
}

// Event Listeners
addOptionBtn.addEventListener('click', addOption);
optionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addOption();
});

optionsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = parseInt(e.target.dataset.index);
        options.splice(index, 1);
        updateOptionsList();
        drawWheel();
    }
});

spinBtn.addEventListener('click', spin);

// Initial draw
drawWheel();


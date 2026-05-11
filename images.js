const imageData = [
    {
        src: 'img1.jpg',
        title: 'Component Structure',
        desc: 'Detailed view of the HelioGuard smartwatch internal structure and features.'
    },
    {
        src: 'img2.jpg',
        title: 'Technical Design Sheet',
        desc: 'Exploded views, top/bottom views, and technical breakdown.'
    },
    {
        src: 'img3.jpg',
        title: 'Engineering Sketches',
        desc: 'Hand-drawn 2D/3D sketches and AutoCAD dimensions.'
    },
    {
        src: 'img4.jpg',
        title: 'Step-by-Step Usage',
        desc: '6-step usage guide and core features overview.'
    }
];

let currentIndex = 0;

function initGallery() {
    const thumbContainer = document.getElementById('thumbnail-container');
    
    // Generate thumbnails dynamically
    imageData.forEach((img, index) => {
        const thumb = document.createElement('div');
        thumb.className = `thumb ${index === 0 ? 'active' : ''}`;
        thumb.onclick = () => goToImage(index);
        
        const imgEl = document.createElement('img');
        imgEl.src = img.src;
        imgEl.alt = img.title;
        // Fallback for thumbnails
        imgEl.onerror = function() {
            this.src = 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=200';
        };
        
        thumb.appendChild(imgEl);
        thumbContainer.appendChild(thumb);
    });
}

function updateMainImage() {
    const mainImg = document.getElementById('main-display');
    const titleEl = document.getElementById('image-title');
    const descEl = document.getElementById('image-desc');
    const overlay = document.querySelector('.glass-overlay');
    
    // Update active thumbnail
    document.querySelectorAll('.thumb').forEach((thumb, index) => {
        if (index === currentIndex) {
            thumb.classList.add('active');
            // Scroll thumbnail into view
            thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else {
            thumb.classList.remove('active');
        }
    });

    // Add fade out effect
    mainImg.classList.remove('slide-in');
    mainImg.classList.add('fade-out');
    
    // Reset overlay animation
    overlay.style.animation = 'none';
    overlay.offsetHeight; // Trigger reflow
    overlay.style.animation = 'slideUpFade 0.6s 0.3s forwards ease';

    setTimeout(() => {
        // Change source and text
        mainImg.src = imageData[currentIndex].src;
        titleEl.textContent = imageData[currentIndex].title;
        descEl.textContent = imageData[currentIndex].desc;
        
        // Add slide in effect
        mainImg.classList.remove('fade-out');
        mainImg.classList.add('slide-in');
    }, 400); // Wait for fade out
}

function goToImage(index) {
    if (index === currentIndex) return;
    currentIndex = index;
    updateMainImage();
}

function nextImage() {
    currentIndex = (currentIndex + 1) % imageData.length;
    updateMainImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + imageData.length) % imageData.length;
    updateMainImage();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
});

// Initialize on load
window.addEventListener('DOMContentLoaded', initGallery);

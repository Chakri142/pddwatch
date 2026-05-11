document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden');
                // Unobserve after showing so it stays visible
                // observer.unobserve(entry.target); 
            } else {
                // Optional: comment this out if you don't want them to hide again when scrolling up
                entry.target.classList.add('hidden');
            }
        });
    }, observerOptions);

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        // Add a slight delay based on index for a staggered effect if they appear together
        item.style.transitionDelay = `${(index % 3) * 0.1}s`;
        observer.observe(item);
    });
});

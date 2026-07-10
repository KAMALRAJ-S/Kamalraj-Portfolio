// ============ GLOBAL VARIABLES ============
let scene, camera, renderer, globe;
let globeAnimationId;
let cursorDot, cursorRing;
const skills = [
    { name: "Python", category: "Languages", angle: 0, phi: 0 },
    { name: "C#", category: "Languages", angle: 60, phi: 30 },
    { name: "JavaScript", category: "Languages", angle: 120, phi: -30 },
    { name: "SQL", category: "Languages", angle: 180, phi: 0 },
    { name: "Django", category: "Backend", angle: 240, phi: 45 },
    { name: ".NET", category: "Backend", angle: 300, phi: -45 },
    { name: "REST APIs", category: "Backend", angle: 30, phi: 0 },
    { name: "OOP", category: "Backend", angle: 90, phi: 15 },
    { name: "React.js", category: "Frontend", angle: 150, phi: -20 },
    { name: "HTML5", category: "Frontend", angle: 210, phi: 20 },
    { name: "CSS3", category: "Frontend", angle: 270, phi: 0 },
    { name: "MySQL", category: "Databases", angle: 330, phi: -35 },
    { name: "SQL Server", category: "Databases", angle: 45, phi: 35 },
    { name: "AWS", category: "Cloud", angle: 105, phi: 0 },
    { name: "Docker", category: "Cloud", angle: 165, phi: 25 },
    { name: "Git", category: "Cloud", angle: 225, phi: -25 },
    { name: "Postman", category: "Cloud", angle: 285, phi: 10 },
    { name: "Agile", category: "DevOps", angle: 345, phi: -40 },
    { name: "SDLC", category: "DevOps", angle: 75, phi: 40 },
    { name: "CI/CD", category: "DevOps", angle: 135, phi: 0 }
];

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    initializeCustomCursor();
    initializeTypingEffect();
    initializeScrollNavigation();
    setupFormValidation();
    updateYear();
    setupMobileNavigation();
    initializeSectionAnimations();
    
    // Initialize globe with robust THREE.js loading check
    function waitForTHREE(attempts = 0) {
        if (typeof THREE !== 'undefined') {
            initializeGlobe();
        } else if (attempts < 20) {
            // Retry every 100ms, up to 2 seconds
            setTimeout(() => waitForTHREE(attempts + 1), 100);
        } else {
            console.error('❌ THREE.js not available after 2 seconds');
            const loadingEl = document.querySelector('.globe-loading');
            if (loadingEl) {
                loadingEl.innerHTML = '<p style="color: #ff6b00; padding: 2rem;">⚠️ Three.js failed to load</p>';
            }
        }
    }
    
    waitForTHREE();
});

// ============ SECTION REVEAL ANIMATIONS ============
function initializeSectionAnimations() {
    const animatedSelectors = [
        'section',
        '.about-text',
        '.stat-card',
        '.skills-globe-container',
        '.skills-legend',
        '.skill-category',
        '.timeline-item',
        '.education-card',
        '.project-card',
        '.contact-card',
        '.footer-content'
    ];

    const animatedSections = document.querySelectorAll(animatedSelectors.join(','));
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -110px 0px',
        threshold: 0.1
    });

    animatedSections.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
}

// ============ CUSTOM CURSOR ============
function initializeCustomCursor() {
    cursorDot = document.getElementById('cursor-dot');
    cursorRing = document.getElementById('cursor-ring');
    
    if (!cursorDot || !cursorRing) return;
    
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth animation for cursor
    setInterval(() => {
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
    }, 16);
    
    // Hide cursor on mobile
    if (window.matchMedia('(hover: none)').matches) {
        cursorDot.style.display = 'none';
        cursorRing.style.display = 'none';
    }
}

// ============ MOBILE NAVIGATION ============
function setupMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (!navToggle || !navMenu) return;

    navToggle.setAttribute('aria-expanded', 'false');

    navToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Close menu when link clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside on mobile
    document.addEventListener('click', (event) => {
        if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ============ TYPING EFFECT ============
function initializeTypingEffect() {
    const lines = [
        "a Software Engineer specializing in backend systems.",
        "passionate about building scalable solutions.",
        "crafting elegant code that solves real problems.",
        "always learning, always improving."
    ];

    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    const textElement = document.getElementById("typing-text");
    
    if (!textElement) return;

    const typeSpeed = 40;
    const deleteSpeed = 20;
    const delayBetweenLines = 2500;

    function typeNextCharacter() {
        const currentLine = lines[currentLineIndex];

        if (!isDeleting && currentCharIndex < currentLine.length) {
            textElement.textContent += currentLine.charAt(currentCharIndex);
            currentCharIndex++;
            setTimeout(typeNextCharacter, typeSpeed);
        } else if (isDeleting && currentCharIndex > 0) {
            textElement.textContent = currentLine.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            setTimeout(typeNextCharacter, deleteSpeed);
        } else if (!isDeleting && currentCharIndex === currentLine.length) {
            isDeleting = true;
            setTimeout(typeNextCharacter, delayBetweenLines);
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentLineIndex = (currentLineIndex + 1) % lines.length;
            setTimeout(typeNextCharacter, typeSpeed);
        }
    }

    setTimeout(typeNextCharacter, 800);
}

// ============ SCROLL NAVIGATION ============
function initializeScrollNavigation() {
    const navLinks = document.querySelectorAll('[data-scroll]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                updateActiveNav();
            }
        });
    });

    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('scroll', updateScrollProgress);
}

function updateActiveNav() {
    const sections = [
        { id: 'profile-page', scroll: 'home' },
        { id: 'About-page', scroll: 'about' },
        { id: 'Skills-page', scroll: 'skill' },
        { id: 'Experience-page', scroll: 'experience' },
        { id: 'Education-page', scroll: 'education' },
        { id: 'Projects-page', scroll: 'project' },
        { id: 'contact', scroll: 'contact' }
    ];

    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element && scrollPosition >= element.offsetTop && 
            scrollPosition < element.offsetTop + element.offsetHeight) {
            updateNavActiveState(section.scroll);
        }
    });
}

function updateNavActiveState(activeSection) {
    const navLinks = document.querySelectorAll('#nav-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-scroll') === activeSection) {
            link.classList.add('active');
        }
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============ SCROLL PROGRESS BAR ============
function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
}

// ============ THREE.JS GLOBE VISUALIZATION ============
function initializeGlobe() {
    const canvasElement = document.getElementById('skillsGlobe');
    if (!canvasElement) {
        console.warn('⚠️ Globe container not found');
        return;
    }

    try {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('❌ Three.js library not loaded');
            return;
        }

        const parentContainer = canvasElement.parentElement;
        if (!parentContainer) return;

        // Scene setup with proper sizing
        scene = new THREE.Scene();
        const width = parentContainer.clientWidth || 500;
        const height = parentContainer.clientHeight || 500;
        
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 2.2;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: canvasElement });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        canvasElement.style.width = '100%';
        canvasElement.style.height = '100%';

        // Create animated globe with better material
        const geometry = new THREE.IcosahedronGeometry(1, 5);
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Create gradient texture
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#1a2a3f');
        gradient.addColorStop(0.5, '#2a3a5f');
        gradient.addColorStop(1, '#0a1a2f');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Add grid pattern
        ctx.strokeStyle = 'rgba(255, 154, 60, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            ctx.beginPath();
            ctx.moveTo((i * 512) / 10, 0);
            ctx.lineTo((i * 512) / 10, 512);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, (i * 512) / 10);
            ctx.lineTo(512, (i * 512) / 10);
            ctx.stroke();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            emissive: 0xff6b00,
            emissiveIntensity: 0.1,
            wireframe: false,
            shininess: 50
        });
        
        globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        // Add animated skill markers
        addAnimatedSkillMarkers();

        // Enhanced lighting
        const light1 = new THREE.PointLight(0xffa03c, 1.3, 100);
        light1.position.set(5, 3, 5);
        scene.add(light1);

        const light2 = new THREE.PointLight(0x6b4dff, 0.7, 100);
        light2.position.set(-5, -3, -5);
        scene.add(light2);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Mouse/Touch interaction
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const startDrag = (x, y) => {
            isDragging = true;
            previousMousePosition = { x, y };
            parentContainer.classList.add('dragging');
        };

        const moveDrag = (x, y) => {
            if (isDragging && globe) {
                const deltaX = x - previousMousePosition.x;
                const deltaY = y - previousMousePosition.y;
                
                globe.rotation.y += deltaX * 0.005;
                globe.rotation.x += deltaY * 0.005;
                
                previousMousePosition = { x, y };
            }
        };

        const stopDrag = () => {
            isDragging = false;
            parentContainer.classList.remove('dragging');
        };

        // Mouse events
        parentContainer.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
        parentContainer.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
        parentContainer.addEventListener('mouseup', stopDrag);
        parentContainer.addEventListener('mouseleave', stopDrag);

        // Touch events
        parentContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length) {
                startDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
        });

        parentContainer.addEventListener('touchmove', (e) => {
            if (e.touches.length) {
                moveDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
        });

        parentContainer.addEventListener('touchend', stopDrag);

        // Auto-rotate
        let autoRotate = true;
        parentContainer.addEventListener('mousedown', () => { autoRotate = false; });
        parentContainer.addEventListener('mouseup', () => { autoRotate = true; });
        parentContainer.addEventListener('touchstart', () => { autoRotate = false; });
        parentContainer.addEventListener('touchend', () => { autoRotate = true; });

        // Handle resize
        const handleResize = () => {
            const newWidth = parentContainer.clientWidth || 500;
            const newHeight = parentContainer.clientHeight || 500;
            if (newWidth > 0 && newHeight > 0) {
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        // Animation loop
        let time = 0;
        let renderCount = 0;
        
        function animate() {
            globeAnimationId = requestAnimationFrame(animate);
            
            if (autoRotate && globe) {
                globe.rotation.y += 0.0004;
            }

            // Animate markers
            scene.children.forEach((child, index) => {
                if (child.userData && child.userData.isMarker) {
                    child.rotation.x += 0.01;
                    child.rotation.y += 0.01;
                    
                    // Pulse animation
                    const scale = 1 + Math.sin(time * 0.01 + index) * 0.15;
                    child.scale.set(scale, scale, scale);
                }
            });

            time++;
            renderer.render(scene, camera);
            
            // Hide loading after first successful render
            if (renderCount === 0) {
                const loadingEl = parentContainer.querySelector('.globe-loading');
                if (loadingEl) {
                    loadingEl.style.opacity = '0';
                    loadingEl.style.pointerEvents = 'none';
                    loadingEl.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => {
                        loadingEl.style.display = 'none';
                    }, 350);
                }
                renderCount++;
            }
        }

        animate();
        
    } catch (error) {
        console.error('❌ Globe initialization error:', error);
        console.error('Stack:', error.stack);
        
        const container = document.getElementById('skillsGlobe');
        const loadingEl = container?.parentElement?.querySelector('.globe-loading');
        
        if (loadingEl) {
            const errorMsg = error.message || 'Unknown error';
            loadingEl.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: #ff6b00;">
                    <p>⚠️ Globe Rendering Error</p>
                    <p style="font-size: 0.85rem; color: #b8bcc4; margin-top: 0.5rem;">${errorMsg}</p>
                </div>
            `;
            console.error('Full error details:', {
                message: error.message,
                name: error.name,
                THREE: typeof THREE,
                container: !!container,
                renderer: !!renderer,
                scene: !!scene
            });
        }
    }
}

function addAnimatedSkillMarkers() {
    const categoryColors = {
        'Languages': 0xff6b00,
        'Backend': 0xff9a3c,
        'Frontend': 0xffc857,
        'Databases': 0x00d4ff,
        'Cloud': 0x00ff88,
        'DevOps': 0x9b4dff
    };

    skills.forEach((skill, index) => {
        // Convert to 3D position on sphere
        const theta = (Math.PI / 180) * skill.angle;
        const phi = (Math.PI / 180) * skill.phi;
        
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);
        
        // Create marker with glow
        const markerGroup = new THREE.Group();
        
        // Inner marker
        const markerGeometry = new THREE.SphereGeometry(0.09, 16, 16);
        const markerMaterial = new THREE.MeshPhongMaterial({
            color: categoryColors[skill.category] || 0xff9a3c,
            emissive: categoryColors[skill.category] || 0xff9a3c,
            emissiveIntensity: 0.4,
            shininess: 100
        });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(x * 1.25, y * 1.25, z * 1.25);
        marker.userData = { skill: skill.name, category: skill.category, isMarker: true };
        
        // Outer glow
        const glowGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: categoryColors[skill.category] || 0xff9a3c,
            transparent: true,
            opacity: 0.15
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(marker.position);
        
        // Outer ring
        const ringGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: categoryColors[skill.category] || 0xff9a3c,
            transparent: true,
            opacity: 0.08,
            wireframe: true
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(marker.position);
        
        markerGroup.add(marker);
        markerGroup.add(glow);
        markerGroup.add(ring);
        markerGroup.userData = { isMarker: true };
        
        scene.add(markerGroup);
    });
}

// ============ FORM VALIDATION ============
function setupFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const successMessage = document.getElementById('successMessage');

    const validateEmail = () => {
        const email = emailInput.value;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = regex.test(email);
        
        if (!isValid && email.length > 0) {
            emailError.textContent = '❌ Invalid email format';
            emailError.style.display = 'block';
        } else {
            emailError.style.display = 'none';
        }
        return isValid || email.length === 0;
    };

    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('change', validateEmail);

    contactForm.addEventListener('submit', function(e) {
        if (!validateEmail()) {
            e.preventDefault();
        }
    });

    // Show success message
    if (successMessage) {
        contactForm.addEventListener('submit', function(e) {
            setTimeout(() => {
                successMessage.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
                successMessage.style.display = 'block';
                contactForm.reset();
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
            }, 500);
        });
    }
}

// ============ SOCIAL MEDIA & CONTACT ============
function linkedin(event) {
    if (event) event.preventDefault();
    window.open('https://www.linkedin.com/in/kamalraj2003', '_blank');
}

function github(event) {
    if (event) event.preventDefault();
    window.open('https://github.com/KAMALRAJ-S', '_blank');
}

function instagram(event) {
    if (event) event.preventDefault();
    window.open('https://www.instagram.com/kamalrajsellamuthu/', '_blank');
}

function email() {
    window.location.href = 'mailto:kamalraj0653@gmail.com?subject=Let%27s%20Collaborate!&body=Hi%20Kamalraj,';
}

function download() {
    // Update this with your actual resume URL
    window.open('./assets/Kamalraj_Resume_.pdf', '_blank');
}

// ============ UTILITY FUNCTIONS ============
function updateYear() {
    const yearSpan = document.getElementById('date');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Show/hide dialog for tooltips (legacy support)
function showDialog(text) {
    const dialogBox = document.getElementById('dialogue-box');
    if (dialogBox) {
        dialogBox.textContent = text;
        dialogBox.style.display = 'block';
    }
}

function hideDialog() {
    const dialogBox = document.getElementById('dialogue-box');
    if (dialogBox) {
        dialogBox.style.display = 'none';
    }
}

// ============ CLEANUP ============
window.addEventListener('beforeunload', () => {
    if (globeAnimationId) {
        cancelAnimationFrame(globeAnimationId);
    }
    if (renderer) {
        renderer.dispose();
    }
});

console.log('✅ Portfolio script loaded successfully');

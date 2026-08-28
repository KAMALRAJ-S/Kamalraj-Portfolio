// ============ GLOBAL VARIABLES ============
let scene, camera, renderer, globe;
let globeAnimationId;
let cursorDot, cursorRing;
const skills = [
    { name: "Python", category: "Languages" },
    { name: "SQL", category: "Languages" },
    { name: "JavaScript", category: "Languages" },
    { name: "RAG", category: "GenAI" },
    { name: "LangChain", category: "GenAI" },
    { name: "Embeddings", category: "GenAI" },
    { name: "Prompt Design", category: "GenAI" },
    { name: "Copilot Studio", category: "GenAI" },
    { name: "LLaMA 3.3", category: "GenAI" },
    { name: "Hugging Face", category: "GenAI" },
    { name: "CNN", category: "AI-ML" },
    { name: "TensorFlow", category: "AI-ML" },
    { name: "OpenCV", category: "AI-ML" },
    { name: "Pandas", category: "AI-ML" },
    { name: "NumPy", category: "AI-ML" },
    { name: "Streamlit", category: "Backend" },
    { name: "REST APIs", category: "Backend" },
    { name: "ChromaDB", category: "Databases" },
    { name: "Git", category: "Backend" },
    { name: "Agile / SDLC", category: "Backend" }
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
        "a GenAI developer building grounded AI systems.",
        "specializing in RAG and conversational agents.",
        "turning language models into useful software.",
        "focused on reliable, human-centered AI."
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
function initializeGlobeLegacy() {
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

// ============ THREE.JS SKILL ORBIT VISUALIZATION ============
function initializeGlobe() {
    const canvasElement = document.getElementById('skillsGlobe');
    const parentContainer = canvasElement?.parentElement;
    if (!canvasElement || !parentContainer || typeof THREE === 'undefined') return;

    const loadingEl = parentContainer.querySelector('.globe-loading');
    const showFallback = () => {
        if (loadingEl) loadingEl.innerHTML = '<p style="color: #ff9a3c; padding: 2rem; text-align: center;">Interactive skills map unavailable in this browser</p>';
    };

    try {
        const width = Math.max(parentContainer.clientWidth, 320);
        const height = Math.max(parentContainer.clientHeight, 320);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
        camera.position.z = 5.2;
        renderer = new THREE.WebGLRenderer({ canvas: canvasElement, alpha: true, antialias: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height, false);
        renderer.setClearColor(0x000000, 0);

        const categoryColors = { Languages: 0xff6b00, Backend: 0xff9a3c, Frontend: 0xffc857, Databases: 0x00d4ff, Cloud: 0x00ff88, DevOps: 0x9b4dff };
        const orbitSystem = new THREE.Group();
        globe = orbitSystem;
        scene.add(orbitSystem);
        orbitSystem.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.78, 2), new THREE.MeshPhongMaterial({ color: 0x101b2d, emissive: 0xff6b00, emissiveIntensity: 0.3, shininess: 90, flatShading: true })));
        orbitSystem.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 1), new THREE.MeshBasicMaterial({ color: 0xff9a3c, wireframe: true, transparent: true, opacity: 0.24 })));

        [1.45, 1.72, 1.98].forEach((radius, index) => {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.008, 8, 96), new THREE.MeshBasicMaterial({ color: index === 1 ? 0xff9a3c : 0x4c78a8, transparent: true, opacity: 0.5 }));
            ring.rotation.set(index * 0.8, index * 0.45, index * 0.25);
            orbitSystem.add(ring);
        });

        const markerGeometry = new THREE.SphereGeometry(0.09, 16, 16);
        skills.forEach((skill, index) => {
            const color = categoryColors[skill.category] || 0xff9a3c;
            const latitude = Math.asin(-1 + (2 * (index + 0.5)) / skills.length);
            const longitude = Math.PI * (1 + Math.sqrt(5)) * index;
            const position = new THREE.Vector3(Math.cos(latitude) * Math.cos(longitude), Math.sin(latitude), Math.cos(latitude) * Math.sin(longitude)).multiplyScalar(1.3 + (index % 3) * 0.23);
            const markerGroup = new THREE.Group();
            markerGroup.position.copy(position);
            markerGroup.userData = { isMarker: true, phase: index * 0.7 };
            markerGroup.add(new THREE.Mesh(markerGeometry, new THREE.MeshPhongMaterial({ color, emissive: color, emissiveIntensity: 0.65 })));
            markerGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 16), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2 })));
            markerGroup.add(createSkillLabel(skill.name, color));
            orbitSystem.add(markerGroup);
        });

        const stars = new THREE.BufferGeometry();
        const starPositions = new Float32Array(180 * 3);
        for (let index = 0; index < starPositions.length; index += 3) {
            const radius = 3.4 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            starPositions[index] = radius * Math.sin(phi) * Math.cos(theta);
            starPositions[index + 1] = radius * Math.cos(phi);
            starPositions[index + 2] = radius * Math.sin(phi) * Math.sin(theta);
        }
        stars.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0xffc857, size: 0.025, transparent: true, opacity: 0.7 })));
        scene.add(new THREE.AmbientLight(0xffffff, 0.65));
        const keyLight = new THREE.PointLight(0xff9a3c, 2.2, 20);
        keyLight.position.set(3, 2, 4);
        scene.add(keyLight);
        const fillLight = new THREE.PointLight(0x3d8bff, 1.1, 20);
        fillLight.position.set(-4, -2, -3);
        scene.add(fillLight);

        let isDragging = false;
        let lastPointer = { x: 0, y: 0 };
        let momentum = 0.0025;
        let previousFrameTime = performance.now();
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const pointerStart = (event) => { isDragging = true; lastPointer = { x: event.clientX, y: event.clientY }; parentContainer.classList.add('dragging'); };
        const pointerMove = (event) => {
            if (!isDragging) return;
            const deltaX = event.clientX - lastPointer.x;
            const deltaY = event.clientY - lastPointer.y;
            orbitSystem.rotation.y += deltaX * 0.007;
            orbitSystem.rotation.x = Math.max(-0.65, Math.min(0.65, orbitSystem.rotation.x + deltaY * 0.004));
            momentum = deltaX * 0.0007;
            lastPointer = { x: event.clientX, y: event.clientY };
        };
        const pointerEnd = () => { isDragging = false; parentContainer.classList.remove('dragging'); };
        parentContainer.addEventListener('pointerdown', pointerStart);
        parentContainer.addEventListener('pointermove', pointerMove);
        parentContainer.addEventListener('pointerup', pointerEnd);
        parentContainer.addEventListener('pointercancel', pointerEnd);
        parentContainer.addEventListener('pointerleave', pointerEnd);

        const handleResize = () => {
            const nextWidth = Math.max(parentContainer.clientWidth, 320);
            const nextHeight = Math.max(parentContainer.clientHeight, 320);
            camera.aspect = nextWidth / nextHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(nextWidth, nextHeight, false);
        };
        window.addEventListener('resize', handleResize);

        const startedAt = performance.now();
        const animate = (now) => {
            globeAnimationId = requestAnimationFrame(animate);
            const frameScale = Math.min((now - previousFrameTime) / 16.67, 2);
            previousFrameTime = now;
            if (!isDragging && !reducedMotion) orbitSystem.rotation.y += momentum * frameScale;
            momentum *= Math.pow(0.985, frameScale);
            if (!isDragging && Math.abs(momentum) < 0.001) momentum = 0.0012;
            orbitSystem.children.forEach((child) => {
                if (child.userData.isMarker) child.scale.setScalar(1 + Math.sin(now * 0.003 + child.userData.phase) * 0.2);
            });
            renderer.render(scene, camera);
            if (now - startedAt > 150 && loadingEl) {
                loadingEl.style.opacity = '0';
                loadingEl.style.pointerEvents = 'none';
                setTimeout(() => { loadingEl.style.display = 'none'; }, 350);
            }
        };
        requestAnimationFrame(animate);
    } catch (error) {
        console.error('Three.js skill visualization failed:', error);
        showFallback();
    }
}

function createSkillLabel(text, color) {
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 320;
    labelCanvas.height = 72;
    const context = labelCanvas.getContext('2d');
    context.font = '600 30px Inter, sans-serif';
    context.textAlign = 'center';
    context.fillStyle = '#f8f9fa';
    context.fillText(text, 160, 32);
    context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    context.fillRect(112, 50, 96, 3);
    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(labelCanvas), transparent: true, depthTest: false }));
    label.position.set(0, 0.18, 0);
    label.scale.set(1.02, 0.24, 1);
    return label;
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
    window.open('./assets/Kamalraj_S_Resume.pdf', '_blank');
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

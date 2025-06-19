  // Loader Animado
        let percentage = 0;
        const percentageElement = document.getElementById('percentage');
        const loaderInterval = setInterval(() => {
            percentage += Math.floor(Math.random() * 5) + 1;
            if (percentage > 100) percentage = 100;
            percentageElement.textContent = `${percentage}%`;
            
            if (percentage === 100) {
                clearInterval(loaderInterval);
                setTimeout(() => {
                    const loader = document.querySelector('.loader');
                    gsap.to(loader, {
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        onComplete: () => {
                            loader.style.display = 'none';
                            initAnimations();
                        }
                    });
                }, 500);
            }
        }, 50);

        // Menu Mobile
        const menuBtn = document.querySelector('.menu-btn');
        const nav = document.querySelector('#nav');

        menuBtn.addEventListener('click', function() {
            menuBtn.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Header Scroll Effect
        window.addEventListener('scroll', function() {
            const header = document.querySelector('#header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Texto Digitado
        const typed = new Typed('#typed-text', {
            strings: ['experiência digital', 'forma de trabalhar', 'maneira de conectar', 'realidade virtual'],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true,
            backDelay: 2000,
            showCursor: false
        });

        // Counter Animation
        function animateCounters() {
            const counters = document.querySelectorAll('.counter');
            const speed = 200;
            
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const increment = target / speed;
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(animateCounters, 1);
                } else {
                    counter.innerText = target;
                }
            });
        }

        // Scroll Trigger Animations
        function initAnimations() {
            // Hero Section
            gsap.from('#hero-title', {
                duration: 1.5,
                y: 100,
                opacity: 0,
                ease: 'power4.out'
            });
            
            gsap.from('#hero-text', {
                duration: 1.5,
                y: 80,
                opacity: 0,
                delay: 0.3,
                ease: 'power3.out'
            });
            
            gsap.from('.hero-buttons a', {
                duration: 1.5,
                y: 80,
                opacity: 0,
                delay: 0.6,
                stagger: 0.2,
                ease: 'power3.out'
            });
            
            // Features Animation
            gsap.utils.toArray('.feature-card').forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    duration: 1,
                    y: 100,
                    opacity: 0,
                    delay: i * 0.1,
                    ease: 'back.out(1.7)'
                });
            });
            
            // Stats Animation
            ScrollTrigger.create({
                trigger: '.stats',
                start: 'top 70%',
                onEnter: animateCounters
            });
            
            // 3D DNA Helix
            initDNAHelix();
            
            // Floating Particles
            initParticles();
            
            // Efeito de Neon nos Cards
            gsap.utils.toArray('.feature-card').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                });
            });
        }

        // 3D DNA Helix with THREE.js
        function initDNAHelix() {
            const container = document.getElementById('dna-container');
            if (!container) return;
            
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            // Scene
            const scene = new THREE.Scene();
            scene.background = null;
            
            // Camera
            const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            camera.position.z = 30;
            
            // Renderer
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);
            
            // DNA Helix
            const group = new THREE.Group();
            scene.add(group);
            
            const geometry = new THREE.SphereGeometry(0.3, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: 0xCCAFFF,
                emissive: 0x4601FA,
                emissiveIntensity: 0.5,
                shininess: 100
            });
            
            const cylinders = [];
            const spheres = [];
            
            // Create DNA strands
            const radius = 5;
            const segments = 30;
            
            for (let i = 0; i < segments; i++) {
                const angle = i * 0.2;
                const x1 = Math.cos(angle) * radius;
                const z1 = Math.sin(angle) * radius;
                const y1 = i * 0.5 - segments * 0.25;
                
                const x2 = Math.cos(angle + Math.PI) * radius;
                const z2 = Math.sin(angle + Math.PI) * radius;
                const y2 = i * 0.5 - segments * 0.25;
                
                // Spheres
                const sphere1 = new THREE.Mesh(geometry, material);
                sphere1.position.set(x1, y1, z1);
                group.add(sphere1);
                spheres.push(sphere1);
                
                const sphere2 = new THREE.Mesh(geometry, material);
                sphere2.position.set(x2, y2, z2);
                group.add(sphere2);
                spheres.push(sphere2);
                
                // Cylinders between spheres
                if (i > 0) {
                    const prevSphere1 = spheres[spheres.length - 4];
                    const prevSphere2 = spheres[spheres.length - 3];
                    
                    // Vertical connections
                    createCylinder(prevSphere1.position, sphere1.position, group);
                    createCylinder(prevSphere2.position, sphere2.position, group);
                    
                    // Horizontal connections
                    createCylinder(prevSphere1.position, sphere2.position, group);
                    createCylinder(prevSphere2.position, sphere1.position, group);
                }
            }
            
            function createCylinder(startPos, endPos, parent) {
                const direction = new THREE.Vector3().subVectors(endPos, startPos);
                const length = direction.length();
                const orientation = new THREE.Matrix4();
                orientation.lookAt(startPos, endPos, new THREE.Object3D().up);
                orientation.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));
                
                const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 8, 1, false);
                const cylinder = new THREE.Mesh(cylinderGeometry, material);
                
                cylinder.applyMatrix4(orientation);
                cylinder.position.x = (startPos.x + endPos.x) / 2;
                cylinder.position.y = (startPos.y + endPos.y) / 2;
                cylinder.position.z = (startPos.z + endPos.z) / 2;
                
                parent.add(cylinder);
                cylinders.push(cylinder);
            }
            
            // Lights
            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);
            
            const directionalLight1 = new THREE.DirectionalLight(0xCCAFFF, 1);
            directionalLight1.position.set(1, 1, 1);
            scene.add(directionalLight1);
            
            const directionalLight2 = new THREE.DirectionalLight(0x4601FA, 1);
            directionalLight2.position.set(-1, -1, -1);
            scene.add(directionalLight2);
            
            // Animation
            function animate() {
                requestAnimationFrame(animate);
                
                group.rotation.y += 0.01;
                
                // Pulsing effect
                const time = Date.now() * 0.001;
                spheres.forEach((sphere, i) => {
                    sphere.scale.setScalar(1 + Math.sin(time * 2 + i * 0.1) * 0.2);
                });
                
                renderer.render(scene, camera);
            }
            
            animate();
            
            // Handle resize
            window.addEventListener('resize', function() {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });
        }

        // Floating Particles Background
        function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    document.getElementById('particles-js').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    // Reduzi a quantidade de partículas para deixar mais espaçado
    const particleCount = window.innerWidth < 768 ? 30 : 80;
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1; // Tamanho um pouco menor
            this.speedX = (Math.random() - 0.5) * 0.5; // Movimento mais lento
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = 'rgba(255, 255, 255, 0.8)'; // Branco com opacidade
            this.angle = 0;
            this.velocity = Math.random() * 0.1; // Movimento mais suave
            this.oscillation = Math.random() * 0.02; // Adiciona oscilação suave
        }
        
        update() {
            this.angle += this.velocity;
            // Movimento mais fluido com oscilação suave
            this.x += Math.cos(this.angle) * this.speedX + Math.sin(this.angle * 2) * this.oscillation;
            this.y += Math.sin(this.angle) * this.speedY + Math.cos(this.angle * 1.5) * this.oscillation;
            
            // Rebate nas bordas com suavidade
            if (this.x > canvas.width + 5 || this.x < -5) {
                this.speedX = -this.speedX * 0.8;
            }
            
            if (this.y > canvas.height + 5 || this.y < -5) {
                this.speedY = -this.speedY * 0.8;
            }
            
            // Mantém as partículas dentro do canvas (opcional)
            this.x = Math.max(-5, Math.min(canvas.width + 5, this.x));
            this.y = Math.max(-5, Math.min(canvas.height + 5, this.y));
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Glow effect mais sutil
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                this.x, this.y, this.size * 0.5,
                this.x, this.y, this.size * 2
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Removi completamente a parte que conecta as partículas
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Handle resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Reposiciona as partículas proporcionalmente ao novo tamanho
        const widthRatio = canvas.width / (canvas.width || window.innerWidth);
        const heightRatio = canvas.height / (canvas.height || window.innerHeight);
        
        particles.forEach(particle => {
            particle.x *= widthRatio;
            particle.y *= heightRatio;
        });
    });
}


        
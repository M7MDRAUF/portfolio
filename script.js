// ============================================
// INITIALIZATION & DOM ELEMENTS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
    }, 1500);
    
    // Initialize all features
    initNavigation();
    initScrollAnimations();
    initBackToTop();
    initContactForm();
    initSmoothScroll();
    initAOSAnimations();
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 150) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// SCROLL ANIMATIONS (AOS-like implementation)
// ============================================
function initAOSAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
}

function initScrollAnimations() {
    // Animate skill progress bars when in view
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    const width = progressBar.style.width;
                    progressBar.style.width = '0';
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 100);
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.skill-item').forEach(item => {
        skillObserver.observe(item);
    });

    // Animate sections on scroll
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(element => {
        revealObserver.observe(element);
    });
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Success feedback
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // In a real application, you would send this to an email service or backend API
            // Example:
            // try {
            //     const response = await fetch('/api/contact', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify(formData)
            //     });
            //     if (response.ok) {
            //         showNotification('Message sent successfully!', 'success');
            //         contactForm.reset();
            //     } else {
            //         throw new Error('Failed to send message');
            //     }
            // } catch (error) {
            //     showNotification('Failed to send message. Please try again.', 'error');
            // }
        }, 2000);
    });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.95)' : type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(99, 102, 241, 0.95)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
    }
    
    .notification-content i {
        font-size: 1.25rem;
    }
    
    .notification-close {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
    }
    
    .notification-close:hover {
        transform: scale(1.2);
    }
`;
document.head.appendChild(style);

// ============================================
// ACHIEVEMENT MODALS
// ============================================
const achievementDetails = {
    achievement1: {
        title: 'Enterprise Automation & Process Optimization',
        icon: 'fas fa-robot',
        situation: 'Al Ain Hospital faced critical operational inefficiencies affecting 100+ staff members across multiple departments. Manual data entry processes on SharePoint were consuming hours daily, producing frequent errors that impacted hospital operations. Management demanded a 30% efficiency improvement without disrupting existing workflows or requiring extensive retraining.',
        task: 'As the lead Backend Developer, I was responsible for architecting and implementing a comprehensive automated solution that would eliminate manual bottlenecks, improve data accuracy, ensure SEHA compliance, and enhance overall user satisfaction—all while maintaining zero downtime during deployment.',
        actions: [
            'Conducted in-depth interviews with 15 staff members across departments to map pain points',
            'Designed custom SharePoint lists with advanced validation rules to prevent errors',
            'Implemented sophisticated Power Automate workflows with intelligent routing',
            'Created approval chains with automatic notifications and escalation logic',
            'Integrated comprehensive error handling and logging mechanisms',
            'Developed detailed documentation and conducted hands-on training sessions',
            'Established real-time monitoring dashboards to track performance'
        ],
        results: [
            '20% reduction in manual processing time, exceeding baseline expectations',
            '95% ticket resolution rate within 24 hours (resolved 50+ support tickets)',
            '30% decrease in data entry errors',
            'Significant improvement in user satisfaction scores',
            'Solution adopted as standard template for other hospital departments'
        ],
        technologies: ['SharePoint Designer', 'Power Automate', 'REST API', 'JavaScript', 'SQL']
    },
    achievement2: {
        title: 'Full-Stack E-Commerce Solution Development',
        icon: 'fas fa-shopping-cart',
        situation: 'The hospital\'s facilities department struggled with furniture inventory management through fragmented processes involving emails, phone calls, and spreadsheets. This resulted in confusion, duplicate orders, inventory discrepancies, and processing delays averaging 3-5 days per request.',
        task: 'Design and develop a complete furniture catalog website featuring search functionality, shopping cart capabilities, form submission workflows, and real-time inventory integration—all within SharePoint\'s technical constraints and security requirements.',
        actions: [
            'Gathered comprehensive requirements from facilities, procurement, and end-user departments',
            'Architected database schema using SharePoint lists with proper relational structures',
            'Developed intuitive user interface with advanced filtering and search capabilities',
            'Built custom shopping cart feature using JavaScript and SharePoint REST API',
            'Created sophisticated custom forms with multi-level validation',
            'Designed approval workflow with intelligent routing based on thresholds',
            'Integrated with existing inventory system for real-time availability',
            'Conducted comprehensive UAT with 20+ users and implemented iterative improvements'
        ],
        results: [
            '15% improvement in user experience metrics based on post-launch surveys',
            'Processing time reduced from 3-5 days to same-day approvals',
            'Eliminated duplicate orders and improved inventory accuracy',
            '200+ successful transactions in first three months',
            'Positive recognition from hospital administration for innovation'
        ],
        technologies: ['JavaScript', 'SharePoint REST API', 'HTML5', 'CSS3', 'SQL', 'Power Automate']
    },
    achievement3: {
        title: 'Rapid Problem Resolution Under Pressure',
        icon: 'fas fa-bolt',
        situation: 'The Talabi intranet portal experienced frequent critical issues affecting hospital staff\'s access to essential information. During a particularly challenging week, the ticket queue exceeded 30 unresolved issues, causing significant frustration and escalations to senior management.',
        task: 'Rapidly diagnose and resolve critical issues while maintaining quality standards, documenting solutions for knowledge sharing, and preventing issue recurrence—all while managing regular development responsibilities.',
        actions: [
            'Implemented systematic prioritization framework based on business impact',
            'Created comprehensive documentation repository for common issues',
            'Established structured debugging approach: reproduce → diagnose → fix → test → document',
            'Partnered with IT security and database teams for complex issues',
            'Analyzed recurring issues to identify root causes and implement permanent fixes',
            'Established clear stakeholder communication protocols',
            'Developed automated monitoring scripts for proactive issue detection'
        ],
        results: [
            '95% resolution rate within 24 hours (exceeding industry standard of 48-72 hours)',
            '50+ tickets resolved during tenure with high satisfaction ratings',
            '40% reduction in recurring tickets through root cause analysis',
            'Reusable solution library documented for future reference',
            'Management recognition for reliability and technical excellence'
        ],
        technologies: ['SharePoint', 'JavaScript', 'SQL Server', 'PowerShell', 'System Administration']
    },
    achievement4: {
        title: 'Enterprise Security & Compliance Management',
        icon: 'fas fa-shield-alt',
        situation: 'Al Ain Hospital had 100+ users accessing SharePoint with varying roles and security needs. The previous permissions structure was ad-hoc, difficult to audit, and raised security concerns. SEHA compliance requirements were stringent.',
        task: 'Design and implement a comprehensive role-based permissions structure that met SEHA security standards, followed least-privilege principles, was easy to maintain and audit, and didn\'t disrupt current workflows.',
        actions: [
            'Conducted thorough audit of existing permissions and identified security gaps',
            'Studied SEHA security standards and compliance requirements in detail',
            'Architected role-based access control (RBAC) system with clear hierarchies',
            'Created SharePoint groups aligned with hospital departments and roles',
            'Implemented least-privilege principle ensuring minimal necessary access',
            'Developed comprehensive documentation with clear justifications',
            'Conducted security training for site administrators',
            'Established quarterly access reviews with department heads',
            'Created detailed audit logs to track all permission changes'
        ],
        results: [
            'Successfully managed permissions for 100+ users with zero security incidents',
            'Full compliance achieved with SEHA security standards',
            '50% reduction in permission-related support tickets',
            'Streamlined processes for employee onboarding and offboarding',
            'Reusable framework adopted by other hospital IT projects'
        ],
        technologies: ['SharePoint Security', 'Active Directory', 'RBAC', 'Compliance Management', 'PowerShell']
    },
    achievement5: {
        title: 'Technical Innovation & Custom Integration',
        icon: 'fas fa-lightbulb',
        situation: 'SharePoint\'s out-of-the-box capabilities were restrictive and couldn\'t deliver the modern, responsive web experiences hospital stakeholders demanded. There was organizational skepticism about whether custom development was even possible within SharePoint\'s security constraints.',
        task: 'Research, design, and implement a secure method to integrate custom HTML, CSS, and JavaScript within SharePoint\'s environment while maintaining strict security compliance and system stability.',
        actions: [
            'Conducted extensive research on SharePoint web part capabilities and security boundaries',
            'Deep-dive study of SharePoint REST API documentation',
            'Learned JavaScript frameworks compatible with SharePoint\'s security model',
            'Partnered with SEHA IT security team to ensure compliance',
            'Developed demonstration solutions and presented technical feasibility',
            'Created comprehensive coding standards and best practices documentation',
            'Implemented solutions with phased rollout and thorough testing',
            'Built reusable component library for accelerated development'
        ],
        results: [
            'Successfully integrated custom HTML/CSS/JavaScript while maintaining security compliance',
            'Enhanced functionality of internal websites including SALAMTAK platform',
            '10% improvement in content accuracy and user engagement metrics',
            'Established foundation for advanced SharePoint customizations',
            'Created component library reducing future development time by 30%'
        ],
        technologies: ['JavaScript', 'HTML5', 'CSS3', 'SharePoint REST API', 'React Patterns', 'Web Security']
    },
    achievement6: {
        title: 'Cross-Functional Leadership & Project Management',
        icon: 'fas fa-users',
        situation: 'The SALAMTAK internal website contained outdated and inaccurate information with poor user engagement. Multiple departments owned different sections, creating inconsistent content and no clear governance structure.',
        task: 'Lead the complete redesign and optimization of the website while coordinating with multiple department stakeholders, managing competing priorities, and establishing sustainable governance processes.',
        actions: [
            'Organized kickoff meetings with all stakeholders to establish shared vision',
            'Created detailed project plan with clear milestones and responsibilities',
            'Conducted comprehensive content audits with department heads',
            'Developed wireframes and interactive mockups with iterative feedback',
            'Simplified navigation structure based on user behavior analysis',
            'Established content management workflow with clear ownership',
            'Provided comprehensive training to content owners',
            'Conducted regular check-ins to track progress and maintain momentum'
        ],
        results: [
            'Improved content accuracy across all sections with zero post-launch corrections',
            '10% increase in user engagement (page views and time-on-site metrics)',
            'Sustainable governance process established for long-term content quality',
            'Strong cross-functional relationships built across departments',
            'On-time delivery within scope and budget constraints'
        ],
        technologies: ['Project Management', 'SharePoint', 'UX Design', 'Stakeholder Management', 'Agile']
    }
};

function openModal(achievementId) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const achievement = achievementDetails[achievementId];
    
    if (!achievement) return;
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <h2>${achievement.title}</h2>
        </div>
        
        <div class="modal-section">
            <h3><i class="fas fa-info-circle"></i> Situation</h3>
            <p>${achievement.situation}</p>
        </div>
        
        <div class="modal-section">
            <h3><i class="fas fa-tasks"></i> Task</h3>
            <p>${achievement.task}</p>
        </div>
        
        <div class="modal-section">
            <h3><i class="fas fa-cog"></i> Actions Taken</h3>
            <ul class="modal-list">
                ${achievement.actions.map(action => `<li>${action}</li>`).join('')}
            </ul>
        </div>
        
        <div class="modal-section">
            <h3><i class="fas fa-chart-line"></i> Results & Impact</h3>
            <ul class="modal-list results">
                ${achievement.results.map(result => `<li><i class="fas fa-check-circle"></i> ${result}</li>`).join('')}
            </ul>
        </div>
        
        <div class="modal-section">
            <h3><i class="fas fa-tools"></i> Technologies Used</h3>
            <div class="modal-technologies">
                ${achievement.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal when clicking outside
document.getElementById('modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .modal-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 1rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        color: white;
        margin-bottom: 1rem;
    }
    
    .modal-header h2 {
        font-size: 1.75rem;
        font-family: 'Space Grotesk', sans-serif;
        color: #f1f5f9;
    }
    
    .modal-section {
        margin-bottom: 2rem;
    }
    
    .modal-section h3 {
        font-size: 1.25rem;
        color: #f1f5f9;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .modal-section h3 i {
        color: #6366f1;
    }
    
    .modal-section p {
        color: #cbd5e1;
        line-height: 1.8;
        font-size: 1rem;
    }
    
    .modal-list {
        list-style: none;
        padding-left: 0;
    }
    
    .modal-list li {
        padding: 0.75rem 0;
        padding-left: 1.5rem;
        position: relative;
        color: #cbd5e1;
        line-height: 1.6;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .modal-list li:last-child {
        border-bottom: none;
    }
    
    .modal-list li::before {
        content: '▸';
        position: absolute;
        left: 0;
        color: #6366f1;
        font-weight: bold;
    }
    
    .modal-list.results li {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding-left: 0;
    }
    
    .modal-list.results li::before {
        display: none;
    }
    
    .modal-list.results li i {
        color: #10b981;
        margin-top: 0.25rem;
        flex-shrink: 0;
    }
    
    .modal-technologies {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .modal-technologies .tech-badge {
        padding: 0.5rem 1rem;
        background: rgba(99, 102, 241, 0.1);
        color: #818cf8;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
        border: 1px solid rgba(99, 102, 241, 0.2);
    }
`;
document.head.appendChild(modalStyles);

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ============================================
// ANALYTICS & TRACKING (Optional)
// ============================================
function trackEvent(eventName, eventData = {}) {
    // Implement your analytics tracking here
    console.log('Event tracked:', eventName, eventData);
    
    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, eventData);
    // }
}

// Track button clicks
document.querySelectorAll('.btn, .btn-learn-more').forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = e.currentTarget.textContent.trim();
        trackEvent('button_click', {
            button_text: buttonText,
            button_location: e.currentTarget.closest('section')?.id || 'unknown'
        });
    });
});

// ============================================
// UTILITY FUNCTIONS
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLink();
}, 100));

// ============================================
// EASTER EGGS & FUN FEATURES
// ============================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    showNotification('🎉 Konami Code Activated! You found the secret!', 'success');
    document.body.style.animation = 'rainbow 3s linear';
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 3000);
}

// Rainbow animation
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c👋 Hello there!', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cLooking at the console? I like your curiosity!', 'font-size: 16px; color: #cbd5e1;');
console.log('%cFeel free to reach out: mohammed.albatayneh@gmail.com', 'font-size: 14px; color: #94a3b8;');
console.log('%c💼 Let\'s build something amazing together!', 'font-size: 14px; color: #10b981; font-weight: bold;');

// ============================================
// EXPORT FOR TESTING (if needed)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeWebsite,
        openModal,
        closeModal,
        showNotification
    };
}

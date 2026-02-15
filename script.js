// Global state
let currentPage = 'home';
let allJobs = [];
let filteredJobs = [];

// Mock job data
const mockJobs = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'New York, NY',
        type: 'Full-time',
        category: 'Technology',
        salary: '$80,000 - $120,000',
        description: 'We are looking for a skilled Frontend Developer to join our team and help build amazing user experiences.',
        logo: 'TC'
    },
    {
        id: 2,
        title: 'Digital Marketing Manager',
        company: 'Growth Agency',
        location: 'Los Angeles, CA',
        type: 'Full-time',
        category: 'Marketing',
        salary: '$60,000 - $90,000',
        description: 'Lead our digital marketing efforts and drive customer acquisition through innovative campaigns.',
        logo: 'GA'
    },
    {
        id: 3,
        title: 'Data Analyst',
        company: 'DataViz Solutions',
        location: 'Chicago, IL',
        type: 'Full-time',
        category: 'Technology',
        salary: '$55,000 - $75,000',
        description: 'Analyze complex datasets and provide actionable insights to drive business decisions.',
        logo: 'DV'
    },
    {
        id: 4,
        title: 'UX Designer',
        company: 'Design Studio',
        location: 'San Francisco, CA',
        type: 'Contract',
        category: 'Technology',
        salary: '$70,000 - $95,000',
        description: 'Create intuitive and beautiful user experiences for our clients\' products.',
        logo: 'DS'
    },
    {
        id: 5,
        title: 'Financial Analyst',
        company: 'FinanceFirst',
        location: 'Boston, MA',
        type: 'Full-time',
        category: 'Finance',
        salary: '$65,000 - $85,000',
        description: 'Analyze financial data and provide recommendations for investment strategies.',
        logo: 'FF'
    },
    {
        id: 6,
        title: 'Software Engineer',
        company: 'StartupXYZ',
        location: 'Austin, TX',
        type: 'Full-time',
        category: 'Technology',
        salary: '$75,000 - $110,000',
        description: 'Build scalable backend systems and APIs for our growing platform.',
        logo: 'SX'
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeJobs();
    initializeNavigation();
    initializeFilters();
    showPage('home');
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
        });
    });

    // Handle footer navigation
    document.querySelectorAll('a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });

  
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Page navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Scroll to top
        window.scrollTo(0, 0);

        // Load page-specific content
        if (pageId === 'jobs') {
            displayJobs(allJobs);
        }
    }
}

// Job management
function initializeJobs() {
    // Load jobs from localStorage or use mock data
    const savedJobs = localStorage.getItem('jobPortalJobs');
    if (savedJobs) {
        allJobs = JSON.parse(savedJobs);
    } else {
        allJobs = [...mockJobs];
        saveJobs();
    }
    
    filteredJobs = [...allJobs];
    displayFeaturedJobs();
}

function saveJobs() {
    localStorage.setItem('jobPortalJobs', JSON.stringify(allJobs));
}

function displayFeaturedJobs() {
    const container = document.getElementById('featuredJobs');
    if (!container) return;   // ✅ correct safety check

    const featuredJobs = allJobs.slice(0, 3);
    container.innerHTML = featuredJobs
        .map(job => createJobCard(job))
        .join('');
}

function displayJobs(jobs) {
    const container = document.getElementById('allJobs');
    if (!container) return;   // ✅ REQUIRED

    if (jobs.length === 0) {
        container.innerHTML =
            '<div class="loading">No jobs found matching your criteria.</div>';
        return;
    }

    container.innerHTML = jobs
        .map(job => createJobCard(job))
        .join('');
}


function createJobCard(job) {
    return `
        <div class="job-card">
            <div class="job-header">
                <div class="company-logo">${job.logo}</div>
                <div class="job-info">
                    <h3>${job.title}</h3>
                    <div class="company-name">${job.company}</div>
                </div>
            </div>
            <div class="job-details">
                <div class="job-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${job.location}
                </div>
                <div class="job-type">
                    <i class="fas fa-clock"></i>
                    ${job.type}
                </div>
                <div class="job-salary">
                    <i class="fas fa-dollar-sign"></i>
                    ${job.salary}
                </div>
            </div>
            <p class="job-description">${job.description}</p>
            <button class="apply-btn" onclick="applyForJob(${job.id})">
                <i class="fas fa-paper-plane"></i>
                Apply Now
            </button>
        </div>
    `;
}

// Search and filter functionality
function initializeFilters() {
    const titleFilter = document.getElementById('jobTitleFilter');
    const locationFilter = document.getElementById('locationFilter');
    const categoryFilter = document.getElementById('categoryFilter');

    if (titleFilter) titleFilter.addEventListener('input', filterJobs);
    if (locationFilter) locationFilter.addEventListener('input', filterJobs);
    if (categoryFilter) categoryFilter.addEventListener('change', filterJobs);
}

function filterJobs() {
    const titleQuery = document.getElementById('jobTitleFilter')?.value.toLowerCase() || '';
    const locationQuery = document.getElementById('locationFilter')?.value.toLowerCase() || '';
    const categoryQuery = document.getElementById('categoryFilter')?.value || '';

    filteredJobs = allJobs.filter(job => {
        const matchesTitle = job.title.toLowerCase().includes(titleQuery) || 
                           job.company.toLowerCase().includes(titleQuery);
        const matchesLocation = job.location.toLowerCase().includes(locationQuery);
        const matchesCategory = !categoryQuery || job.category === categoryQuery;

        return matchesTitle && matchesLocation && matchesCategory;
    });

    displayJobs(filteredJobs);
}

function searchJobs() {
    const jobQuery = document.getElementById('jobSearch').value;
    const locationQuery = document.getElementById('locationSearch').value;

    // Set the filters on the jobs page
    showPage('jobs');
    
    // Wait for page to load, then apply filters
    setTimeout(() => {
        if (jobQuery) {
            document.getElementById('jobTitleFilter').value = jobQuery;
        }
        if (locationQuery) {
            document.getElementById('locationFilter').value = locationQuery;
        }
        filterJobs();
    }, 100);
}

// Application functionality
function applyForJob(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (job) {
        alert(`Thank you for your interest in the ${job.title} position at ${job.company}! Your application has been submitted.`);
    }
}

// Form handlers
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simple validation
    if (email && password) {
        showMessage('login', 'Login successful! Welcome back.', 'success');
        
        // Simulate login delay
        setTimeout(() => {
            showPage('home');
        }, 1500);
    } else {
        showMessage('login', 'Please fill in all fields.', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const role = document.getElementById('userRole').value;
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    // Simple validation
    if (role && name && email && password) {
        if (password.length < 6) {
            showMessage('register', 'Password must be at least 6 characters long.', 'error');
            return;
        }

        showMessage('register', 'Registration successful! Please login to continue.', 'success');
        
        // Simulate registration delay
        setTimeout(() => {
            showPage('login');
        }, 1500);
    } else {
        showMessage('register', 'Please fill in all fields.', 'error');
    }
}

function handleContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    // Simple validation
    if (name && email && message) {
        showMessage('contact', 'Thank you for your message! We\'ll get back to you soon.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
    } else {
        showMessage('contact', 'Please fill in all fields.', 'error');
    }
}

// Message display utility
function showMessage(formId, text, type) {
    const form = document.getElementById(formId + 'Form') || document.getElementById('contactForm');
    
    // Remove existing messages
    const existingMessage = form.parentNode.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    form.parentNode.insertBefore(messageDiv, form);

    // Auto-remove success messages
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Add some sample jobs periodically (simulate dynamic content)
function addSampleJob() {
    const sampleJobs = [
        {
            title: 'Product Manager',
            company: 'InnovateNow',
            location: 'Seattle, WA',
            type: 'Full-time',
            category: 'Technology',
            salary: '$90,000 - $130,000',
            description: 'Drive product strategy and work with cross-functional teams to deliver exceptional products.',
            logo: 'IN'
        },
        {
            title: 'Nurse Practitioner',
            company: 'HealthFirst Medical',
            location: 'Miami, FL',
            type: 'Full-time',
            category: 'Healthcare',
            salary: '$75,000 - $95,000',
            description: 'Provide comprehensive healthcare services in our state-of-the-art medical facility.',
            logo: 'HF'
        }
    ];

    const randomJob = sampleJobs[Math.floor(Math.random() * sampleJobs.length)];
    randomJob.id = allJobs.length + 1;
    
    allJobs.unshift(randomJob);
    saveJobs();
    
    if (currentPage === 'home') {
        displayFeaturedJobs();
    } else if (currentPage === 'jobs') {
        filterJobs();
    }
}

// Add a new job every 30 seconds (for demo purposes)
setInterval(addSampleJob, 30000);
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');

        if (id === "#" || !document.querySelector(id)) return;

        e.preventDefault();
        document.querySelector(id).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#ffffff';
        navbar.style.backdropFilter = 'none';
    }
});

// Enhanced job search with debouncing
let searchTimeout;
function debouncedSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(filterJobs, 300);
}

// Add event listeners for real-time search
document.addEventListener('DOMContentLoaded', function() {
    const filters = ['jobTitleFilter', 'locationFilter'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('input', debouncedSearch);
        }
    });
    document.addEventListener("DOMContentLoaded", () => {
  showUser();
});

    
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        document.getElementById('navMenu').classList.remove('active');
    }
});

// Add loading animation for job cards
function showJobsLoading() {
    const container = document.getElementById('allJobs');
    container.innerHTML = '<div class="loading">Loading jobs...</div>';
}

// Simulate API delay for better UX
function simulateLoadingDelay(callback, delay = 500) {
    showJobsLoading();
    setTimeout(callback, delay);
}

// Enhanced apply function with more feedback
function applyForJob(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (job) {
        const button = event.target;
        const originalText = button.innerHTML;
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying...';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check"></i> Applied!';
            button.style.background = '#10B981';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 2000);
        }, 1000);
    }
}

// Local storage utilities
function clearAllData() {
    localStorage.removeItem('jobPortalJobs');
    allJobs = [...mockJobs];
    filteredJobs = [...allJobs];
    saveJobs();
    
    if (currentPage === 'home') {
        displayFeaturedJobs();
    } else if (currentPage === 'jobs') {
        displayJobs(allJobs);
    }
}

// Export functions for testing (if needed)

const links = document.querySelectorAll("[data-page]");
const pages = document.querySelectorAll(".page");

links.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const page = link.getAttribute("data-page");
        showPage(page);
    });
});



function openHire() {
    showPage("hire");
}

function goHome() {
    showPage("home");
}
function submitProposal() {
    document.getElementById("proposalForm").style.display = "none";
    document.getElementById("proposalSuccess").style.display = "block";
}

async function loadServices() {
  try {
    const res = await fetch("https://fb-backend-ureh.onrender.com/services");
    const services = await res.json();

    console.log("Services from backend:", services);
  } catch (error) {
    console.error("Backend not reachable", error);
  }
}
function openHire(serviceName, price) {
  // Show hire page
  showPage("hire");

  // Set service name & price
  document.getElementById("selectedService").innerText = serviceName;
  document.getElementById("selectedPrice").innerText = "Starting Price: " + price;

  // Prefill budget input (numbers only)
  const budgetInput = document.querySelector("#hire input[type='number']");
  if (budgetInput && price) {
    budgetInput.value = price.replace(/[^\d]/g, "");
  }

  // Reset success state
  document.getElementById("proposalForm").style.display = "block";
  document.getElementById("proposalSuccess").style.display = "none";
}
// ===============================
// Hamburger Menu Toggle
// ===============================

const navToggle = document.getElementById("navToggle");
const navMenu = document.querySelector(".nav-menu");

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close menu when clicking a link
document.querySelectorAll(".nav-menu a").forEach(link => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch(err => console.log("SW failed", err));
  });
}
document.addEventListener("DOMContentLoaded", () => {
  // LOGIN
  // LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    // Save logged-in user
    localStorage.setItem("loggedInUser", email);

    showUser();
    showPage("home");
  });
}


  // REGISTER
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", e => {
      e.preventDefault();

      const user = {
        role: userRole.value,
        name: registerName.value.trim(),
        email: registerEmail.value.trim(),
        password: registerPassword.value
      };

      if (!user.role || !user.name || !user.email || !user.password) {
        alert("Fill all fields");
        return;
      }

      localStorage.setItem("registeredUser", JSON.stringify(user));
      alert("Registration successful!");
      showPage("login");
    });
  }
});

function showUser() {
  const email = localStorage.getItem("loggedInUser");

  const userBox = document.getElementById("userBox");
  const userEmail = document.getElementById("userEmail");

  const loginLink = document.querySelector('[data-page="login"]');
  const registerLink = document.querySelector('[data-page="register"]');

  if (email) {
    userEmail.textContent = email;
    userBox.style.display = "flex";

    loginLink.style.display = "none";
    registerLink.style.display = "none";
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");

  document.getElementById("userBox").style.display = "none";

  document.querySelector('[data-page="login"]').style.display = "inline-block";
  document.querySelector('[data-page="register"]').style.display = "inline-block";

  showPage("login");
}

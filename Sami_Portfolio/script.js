// Language switcher
const langSwitch = document.getElementById('lang-switch');
let currentLang = 'nl';

function updateLanguage() {
    document.querySelectorAll('[data-nl][data-en]').forEach(element => {
        const newText = element.getAttribute(`data-${currentLang}`);
        
        // Special handling for the hero title to preserve the name highlight
        if (element.classList.contains('hero') && element.tagName === 'H1') {
            element.innerHTML = `${newText} <br><span class="highlight">Sami el Baghdadi</span>`;
        } else {
            element.textContent = newText;
        }
    });

    // Update button text
    langSwitch.textContent = currentLang === 'nl' ? 'EN' : 'NL';
    langSwitch.setAttribute('data-lang', currentLang === 'nl' ? 'en' : 'nl');
}

langSwitch.addEventListener('click', () => {
    currentLang = currentLang === 'nl' ? 'en' : 'nl';
    updateLanguage();
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('nav ul').classList.toggle('show');	
});
document.querySelectorAll("nav ul li a").forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('nav ul').classList.remove('show');
    });
}); 

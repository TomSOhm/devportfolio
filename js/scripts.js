(function($) {

    // Show current year
    $("#current-year").text(new Date().getFullYear());

    // Remove no-js class
    $('html').removeClass('no-js');

    // Animate to section when nav is clicked
    $('header a').click(function(e) {

        // Treat as normal link if no-scroll class
        if ($(this).hasClass('no-scroll')) return;

        e.preventDefault();
        var heading = $(this).attr('href');
        var scrollDistance = $(heading).offset().top;

        $('html, body').animate({
            scrollTop: scrollDistance + 'px'
        }, Math.abs(window.pageYOffset - $(heading).offset().top) / 1);

        // Hide the menu once clicked if mobile
        if ($('header').hasClass('active')) {
            $('header, body').removeClass('active');
        }
    });

    // Scroll to top
    $('#to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });

    // Scroll to first element
    $('#lead-down span').click(function() {
        var scrollDistance = $('#lead').next().offset().top;
        $('html, body').animate({
            scrollTop: scrollDistance + 'px'
        }, 500);
    });

    // Create timeline
    $('#experience-timeline').each(function() {

        $this = $(this); // Store reference to this
        $userContent = $this.children('div'); // user content

        // Create each timeline block
        $userContent.each(function() {
            $(this).addClass('vtimeline-content').wrap('<div class="vtimeline-point"><div class="vtimeline-block"></div></div>');
        });

        // Add icons to each block
        $this.find('.vtimeline-point').each(function() {
            $(this).prepend('<div class="vtimeline-icon"><i class="fa fa-map-marker"></i></div>');
        });

        // Add dates to the timeline if exists
        $this.find('.vtimeline-content').each(function() {
            var date = $(this).data('date');
            if (date) { // Prepend if exists
                $(this).parent().prepend('<span class="vtimeline-date">'+date+'</span>');
            }
        });

    });

    // Open mobile menu
    $('#mobile-menu-open').click(function() {
        $('header, body').addClass('active');
    });

    // Close mobile menu
    $('#mobile-menu-close').click(function() {
        $('header, body').removeClass('active');
    });

    // Load additional projects
    $('#view-more-projects').click(function(e){
        e.preventDefault();
        $(this).fadeOut(300, function() {
            $('#more-projects').fadeIn(300);
        });
    });

    // Contact form handling
    const modal = document.querySelector('.modal');
    const contactForm = document.getElementById('contactForm');
    const closeModal = document.querySelector('.close-modal');
    const contactButton = document.querySelector('.btn-contact');

    function showModal() {
        // Reset any previous styles
        modal.style.display = 'block';
        modal.style.textAlign = 'center';
        
        // Show modal with animation
        requestAnimationFrame(() => {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            // Set focus to first input for accessibility
            document.getElementById('name').focus();
        });
    }

    function hideModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Add transition end listener to handle display none
        const handleTransitionEnd = () => {
            modal.style.display = 'none';
            modal.style.textAlign = '';
            modal.removeEventListener('transitionend', handleTransitionEnd);
        };
        modal.addEventListener('transitionend', handleTransitionEnd);
        
        // Reset form and error messages
        contactForm.reset();
        document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => el.classList.remove('error'));
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        input.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        input.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    // Email validation function
    function isValidEmail(email) {
        // Basic email format validation
        const basicFormat = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        if (!basicFormat.test(email)) return false;

        // Additional validation rules
        const parts = email.split('@');
        if (parts.length !== 2) return false;

        const [localPart, domain] = parts;
        
        // Check local part
        if (localPart.length === 0 || localPart.length > 64) return false;
        if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
        if (localPart.includes('..')) return false;

        // Check domain part
        const domainParts = domain.split('.');
        if (domainParts.length < 2) return false;
        
        // Check each domain part
        for (const part of domainParts) {
            if (part.length === 0 || part.length > 63) return false;
            if (part.startsWith('-') || part.endsWith('-')) return false;
            if (!/^[a-zA-Z0-9\-]+$/.test(part)) return false;
        }

        // Check TLD (last part)
        const tld = domainParts[domainParts.length - 1];
        if (tld.length < 2) return false;
        if (!/^[a-zA-Z]{2,}$/.test(tld)) return false;

        return true;
    }

    function showToast(message, type = 'info') {
        // Remove any existing toasts
        const existingToasts = document.querySelectorAll('.toast-message');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast-message ${type}`;
        
        const icon = document.createElement('i');
        switch (type) {
            case 'success':
                icon.className = 'fas fa-check-circle';
                break;
            case 'error':
                icon.className = 'fas fa-exclamation-circle';
                break;
            default:
                icon.className = 'fas fa-info-circle';
        }
        
        const textSpan = document.createElement('span');
        textSpan.textContent = message;
        
        toast.appendChild(icon);
        toast.appendChild(textSpan);
        document.body.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Remove toast after delay if it's a success message
        if (type === 'success') {
            setTimeout(() => {
                toast.classList.add('hide');
                setTimeout(() => toast.remove(), 300);
            }, 5000); // Increased to 5 seconds for better visibility
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log('🚀 Form submission started');
        
        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const subjectInput = contactForm.querySelector('input[name="subject"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');
        const submitBtn = contactForm.querySelector('.submit-btn');
        const modalContent = document.querySelector('.modal-content');

        // Log the form data
        console.log('📝 Form Data:', {
            name: nameInput.value,
            email: emailInput.value,
            subject: subjectInput.value,
            message: messageInput.value
        });

        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.toast-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Clear previous errors
        [nameInput, emailInput, subjectInput, messageInput].forEach(clearError);
        
        // Validate inputs
        let hasError = false;
        
        // Name validation
        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
            showError(nameInput, 'Please enter your name (minimum 2 characters)');
            hasError = true;
        }
        
        // Email validation
        const email = emailInput.value.trim();
        if (!email || !isValidEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            hasError = true;
        }
        
        // Subject validation
        if (!subjectInput.value.trim() || subjectInput.value.trim().length < 2) {
            showError(subjectInput, 'Please enter a subject (minimum 2 characters)');
            hasError = true;
        }
        
        // Message validation
        if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
            showError(messageInput, 'Please enter a message (minimum 10 characters)');
            hasError = true;
        }
        
        if (hasError) {
            console.log('❌ Form validation failed');
            return;
        }

        console.log('✅ Form validation passed');

        // Show sending message
        showToast('Sending message...', 'info');
        console.log('📤 Attempting to send email...');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        try {
            const templateParams = {
                from_name: nameInput.value.trim(),
                from_email: emailInput.value.trim(),
                reply_to: emailInput.value.trim(),
                email: emailInput.value.trim(),
                subject: subjectInput.value.trim(),
                message: messageInput.value.trim(),
                to_name: "Tom",
                year: new Date().getFullYear()
            };

            const response = await emailjs.send(
                config.emailjs.serviceId,
                config.emailjs.templateId,
                templateParams
            );

            console.log('✅ Email sent successfully:', response);
            
            // Transform modal content to success state
            modalContent.innerHTML = `
                <div class="success-checkmark">
                    <i class="fas fa-check"></i>
                </div>
                <h2 class="success-title">Message Sent!</h2>
                <p class="success-text">Thank you for reaching out. I'll get back to you soon!</p>
            `;
            modalContent.classList.add('success');
            
            // Show success toast
            showToast('Message sent successfully!', 'success');
            
            // Close modal and reset after delay
            setTimeout(() => {
                hideModal();
                // Reset the modal content after it's hidden
                setTimeout(() => {
                    modalContent.classList.remove('success');
                    modalContent.innerHTML = `
                        <span class="close-modal" aria-label="Close modal">&times;</span>
                        <h2 id="contactModalTitle">Let's Talk</h2>
                        <p>Fill out the form below and I'll get back to you as soon as possible.</p>
                        <form id="contactForm" onsubmit="return handleSubmit(event)" novalidate>
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" id="name" name="name" required 
                                       maxlength="50" 
                                       pattern="^[a-zA-Z0-9\\s\\-']{2,50}$"
                                       placeholder="Your name"
                                       aria-required="true">
                                <span class="error-message" id="nameError"></span>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required 
                                       maxlength="100"
                                       pattern="[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$"
                                       placeholder="your.email@example.com"
                                       aria-required="true">
                                <span class="error-message" id="emailError"></span>
                            </div>
                            <div class="form-group">
                                <label for="subject">Subject</label>
                                <input type="text" id="subject" name="subject" required 
                                       maxlength="100"
                                       pattern="^[a-zA-Z0-9\\s\\-',.!?]{2,100}$"
                                       placeholder="What would you like to discuss?"
                                       aria-required="true">
                                <span class="error-message" id="subjectError"></span>
                            </div>
                            <div class="form-group">
                                <label for="message">Message</label>
                                <textarea id="message" name="message" rows="4" required 
                                          maxlength="1000"
                                          placeholder="Your message here..."
                                          aria-required="true"></textarea>
                                <span class="error-message" id="messageError"></span>
                            </div>
                            <button type="submit" class="submit-btn" aria-label="Send message">
                                <span class="button-text">Send Message</span>
                                <span class="loading-spinner">
                                    <i class="fas fa-spinner fa-spin"></i>
                                </span>
                            </button>
                        </form>
                    `;
                    // Reattach event listeners
                    const newCloseBtn = modalContent.querySelector('.close-modal');
                    if (newCloseBtn) {
                        newCloseBtn.addEventListener('click', hideModal);
                    }
                    const newForm = modalContent.querySelector('#contactForm');
                    if (newForm) {
                        newForm.addEventListener('submit', handleSubmit);
                    }
                }, 300);
            }, 3000);
            
        } catch (error) {
            console.error('❌ Error sending email:', error);
            let errorMessage = 'Failed to send message. ';
            
            if (error.text) {
                errorMessage += error.text;
            } else if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Please check your EmailJS configuration and try again.';
            }
            showToast(errorMessage, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            console.log('🏁 Form submission process completed');
        }
    }

    // Event listeners
    contactButton.addEventListener('click', showModal);
    closeModal.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });
    contactForm.addEventListener('submit', handleSubmit);

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });

})(jQuery);

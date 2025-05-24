
document.addEventListener('DOMContentLoaded', () => {
  // --- Navbar ---
  const header = document.getElementById('header');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');
  const navLogoText = header.querySelector('a > span');
  const desktopNavLinks = document.querySelectorAll('#desktop-nav a.nav-link');
  const mobileNavLinks = document.querySelectorAll('#mobile-menu a.nav-link-mobile');

  const toggleMenu = () => {
    const isMenuOpen = mobileMenu.classList.toggle('hidden');
    menuIconOpen.classList.toggle('hidden', !isMenuOpen); // Corrected logic: show open icon if menu is hidden
    menuIconClose.classList.toggle('hidden', isMenuOpen);  // Corrected logic: show close icon if menu is not hidden
    updateHeaderStyle(); 
  };

  if (mobileMenuButton && mobileMenu && menuIconOpen && menuIconClose) {
    mobileMenuButton.addEventListener('click', toggleMenu);
  }

  const closeMobileMenu = () => {
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      if (menuIconOpen) menuIconOpen.classList.remove('hidden');
      if (menuIconClose) menuIconClose.classList.add('hidden');
      updateHeaderStyle();
    }
  };
  
  const smoothScrollToTarget = (targetId) => {
    if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Calculate offset for fixed header if necessary
            const headerHeight = document.getElementById('header')?.offsetHeight || 0;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
  };

  mobileNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          smoothScrollToTarget(targetId);
          closeMobileMenu(); 
      });
  });
  
   desktopNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          smoothScrollToTarget(targetId);
      });
  });
  
  const logoLink = document.querySelector('#header a[href="#inicio-hero"]');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollToTarget('#inicio-hero');
        closeMobileMenu();
    });
  }
  const footerLogoLink = document.querySelector('footer a[href="#inicio-hero"]');
    if (footerLogoLink) {
        footerLogoLink.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScrollToTarget('#inicio-hero');
        });
    }

  const updateHeaderStyle = () => {
    if (!header) return;
    const isScrolled = window.scrollY > 50;
    const isMenuOpen = mobileMenu && !mobileMenu.classList.contains('hidden');

    if (isScrolled || isMenuOpen) {
      header.classList.remove('bg-transparent');
      header.classList.add('bg-sky-800', 'shadow-lg');
      if (navLogoText) {
        navLogoText.classList.remove('text-slate-800', 'md:text-white');
        navLogoText.classList.add('text-white');
      }
      if (mobileMenuButton) {
        mobileMenuButton.classList.remove('text-slate-700');
        mobileMenuButton.classList.add('text-white');
        // Ensure correct icon is shown based on menu state
        if (menuIconOpen && menuIconClose) {
            menuIconOpen.classList.toggle('hidden', isMenuOpen);
            menuIconClose.classList.toggle('hidden', !isMenuOpen);
        }
      }
      desktopNavLinks.forEach(link => {
        link.classList.remove('text-slate-700', 'md:text-slate-200', 'md:hover:text-white');
        link.classList.add('text-slate-200', 'hover:text-white');
      });
    } else {
      header.classList.add('bg-transparent');
      header.classList.remove('bg-sky-800', 'shadow-lg');
      if (navLogoText) {
        navLogoText.classList.remove('text-white');
        navLogoText.classList.add('text-slate-800', 'md:text-white');
      }
      if (mobileMenuButton) {
        mobileMenuButton.classList.remove('text-white');
        mobileMenuButton.classList.add('text-slate-700');
         if (menuIconOpen && menuIconClose) { // Ensure open icon is default when not scrolled and menu closed
            menuIconOpen.classList.remove('hidden');
            menuIconClose.classList.add('hidden');
        }
      }
      desktopNavLinks.forEach(link => {
        link.classList.remove('text-slate-200', 'hover:text-white');
        link.classList.add('text-slate-700', 'md:text-slate-200', 'md:hover:text-white');
      });
    }
  };
  
  window.addEventListener('scroll', updateHeaderStyle);
  updateHeaderStyle(); // Initial check

  // --- Gallery Lightbox ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImage && lightboxClose) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img')?.src;
        const imgAlt = item.querySelector('img')?.alt;
        if (imgSrc) {
          lightboxImage.src = imgSrc;
          lightboxImage.alt = imgAlt || "Vista ampliada de trabajo realizado";
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightboxImage.src = ''; 
      lightboxImage.alt = '';
      document.body.style.overflow = ''; // Restore background scroll
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { 
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
     document.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
  }

  // --- Testimonials Carousel ---
  const testimonialsData = [
    {
      id: 1,
      name: 'Carlos R.',
      location: 'Monterrey, N.L.',
      quote: 'Excelente servicio y atención. Mi auto quedó como nuevo. ¡Totalmente recomendados!',
      avatar: 'images/avatar-carlos-r.png', 
    },
    {
      id: 2,
      name: 'Luis M.', 
      location: 'San Pedro Garza García, N.L.',
      quote: 'Muy profesionales y honestos. Me explicaron todo el proceso y el precio fue justo. Volveré sin duda.',
      avatar: 'images/avatar-luis-m.png', 
    },
    {
      id: 3,
      name: 'Javier M.',
      location: 'Guadalupe, N.L.',
      quote: 'Rápidos, eficientes y amables. El mejor taller al que he llevado mi camioneta. ¡Gracias!',
      avatar: 'images/avatar-javier-m.png', 
    },
  ];

  const testimonialContainer = document.getElementById('testimonial-container');
  const prevTestimonialButton = document.getElementById('prev-testimonial');
  const nextTestimonialButton = document.getElementById('next-testimonial');
  const testimonialDotsContainer = document.getElementById('testimonial-dots');
  let currentTestimonialIndex = 0;
  let testimonialInterval;

  function displayTestimonial(index) {
    if (!testimonialContainer) return;
    const testimonial = testimonialsData[index];
    testimonialContainer.style.opacity = 0;
    setTimeout(() => {
        testimonialContainer.innerHTML = `
        <div class="testimonial-item active">
            <img src="${testimonial.avatar}" alt="Foto de ${testimonial.name}" class="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-6 border-4 border-sky-200 object-cover">
            <blockquote class="text-center text-slate-700 text-lg md:text-xl italic leading-relaxed mb-6">
            <p>"${testimonial.quote}"</p>
            </blockquote>
            <footer class="text-center">
            <p class="font-semibold text-sky-700 text-md">${testimonial.name}</p>
            ${testimonial.location ? `<p class="text-sm text-slate-500">${testimonial.location}</p>` : ''}
            </footer>
        </div>
        `;
        testimonialContainer.style.opacity = 1;
    }, 250); // Half of transition duration for fade out
    updateTestimonialDots(index);
  }

  function updateTestimonialDots(index) {
    if (!testimonialDotsContainer) return;
    testimonialDotsContainer.innerHTML = ''; 
    testimonialsData.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `w-2.5 h-2.5 rounded-full transition-colors ${index === i ? 'bg-sky-600' : 'bg-slate-300 hover:bg-slate-400'}`;
      dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
      dot.addEventListener('click', () => {
        currentTestimonialIndex = i;
        displayTestimonial(currentTestimonialIndex);
        resetTestimonialInterval();
      });
      testimonialDotsContainer.appendChild(dot);
    });
  }

  function nextTestimonial() {
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialsData.length;
    displayTestimonial(currentTestimonialIndex);
  }

  function prevTestimonial() {
    currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonialsData.length) % testimonialsData.length;
    displayTestimonial(currentTestimonialIndex);
  }

  function resetTestimonialInterval() {
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(nextTestimonial, 7000);
  }

  if (testimonialContainer && prevTestimonialButton && nextTestimonialButton && testimonialDotsContainer) {
    prevTestimonialButton.addEventListener('click', () => {
      prevTestimonial();
      resetTestimonialInterval();
    });
    nextTestimonialButton.addEventListener('click', () => {
      nextTestimonial();
      resetTestimonialInterval();
    });
    displayTestimonial(currentTestimonialIndex); 
    resetTestimonialInterval(); 
  }

  // --- Scroll to Top Button ---
  const scrollToTopButton = document.getElementById('scroll-to-top');
  if (scrollToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollToTopButton.classList.remove('hidden');
        scrollToTopButton.classList.add('opacity-100');
      } else {
        scrollToTopButton.classList.remove('opacity-100');
        // Add a delay before adding 'hidden' to allow opacity transition
        setTimeout(() => {
          if (window.pageYOffset <= 300) { // Re-check in case user scrolled back up quickly
            scrollToTopButton.classList.add('hidden');
          }
        }, 300); // Match transition duration
      }
    });
    scrollToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Contact Form with Image Upload ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitButton = document.getElementById('submit-contact-form');
  const imageInput = document.getElementById('image');
  const imageNameDisplay = document.getElementById('image-name');
  const imagePreview = document.getElementById('image-preview');
  const imagePreviewImg = imagePreview ? imagePreview.querySelector('img') : null;
  const removeImageButton = document.getElementById('remove-image');
  const cameraButton = document.getElementById('camera-button');

  // Función para mostrar el estado del formulario
  function showFormStatus(message, type) {
    if (!formStatus || !submitButton) return;
    formStatus.textContent = message;
    formStatus.classList.remove('bg-green-100', 'text-green-700', 'bg-red-100', 'text-red-700', 'hidden');
    if (type === 'success') {
      formStatus.classList.add('bg-green-100', 'text-green-700');
    } else {
      formStatus.classList.add('bg-red-100', 'text-red-700');
    }
    submitButton.disabled = false;
    submitButton.textContent = 'Enviar Mensaje';
  }

  // Función para manejar la selección de archivos
  function handleFileSelect(file) {
    if (!file) return;
    
    // Verificar tipo de archivo
    if (!file.type.match('image.*')) {
      showFormStatus('Por favor, selecciona un archivo de imagen válido (JPG, PNG, GIF, etc.).', 'error');
      return;
    }
    
    // Verificar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showFormStatus('La imagen es demasiado grande. El tamaño máximo permitido es 5MB.', 'error');
      return;
    }
    
    // Mostrar nombre del archivo
    if (imageNameDisplay) {
      imageNameDisplay.textContent = file.name;
    }
    
    // Mostrar vista previa
    if (imagePreview && imagePreviewImg) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreviewImg.src = e.target.result;
        imagePreview.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  }

  // Inicializar funcionalidad de carga de imágenes
  if (imageInput) {
    imageInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        handleFileSelect(this.files[0]);
      }
    });
  }

  // Botón para eliminar imagen
  if (removeImageButton) {
    removeImageButton.addEventListener('click', function() {
      if (imageInput) imageInput.value = '';
      if (imageNameDisplay) imageNameDisplay.textContent = 'Ningún archivo seleccionado';
      if (imagePreview) imagePreview.classList.add('hidden');
      if (imagePreviewImg) imagePreviewImg.src = '';
    });
  }

  // Botón para abrir la cámara en dispositivos móviles
  if (cameraButton) {
    cameraButton.addEventListener('click', function() {
      if (imageInput) {
        // Cambiar el atributo capture para usar la cámara
        imageInput.setAttribute('capture', 'environment');
        imageInput.click();
      }
    });
  }

  // Manejo del envío del formulario
  if (contactForm && formStatus && submitButton) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent default browser submission
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
      formStatus.classList.add('hidden');
      formStatus.classList.remove('bg-green-100', 'text-green-700', 'bg-red-100', 'text-red-700');

      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');

      // Client-side validation
      if (!name || !email || !subject || !message) {
        showFormStatus('Por favor, completa todos los campos obligatorios (*).', 'error');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
         showFormStatus('Por favor, introduce un correo electrónico válido.', 'error');
        return;
      }

      try {
        const fetchResponse = await fetch('process_form.php', {
          method: 'POST',
          body: formData 
        });

        if (!fetchResponse.ok) {
          console.error('Server error details:', fetchResponse.status, fetchResponse.statusText);
          let errorText = await fetchResponse.text();
          try { // Try to parse as JSON if server sent JSON error
             const jsonError = JSON.parse(errorText);
             errorText = jsonError.message || errorText;
          } catch (parseError) { /* Keep raw error text */ }
          showFormStatus(`Error del servidor: ${fetchResponse.status}. ${errorText.substring(0,150)}`, 'error');
          return;
        }

        const phpResponse = await fetchResponse.json();

        if (phpResponse.status === 'success') {
          showFormStatus(phpResponse.message, 'success');
          contactForm.reset();
          // Limpiar la vista previa de la imagen
          if (imagePreview) imagePreview.classList.add('hidden');
          if (imageNameDisplay) imageNameDisplay.textContent = 'Ningún archivo seleccionado';
        } else {
          showFormStatus(phpResponse.message || 'Error desconocido desde el servidor.', 'error');
        }
      } catch (error) {
        console.error('Error en fetch:', error);
        showFormStatus('Error de conexión al enviar el formulario. Por favor, revisa tu conexión e inténtalo de nuevo.', 'error');
      }
      // The showFormStatus function already re-enables the button and sets its text.
    });
  }
  

  // --- Footer Current Year ---
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- AI Diagnostic Assistant ---
  const aiProblemDescription = document.getElementById('ai-problem-description');
  const aiSubmitButton = document.getElementById('ai-submit-problem');
  const aiLoadingSpinner = document.getElementById('ai-loading-spinner');
  const aiResponseArea = document.getElementById('ai-response-area');
  const aiPossibleCausesList = document.getElementById('ai-possible-causes');
  const aiUrgencyLevel = document.getElementById('ai-urgency-level');
  const aiRecommendation = document.getElementById('ai-recommendation');
  const aiNotesContainer = document.getElementById('ai-notes-container');
  const aiNotes = document.getElementById('ai-notes');

  // Mock AI Service Function (REMOVED - Now using fetch to gemini_proxy.php)
  // function getMockAIDiagnosis(problemDescription) { ... } 

  if (aiSubmitButton && aiProblemDescription && aiLoadingSpinner && aiResponseArea && aiPossibleCausesList && aiUrgencyLevel && aiRecommendation && aiNotesContainer && aiNotes) {
    aiSubmitButton.addEventListener('click', async () => {
      const problem = aiProblemDescription.value;

      // Clear previous results and hide response area
      aiPossibleCausesList.innerHTML = '';
      aiUrgencyLevel.textContent = '';
      aiRecommendation.textContent = '';
      aiResponseArea.classList.add('hidden');
      aiSubmitButton.disabled = true; // Disable button during processing

      // Basic client-side validation
      if (!problem || problem.trim() === '') {
        aiLoadingSpinner.classList.add('hidden'); // Hide if it was shown
        // Display error directly in the response area or a dedicated error div
        aiPossibleCausesList.innerHTML = '<li>Por favor, describe el problema de tu vehículo.</li>';
        aiUrgencyLevel.textContent = 'Error';
        aiRecommendation.textContent = 'El campo de descripción no puede estar vacío.';
        aiResponseArea.classList.remove('hidden');
        aiResponseArea.classList.remove('bg-slate-50');
        aiResponseArea.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-300'); // Error styling
        aiSubmitButton.disabled = false;
        return;
      }
       // Restore normal styling if it was an error before
      aiResponseArea.classList.add('bg-slate-50');
      aiResponseArea.classList.remove('bg-red-100', 'text-red-700', 'border', 'border-red-300');


      // This code replaces the call to getMockAIDiagnosis and its specific error handling.
      // It should be placed after basic client-side validation of the 'problem' variable.

      aiLoadingSpinner.classList.remove('hidden');
      // Ensure previous error/success styling is managed correctly
      aiResponseArea.classList.add('hidden'); // Hide previous results first
      aiPossibleCausesList.innerHTML = '';    // Clear old results
      aiUrgencyLevel.textContent = '';
      aiRecommendation.textContent = '';
      aiResponseArea.classList.add('bg-slate-50'); // Default background
      aiResponseArea.classList.remove('bg-red-100', 'text-red-700', 'border', 'border-red-300'); // Remove error styling

      try {
        const formData = new FormData();
        formData.append('problem_description', problem);

        const fetchResponse = await fetch('gemini_proxy.php', {
          method: 'POST',
          body: formData
        });

        if (!fetchResponse.ok) {
          // Network error or non-200 response from PHP script itself (e.g., PHP fatal error before JSON response)
          let errorMsg = `Error conectando con el servicio de diagnóstico. Estado: ${fetchResponse.status}`;
          try {
            // Try to get more details if the server sent any text (e.g. PHP error output)
            const textError = await fetchResponse.text();
            errorMsg += ` - ${textError.substring(0, 200)}`; // Limit length
          } catch (e) { /* ignore if can't get text */ }
          throw new Error(errorMsg);
        }

        const responseData = await fetchResponse.json(); // Expect JSON from gemini_proxy.php

        if (responseData.status === 'success' && responseData.data) {
          const { possibleCauses, urgency, recommendation, notes, error: aiError } = responseData.data;

          // Clear previous results before populating new ones
          aiPossibleCausesList.innerHTML = '';
          aiUrgencyLevel.textContent = '';
          aiRecommendation.textContent = '';
          if (aiNotes) aiNotes.textContent = '';
          if (aiNotesContainer) aiNotesContainer.classList.add('hidden');

          if (aiError) {
            // If the AI returns a specific error (e.g., not an automotive problem)
            const li = document.createElement('li');
            li.textContent = aiError;
            li.style.color = 'red'; // Or apply a Tailwind class for error text
            aiPossibleCausesList.appendChild(li);
            // Optionally hide urgency, recommendation if only an error is shown
            // document.getElementById('ai-urgency-level').parentElement.classList.add('hidden'); // Example
            // document.getElementById('ai-recommendation').parentElement.classList.add('hidden'); // Example
          } else {
            // Normal processing if no specific AI error
            if (possibleCauses && Array.isArray(possibleCauses) && possibleCauses.length > 0) {
              possibleCauses.forEach(cause => {
                const li = document.createElement('li');
                li.textContent = cause;
                aiPossibleCausesList.appendChild(li);
              });
            } else {
              const li = document.createElement('li');
              li.textContent = 'No se identificaron causas específicas con la información proporcionada por la IA.';
              aiPossibleCausesList.appendChild(li);
            }

            aiUrgencyLevel.textContent = urgency || 'No especificado por la IA';
            aiRecommendation.textContent = recommendation || 'No hay recomendaciones adicionales de la IA.';

            if (aiNotes && aiNotesContainer) { // Check if elements exist
              if (notes && notes.trim() !== "") {
                aiNotes.textContent = notes;
                aiNotesContainer.classList.remove('hidden');
              } else {
                // Ensure it's hidden if no notes
                aiNotesContainer.classList.add('hidden');
              }
            }
          }
          aiResponseArea.classList.remove('hidden'); // Show results / successfully handled non-JSON text
        } else if (responseData.status === 'success_text' && responseData.raw_ai_text) {
          // AI returned plain text, not the expected JSON (gemini_proxy.php wrapped it)
           const li = document.createElement('li');
           li.textContent = "Respuesta de la IA (texto plano):";
           aiPossibleCausesList.appendChild(li);

          aiUrgencyLevel.textContent = 'Respuesta no estructurada';
          aiRecommendation.textContent = responseData.raw_ai_text;
          
        } else if (responseData.status === 'error' && responseData.message) {
          // Error explicitly reported by gemini_proxy.php (e.g., API key issue, Gemini error)
          throw new Error(responseData.message);
        } else {
          // Any other unexpected JSON structure from gemini_proxy.php
          throw new Error('Respuesta inesperada del servicio de diagnóstico.');
        }
        aiResponseArea.classList.remove('hidden'); // Show results / successfully handled non-JSON text

      } catch (error) {
        console.error("Error en el diagnóstico IA:", error);
        aiUrgencyLevel.textContent = 'Error en Diagnóstico';
        aiRecommendation.textContent = error.message || 'No se pudo obtener un diagnóstico. Intenta de nuevo más tarde.';
        // Apply error styling to the response area
        aiResponseArea.classList.remove('bg-slate-50');
        aiResponseArea.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-300');
        aiResponseArea.classList.remove('hidden'); // Ensure error message is visible
      } finally {
        aiLoadingSpinner.classList.add('hidden');
        aiSubmitButton.disabled = false; // Re-enable button
      }
    });
  } else {
    console.warn("Algunos elementos del formulario de diagnóstico IA no fueron encontrados en el DOM.");
  }

  // --- End AI Diagnostic Assistant ---
});

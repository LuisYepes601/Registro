 document.addEventListener("DOMContentLoaded", function () {
            const form = document.getElementById("registrationForm");
            const formSections = document.querySelectorAll('.form-section');
            const navItems = document.querySelectorAll('.nav-item');
            const progressBar = document.getElementById('formProgress');
            const progressText = document.getElementById('progressText');
            
            // Manejar la funcionalidad de "No tengo segundo nombre"
            const noSegundoNombre = document.getElementById("noSegundoNombre");
            const segundoNombre = document.getElementById("segundoNombre");

            noSegundoNombre.addEventListener("change", function () {
                if (this.checked) {
                    segundoNombre.disabled = true;
                    segundoNombre.value = "";
                } else {
                    segundoNombre.disabled = false;
                }
            });

            // Manejar la funcionalidad de "No tengo segundo apellido"
            const noSegundoApellido = document.getElementById("noSegundoApellido");
            const segundoApellido = document.getElementById("segundoApellido");

            noSegundoApellido.addEventListener("change", function () {
                if (this.checked) {
                    segundoApellido.disabled = true;
                    segundoApellido.value = "";
                } else {
                    segundoApellido.disabled = false;
                }
            });

            // Navegación por pestañas
            navItems.forEach(item => {
                item.addEventListener('click', function() {
                    const targetId = this.getAttribute('data-target');
                    
                    // Actualizar pestañas activas
                    navItems.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Mostrar sección correspondiente
                    formSections.forEach(section => {
                        section.classList.remove('active');
                        if (section.id === targetId) {
                            section.classList.add('active');
                            updateProgress();
                        }
                    });
                });
            });

            // Navegación con botones Siguiente/Anterior
            const nextButtons = document.querySelectorAll('.btn-next');
            const prevButtons = document.querySelectorAll('.btn-prev');
            
            nextButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const currentSection = this.closest('.form-section');
                    const nextSectionId = this.getAttribute('data-next');
                    
                    // Validar la sección actual antes de avanzar
                    if (validateSection(currentSection.id)) {
                        // Actualizar pestañas activas
                        navItems.forEach(nav => nav.classList.remove('active'));
                        document.querySelector(`.nav-item[data-target="${nextSectionId}"]`).classList.add('active');
                        
                        // Marcar la sección actual como completada
                        document.querySelector(`.nav-item[data-target="${currentSection.id}"]`).classList.add('completed');
                        
                        // Mostrar siguiente sección
                        formSections.forEach(section => {
                            section.classList.remove('active');
                            if (section.id === nextSectionId) {
                                section.classList.add('active');
                                updateProgress();
                            }
                        });
                    }
                });
            });
            
            prevButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const prevSectionId = this.getAttribute('data-prev');
                    
                    // Actualizar pestañas activas
                    navItems.forEach(nav => nav.classList.remove('active'));
                    document.querySelector(`.nav-item[data-target="${prevSectionId}"]`).classList.add('active');
                    
                    // Mostrar sección anterior
                    formSections.forEach(section => {
                        section.classList.remove('active');
                        if (section.id === prevSectionId) {
                            section.classList.add('active');
                            updateProgress();
                        }
                    });
                });
            });

            // Actualizar barra de progreso
            function updateProgress() {
                const activeSection = document.querySelector('.form-section.active');
                const sectionId = activeSection.id;
                const totalSections = formSections.length;
                let currentSectionIndex = 0;
                
                // Encontrar el índice de la sección actual
                formSections.forEach((section, index) => {
                    if (section.id === sectionId) {
                        currentSectionIndex = index + 1;
                    }
                });
                
                // Calcular el porcentaje de progreso
                const progressPercentage = (currentSectionIndex / totalSections) * 100;
                progressBar.style.width = `${progressPercentage}%`;
                progressText.textContent = `Paso ${currentSectionIndex} de ${totalSections}`;
            }

            // Validar sección específica
            function validateSection(sectionId) {
                const section = document.getElementById(sectionId);
                const requiredInputs = section.querySelectorAll('input[required], select[required]');
                let isValid = true;
                
                // Limpiar errores previos
                section.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
                section.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
                
                // Validar cada campo requerido
                requiredInputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error');
                        const errorId = input.id + 'Error';
                        const errorElement = document.getElementById(errorId);
                        if (errorElement) {
                            errorElement.style.display = 'block';
                        }
                    }
                });
                
                // Validaciones específicas por sección
                if (sectionId === 'contacto') {
                    const email = document.getElementById('email');
                    const confirmEmail = document.getElementById('confirmEmail');
                    const telefono = document.getElementById('telefono');
                    
                    // Validar formato de teléfono si se proporciona
                    if (telefono.value && !telefono.validity.valid) {
                        isValid = false;
                        telefono.classList.add('error');
                        document.getElementById('telefonoError').style.display = 'block';
                    }
                    
                    // Validar que los correos coincidan
                    if (email.value !== confirmEmail.value) {
                        isValid = false;
                        email.classList.add('error');
                        confirmEmail.classList.add('error');
                        document.getElementById('emailError').textContent = 'Los correos electrónicos no coinciden';
                        document.getElementById('emailError').style.display = 'block';
                        document.getElementById('confirmEmailError').textContent = 'Los correos electrónicos no coinciden';
                        document.getElementById('confirmEmailError').style.display = 'block';
                    }
                }
                
                if (sectionId === 'cuenta') {
                    const contrasena = document.getElementById('contrasena');
                    const confirmarContrasena = document.getElementById('confirmarContrasena');
                    
                    // Validar que las contraseñas coincidan
                    if (contrasena.value !== confirmarContrasena.value) {
                        isValid = false;
                        contrasena.classList.add('error');
                        confirmarContrasena.classList.add('error');
                        document.getElementById('contrasenaError').textContent = 'Las contraseñas no coinciden';
                        document.getElementById('contrasenaError').style.display = 'block';
                        document.getElementById('confirmarContrasenaError').textContent = 'Las contraseñas no coinciden';
                        document.getElementById('confirmarContrasenaError').style.display = 'block';
                    }
                    
                    // Validar fortaleza de la contraseña
                    if (contrasena.value && !validarContrasena(contrasena.value)) {
                        isValid = false;
                        contrasena.classList.add('error');
                        document.getElementById('contrasenaError').textContent = 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números';
                        document.getElementById('contrasenaError').style.display = 'block';
                    }
                }
                
                return isValid;
            }

            // Función para validar contraseña
            function validarContrasena(contrasena) {
                const tieneLongitudMinima = contrasena.length >= 8;
                const tieneMayuscula = /[A-Z]/.test(contrasena);
                const tieneMinuscula = /[a-z]/.test(contrasena);
                const tieneNumero = /[0-9]/.test(contrasena);

                return (
                    tieneLongitudMinima &&
                    tieneMayuscula &&
                    tieneMinuscula &&
                    tieneNumero
                );
            }

            // Validación del formulario completo
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                
                // Validar todas las secciones
                let allSectionsValid = true;
                formSections.forEach(section => {
                    if (!validateSection(section.id)) {
                        allSectionsValid = false;
                    }
                });
                
                if (allSectionsValid) {
                    // Si todo está bien, se puede enviar el formulario
                    alert(
                        "Formulario enviado con éxito. Su cuenta será activada después de la verificación."
                    );
                    form.reset();
                    
                    // Resetear la interfaz
                    formSections.forEach(section => section.classList.remove('active'));
                    document.getElementById('personal').classList.add('active');
                    navItems.forEach(nav => nav.classList.remove('active', 'completed'));
                    document.querySelector('.nav-item[data-target="personal"]').classList.add('active');
                    updateProgress();
                } else {
                    alert("Por favor, complete todos los campos requeridos antes de enviar el formulario.");
                }
            });

            // Inicializar la barra de progreso
            updateProgress();
        });

        // Función para mostrar/ocultar contraseña
        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            const icon = input.nextElementSibling.querySelector("i");

            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
            } else {
                input.type = "password";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
            }
        }
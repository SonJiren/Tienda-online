// Carrito de compras
let cart = [];
let total = 0;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    smoothScroll();
});

// Función para agregar producto al carrito
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${productName} agregado al carrito`);
}

// Función para agregar servicio al carrito
function addServiceToCart(serviceName, price) {
    cart.push({
        name: serviceName + " (Servicio)",
        price: price,
        quantity: 1
    });
    
    updateCartDisplay();
    showNotification(`Servicio "${serviceName}" agregado al carrito`);
    toggleCart();
}

// Función para actualizar la visualización del carrito
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Calcular total
    total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Actualizar contador
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Actualizar items del carrito
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #999;">
                <div style="font-size: 64px; margin-bottom: 20px;">🛒</div>
                <p style="font-size: 18px; color: #666; margin-bottom: 10px; font-weight: 600;">Tu carrito está vacío</p>
                <p style="font-size: 14px; color: #999;">Agrega productos para comenzar a comprar</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Cantidad: <strong>${item.quantity}</strong> × $${item.price.toFixed(2)}</p>
                    <p><strong>Subtotal: $${(item.price * item.quantity).toFixed(2)}</strong></p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})" title="Eliminar">🗑️</button>
            </div>
        `).join('');
    }
    
    // Actualizar total
    cartTotal.textContent = total.toFixed(2);
}

// Función para eliminar item del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    showNotification('Item eliminado del carrito');
}

// Función para abrir/cerrar carrito
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    cartSidebar.classList.toggle('open');
    if (cartOverlay) {
        cartOverlay.classList.toggle('active');
    }
}

// Variable para almacenar el método de pago seleccionado
let selectedPaymentMethod = null;

// Función para finalizar compra
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Abrir modal de pago
    openPaymentModal();
}

// Función para abrir modal de pago
function openPaymentModal() {
    const modal = document.getElementById('payment-modal');
    const paymentTotal = document.getElementById('payment-total');
    
    if (modal && paymentTotal) {
        paymentTotal.textContent = `$${total.toFixed(2)}`;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Resetear selección
        selectedPaymentMethod = null;
        document.getElementById('payment-confirm').style.display = 'none';
        document.querySelectorAll('.payment-option').forEach(option => {
            option.classList.remove('selected');
        });
    }
}

// Función para cerrar modal de pago
function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Función para seleccionar método de pago
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // Actualizar UI
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Mostrar confirmación
    const confirmDiv = document.getElementById('payment-confirm');
    const methodName = document.getElementById('selected-method-name');
    
    const methodNames = {
        'oxxo': 'OXXO',
        'paypal': 'PayPal',
        'mercadopago': 'Mercado Pago',
        'tarjeta': 'Tarjeta de Crédito/Débito'
    };
    
    if (confirmDiv && methodName) {
        methodName.textContent = methodNames[method] || method;
        confirmDiv.style.display = 'block';
    }
}

// Función para procesar el pago
function processPayment() {
    if (!selectedPaymentMethod) {
        alert('Por favor selecciona un método de pago');
        return;
    }
    
    // Cerrar modal de pago
    closePaymentModal();
    
    // Si es OXXO, mostrar código de barras
    if (selectedPaymentMethod === 'oxxo') {
        generateBarcode();
    } else {
        // Para otros métodos, mostrar formulario de pago
        openPaymentFormModal();
    }
}

// Función para generar código de barras
function generateBarcode() {
    // Generar código de referencia único
    const referenceCode = 'REF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Abrir modal de código de barras
    const modal = document.getElementById('barcode-modal');
    const barcodeMethod = document.getElementById('barcode-method');
    const barcodeTotal = document.getElementById('barcode-total');
    const referenceCodeSpan = document.getElementById('reference-code');
    
    const methodNames = {
        'oxxo': 'OXXO',
        'paypal': 'PayPal',
        'mercadopago': 'Mercado Pago',
        'tarjeta': 'Tarjeta de Crédito/Débito'
    };
    
    if (modal && barcodeMethod && barcodeTotal && referenceCodeSpan) {
        barcodeMethod.textContent = methodNames[selectedPaymentMethod] || selectedPaymentMethod;
        barcodeTotal.textContent = `$${total.toFixed(2)}`;
        referenceCodeSpan.textContent = referenceCode;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Generar código de barras usando JsBarcode
        setTimeout(() => {
            try {
                const canvas = document.getElementById('barcode-canvas');
                if (canvas && typeof JsBarcode !== 'undefined') {
                    JsBarcode(canvas, referenceCode, {
                        format: "CODE128",
                        width: 2,
                        height: 100,
                        displayValue: true,
                        fontSize: 20,
                        margin: 10
                    });
                } else {
                    // Fallback: crear código de barras simple
                    createSimpleBarcode(referenceCode);
                }
            } catch (error) {
                console.error('Error generando código de barras:', error);
                createSimpleBarcode(referenceCode);
            }
        }, 100);
    }
}

// Función para crear código de barras simple (fallback)
function createSimpleBarcode(code) {
    const canvas = document.getElementById('barcode-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 150;
    
    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar barras simples
    ctx.fillStyle = '#000000';
    let x = 50;
    for (let i = 0; i < code.length; i++) {
        const char = code.charCodeAt(i);
        const barWidth = (char % 3) + 1;
        const barHeight = 80 + (char % 20);
        
        ctx.fillRect(x, 20, barWidth, barHeight);
        x += barWidth + 1;
    }
    
    // Texto del código
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(code, canvas.width / 2, 130);
}

// Función para descargar código de barras
function downloadBarcode() {
    const canvas = document.getElementById('barcode-canvas');
    if (!canvas) return;
    
    try {
        // Convertir canvas a imagen
        const link = document.createElement('a');
        link.download = 'codigo-barras-' + Date.now() + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showNotification('Código de barras descargado');
    } catch (error) {
        console.error('Error descargando código de barras:', error);
        alert('Error al descargar el código de barras');
    }
}

// Función para cerrar modal de código de barras
function closeBarcodeModal() {
    const modal = document.getElementById('barcode-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Función para abrir modal de formulario de pago
function openPaymentFormModal() {
    const modal = document.getElementById('payment-form-modal');
    const formTitle = document.getElementById('payment-form-title');
    const formTotal = document.getElementById('form-payment-total');
    const formMethod = document.getElementById('form-payment-method');
    
    const methodNames = {
        'paypal': 'PayPal',
        'mercadopago': 'Mercado Pago',
        'tarjeta': 'Tarjeta de Crédito/Débito'
    };
    
    if (modal && formTitle && formTotal && formMethod) {
        // Ocultar todos los formularios
        document.getElementById('paypal-form').style.display = 'none';
        document.getElementById('card-form').style.display = 'none';
        document.getElementById('mercadopago-form').style.display = 'none';
        
        // Mostrar el formulario correspondiente
        if (selectedPaymentMethod === 'paypal') {
            document.getElementById('paypal-form').style.display = 'block';
            formTitle.textContent = 'Pagar con PayPal';
        } else if (selectedPaymentMethod === 'tarjeta') {
            document.getElementById('card-form').style.display = 'block';
            formTitle.textContent = 'Pagar con Tarjeta';
        } else if (selectedPaymentMethod === 'mercadopago') {
            document.getElementById('mercadopago-form').style.display = 'block';
            formTitle.textContent = 'Pagar con Mercado Pago';
        }
        
        formTotal.textContent = `$${total.toFixed(2)}`;
        formMethod.textContent = methodNames[selectedPaymentMethod] || selectedPaymentMethod;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Función para cerrar modal de formulario de pago
function closePaymentFormModal() {
    const modal = document.getElementById('payment-form-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Limpiar formularios
        const forms = ['paypal-form', 'card-form', 'mercadopago-form'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.querySelectorAll('input').forEach(input => input.value = '');
            }
        });
    }
}

// Función para enviar formulario de pago
function submitPaymentForm() {
    let isValid = true;
    let missingFields = [];
    
    // Validar según el método
    if (selectedPaymentMethod === 'paypal') {
        const email = document.getElementById('paypal-email').value;
        const password = document.getElementById('paypal-password').value;
        const name = document.getElementById('paypal-name').value;
        const phone = document.getElementById('paypal-phone').value;
        const zip = document.getElementById('paypal-zip').value;
        const address = document.getElementById('paypal-address').value;
        
        if (!email) missingFields.push('Email');
        if (!password) missingFields.push('Contraseña');
        if (!name) missingFields.push('Nombre');
        if (!phone) missingFields.push('Teléfono');
        if (!zip) missingFields.push('Código Postal');
        if (!address) missingFields.push('Dirección');
        
        if (missingFields.length > 0) isValid = false;
    } else if (selectedPaymentMethod === 'tarjeta') {
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;
        const cardName = document.getElementById('card-name').value;
        const cardAddress = document.getElementById('card-address').value;
        const cardCity = document.getElementById('card-city').value;
        const cardZip = document.getElementById('card-zip').value;
        const cardEmail = document.getElementById('card-email').value;
        
        if (!cardNumber) missingFields.push('Número de Tarjeta');
        if (!cardExpiry) missingFields.push('Fecha de Vencimiento');
        if (!cardCvv) missingFields.push('CVV');
        if (!cardName) missingFields.push('Nombre en la Tarjeta');
        if (!cardAddress) missingFields.push('Dirección');
        if (!cardCity) missingFields.push('Ciudad');
        if (!cardZip) missingFields.push('Código Postal');
        if (!cardEmail) missingFields.push('Email');
        
        if (missingFields.length > 0) isValid = false;
    } else if (selectedPaymentMethod === 'mercadopago') {
        const email = document.getElementById('mercadopago-email').value;
        const password = document.getElementById('mercadopago-password').value;
        const name = document.getElementById('mercadopago-name').value;
        const phone = document.getElementById('mercadopago-phone').value;
        const dni = document.getElementById('mercadopago-dni').value;
        const address = document.getElementById('mercadopago-address').value;
        const city = document.getElementById('mercadopago-city').value;
        const zip = document.getElementById('mercadopago-zip').value;
        
        if (!email) missingFields.push('Email');
        if (!password) missingFields.push('Contraseña');
        if (!name) missingFields.push('Nombre');
        if (!phone) missingFields.push('Teléfono');
        if (!dni) missingFields.push('DNI/CPF');
        if (!address) missingFields.push('Dirección');
        if (!city) missingFields.push('Ciudad');
        if (!zip) missingFields.push('Código Postal');
        
        if (missingFields.length > 0) isValid = false;
    }
    
    if (!isValid) {
        alert('Por favor completa todos los campos requeridos:\n\n' + missingFields.join('\n'));
        return;
    }
    
    // Cerrar modal de formulario
    closePaymentFormModal();
    
    // Mostrar animación de éxito
    showSuccessAnimation();
}

// Función para completar el pago (desde código de barras OXXO)
function completePayment() {
    if (confirm('¿Confirmas que has completado el pago en OXXO?')) {
        // Cerrar modal de código de barras
        closeBarcodeModal();
        
        // Mostrar animación de éxito
        showSuccessAnimation();
    }
}

// Función para mostrar animación de éxito
function showSuccessAnimation() {
    const animation = document.getElementById('success-animation');
    const successTotal = document.getElementById('success-total');
    const successMethod = document.getElementById('success-method');
    
    const methodNames = {
        'oxxo': 'OXXO',
        'paypal': 'PayPal',
        'mercadopago': 'Mercado Pago',
        'tarjeta': 'Tarjeta de Crédito/Débito'
    };
    
    if (animation && successTotal && successMethod) {
        successTotal.textContent = `$${total.toFixed(2)}`;
        successMethod.textContent = methodNames[selectedPaymentMethod] || selectedPaymentMethod;
        
        animation.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Lanzar confeti
        launchConfetti();
        
        // Limpiar carrito después de 3 segundos
        setTimeout(() => {
        cart = [];
        updateCartDisplay();
        toggleCart();
        }, 3000);
    }
}

// Función para lanzar confeti
function launchConfetti() {
    if (typeof confetti !== 'undefined') {
        // Confeti desde el centro
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        
        // Más confeti después de un delay
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 250);
        
        // Confeti final
        setTimeout(() => {
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 }
            });
        }, 500);
    }
}

// Función para cerrar animación de éxito
function closeSuccessAnimation() {
    const animation = document.getElementById('success-animation');
    if (animation) {
        animation.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Formatear número de tarjeta
document.addEventListener('DOMContentLoaded', function() {
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Formatear fecha de vencimiento
    const cardExpiry = document.getElementById('card-expiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
});

// Función para filtrar productos por categoría
function filterProducts(category) {
    const cards = document.querySelectorAll('.card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Actualizar botones activos
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filtrar productos
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Función para filtrar por categoría desde las tarjetas de categoría
function filterCategory(category) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.textContent.trim() === getCategoryName(category) || 
            (category === 'tecnologia' && btn.textContent.trim() === 'Tecnología')) {
            btn.click();
        }
    });
    
    // Scroll a productos
    scrollToSection('productos');
}

// Función auxiliar para obtener nombre de categoría
function getCategoryName(category) {
    const names = {
        'tecnologia': 'Tecnología',
        'hogar': 'Hogar',
        'ropa': 'Ropa',
        'deportes': 'Deportes',
        'belleza': 'Belleza',
        'libros': 'Libros'
    };
    return names[category] || category;
}

// Función para scroll suave
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Configurar scroll suave para todos los enlaces
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Función para mostrar notificaciones
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #1a73e8;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Añadir animación
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
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Contador de caracteres para el textarea
document.addEventListener('DOMContentLoaded', function() {
    const mensajeTextarea = document.getElementById('mensaje');
    const charCount = document.getElementById('char-count');
    
    if (mensajeTextarea && charCount) {
        mensajeTextarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }
});

// Función para enviar formulario de contacto usando Web3Forms
async function submitForm(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');
    const form = event.target;
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Deshabilitar botón mientras se envía
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    formMessage.style.display = 'none';
    
    // Obtener el access key (si está configurado)
    const accessKeyInput = form.querySelector('input[name="access_key"]');
    const accessKey = accessKeyInput ? accessKeyInput.value : '';
    
    // Verificar si Web3Forms está configurado
    if (accessKey && accessKey !== 'YOUR_ACCESS_KEY' && accessKey.length > 10) {
        // Usar Web3Forms API - formato por defecto
        try {
            // Enviar el formulario directamente sin modificar nada
            const formData = new FormData(form);
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Éxito
                formMessage.style.display = 'block';
                formMessage.style.background = '#4caf50';
                formMessage.style.color = 'white';
                formMessage.style.padding = '15px';
                formMessage.style.borderRadius = '5px';
                formMessage.innerHTML = `
                    <strong>✅ ¡Mensaje enviado con éxito!</strong><br>
                    El mensaje ha sido enviado a espartano.gamer04@gmail.com<br>
                    Te responderemos pronto.
                `;
                
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensaje';
                
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            } else {
                throw new Error(result.message || 'Error al enviar');
            }
        } catch (error) {
            console.error('Error al enviar con Web3Forms:', error);
            // Fallback a método alternativo
            sendEmailFallback(nombre, email, telefono, mensaje, formMessage, submitBtn, form);
        }
    } else {
        // Si no está configurado, mostrar mensaje informativo
        formMessage.style.display = 'block';
        formMessage.style.background = '#ff9800';
        formMessage.style.color = 'white';
        formMessage.style.padding = '20px';
        formMessage.style.borderRadius = '5px';
        formMessage.innerHTML = `
            <strong>⚠️ Web3Forms no está configurado</strong><br><br>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; margin: 10px 0; text-align: left;">
                <strong>📧 Mensaje recibido:</strong><br>
                <strong>Nombre:</strong> ${nombre}<br>
                <strong>Email:</strong> ${email}<br>
                <strong>Teléfono:</strong> ${telefono || 'No proporcionado'}<br>
                <strong>Mensaje:</strong><br>
                ${mensaje.replace(/\n/g, '<br>')}
            </div>
            <p style="margin: 15px 0;"><strong>Para recibir emails automáticamente:</strong></p>
            <ol style="text-align: left; display: inline-block; margin: 10px 0;">
                <li>Ve a <a href="https://web3forms.com/" target="_blank" style="color: #fff; text-decoration: underline;">web3forms.com</a></li>
                <li>Ingresa: <strong>espartano.gamer04@gmail.com</strong></li>
                <li>Copia el Access Key</li>
                <li>Reemplaza "YOUR_ACCESS_KEY" en el código HTML</li>
            </ol>
            <button onclick="copyEmailInfo()" style="margin-top: 10px; padding: 10px 20px; background: white; color: #ff9800; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                📋 Copiar información del mensaje
            </button>
        `;
        
        // Guardar información para copiar
        window.emailInfoToCopy = `
Nombre: ${nombre}
Email: ${email}
Teléfono: ${telefono || 'No proporcionado'}

Mensaje:
${mensaje}

---
Este mensaje fue enviado desde el formulario de contacto de la Tienda Online.
        `.trim();
        
        // Intentar abrir mailto como respaldo
        const subject = encodeURIComponent(`Mensaje de contacto de ${nombre}`);
        const body = encodeURIComponent(window.emailInfoToCopy);
        const mailtoLink = `mailto:espartano.gamer04@gmail.com?subject=${subject}&body=${body}`;
        
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 1000);
        
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensaje';
        
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 20000);
    }
}

// Función de respaldo mejorada que muestra la información y permite copiar
function sendEmailFallback(nombre, email, telefono, mensaje, formMessage, submitBtn, form) {
    // Crear el contenido del email
    const emailContent = `
Nombre: ${nombre}
Email: ${email}
Teléfono: ${telefono || 'No proporcionado'}

Mensaje:
${mensaje}

---
Este mensaje fue enviado desde el formulario de contacto de la Tienda Online.
    `.trim();
    
    // Mostrar información del mensaje con opción de copiar
    formMessage.style.display = 'block';
    formMessage.style.background = '#ff9800';
    formMessage.style.color = 'white';
    formMessage.style.padding = '20px';
    formMessage.style.borderRadius = '5px';
    formMessage.innerHTML = `
        <strong>📧 Información del mensaje recibido:</strong><br><br>
        <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; margin: 10px 0; text-align: left;">
            <strong>Nombre:</strong> ${nombre}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Teléfono:</strong> ${telefono || 'No proporcionado'}<br>
            <strong>Mensaje:</strong><br>
            ${mensaje.replace(/\n/g, '<br>')}
        </div>
        <p><strong>⚠️ Nota:</strong> Para recibir los mensajes automáticamente, configura Web3Forms.</p>
        <p><strong>Email de destino:</strong> espartano.gamer04@gmail.com</p>
        <button onclick="copyEmailInfo()" style="margin-top: 10px; padding: 10px 20px; background: white; color: #ff9800; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
            📋 Copiar información del mensaje
        </button>
    `;
    
    // Guardar información para copiar
    window.emailInfoToCopy = emailContent;
    
    // Intentar abrir mailto como respaldo
    const subject = encodeURIComponent(`Mensaje de contacto de ${nombre}`);
    const body = encodeURIComponent(emailContent);
    const mailtoLink = `mailto:espartano.gamer04@gmail.com?subject=${subject}&body=${body}`;
    
    // Abrir cliente de email después de un breve delay
    setTimeout(() => {
        window.location.href = mailtoLink;
    }, 1000);
    
    // Resetear formulario
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar Mensaje';
    
    // Ocultar mensaje después de 15 segundos
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 15000);
}

// Función para copiar información del email
function copyEmailInfo() {
    if (window.emailInfoToCopy) {
        navigator.clipboard.writeText(window.emailInfoToCopy).then(() => {
            alert('✅ Información copiada al portapapeles');
        }).catch(() => {
            // Fallback para navegadores antiguos
            const textArea = document.createElement('textarea');
            textArea.value = window.emailInfoToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('✅ Información copiada al portapapeles');
        });
    }
}

// Cerrar carrito al hacer clic fuera (ya manejado por el overlay)
// El overlay ya tiene el onclick="toggleCart()" en el HTML

// Efectos de animación al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animación
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.card, .servicio-card, .testimonio-card, .categoria-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Mensaje de bienvenida mejorado
console.log("🛒 Tienda Online - Sistema de compras y servicios");
console.log("✅ Carrito de compras funcional");
console.log("✅ Filtros de productos activos");
console.log("✅ Sistema de servicios disponible");

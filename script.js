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
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Tu carrito está vacío</p>';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Cantidad: ${item.quantity} | Precio: $${item.price.toFixed(2)}</p>
                    <p><strong>Subtotal: $${(item.price * item.quantity).toFixed(2)}</strong></p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">Eliminar</button>
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
    cartSidebar.classList.toggle('open');
}

// Función para finalizar compra
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const confirmMessage = `¿Deseas finalizar la compra?\n\nTotal: $${total.toFixed(2)}\n\nItems: ${cart.reduce((sum, item) => sum + item.quantity, 0)}`;
    
    if (confirm(confirmMessage)) {
        alert(`¡Compra realizada con éxito!\n\nTotal pagado: $${total.toFixed(2)}\n\nGracias por tu compra.`);
        cart = [];
        updateCartDisplay();
        toggleCart();
    }
}

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
        // Usar Web3Forms API
        try {
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

// Cerrar carrito al hacer clic fuera
document.addEventListener('click', function(event) {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartSidebar.classList.contains('open') && 
        !cartSidebar.contains(event.target) && 
        !cartIcon.contains(event.target)) {
        toggleCart();
    }
});

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

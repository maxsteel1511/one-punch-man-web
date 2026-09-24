/* =========================================================
   ONE PUNCH-MAN | Asociación de Héroes — script.js
   Contenido:
   1. Menú móvil (hamburguesa) + submenú desplegable en móvil
   2. Cierre de menú al hacer clic en un enlace
   3. Galería: filtros por categoría
   4. Galería: lightbox (ventana emergente de imagen ampliada)
   5. Formulario de contacto: validación y envío simulado
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Menú móvil ---------- */
  var botonMenu = document.getElementById('botonMenuMovil');
  var navPrincipal = document.getElementById('navPrincipal');

  if (botonMenu && navPrincipal) {
    botonMenu.addEventListener('click', function () {
      var abierto = navPrincipal.classList.toggle('abierto');
      botonMenu.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
  }
  /* Submenú de "Personajes" en móvil: el primer toque abre/cierra el
   submenú en vez de navegar directo; los enlaces internos del
   submenú siguen navegando normalmente. */
var enlacesConSubmenu = document.querySelectorAll('.tiene-submenu > a.enlace-nav');
enlacesConSubmenu.forEach(function (enlace) {
  enlace.addEventListener('click', function (evento) {
    if (window.matchMedia('(max-width: 900px)').matches) {
      var padre = enlace.closest('.tiene-submenu');
      var yaAbierto = padre.classList.contains('submenu-abierto');
      if (!yaAbierto) {
        evento.preventDefault();
        padre.classList.add('submenu-abierto');
      }
      // si ya estaba abierto, el segundo toque deja navegar normalmente
    }
  });
});

  /* Nota: el enlace "Personajes" navega directamente a personajes.html
     en cualquier dispositivo (ya no intercepta el clic). El submenú
     con las 3 opciones (Héroes Clase S / Clase A y B / Villanos) sigue
     disponible en escritorio al pasar el mouse, y sus enlaces siempre
     funcionan como accesos directos a las secciones dentro de esa página. */

  /* Cerrar el menú móvil al elegir cualquier enlace de navegación */
  var enlacesNav = navPrincipal ? navPrincipal.querySelectorAll('a') : [];
  enlacesNav.forEach(function (enlace) {
  enlace.addEventListener('click', function (evento) {
    if (evento.defaultPrevented) return; // se está abriendo el submenú, no cerrar el menú
    if (window.matchMedia('(max-width: 900px)').matches) {
      navPrincipal.classList.remove('abierto');
      botonMenu.setAttribute('aria-expanded', 'false');
    }
  });
});

  /* ---------- 2. Galería: filtros ---------- */
  var botonesFiltro = document.querySelectorAll('.boton-filtro');
  var itemsGaleria = document.querySelectorAll('.item-galeria');

  botonesFiltro.forEach(function (boton) {
    boton.addEventListener('click', function () {
      var filtro = boton.getAttribute('data-filtro');

      botonesFiltro.forEach(function (b) { b.classList.remove('activo'); });
      boton.classList.add('activo');

      itemsGaleria.forEach(function (item) {
        var categoria = item.getAttribute('data-categoria');
        var coincide = (filtro === 'todos' || categoria === filtro);
        item.classList.toggle('oculto', !coincide);
      });
    });
  });

  /* ---------- 3. Galería: lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var imagenLightbox = document.getElementById('imagenLightbox');
  var tituloLightbox = document.getElementById('tituloLightbox');
  var cerrarLightbox = document.getElementById('cerrarLightbox');

  function abrirLightbox(item) {
    var img = item.querySelector('img');
    imagenLightbox.src = img.src;
    imagenLightbox.alt = img.alt;
    tituloLightbox.textContent = img.getAttribute('data-titulo') || img.alt;
    lightbox.classList.remove('oculto');
  }

  function cerrarVentanaLightbox() {
    lightbox.classList.add('oculto');
    imagenLightbox.src = '';
  }

  itemsGaleria.forEach(function (item) {
    item.addEventListener('click', function () { abrirLightbox(item); });
    // Accesibilidad: permitir abrir con Enter/Espacio al navegar con teclado
    item.addEventListener('keypress', function (evento) {
      if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault();
        abrirLightbox(item);
      }
    });
  });

  if (cerrarLightbox) {
    cerrarLightbox.addEventListener('click', cerrarVentanaLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', function (evento) {
      if (evento.target === lightbox) cerrarVentanaLightbox();
    });
  }
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && lightbox && !lightbox.classList.contains('oculto')) {
      cerrarVentanaLightbox();
    }
  });

  /* ---------- 4. Formulario de contacto ---------- */
  var formulario = document.getElementById('formularioContacto');
  var avisoFormulario = document.getElementById('avisoFormulario');

  var campoNombre = document.getElementById('nombre');
  var campoCorreo = document.getElementById('correo');
  var campoMensaje = document.getElementById('mensaje');

  var errorNombre = document.getElementById('errorNombre');
  var errorCorreo = document.getElementById('errorCorreo');
  var errorMensaje = document.getElementById('errorMensaje');

  function mostrarError(campo, elementoError, texto) {
    campo.closest('.campo').classList.add('con-error');
    elementoError.textContent = texto;
  }

  function limpiarError(campo, elementoError) {
    campo.closest('.campo').classList.remove('con-error');
    elementoError.textContent = '';
  }

  function esCorreoValido(valor) {
    // Validación simple de formato de correo
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  function validarFormulario() {
    var esValido = true;

    if (campoNombre.value.trim().length < 3) {
      mostrarError(campoNombre, errorNombre, 'Ingresa al menos 3 caracteres.');
      esValido = false;
    } else {
      limpiarError(campoNombre, errorNombre);
    }

    if (!esCorreoValido(campoCorreo.value.trim())) {
      mostrarError(campoCorreo, errorCorreo, 'Ingresa un correo electrónico válido.');
      esValido = false;
    } else {
      limpiarError(campoCorreo, errorCorreo);
    }

    if (campoMensaje.value.trim().length < 10) {
      mostrarError(campoMensaje, errorMensaje, 'Cuéntanos un poco más (mínimo 10 caracteres).');
      esValido = false;
    } else {
      limpiarError(campoMensaje, errorMensaje);
    }

    return esValido;
  }

  if (formulario) {
    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();

      if (validarFormulario()) {
        // Simulación de envío (no hay backend real en este proyecto de práctica)
        avisoFormulario.textContent = '¡Solicitud enviada, ' + campoNombre.value.trim() +
          '! La Asociación de Héroes revisará tu caso pronto.';
        avisoFormulario.classList.add('visible');
        formulario.reset();
      } else {
        avisoFormulario.textContent = 'Revisa los campos marcados antes de enviar tu solicitud.';
        avisoFormulario.classList.add('visible');
      }
    });

    // Limpia el error de un campo apenas el usuario empieza a corregirlo
    [campoNombre, campoCorreo, campoMensaje].forEach(function (campo) {
      campo.addEventListener('input', function () {
        campo.closest('.campo').classList.remove('con-error');
      });
    });
  }

});

/* ---------- 5. Efecto parallax en el fondo ---------- */
var factorParallax = 0.35; // 0 = fondo fijo, 1 = se mueve igual que el scroll. Subí este número para más movimiento.

function actualizarParallax() {
  document.body.style.setProperty('--parallax-y', (window.scrollY * factorParallax) + 'px');
}

window.addEventListener('scroll', actualizarParallax, { passive: true });
actualizarParallax();
// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado completamente');
  
  // Definir usuarios y credenciales predeterminadas
  const users = {
      'apoderado': {
          password: '123456',
          type: 'apoderado',
          displayName: 'María González',
          role: 'Apoderado'
      },
      'ejecutivo': {
          password: '123456',
          type: 'ejecutivo',
          displayName: 'Juan Pérez',
          role: 'Ejecutivo de Ventas'
      }
  };
  
  // Definir las vistas disponibles para cada tipo de usuario
  const userViews = {
    'apoderado': {
      'dashboard': loadApoderadoDashboard,
      'aportes': loadApoderadoAportes,
      'documents': loadApoderadoDocumentos,
      'itinerary': () => showGenericView('Itinerario de Viaje'),
      'insurance': () => showGenericView('Seguros Contratados'),
      'messages': () => showGenericView('Mensajes')
    },
    'ejecutivo': {
      'dashboard': loadEjecutivoDashboard,
      'contracts': loadEjecutivoContracts,
      'createContract': loadCrearContrato,
      'clients': () => showGenericView('Gestión de Clientes'),
      'deposits': loadEjecutivoDepositos,
      'insurance': () => showGenericView('Gestión de Seguros'),
      'reports': () => showGenericView('Reportes'),
      'settings': () => showGenericView('Configuración')
    }
  };
  
  // Variables para almacenar el usuario actual
  let currentUser = null;
  let currentView = 'dashboard';
  
  // Obtener elementos del DOM
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginView = document.getElementById('loginView');
  const mainLayout = document.getElementById('mainLayout');
  const userDisplay = document.getElementById('userDisplay');
  const mainMenu = document.getElementById('mainMenu');
  const viewContainer = document.getElementById('viewContainer');
  
  // Verificar que todos los elementos estén presentes
  if (!loginButton || !logoutButton || !usernameInput || !passwordInput || 
      !loginView || !mainLayout || !userDisplay || !mainMenu || !viewContainer) {
    console.error('Algunos elementos del DOM no fueron encontrados');
    return;
  }
  
  // Función para iniciar sesión
  loginButton.addEventListener('click', function() {
    console.log('Botón de login clickeado');
    
    const username = usernameInput.value.toLowerCase();
    const password = passwordInput.value;
    
    // Validación simple
    if (!username || !password) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    console.log('Verificando usuario:', username);
    
    // Verificar credenciales
    if (!users[username]) {
        alert('Usuario no encontrado');
        return;
    }
    
    if (users[username].password !== password) {
        alert('Contraseña incorrecta');
        return;
    }
    
    console.log('Usuario autenticado correctamente');
    
    // Almacenar usuario actual
    currentUser = users[username];
    
    // Ocultar vista de login y mostrar layout principal
    loginView.style.display = 'none';
    mainLayout.style.display = 'block';
    
    // Hacer visible el contenedor principal y sus elementos
    document.querySelector('.header').style.display = 'flex';
    document.querySelector('.container').style.display = 'flex';
    
    // Actualizar información del usuario
    userDisplay.textContent = `${currentUser.displayName} | ${currentUser.role}`;
    
    // Configurar menú según tipo de usuario
    setupUserMenu(currentUser.type);
    
    // Cargar vista inicial (dashboard)
    loadView('dashboard');
  });
  
  // Función para cerrar sesión
  logoutButton.addEventListener('click', function() {
    console.log('Cerrando sesión');
    mainLayout.style.display = 'none';
    loginView.style.display = 'block';
    usernameInput.value = '';
    passwordInput.value = '';
    currentUser = null;
    
    // Ocultar todas las vistas
    hideAllViews();
  });
  
  // Configurar menú según tipo de usuario
  function setupUserMenu(userType) {
    console.log('Configurando menú para:', userType);
    
    let menuHTML = '';
    
    if (userType === 'apoderado') {
      menuHTML = `
        <li data-view="dashboard" class="active">Mi Cuenta</li>
        <li data-view="aportes">Aportes</li>
        <li data-view="documents">Documentos</li>
        <li data-view="itinerary">Itinerario</li>
        <li data-view="insurance">Seguros</li>
        <li data-view="messages">Mensajes</li>
      `;
    } else if (userType === 'ejecutivo') {
      menuHTML = `
        <li data-view="dashboard" class="active">Dashboard</li>
        <li data-view="contracts">Contratos</li>
        <li data-view="clients">Clientes</li>
        <li data-view="deposits">Depósitos</li>
        <li data-view="insurance">Seguros</li>
        <li data-view="reports">Reportes</li>
        <li data-view="settings">Configuración</li>
      `;
    }
    
    mainMenu.innerHTML = menuHTML;
    
    // Configurar eventos de clic para el menú
    setupMenuListeners();
  }
  
  // Configurar listeners para los elementos del menú
  function setupMenuListeners() {
    const menuItems = mainMenu.querySelectorAll('li');
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        // Remover clase active de todos los elementos
        menuItems.forEach(mi => mi.classList.remove('active'));
        
        // Agregar clase active al elemento clickeado
        this.classList.add('active');
        
        // Obtener la vista a mostrar
        const viewName = this.getAttribute('data-view');
        
        // Cargar la vista correspondiente
        loadView(viewName);
      });
    });
  }
  
  // Función para cargar una vista específica
  function loadView(viewName) {
    console.log('Cargando vista:', viewName);
    
    // Ocultar todas las vistas
    hideAllViews();
    
    // Almacenar la vista actual
    currentView = viewName;
    
    // Verificar si existe un manejador para esta vista
    if (currentUser && userViews[currentUser.type][viewName]) {
      // Llamar al manejador correspondiente
      userViews[currentUser.type][viewName]();
    } else {
      // Mostrar vista genérica si no hay manejador específico
      showGenericView(`Vista de ${viewName}`);
    }
  }
  
  // Función para ocultar todas las vistas
  function hideAllViews() {
    const views = viewContainer.querySelectorAll('.view');
    views.forEach(view => {
      view.style.display = 'none';
    });
  }
  
  // Función para mostrar una vista específica
  function showView(viewId) {
    const view = document.getElementById(viewId);
    if (view) {
      view.style.display = 'block';
    }
  }
  
  // Función para mostrar una vista genérica con mensaje
  function showGenericView(title) {
    // Crear una vista genérica
    const genericViewId = 'genericView';
    let genericView = document.getElementById(genericViewId);
    
    // Si no existe, crearla
    if (!genericView) {
      genericView = document.createElement('div');
      genericView.id = genericViewId;
      genericView.className = 'view';
      viewContainer.appendChild(genericView);
    }
    
    // Actualizar contenido
    genericView.innerHTML = `
      <h1 class="page-title">${title}</h1>
      <div class="card">
        <p>Esta funcionalidad está en desarrollo.</p>
      </div>
    `;
    
    // Mostrar la vista
    genericView.style.display = 'block';
  }
  
  // =============== VISTAS PARA EJECUTIVO DE VENTAS ===============
  
  // Cargar dashboard para ejecutivo
  function loadEjecutivoDashboard() {
    const dashboardView = document.getElementById('dashboardView');
    
    dashboardView.innerHTML = `
      <h1 class="dashboard-title">Dashboard</h1>
      <div class="cards-container">
        <div class="card">
          <h2 class="card-title">Contratos Activos</h2>
          <div class="card-value">12</div>
        </div>
        <div class="card">
          <h2 class="card-title">Depósitos Pendientes</h2>
          <div class="card-value">5</div>
        </div>
        <div class="card">
          <h2 class="card-title">Total Depositado (mes)</h2>
          <div class="card-value">$8.5M</div>
        </div>
        <div class="card">
          <h2 class="card-title">Giras Próximas</h2>
          <div class="card-value">3</div>
        </div>
      </div>
      
      <div class="table-container">
        <div class="table-header">
          <h2 class="table-title">Contratos Recientes</h2>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Colegio</th>
              <th>Curso</th>
              <th>Destino</th>
              <th>Fecha de Viaje</th>
              <th>Monto Total</th>
              <th>Progreso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Colegio San Ignacio</td>
              <td>4° Medio A</td>
              <td>Cancún, México</td>
              <td>15/10/2025</td>
              <td>$15,000,000</td>
              <td>80%</td>
              <td><span class="status status-active">Activo</span></td>
              <td class="actions">
                <button>Ver</button>
                <button>Editar</button>
              </td>
            </tr>
            <tr>
              <td>Colegio Santa María</td>
              <td>3° Medio B</td>
              <td>Buenos Aires, Argentina</td>
              <td>05/11/2025</td>
              <td>$8,500,000</td>
              <td>65%</td>
              <td><span class="status status-active">Activo</span></td>
              <td class="actions">
                <button>Ver</button>
                <button>Editar</button>
              </td>
            </tr>
            <tr>
              <td>Liceo Manuel Barros</td>
              <td>4° Medio C</td>
              <td>Río de Janeiro, Brasil</td>
              <td>20/09/2025</td>
              <td>$12,800,000</td>
              <td>95%</td>
              <td><span class="status status-pending">Pendiente</span></td>
              <td class="actions">
                <button>Ver</button>
                <button>Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    
    showView('dashboardView');
    
    // Configurar eventos para botones de acciones
    const actionButtons = dashboardView.querySelectorAll('.actions button');
    actionButtons.forEach(button => {
      button.addEventListener('click', function() {
        if (this.textContent === 'Ver') {
          alert('Ver detalles del contrato');
        } else if (this.textContent === 'Editar') {
          loadCrearContrato(true); // true indica modo edición
        }
      });
    });
  }
  
  // Cargar vista de contratos para ejecutivo
  function loadEjecutivoContracts() {
    const contractsView = document.getElementById('contractsView');
    
    contractsView.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Gestión de Contratos</h1>
        <div class="page-actions">
          <button id="createContractBtn">Nuevo Contrato</button>
        </div>
      </div>
      
      <div class="search-bar">
        <input type="text" placeholder="Buscar contrato, cliente o curso...">
        <button>Buscar</button>
      </div>
      
      <div class="table-container">
        <div class="table-header">
          <h2 class="table-title">Contratos Activos</h2>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>N° Contrato</th>
              <th>Colegio</th>
              <th>Curso</th>
              <th>Destino</th>
              <th>Fecha de Viaje</th>
              <th>Monto Total</th>
              <th>Progreso</th>
              <th>Estado</th>
              <th>Acciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#1245</td>
              <td>Colegio San Ignacio</td>
              <td>4° Medio A</td>
              <td>Cancún, México</td>
              <td>15/10/2025</td>
              <td>$15,000,000</td>
              <td>
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 80%;"></div>
                </div>
                <div class="progress-text">80%</div>
              </td>
              <td><span class="status status-active">Activo</span></td>
              <td class="actions">
                <button class="view-contract">Ver</button>
                <button class="edit-contract">Editar</button>
              </td>
            </tr>
            <tr>
              <td>#1246</td>
              <td>Colegio Santa María</td>
              <td>3° Medio B</td>
              <td>Buenos Aires, Argentina</td>
              <td>05/11/2025</td>
              <td>$8,500,000</td>
              <td>
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 65%;"></div>
                </div>
                <div class="progress-text">65%</div>
              </td>
              <td><span class="status status-active">Activo</span></td>
              <td class="actions">
                <button class="view-contract">Ver</button>
                <button class="edit-contract">Editar</button>
              </td>
            </tr>
            <tr>
              <td>#1247</td>
              <td>Liceo Manuel Barros</td>
              <td>4° Medio C</td>
              <td>Río de Janeiro, Brasil</td>
              <td>20/09/2025</td>
              <td>$12,800,000</td>
              <td>
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 95%;"></div>
                </div>
                <div class="progress-text">95%</div>
              </td>
              <td><span class="status status-pending">Pendiente</span></td>
              <td class="actions">
                <button class="view-contract">Ver</button>
                <button class="edit-contract">Editar</button>
              </td>
            </tr>
            <tr>
              <td>#1248</td>
              <td>Colegio Los Cipreses</td>
              <td>3° Medio A</td>
              <td>Punta Cana, Rep. Dominicana</td>
              <td>08/08/2025</td>
              <td>$18,200,000</td>
              <td>
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 100%;"></div>
                </div>
                <div class="progress-text">100%</div>
              </td>
              <td><span class="status status-completed">Completado</span></td>
              <td class="actions">
                <button class="view-contract">Ver</button>
                <button class="edit-contract">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    
    showView('contractsView');
    
    // Configurar evento para botón de nuevo contrato
    const createContractBtn = contractsView.querySelector('#createContractBtn');
    if (createContractBtn) {
      createContractBtn.addEventListener('click', function() {
        loadCrearContrato();
      });
    }
    
    // Configurar eventos para botones de acciones
    const viewButtons = contractsView.querySelectorAll('.view-contract');
    const editButtons = contractsView.querySelectorAll('.edit-contract');
    
    viewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const row = this.closest('tr');
        const contractId = row.cells[0].textContent;
        alert(`Ver detalles del contrato ${contractId}`);
      });
    });
    
    editButtons.forEach(button => {
      button.addEventListener('click', function() {
        loadCrearContrato(true); // Modo edición
      });
    });
  }
  
  // Cargar vista de crear/editar contrato para ejecutivo
  function loadCrearContrato(isEditMode = false) {
    const createContractView = document.getElementById('createContractView');
    
    createContractView.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">${isEditMode ? 'Editar Contrato #1245' : 'Crear Nuevo Contrato'}</h1>
      </div>
      
      <div class="form-container">
        <form id="contractForm">
          <div class="form-section">
            <h2 class="form-section-title">Información del Cliente</h2>
            <div class="form-row">
              <div class="form-group">
                <label for="colegio">Colegio</label>
                <select id="colegio" ${isEditMode ? 'value="Colegio San Ignacio"' : ''}>
                  <option value="">Seleccionar Colegio</option>
                  <option value="1" ${isEditMode ? 'selected' : ''}>Colegio San Ignacio</option>
                  <option value="2">Colegio Santa María</option>
                  <option value="3">Liceo Manuel Barros</option>
                  <option value="4">Colegio Los Cipreses</option>
                </select>
              </div>
              <div class="form-group">
                <label for="curso">Curso</label>
                <input type="text" id="curso" placeholder="Ej: 4° Medio A" ${isEditMode ? 'value="4° Medio A"' : ''}>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="representante">Nombre del Representante</label>
                <input type="text" id="representante" placeholder="Nombre completo" ${isEditMode ? 'value="Carlos Martínez"' : ''}>
              </div>
              <div class="form-group">
                <label for="email">Email de Contacto</label>
                <input type="email" id="email" placeholder="correo@ejemplo.com" ${isEditMode ? 'value="cmartinez@colegiosanignacio.cl"' : ''}>
              </div>
              <div class="form-group">
                <label for="telefono">Teléfono de Contacto</label>
                <input type="text" id="telefono" placeholder="+56 9 XXXX XXXX" ${isEditMode ? 'value="+56 9 8765 4321"' : ''}>
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <h2 class="form-section-title">Detalles del Viaje</h2>
            <div class="form-row">
              <div class="form-group">
                <label for="destino">Destino</label>
                <select id="destino">
                  <option value="">Seleccionar Destino</option>
                  <option value="1" ${isEditMode ? 'selected' : ''}>Cancún, México</option>
                  <option value="2">Buenos Aires, Argentina</option>
                  <option value="3">Río de Janeiro, Brasil</option>
                  <option value="4">Punta Cana, Rep. Dominicana</option>
                  <option value="5">Orlando, Estados Unidos</option>
                </select>
              </div>
              <div class="form-group">
                <label for="fecha_inicio">Fecha de Inicio</label>
                <input type="date" id="fecha_inicio" ${isEditMode ? 'value="2025-10-15"' : ''}>
              </div>
              <div class="form-group">
                <label for="fecha_fin">Fecha de Término</label>
                <input type="date" id="fecha_fin" ${isEditMode ? 'value="2025-10-22"' : ''}>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="alumnos">Número de Alumnos</label>
                <input type="number" id="alumnos" min="1" placeholder="Ej: 30" ${isEditMode ? 'value="30"' : ''}>
              </div>
              <div class="form-group">
                <label for="adultos">Número de Adultos</label>
                <input type="number" id="adultos" min="1" placeholder="Ej: 4" ${isEditMode ? 'value="4"' : ''}>
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <h2 class="form-section-title">Detalles Financieros</h2>
            <div class="form-row">
              <div class="form-group">
                <label for="monto_total">Monto Total del Paquete</label>
                <input type="text" id="monto_total" placeholder="Ej: $15,000,000" ${isEditMode ? 'value="$15,000,000"' : ''}>
              </div>
              <div class="form-group">
                <label for="monto_alumno">Monto por Alumno</label>
                <input type="text" id="monto_alumno" placeholder="Ej: $500,000" ${isEditMode ? 'value="$500,000"' : ''}>
              </div>
              <div class="form-group">
                <label for="monto_reserva">Monto de Reserva</label>
                <input type="text" id="monto_reserva" placeholder="Ej: $3,000,000" ${isEditMode ? 'value="$3,000,000"' : ''}>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="fecha_limite">Fecha Límite de Pago</label>
                <input type="date" id="fecha_limite" ${isEditMode ? 'value="2025-09-15"' : ''}>
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <h2 class="form-section-title">Servicios Incluidos</h2>
            <div class="form-row">
              <div class="form-group">
                <label for="servicios">Descripción de Servicios</label>
                <textarea id="servicios" placeholder="Describa los servicios incluidos en el paquete turístico">${isEditMode ? 'Paquete todo incluido con vuelos, hotel 5 estrellas, traslados, alimentación completa y actividades recreativas.' : ''}</textarea>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="seguros">Seguros</label>
                <select id="seguros" multiple>
                  <option value="1" ${isEditMode ? 'selected' : ''}>Seguro de Viaje Básico</option>
                  <option value="2" ${isEditMode ? 'selected' : ''}>Seguro de Cancelación</option>
                  <option value="3">Seguro Médico Internacional</option>
                  <option value="4">Seguro de Equipaje</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="actions">
            <button type="button" id="cancelContractBtn" class="btn-secondary">Cancelar</button>
            <button type="button" id="saveContractBtn">${isEditMode ? 'Guardar Cambios' : 'Crear Contrato'}</button>
          </div>
        </form>
      </div>
    `;
    
    showView('createContractView');
    
    // Configurar eventos para botones
    const cancelBtn = createContractView.querySelector('#cancelContractBtn');
    const saveBtn = createContractView.querySelector('#saveContractBtn');
    
    cancelBtn.addEventListener('click', function() {
      loadView('contracts');
    });
    
    saveBtn.addEventListener('click', function() {
      alert(`Contrato ${isEditMode ? 'actualizado' : 'creado'} exitosamente`);
      loadView('contracts');
    });
  }
  
  // Cargar vista de depósitos para ejecutivo
  function loadEjecutivoDepositos() {
    const depositsView = document.getElementById('depositsView');
    
    depositsView.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Gestión de Depósitos</h1>
        <div class="page-actions">
          <button id="registerDepositBtn">Registrar Nuevo Depósito</button>
        </div>
      </div>
      
      <div class="search-bar">
        <input type="text" placeholder="Buscar por colegio, curso o tipo de depósito...">
        <button>Buscar</button>
      </div>
      
      <div class="table-container">
        <div class="table-header">
          <h2 class="table-title">Depósitos Recientes</h2>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Colegio</th>
              <th>Curso</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>15/06/2025</td>
              <td>Colegio San Ignacio</td>
              <td>4° Medio A</td>
              <td>Colectivo</td>
              <td>Rifa del curso</td>
              <td>$2,250,000</td>
              <td><span class="status status-active">Verificado</span></td>
              <td class="actions">
                <button>Ver</button>
              </td>
            </tr>
            <tr>
              <td>01/06/2025</td>
              <td>Colegio San Ignacio</td>
              <td>4° Medio A</td>
              <td>Individual</td>
              <td>Pago de cuota - María González</td>
              <td>$150,000</td>
              <td><span class="status status-active">Verificado</span></td>
              <td class="actions">
                <button>Ver</button>
              </td>
            </tr>
            <tr>
              <td>28/05/2025</td>
              <td>Colegio Santa María</td>
              <td>3° Medio B</td>
              <td>Colectivo</td>
              <td>Fiesta beneficio</td>
              <td>$3,000,000</td>
              <td><span class="status status-active">Verificado</span></td>
              <td class="actions">
                <button>Ver</button>
              </td>
            </tr>
            <tr>
              <td>15/05/2025</td>
              <td>Liceo Manuel Barros</td>
              <td>4° Medio C</td>
              <td>Individual</td>
              <td>Pago de cuota - Juan Rodríguez</td>
              <td>$200,000</td>
              <td><span class="status status-pending">Pendiente</span></td>
              <td class="actions">
                <button>Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    
    showView('depositsView');
    
    // Configurar evento para botón de registrar depósito
    const registerDepositBtn = depositsView.querySelector('#registerDepositBtn');
    registerDepositBtn.addEventListener('click', function() {
      alert('Función de registro de depósito en desarrollo');
    });
    
    // Configurar eventos para botones de ver
    const viewButtons = depositsView.querySelectorAll('.actions button');
    viewButtons.forEach(button => {
      button.addEventListener('click', function() {
        alert('Ver detalles del depósito');
      });
    });
  }
  
  // =============== VISTAS PARA APODERADO ===============
  
  // Cargar dashboard para apoderado
  function loadApoderadoDashboard() {
    const dashboardView = document.getElementById('dashboardView');
    
    dashboardView.innerHTML = `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Bienvenido/a, María</h1>
        <h2 class="dashboard-subtitle">Gira de Estudios - Colegio San Ignacio - 4° Medio A</h2>
      </div>
      
      <div class="cards-container">
        <div class="card">
          <h2 class="card-title">Estado de Cuenta</h2>
          <div class="card-value">$1,125,000</div>
          <div class="card-subtitle">de $1,500,000</div>
          <div class="progress-container">
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: 75%;"></div>
            </div>
            <div class="progress-text">
              <span>75% completado</span>
              <span>Falta: $375,000</span>
            </div>
          </div>
        </div>
        <div class="card">
          <h2 class="card-title">Destino</h2>
          <div class="card-value">Cancún, México</div>
          <div class="card-subtitle">15 al 22 de Octubre, 2025</div>
        </div>
        <div class="card">
          <h2 class="card-title">Progreso del Curso</h2>
          <div class="card-value">80%</div>
          <div class="card-subtitle">Meta grupal: $37,500,000</div>
        </div>
      </div>
      
      <div class="sections-container">
        <div class="section">
          <div class="section-title">
            <span>Últimos Movimientos</span>
          </div>
          <div class="transaction">
            <div class="transaction-details">
              <div class="transaction-title">Depósito personal</div>
              <div class="transaction-date">15 de junio, 2025</div>
            </div>
            <div class="transaction-amount">+$150,000</div>
          </div>
          <div class="transaction">
            <div class="transaction-details">
              <div class="transaction-title">Rifa curso (prorrateado)</div>
              <div class="transaction-date">28 de mayo, 2025</div>
            </div>
            <div class="transaction-amount">+$75,000</div>
          </div>
          <div class="transaction">
            <div class="transaction-details">
              <div class="transaction-title">Fiesta beneficio (prorrateado)</div>
              <div class="transaction-date">15 de mayo, 2025</div>
            </div>
            <div class="transaction-amount">+$100,000</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">
            <span>Documentos Importantes</span>
          </div>
          <div class="transaction">
            <div class="transaction-details">
              <div class="transaction-title">Contrato de Viaje</div>
            </div>
            <div class="actions">
              <button>Ver</button>
            </div>
          </div>
          <div class="transaction">
            <div class="transaction-details">
              <div class="transaction-title">Póliza de Seguro</div>
            </div>
            <div class="actions">
              <button>Ver</button>
            </div>
          </div>
          <div class="transaction">
            <div class="transaction-details">
              <div class="transaction-title">Itinerario Detallado</div>
            </div>
            <div class="actions">
              <button>Ver</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">
          <span>Próximas Actividades</span>
        </div>
        <div class="transaction">
          <div class="transaction-details">
            <div class="transaction-title">Reunión informativa - Salón Multiuso</div>
            <div class="transaction-date">25 de junio, 2025 - 19:00 hrs</div>
          </div>
        </div>
        <div class="transaction">
          <div class="transaction-details">
            <div class="transaction-title">Venta de completos - Patio central</div>
            <div class="transaction-date">30 de junio, 2025 - 12:00 hrs</div>
          </div>
        </div>
        <div class="transaction">
          <div class="transaction-details">
            <div class="transaction-title">Última fecha de pago cuota</div>
            <div class="transaction-date">15 de julio, 2025</div>
          </div>
        </div>
      </div>
    `;
    
    showView('dashboardView');
    
    // Configurar eventos para botones de documentos
    const documentButtons = dashboardView.querySelectorAll('.section button');
    documentButtons.forEach(button => {
      button.addEventListener('click', function() {
        loadView('documents');
      });
    });
  }
  
  // Cargar vista de aportes para apoderado
  function loadApoderadoAportes() {
    const aportesView = document.getElementById('aportesView');
    
    if (!aportesView) {
      // Crear la vista si no existe
      const newView = document.createElement('div');
      newView.id = 'aportesView';
      newView.className = 'view';
      viewContainer.appendChild(newView);
      
      // Actualizar referencia
      aportesView = newView;
    }
    
    aportesView.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Mis Aportes</h1>
      </div>
      
      <div class="cards-container">
        <div class="card">
          <h2 class="card-title">Estado de Cuenta</h2>
          <div class="card-value">$1,125,000</div>
          <div class="card-subtitle">de $1,500,000</div>
          <div class="progress-container">
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: 75%;"></div>
            </div>
            <div class="progress-text">
              <span>75% completado</span>
              <span>Falta: $375,000</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">
          <span>Historial de Aportes</span>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Comprobante</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>15/06/2025</td>
              <td>Depósito Personal</td>
              <td>Pago de cuota mensual</td>
              <td>$150,000</td>
              <td class="actions">
                <button>Ver</button>
              </td>
            </tr>
            <tr>
              <td>28/05/2025</td>
              <td>Actividad Grupal</td>
              <td>Rifa curso (prorrateado)</td>
              <td>$75,000</td>
              <td class="actions">
                <button>Ver</button>
              </td>
            </tr>
            <tr>
              <td>15/05/2025</td>
              <td>Actividad Grupal</td>
              <td>Fiesta beneficio (prorrateado)</td>
              <td>$100,000</td>
              <td class="actions">
                <button>Ver</button>
              </td>
            </tr>
            <tr>
              <td>10/05/2025</td>
              <td>Depósito Personal</td>
              <td>Pago de cuota mensual</td>
              <td>$200,000</td>
              <td class="actions">
                <button>Ver</button>
              </td>
            </tr>
            <tr>
              <td>15/04/2025</td>
              <td>Depósito Personal</td>
              <td>Pago de cuota mensual</td>
              <td>$200,000</td>
              <td class="actions">
                <button>Ver</button>
              </td>
            </tr>
            <tr>
              <td>10/04/2025</td>
              <td>Actividad Grupal</td>
              <td>Venta de empanadas (prorrateado)</td>
              <td>$50,000</td>
              <td class="actions">
                <button>Ver</button>
              </td>
            </tr>
            <tr>
              <td>15/03/2025</td>
              <td>Depósito Personal</td>
              <td>Pago de cuota mensual</td>
              <td>$200,000</td>
              <td class="actions">
                <button>Ver</button>
              </td>
            </tr>
            <tr>
              <td>15/02/2025</td>
              <td>Depósito Personal</td>
              <td>Pago de reserva</td>
              <td>$150,000</td>
              <td class="actions">
                <button>Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="section mt-20">
        <div class="section-title">
          <span>Próximos Pagos</span>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Fecha Límite</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>15/07/2025</td>
              <td>Cuota mensual julio</td>
              <td>$150,000</td>
              <td><span class="status status-pending">Pendiente</span></td>
            </tr>
            <tr>
              <td>15/08/2025</td>
              <td>Cuota mensual agosto</td>
              <td>$150,000</td>
              <td><span class="status status-pending">Pendiente</span></td>
            </tr>
            <tr>
              <td>15/09/2025</td>
              <td>Cuota final</td>
              <td>$75,000</td>
              <td><span class="status status-pending">Pendiente</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    
    showView('aportesView');
    
    // Configurar eventos para botones de comprobantes
    const comprobanteBtns = aportesView.querySelectorAll('.actions button');
    comprobanteBtns.forEach(button => {
      button.addEventListener('click', function() {
        alert('Ver comprobante de pago');
      });
    });
  }
  
  // Cargar vista de documentos para apoderado
  function loadApoderadoDocumentos() {
    const documentsView = document.getElementById('documentsView');
    
    documentsView.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Documentos</h1>
      </div>
      
      <div class="tabs">
        <div class="tab active">Todos los Documentos</div>
        <div class="tab">Contratos</div>
        <div class="tab">Seguros</div>
        <div class="tab">Itinerarios</div>
      </div>
      
      <div class="search-bar">
        <input type="text" placeholder="Buscar documento...">
        <button>Buscar</button>
      </div>
      
      <div class="document-grid">
        <div class="document-card">
          <div class="document-icon">PDF</div>
          <div class="document-title">Contrato de Viaje</div>
          <div class="document-meta">15/03/2025 | PDF | 2.3 MB</div>
          <div class="document-actions">
            <button>Ver</button>
            <button>Descargar</button>
          </div>
        </div>
        
        <div class="document-card">
          <div class="document-icon">PDF</div>
          <div class="document-title">Póliza de Seguro</div>
          <div class="document-meta">20/03/2025 | PDF | 1.8 MB</div>
          <div class="document-actions">
            <button>Ver</button>
            <button>Descargar</button>
          </div>
        </div>
        
        <div class="document-card">
          <div class="document-icon">DOC</div>
          <div class="document-title">Itinerario Detallado</div>
          <div class="document-meta">25/03/2025 | DOCX | 1.2 MB</div>
          <div class="document-actions">
            <button>Ver</button>
            <button>Descargar</button>
          </div>
        </div>
        
        <div class="document-card">
          <div class="document-icon">PDF</div>
          <div class="document-title">Protocolo de Emergencias</div>
          <div class="document-meta">01/04/2025 | PDF | 1.5 MB</div>
          <div class="document-actions">
          <div class="document-actions">
            <button>Ver</button>
            <button>Descargar</button>
          </div>
        </div>
        
        <div class="document-card">
          <div class="document-icon">PDF</div>
          <div class="document-title">Comprobante de Reserva</div>
          <div class="document-meta">10/04/2025 | PDF | 0.8 MB</div>
          <div class="document-actions">
            <button>Ver</button>
            <button>Descargar</button>
          </div>
        </div>
        
        <div class="document-card">
          <div class="document-icon">XLS</div>
          <div class="document-title">Lista de Participantes</div>
          <div class="document-meta">15/04/2025 | XLSX | 0.5 MB</div>
          <div class="document-actions">
            <button>Ver</button>
            <button>Descargar</button>
          </div>
        </div>
        
        <div class="document-card">
          <div class="document-icon">JPG</div>
          <div class="document-title">Comprobante Depósito</div>
          <div class="document-meta">20/04/2025 | JPG | 1.1 MB</div>
          <div class="document-actions">
            <button>Ver</button>
            <button>Descargar</button>
          </div>
        </div>
        
        <div class="document-card">
          <div class="document-icon">PDF</div>
          <div class="document-title">Contrato Hotel</div>
          <div class="document-meta">25/04/2025 | PDF | 3.2 MB</div>
          <div class="document-actions">
            <button>Ver</button>
            <button>Descargar</button>
          </div>
        </div>
      </div>
    `;
    
    showView('documentsView');
    
    // Configurar eventos para botones de documentos
    const viewButtons = documentsView.querySelectorAll('.document-actions button:first-child');
    const downloadButtons = documentsView.querySelectorAll('.document-actions button:last-child');
    
    viewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const card = this.closest('.document-card');
        const title = card.querySelector('.document-title').textContent;
        alert(`Visualizando documento: ${title}`);
      });
    });
    
    downloadButtons.forEach(button => {
      button.addEventListener('click', function() {
        const card = this.closest('.document-card');
        const title = card.querySelector('.document-title').textContent;
        alert(`Descargando documento: ${title}`);
      });
    });
    
    // Configurar eventos para las pestañas
    const tabs = documentsView.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.textContent.trim();
        alert(`Filtrando por categoría: ${category}`);
        // Aquí iría la lógica para filtrar los documentos según la categoría
      });
    });
  }
  
  // Inicializar la aplicación
  console.log('Aplicación inicializada');
});
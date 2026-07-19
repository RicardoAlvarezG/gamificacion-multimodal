const { Builder, By, until } = require("selenium-webdriver");
const path = require("path");
const fs = require("fs");

const URL_APLICACION = "http://localhost:3000";
const USUARIO = "Ruth24";
const CONTRASENA = "Rsanchez24+++";
const TIEMPO_ESPERA = 30000;

const AULA = {
  nombre: "5 AÑOS",
  turno: "Mañana",
  grado: "Inicial 5 años",
};

const ESTUDIANTE = {
  nombres: "LUIS DANIEL",
  apellidos: "PEREZ LOPEZ",
  nombreCompleto: "LUIS DANIEL PEREZ LOPEZ",
};

const IMAGENES = [
  { palabra: "FLOR", ruta: path.resolve(__dirname, "ima", "flor.webp") },
  { palabra: "ARBOL", ruta: path.resolve(__dirname, "ima", "arbol.webp") },
  { palabra: "LAPIZ", ruta: path.resolve(__dirname, "ima", "lapiz.webp") },
];

let pasoActual = "Inicio";

function registrarPaso(numero, descripcion) {
  pasoActual = `Paso ${numero}: ${descripcion}`;
  console.log(`\n========== ${pasoActual} ==========`);
}

async function esperarElemento(driver, localizador, tiempo = TIEMPO_ESPERA) {
  const elemento = await driver.wait(until.elementLocated(localizador), tiempo);
  await driver.wait(until.elementIsVisible(elemento), tiempo);
  return elemento;
}

async function esperarVarios(driver, localizador, minimo = 1, tiempo = TIEMPO_ESPERA) {
  await driver.wait(async () => {
    const elementos = await driver.findElements(localizador);
    return elementos.length >= minimo;
  }, tiempo);
  return driver.findElements(localizador);
}

async function clicSeguro(driver, localizador) {
  const elemento = await esperarElemento(driver, localizador);
  await driver.executeScript(
    "arguments[0].scrollIntoView({block:'center', inline:'center'});",
    elemento
  );
  await driver.sleep(250);

  try {
    await driver.wait(until.elementIsEnabled(elemento), TIEMPO_ESPERA);
    await elemento.click();
  } catch {
    await driver.executeScript("arguments[0].click();", elemento);
  }

  return elemento;
}

async function escribir(driver, localizador, texto) {
  const elemento = await esperarElemento(driver, localizador);
  await driver.executeScript(
    "arguments[0].scrollIntoView({block:'center'});",
    elemento
  );
  await elemento.clear();
  await elemento.sendKeys(texto);
  return elemento;
}

function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

async function seleccionarPorTexto(driver, localizador, texto) {
  const select = await esperarElemento(driver, localizador);

  await driver.wait(async () => {
    const opcionesActuales = await select.findElements(By.css("option"));
    return opcionesActuales.length > 1;
  }, TIEMPO_ESPERA);

  const opciones = await select.findElements(By.css("option"));
  const buscado = normalizarTexto(texto);
  const disponibles = [];

  for (const opcion of opciones) {
    const contenido = (await opcion.getText()).trim();
    disponibles.push(contenido);
    const normalizado = normalizarTexto(contenido);

    if (
      normalizado === buscado ||
      normalizado.includes(buscado) ||
      buscado.includes(normalizado)
    ) {
      const valor = await opcion.getAttribute("value");
      await driver.executeScript(
        `const select = arguments[0];
         select.value = arguments[1];
         select.dispatchEvent(new Event('change', { bubbles: true }));`,
        select,
        valor
      );
      await driver.sleep(500);
      console.log(`Opción seleccionada: ${contenido}`);
      return;
    }
  }

  throw new Error(
    `No se encontró la opción "${texto}". Opciones disponibles: ${disponibles.join(" | ")}`
  );
}

async function aceptarAlerta(driver, textoEsperado) {
  await driver.wait(until.alertIsPresent(), TIEMPO_ESPERA);
  const alerta = await driver.switchTo().alert();
  const texto = await alerta.getText();

  if (
    textoEsperado &&
    !texto.toLowerCase().includes(textoEsperado.toLowerCase())
  ) {
    throw new Error(
      `Se esperaba la alerta "${textoEsperado}", pero apareció "${texto}".`
    );
  }

  console.log(`Alerta aceptada: ${texto}`);
  await alerta.accept();
}

async function tomarCapturaError(driver) {
  try {
    const carpeta = path.resolve(__dirname, "evidencias-error");
    fs.mkdirSync(carpeta, { recursive: true });
    const nombre = `error-${Date.now()}.png`;
    const captura = await driver.takeScreenshot();
    fs.writeFileSync(path.join(carpeta, nombre), captura, "base64");
    console.error(`Captura guardada en: e2e/selenium/evidencias-error/${nombre}`);
  } catch (errorCaptura) {
    console.error("No se pudo guardar la captura del error:", errorCaptura.message);
  }
}

function verificarImagenes() {
  for (const imagen of IMAGENES) {
    if (!fs.existsSync(imagen.ruta)) {
      throw new Error(`No existe la imagen requerida: ${imagen.ruta}`);
    }
  }
}

async function iniciarSesion(driver) {
  registrarPaso(1, "Iniciar sesión");
  await driver.get(URL_APLICACION);

  await escribir(
    driver,
    By.xpath("//label[contains(normalize-space(),'ID de Usuario')]/following::input[1]"),
    USUARIO
  );
  await escribir(driver, By.css('input[name="password"]'), CONTRASENA);
  await clicSeguro(driver, By.xpath("//button[normalize-space()='Ingresar']"));

  await driver.wait(until.urlContains("/dashboard/docente"), TIEMPO_ESPERA);
  await esperarElemento(driver, By.xpath("//*[contains(normalize-space(),'Panel docente')]"));
  console.log("Inicio de sesión correcto.");
}

async function crearAula(driver) {
  registrarPaso(2, "Crear el aula 5 AÑOS con grado Inicial 5 años");

  const aulaExistente = await driver.findElements(
    By.xpath(`//*[normalize-space()='${AULA.nombre}']`)
  );

  if (aulaExistente.length > 0) {
    throw new Error(
      `El aula "${AULA.nombre}" ya existe. Elimínala antes de ejecutar la prueba para crearla nuevamente con grado Inicial 5 años.`
    );
  }

  await clicSeguro(
    driver,
    By.xpath(
      "//h2[normalize-space()='Mis aulas']/ancestor::div[contains(@class,'rounded')][1]//a[normalize-space()='+ Crear']"
    )
  );

  await driver.wait(
    until.urlContains("/dashboard/docente/aulas/crear"),
    TIEMPO_ESPERA
  );

  await escribir(
    driver,
    By.xpath("//label[normalize-space()='Nombre del aula']/following::input[1]"),
    AULA.nombre
  );

  await seleccionarPorTexto(
    driver,
    By.xpath("//label[normalize-space()='Turno']/following::select[1]"),
    AULA.turno
  );

  const selectorGrado = By.xpath(
    "//label[contains(normalize-space(),'Grado / Edad')]/following::select[1]"
  );

  await seleccionarPorTexto(driver, selectorGrado, AULA.grado);

  const elementoGrado = await esperarElemento(driver, selectorGrado);
  const gradoSeleccionado = (
    await elementoGrado.findElement(By.css("option:checked")).getText()
  ).trim();

  if (normalizarTexto(gradoSeleccionado) !== normalizarTexto(AULA.grado)) {
    throw new Error(
      `No se seleccionó correctamente el grado. Valor actual: "${gradoSeleccionado}".`
    );
  }

  console.log(`Grado confirmado: ${gradoSeleccionado}`);

  await escribir(
    driver,
    By.xpath(
      "//label[contains(normalize-space(),'Confirma tu contraseña')]/following::input[1]"
    ),
    CONTRASENA
  );

  await clicSeguro(driver, By.xpath("//button[normalize-space()='Crear aula']"));
  await aceptarAlerta(driver, "Aula creada correctamente");

  await driver.wait(
    until.urlContains("/dashboard/docente/aulas"),
    TIEMPO_ESPERA
  );
  await esperarElemento(driver, By.xpath(`//*[normalize-space()='${AULA.nombre}']`));
  console.log("Aula creada correctamente con grado Inicial 5 años.");
}

async function abrirModuloEstudiantes(driver) {
  registrarPaso(3, "Ingresar al módulo Estudiantes");
  await driver.get(`${URL_APLICACION}/dashboard/docente`);
  await esperarElemento(driver, By.xpath("//*[contains(normalize-space(),'Panel docente')]"));

  await clicSeguro(
    driver,
    By.xpath(
      "//h2[normalize-space()='Estudiantes']/ancestor::div[contains(@class,'rounded')][1]//a[normalize-space()='Ingresar']"
    )
  );
  await driver.wait(until.urlContains("/dashboard/docente/estudiantes"), TIEMPO_ESPERA);
  await esperarElemento(driver, By.xpath("//h1[normalize-space()='Estudiantes']"));
}

async function registrarEstudiante(driver) {
  registrarPaso(4, "Seleccionar aula y registrar o reutilizar estudiante");

  await clicSeguro(
    driver,
    By.xpath(`//h2[normalize-space()='${AULA.nombre}']/ancestor::button[1]`)
  );
  await esperarElemento(driver, By.xpath(`//h2[contains(normalize-space(),'${AULA.nombre}')]`));

  const estudianteExistente = await driver.findElements(
    By.xpath(`//td[contains(normalize-space(),'${ESTUDIANTE.nombreCompleto}')]`)
  );

  if (estudianteExistente.length > 0) {
    console.log("El estudiante ya existe. Se reutilizará para continuar la prueba.");
    return;
  }

  await clicSeguro(driver, By.xpath("//button[normalize-space()='+ Agregar estudiante']"));

  await esperarElemento(driver, By.xpath("//h3[normalize-space()='Agregar estudiante']"));
  await escribir(
    driver,
    By.xpath("//h3[normalize-space()='Agregar estudiante']/following::label[normalize-space()='Nombres']/following::input[1]"),
    ESTUDIANTE.nombres
  );
  await escribir(
    driver,
    By.xpath("//h3[normalize-space()='Agregar estudiante']/following::label[normalize-space()='Apellidos']/following::input[1]"),
    ESTUDIANTE.apellidos
  );
  await escribir(
    driver,
    By.xpath("//h3[normalize-space()='Agregar estudiante']/following::label[contains(normalize-space(),'Confirma tu contraseña')]/following::input[1]"),
    CONTRASENA
  );
  await clicSeguro(
    driver,
    By.xpath("//h3[normalize-space()='Agregar estudiante']/following::button[normalize-space()='Guardar'][1]")
  );
  await aceptarAlerta(driver, "Estudiante registrado correctamente");

  await esperarElemento(
    driver,
    By.xpath(`//td[contains(normalize-space(),'${ESTUDIANTE.nombreCompleto}')]`)
  );
  console.log("Estudiante registrado correctamente.");
}

async function asignarAvatar(driver) {
  registrarPaso(5, "Abrir detalle y asignar avatar");

  const fila = `//tr[td[contains(normalize-space(),'${ESTUDIANTE.nombreCompleto}')]]`;
  await clicSeguro(driver, By.xpath(`${fila}//button[normalize-space()='🔍']`));
  await esperarElemento(driver, By.xpath("//h3[normalize-space()='Estudiante']"));

  await clicSeguro(
    driver,
    By.xpath("//h3[normalize-space()='Estudiante']/following::button[normalize-space()='✏️'][1]")
  );
  await esperarElemento(driver, By.xpath("//*[normalize-space()='Selecciona un avatar']"));
  await clicSeguro(driver, By.xpath("//img[@alt='oso']/ancestor::button[1]"));
  await aceptarAlerta(driver, "Avatar asignado correctamente");

  await clicSeguro(
    driver,
    By.xpath("//h3[normalize-space()='Estudiante']/following::button[normalize-space()='✕'][1]")
  );
  await clicSeguro(driver, By.xpath("//a[contains(normalize-space(),'Regresar')]"));
  await driver.wait(until.urlContains("/dashboard/docente"), TIEMPO_ESPERA);
  console.log("Avatar asignado correctamente.");
}

async function abrirJuegosYSeleccionarAula(driver) {
  registrarPaso(6, "Ingresar a Juegos y seleccionar el aula");

  await clicSeguro(
    driver,
    By.xpath(
      "//h2[normalize-space()='Juegos']/ancestor::div[contains(@class,'rounded')][1]//a[normalize-space()='Ingresar']"
    )
  );
  await driver.wait(until.urlContains("/dashboard/docente/juegos"), TIEMPO_ESPERA);
  await esperarElemento(driver, By.xpath("//h1[normalize-space()='Juegos']"));

  await clicSeguro(
    driver,
    By.xpath(`//h2[normalize-space()='${AULA.nombre}']/ancestor::button[1]`)
  );
  await esperarElemento(driver, By.xpath("//*[contains(normalize-space(),'Nombre de sesión:')]"));
}

async function personalizarJuego(driver) {
  registrarPaso(7, "Seleccionar y personalizar Asociación Imagen-Palabra");

  const selectorJuegos = By.xpath("//h3[normalize-space()='Juegos disponibles']/following::select[1]");
  await seleccionarPorTexto(driver, selectorJuegos, "Asociación Imagen");
  await esperarElemento(driver, By.xpath("//h4[contains(normalize-space(),'Asociación Imagen')]"));

  await clicSeguro(driver, By.xpath("//button[contains(normalize-space(),'Personalizar juego')]"));
  await esperarElemento(driver, By.xpath("//h2[contains(normalize-space(),'Personalizar juego')]"));

  for (let i = 0; i < IMAGENES.length; i += 1) {
    const cantidadEsperada = i + 1;
    const inputArchivo = await esperarElemento(
      driver,
      By.xpath("//h2[contains(normalize-space(),'Personalizar juego')]/following::input[@type='file'][1]")
    );
    await inputArchivo.sendKeys(IMAGENES[i].ruta);

    const camposPalabra = await esperarVarios(
      driver,
      By.xpath("//input[@placeholder='Ejemplo: PATO']"),
      cantidadEsperada
    );
    const campoActual = camposPalabra[cantidadEsperada - 1];
    await campoActual.clear();
    await campoActual.sendKeys(IMAGENES[i].palabra);
    console.log(`Imagen ${IMAGENES[i].palabra} cargada.`);
  }

  await clicSeguro(
    driver,
    By.xpath("//h2[contains(normalize-space(),'Personalizar juego')]/following::button[normalize-space()='Guardar'][last()]")
  );
  await aceptarAlerta(driver, "Juego personalizado correctamente");
}

async function iniciarYResolverJuego(driver) {
  registrarPaso(8, "Iniciar y resolver las tres rondas");

  await clicSeguro(driver, By.xpath("//button[contains(normalize-space(),'Iniciar juego')]"));
  await aceptarAlerta(driver, "Juego iniciado correctamente");
  await esperarElemento(driver, By.xpath("//h2[normalize-space()='Asociación Imagen-Palabra']"));

  for (let ronda = 1; ronda <= IMAGENES.length; ronda += 1) {
    const botonFinal = await driver.findElements(By.xpath("//button[normalize-space()='Finalizar Juego']"));
    if (botonFinal.length > 0) break;

    const imagenPrincipal = await esperarElemento(
      driver,
      By.xpath("//h2[normalize-space()='Asociación Imagen-Palabra']/following::img[1]")
    );
    const respuesta = (await imagenPrincipal.getAttribute("alt")).trim();
    console.log(`Ronda ${ronda}: respuesta detectada ${respuesta}`);

    await clicSeguro(driver, By.xpath(`//button[normalize-space()='${respuesta}']`));

    await driver.wait(async () => {
      const finales = await driver.findElements(By.xpath("//button[normalize-space()='Finalizar Juego']"));
      if (finales.length > 0) return true;

      const imagenes = await driver.findElements(
        By.xpath("//h2[normalize-space()='Asociación Imagen-Palabra']/following::img[1]")
      );
      if (imagenes.length === 0) return false;
      const nuevoAlt = (await imagenes[0].getAttribute("alt")).trim();
      return nuevoAlt !== respuesta;
    }, TIEMPO_ESPERA);
  }

  await clicSeguro(driver, By.xpath("//button[normalize-space()='Finalizar Juego']"));
  await esperarElemento(driver, By.xpath("//h2[contains(normalize-space(),'Evaluación del juego')]"));
}

async function evaluarYFinalizarSesion(driver) {
  registrarPaso(9, "Asignar estrellas y guardar evaluación");

  const filaEvaluacion = `//tr[td[contains(normalize-space(),'${ESTUDIANTE.nombreCompleto}')]]`;
  const estrellas = await esperarVarios(
    driver,
    By.xpath(`${filaEvaluacion}//button[normalize-space()='☆']`),
    1
  );

  for (const estrella of estrellas) {
    await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", estrella);
    await estrella.click();
    await driver.sleep(200);
  }

  console.log(`Se marcaron ${estrellas.length} estrellas.`);
  await clicSeguro(driver, By.xpath("//button[contains(normalize-space(),'Guardar evaluación')]"));
  await aceptarAlerta(driver, "Evaluación guardada correctamente");

  registrarPaso(10, "Finalizar sesión de juego");
  await clicSeguro(driver, By.xpath("//button[contains(normalize-space(),'Finalizar sesión')]"));
  await aceptarAlerta(driver, "Sesión finalizada correctamente");

  await esperarElemento(driver, By.xpath(`//h2[normalize-space()='${AULA.nombre}']`));
  await clicSeguro(driver, By.xpath("//a[contains(normalize-space(),'Regresar')]"));
  await driver.wait(until.urlContains("/dashboard/docente"), TIEMPO_ESPERA);
}

async function revisarReporte(driver) {
  registrarPaso(11, "Ingresar a Reportes y abrir reporte del aula");

  await clicSeguro(
    driver,
    By.xpath(
      "//h2[normalize-space()='Reportes']/ancestor::div[contains(@class,'rounded')][1]//a[normalize-space()='Ingresar']"
    )
  );
  await driver.wait(until.urlContains("/dashboard/docente/reportes"), TIEMPO_ESPERA);
  await esperarElemento(driver, By.xpath("//h1[normalize-space()='Reportes']"));

  const tarjetaAula = `//article[.//h2[normalize-space()='${AULA.nombre}']]`;
  await clicSeguro(driver, By.xpath(`${tarjetaAula}//a[contains(normalize-space(),'Ver reporte')]`));
  await esperarElemento(driver, By.xpath(`//h1[contains(normalize-space(),'${AULA.nombre}')]`));

  registrarPaso(12, "Abrir reporte individual del estudiante");
  const filaReporte = `//div[contains(@class,'grid')][.//span[contains(normalize-space(),'${ESTUDIANTE.nombreCompleto}')]]`;
  await clicSeguro(driver, By.xpath(`${filaReporte}//a[contains(normalize-space(),'Ver Reporte')]`));
  await esperarElemento(driver, By.xpath("//h1[normalize-space()='Reporte del Estudiante']"));
  await esperarElemento(driver, By.xpath(`//*[contains(normalize-space(),'${ESTUDIANTE.nombreCompleto}')]`));

  registrarPaso(13, "Desplegar curso evaluado y verificar porcentaje");
  const tituloCursos = await esperarElemento(driver, By.xpath("//h3[normalize-space()='Cursos evaluados']"));
  const botonesCurso = await driver.findElements(
    By.xpath("//h3[normalize-space()='Cursos evaluados']/following::button[contains(@class,'w-full')]")
  );

  if (botonesCurso.length === 0) {
    throw new Error("No apareció ningún curso evaluado en el reporte individual.");
  }

  await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", tituloCursos);
  await botonesCurso[0].click();

  const detallePorcentaje = await esperarElemento(
    driver,
    By.xpath("//h3[normalize-space()='Cursos evaluados']/following::*[contains(normalize-space(),'% - ')][1]")
  );
  console.log(`Reporte verificado: ${(await detallePorcentaje.getText()).trim()}`);

  registrarPaso(14, "Regresar al panel y cerrar sesión");
  await clicSeguro(driver, By.xpath("//a[contains(normalize-space(),'Regresar')]"));
  await esperarElemento(driver, By.xpath(`//h1[contains(normalize-space(),'${AULA.nombre}')]`));
  await clicSeguro(driver, By.xpath("//a[contains(normalize-space(),'Regresar')]"));
  await esperarElemento(driver, By.xpath("//h1[normalize-space()='Reportes']"));
  await clicSeguro(driver, By.xpath("//a[contains(normalize-space(),'Regresar')]"));
  await esperarElemento(driver, By.xpath("//*[contains(normalize-space(),'Panel docente')]"));

  await clicSeguro(driver, By.xpath("//button[normalize-space()='Cerrar sesión']"));
  await driver.wait(until.urlContains("/login"), TIEMPO_ESPERA);
  await esperarElemento(driver, By.xpath("//h2[normalize-space()='Iniciar sesión']"));
  console.log("Sesión cerrada correctamente.");
}

async function ejecutarFlujoCompleto() {
  let driver;

  try {
    verificarImagenes();

    driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().window().maximize();

    await iniciarSesion(driver);
    await crearAula(driver);
    await abrirModuloEstudiantes(driver);
    await registrarEstudiante(driver);
    await asignarAvatar(driver);
    await abrirJuegosYSeleccionarAula(driver);
    await personalizarJuego(driver);
    await iniciarYResolverJuego(driver);
    await evaluarYFinalizarSesion(driver);
    await revisarReporte(driver);

    console.log("\n============================================");
    console.log("PRUEBA E2E FINALIZADA CORRECTAMENTE");
    console.log("============================================\n");
    await driver.sleep(3000);
  } catch (error) {
    console.error(`\nERROR EN ${pasoActual}`);
    console.error(error);

    if (driver) {
      await tomarCapturaError(driver);
      await driver.sleep(3000);
    }

    process.exitCode = 1;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

ejecutarFlujoCompleto();
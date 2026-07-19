const { Builder } = require("selenium-webdriver");

async function abrirAplicacion() {
  let navegador;

  try {
    navegador = await new Builder()
      .forBrowser("chrome")
      .build();

    await navegador.get("http://localhost:3000");

    console.log("Prueba correcta: la aplicación se abrió en Chrome.");

    await navegador.sleep(5000);
  } catch (error) {
    console.error("Error al abrir la aplicación:", error);
    process.exitCode = 1;
  } finally {
    if (navegador) {
      await navegador.quit();
    }
  }
}

abrirAplicacion();
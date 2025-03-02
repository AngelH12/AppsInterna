# POS-CARNET-ADMIN

Este es un proyecto desarrollado en React con TypeScript, usando TanStack Query para la gestión de datos y estado.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (Versión 16.x) - Requerido para ejecutar el proyecto.
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/) - Gestor de paquetes de Node.js.

## Instalación

1. Clona el repositorio en tu máquina local:

   ```bash
   git clone https://github.com/usuario/nombre-del-repositorio.git
   ```


2. Instala las dependencias necesarias (es necesario usar yarn ya que npm falla si no se usa el --force):

   ```bash
   yarn install
   ```

3. Asegúrate de configurar las variables de entorno necesarias. Crea un archivo .env en la raíz del proyecto con las siguientes variables:

   ```bash
   REACT_APP_PUBLIC_URL
   ```

4. Luego debes lanzar la app con

   ```bash
    yarn start -- --reset-cache
   ```
   
Inicia la aplicación en modo de desarrollo. Abre http://localhost:3000 para ver la aplicación en tu navegador.


5. Compila la aplicación para producción en la carpeta build. La aplicación estará lista para desplegarse en un entorno de producción.

```bash
   yarn build
   ```


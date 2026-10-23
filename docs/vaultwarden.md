# Guía de Despliegue y Operación de Vaultwarden Local

> **Documento:** `docs/vaultwarden.md`  
> **Asignatura:** Gestión de Riesgos  
> **Laboratorio:** Laboratorio 2 · Ampliación (Prompt 14)  
> **Tecnología:** Vaultwarden (servidor compatible con la API de Bitwarden implementado en Rust)  
> **Imagen fijada:** `vaultwarden/server:1.32.7`  
> **Aislamiento de red:** `127.0.0.1:8080` (restringido a interfaz de bucle invertido)

---

## 1. Justificación y Arquitectura

En entornos corporativos y proyectos con requisitos estrictos de soberanía del dato y cumplimiento normativo (como el ENS o RGPD), el alojamiento de gestores de contraseñas bajo la infraestructura propia (*self-hosted*) mitiga los riesgos derivados de depender de proveedores cloud externos.

**Vaultwarden** proporciona una implementación ligera y eficiente en recursos de la API del servidor de Bitwarden, compatible al 100% con los clientes y extensiones oficiales (escritorio, navegador y CLI).

### Características de Seguridad del Despliegue Local (Prompt 14)
1. **Versión fija e inmutable:** Se utiliza la etiqueta de release `vaultwarden/server:1.32.7` en lugar de `latest`, evitando inconsistencias o roturas imprevistas por dependencias no controladas.
2. **Exposición en bucle local exclusivamente:** El puerto está mapeado a `127.0.0.1:8080:80`, impidiendo que el contenedor escuche en todas las interfaces de red (`0.0.0.0`) o quede expuesto a otros equipos de la red de área local (LAN).
3. **Persistencia aislada fuera del control de versiones:** La base de datos SQLite y las claves de firmado se almacenan en el directorio `./vw-data`, excluido taxativamente del repositorio en `.gitignore`.
4. **Registro de usuarios deshabilitado:** La directiva `SIGNUPS_ALLOWED=false` previene que terceros creen cuentas no autorizadas en el servidor.
5. **Token de administración criptográficamente protegido:** Si se habilita el acceso a la interfaz `/admin`, el parámetro `ADMIN_TOKEN` debe contener obligatoriamente un hash derivado con el algoritmo **Argon2id**; nunca se almacena la contraseña administrativa en claro en el archivo `docker-compose.yml`.

---

## 2. Instrucciones de Instalación y Arranque

### Prerrequisitos
- Tener instalado **Docker Engine** y **Docker Compose v2** (o Docker Desktop en Windows/macOS).

### Paso 1: Configurar el Token Administrativo con Argon2
Para habilitar el panel de administración de Vaultwarden de forma segura, genere un hash Argon2id ejecutando:

```bash
docker run --rm -it vaultwarden/server:1.32.7 /vaultwarden hash
```

El asistente le solicitará que introduzca la contraseña maestra del panel de administración y devolverá una cadena con el formato:
```
$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ...$wK9...
```

Copie la plantilla de variables de entorno y defina el hash obtenido:
```bash
cp vaultwarden/.env.example vaultwarden/.env
# En vaultwarden/.env:
# VAULTWARDEN_ADMIN_TOKEN_HASH=$argon2id$v=19$m=65536,t=3,p=4$...
```

### Paso 2: Iniciar el Contenedor
Desde el directorio del repositorio, ejecute:

```bash
cd vaultwarden
docker compose up -d
```

### Paso 3: Verificación del Estado
Compruebe que el servicio está activo y saludable (*healthy*):

```bash
docker compose ps
curl -i http://127.0.0.1:8080/alive
```

La respuesta HTTP debe devolver un código `200 OK`.

---

## 3. Configuración de la Extensión de Bitwarden

Para conectar la extensión de Bitwarden (Chrome, Firefox, Edge o Brave) a la instancia local de Vaultwarden:

1. Haga clic en el icono de la extensión de Bitwarden en el navegador.
2. En la pantalla de inicio de sesión, haga clic en el icono de **Engranaje (Ajustes)** situado en la esquina superior izquierda.
3. En la sección **Servidor autohospedado (Self-hosted environment)**, introduzca:
   - **URL del servidor:** `http://127.0.0.1:8080`
4. Guarde la configuración y proceda a iniciar sesión con su cuenta local.

---

## 4. Implicaciones: Instancia Local vs Servicio Cloud Oficial

| Criterio | Vaultwarden Local (*Self-hosted*) | Bitwarden Cloud Oficial |
|:---|:---|:---|
| **Soberanía y control de datos** | **Total:** Los datos cifrados nunca salen de su máquina física. | Delegada en los servidores de Bitwarden (EE. UU. o UE). |
| **Superficie de ataque externa** | **Nula en internet:** Al vincularse a `127.0.0.1`, no es accesible fuera de la máquina local. | Expuesta en internet (protegida por cifrado de conocimiento cero y TLS). |
| **Disponibilidad y sincronización** | Requiere que el contenedor esté corriendo localmente. No sincroniza con el móvil salvo túnel o VPN privada. | Alta disponibilidad garantizada 24/7 con sincronización automática en cualquier dispositivo. |
| **Requisitos de HTTPS** | Navegadores modernos restringen ciertas APIs criptográficas en contextos HTTP excepto en `localhost` / `127.0.0.1`. | Certificados TLS gestionados automáticamente por el proveedor. |
| **Responsabilidad de copias de seguridad** | **Responsabilidad del usuario:** La pérdida de disco implica pérdida irreversible sin backups. | Copias de seguridad automáticas y redundancia geográfica gestionada por el proveedor. |

---

## 5. Procedimiento de Copia de Seguridad y Restauración

### Copia de Seguridad en Frío (Recomendada)
Para garantizar la consistencia atómica del archivo de base de datos SQLite (`db.sqlite3`), detenga momentáneamente la escritura:

```bash
# 1. Detener el contenedor
docker compose stop

# 2. Generar un archivo comprimido fechado del directorio de datos
tar -czvf "backup-vaultwarden-$(date +%Y%m%d_%H%M%S).tar.gz" vw-data/

# 3. Reiniciar el servicio
docker compose start
```

### Copia de Seguridad en Caliente (Sin detener el servicio)
Vaultwarden utiliza SQLite en modo WAL (*Write-Ahead Logging*). Para realizar una copia segura sin detener el contenedor:

```bash
docker exec vaultwarden-local sqlite3 /data/db.sqlite3 ".backup '/data/db_backup.sqlite3'"
cp ./vw-data/db_backup.sqlite3 ./vw-data/backup_$(date +%Y%m%d).sqlite3
```

### Protocolo de Restauración
En caso de fallo de disco o migración a una nueva máquina:
1. Instale Docker y clone el repositorio.
2. Extraiga el archivo comprimido en `vaultwarden/vw-data/`.
3. Asegúrese de que los permisos de lectura y escritura del directorio son accesibles por el contenedor.
4. Ejecute `docker compose up -d` y verifique la recuperación abriendo la interfaz web en `http://127.0.0.1:8080`.

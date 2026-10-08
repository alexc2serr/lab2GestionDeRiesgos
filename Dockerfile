# ==============================================================================
# DOCKERFILE MULTI-STAGE: PLATAFORMA DE GESTIÓN DE RIESGOS
# Buenas prácticas de seguridad (mínimo privilegio de contenedor y no-root)
# ==============================================================================

# Etapa 1: Base ligera de Node.js v24 Alpine
FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Etapa 2: Instalación de dependencias
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Etapa 3: Construcción de la aplicación
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Etapa 4: Imagen final de ejecución (Runner) con usuario sin privilegios
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Seguridad: Crear usuario y grupo del sistema no-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar archivos públicos y construidos con permisos adecuados
COPY --from=builder /app/public ./public 2>/dev/null || true
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Asignar propiedad al usuario no privilegiado
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]


# syntax=docker/dockerfile:1

# ---- Stage 1: build the React frontend ----
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend

# Railway passes environment variables as build args only if they are
# declared with ARG here -- Vite then inlines them into the built JS at
# this build step (there is no "runtime env" for a static SPA bundle).
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_URL
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL} \
    VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY} \
    VITE_API_URL=${VITE_API_URL}

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: Django backend, serving the built frontend ----
FROM python:3.12-slim AS backend
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./frontend_dist

RUN chmod +x start.sh

EXPOSE 8000
CMD ["./start.sh"]

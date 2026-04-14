# 03 — VPS Port Mapping

## Current Port Map (as of March 2026)

| Port | Binding | Container / Process | App |
|------|---------|---------------------|-----|
| 22 | 0.0.0.0 | sshd | SSH |
| 80 | 0.0.0.0 | nginx (host) | Reverse proxy for all apps |
| 443 | 0.0.0.0 | nginx (host) | Reverse proxy (TLS) |
| 3000 | 0.0.0.0 | mj_portfolio_dev_1 | Portfolio dev ⚠️ |
| 3001 | 0.0.0.0 | mj_portfolio-prod | Portfolio prod ⚠️ |
| 3020 | 127.0.0.1 | resumekickstarter-frontend-prod | RK frontend prod |
| 3030 | 127.0.0.1 | resumekickstarter-frontend-staging | RK frontend staging |
| **3040** | **127.0.0.1** | **giflove-staging-app** | **GifLove staging** |
| **3050** | **127.0.0.1** | **giflove-production-app** | **GifLove production** |
| 5001 | 0.0.0.0 | penpond-staging-web | Penpond staging ⚠️ |
| 5433 | 127.0.0.1 | resumekickstarter-db-prod | RK PostgreSQL prod |
| 5434 | 127.0.0.1 | resumekickstarter-db-staging | RK PostgreSQL staging |
| 6380 | 127.0.0.1 | resumekickstarter-redis-prod | RK Redis prod |
| 6381 | 127.0.0.1 | resumekickstarter-redis-staging | RK Redis staging |
| 8020 | 127.0.0.1 | resumekickstarter-backend-prod | RK backend prod |
| 8030 | 127.0.0.1 | resumekickstarter-backend-staging | RK backend staging |

> GifLove Postgres and Redis stay internal to their Docker network — no host ports exposed.

## StarterKit4U Port Assignments

| Port | Binding | Purpose | Compose File |
|------|---------|---------|--------------|
| **8040** | 127.0.0.1 | **Production** gunicorn | `docker-compose.production.yml` |
| **8050** | 127.0.0.1 | **Staging** gunicorn | `docker-compose.staging.yml` |

These follow the existing `80xx` convention used by resumekickstarter.

## Nginx Sites Enabled

```
/etc/nginx/sites-enabled/
├── mansijoshi-ca
├── penpond.com
├── resumekickstarter.com
├── staging.penpond.com
├── staging.resumekickstarter.com
├── starterkit4u-production     ← TO ADD
├── starterkit4u-staging        ← TO ADD
├── giflove.ca                  ← TO ADD (production)
└── staging.giflove.ca          ← TO ADD (staging)
```

## UFW Firewall

```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

No changes needed — our Docker ports bind to `127.0.0.1` only, so they're invisible to the internet.

## Security Warning

Three existing apps bind to `0.0.0.0` (accessible from the internet without nginx):

| Port | Container | Risk |
|------|-----------|------|
| 3000 | mj_portfolio_dev_1 | Directly accessible at VPS_IP:3000 |
| 3001 | mj_portfolio-prod | Directly accessible at VPS_IP:3001 |
| 5001 | penpond-staging-web | Directly accessible at VPS_IP:5001 |

**Recommendation:** Change these to `127.0.0.1:PORT:PORT` in their docker-compose files so only nginx can reach them. UFW blocks external access to these ports, but Docker can bypass UFW rules — binding to `127.0.0.1` is the only reliable protection.

## Discovery Commands (for future reference)

```bash
# Show all listening ports with process info
sudo ss -tlnp

# Show all running Docker containers with port mappings
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"

# Check what's on a specific port
sudo lsof -i :8040

# Test if a port is free
curl -s http://127.0.0.1:8040 && echo "IN USE" || echo "FREE"

# Check nginx status
sudo nginx -t
sudo systemctl status nginx
```

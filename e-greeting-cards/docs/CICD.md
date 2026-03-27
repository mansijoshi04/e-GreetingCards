# CI/CD Pipeline — Setup & Usage Guide

## Overview

Three GitHub Actions workflows handle the full pipeline:

| Workflow | File | Trigger | What it does |
|----------|------|---------|--------------|
| CI | `ci.yml` | Every push + every PR to `main` or `staging` | Lint + build check — blocks broken code from merging |
| Deploy Staging | `deploy-staging.yml` | Push to `staging` branch | SSHs into VPS, pulls code, syncs Nginx config, rebuilds Docker |
| Deploy Production | `deploy-production.yml` | Push to `main` branch | Same as staging deploy, targets production containers |

### Branch → Environment Mapping

```
feature/*  →  (no deploy, CI runs on PR)
    ↓ merge PR
staging    →  staging.giflove.ca   (port 3040)
    ↓ merge PR
main       →  giflove.ca           (port 3050)
```

### Nginx Config Strategy

Nginx config is split into two layers to prevent conflicts:

| Layer | Managed by | Location on VPS | Updated on deploy? |
|-------|-----------|-----------------|-------------------|
| Site config (SSL, server_name) | Certbot — set up once, never touched again | `/etc/nginx/sites-available/giflove*.ca` | No |
| Proxy config (location block, upstream port) | This repo's `nginx/conf.d/` | `/etc/nginx/conf.d/giflove-*.conf` | Yes — every deploy |

This means you can update proxy settings (timeouts, headers, upstream port) by committing to the repo, and Certbot's SSL setup is never at risk.

---

## Part 1 — One-Time VPS Setup for CI/CD

These steps are done once on the VPS before CI/CD can work. They configure passwordless sudo for the specific commands the deploy script needs.

### 1A — Create a sudoers rule for deploy commands

SSH into the VPS and run:

```bash
sudo visudo -f /etc/sudoers.d/giflove-deploy
```

Add these lines (replace `your-username` with your actual VPS username):

```
your-username ALL=(ALL) NOPASSWD: /bin/cp /home/your-username/apps/*/e-greeting-cards/nginx/conf.d/* /etc/nginx/conf.d/*
your-username ALL=(ALL) NOPASSWD: /usr/sbin/nginx -t
your-username ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
```

Save and exit. Verify it works without a password prompt:

```bash
sudo nginx -t
```

> **Why this is needed:** GitHub Actions SSHs in as your VPS user and runs the deploy script non-interactively. Any `sudo` command that asks for a password will hang and time out. This sudoers rule grants passwordless sudo only for the three specific commands the deploy script uses — not for all sudo commands.

### 1B — Set up SSH key for GitHub Actions

On the VPS, generate a dedicated deploy key (keep it separate from your personal key):

```bash
ssh-keygen -t ed25519 -C "github-actions-giflove" -f ~/.ssh/giflove_deploy
```

When prompted for a passphrase, **leave it empty** (Actions can't enter passphrases interactively).

Add the public key to authorized_keys:

```bash
cat ~/.ssh/giflove_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Print the private key — you'll paste this into GitHub:

```bash
cat ~/.ssh/giflove_deploy
```

Copy the entire output including the `-----BEGIN...` and `-----END...` lines.

### 1C — Add GitHub Secrets

Go to: **GitHub → your repo → Settings → Secrets and variables → Actions → New repository secret**

Add these three secrets:

| Secret name | Value |
|-------------|-------|
| `VPS_HOST` | Your VPS IP address (`147.79.78.1`) |
| `VPS_USER` | Your SSH username on the VPS |
| `VPS_SSH_KEY` | The private key content from step 1B (the entire `-----BEGIN...-----END...` block) |

### 1D — Verify SSH access works from GitHub Actions

Push any trivial commit to the `staging` branch. The deploy workflow will run and you'll see the SSH step. If it fails with an auth error, double-check:
- The public key is in `~/.ssh/authorized_keys` on the VPS
- The private key in GitHub secrets includes the full header/footer lines
- The VPS user in the secret matches exactly

---

## Part 2 — How Each Workflow Works

### CI (`ci.yml`)

Runs on every push to `main`/`staging` and every PR targeting those branches.

**Steps:**
1. Checkout code
2. Install Node 20 + cache npm
3. `npm ci` — install dependencies
4. `npx prisma generate` — generate Prisma client (required for TypeScript to compile)
5. `npm run lint` — ESLint check
6. `npm run build` — full Next.js production build with stub env vars

**Stub env vars:** `next build` validates that server-side env vars exist at build time. CI uses stub values (e.g. `DATABASE_URL=postgresql://stub:stub@localhost/stub`) so the build succeeds without real credentials. Real values only exist on the VPS.

**If CI fails:** The PR cannot be merged (once branch protection is set up). Fix the lint or build error locally and push again.

---

### Deploy Staging (`deploy-staging.yml`)

Runs automatically on every push to the `staging` branch.

**Steps (runs on VPS via SSH):**
```
1. cd ~/apps/giflove-staging/e-greeting-cards
2. git pull origin staging
3. sudo cp nginx/conf.d/giflove-staging.conf /etc/nginx/conf.d/giflove-staging.conf
4. sudo nginx -t
5. sudo systemctl reload nginx
6. docker compose -f docker-compose.prod.yml up -d --build
7. docker image prune -f
```

**What `set -e` does:** The script exits immediately if any command fails. If `nginx -t` fails (invalid config), the deploy stops before touching Docker — your running app is unaffected.

**Typical deploy time:** 3–6 minutes (most of the time is the Docker build step).

---

### Deploy Production (`deploy-production.yml`)

Identical to staging deploy but targets `~/apps/giflove-production/` and `giflove-production.conf`.

Runs on push to `main`.

---

## Part 3 — Day-to-Day Usage

### Standard feature workflow

```bash
# 1. Create a feature branch from staging
git checkout staging
git pull origin staging
git checkout -b feature/my-feature

# 2. Do your work, commit locally
git add .
git commit -m "feat: my feature"

# 3. Push and open a PR targeting staging
git push -u origin feature/my-feature
# Open PR on GitHub: base = staging, compare = feature/my-feature
# CI runs automatically on the PR

# 4. Merge the PR
# → CI must be green before merging
# → Merging triggers deploy-staging.yml automatically
# → staging.giflove.ca updates within ~5 minutes

# 5. Test on staging.giflove.ca

# 6. When ready for production: open a PR from staging → main
# → Merge triggers deploy-production.yml automatically
# → giflove.ca updates within ~5 minutes
```

### Monitoring a deploy

Go to **GitHub → Actions tab** → click the running workflow to see live logs.

Or watch the app logs on the VPS in real time:
```bash
ssh user@147.79.78.1
cd ~/apps/giflove-staging/e-greeting-cards
docker compose -f docker-compose.prod.yml logs app -f
```

### Hotfix (bypassing staging → main flow)

Only for critical production bugs:
```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix
# fix the bug
git commit -m "fix: critical bug"
git push -u origin hotfix/critical-fix
# Open PR directly to main — merge after CI passes
# Back-merge to staging to keep branches in sync:
git checkout staging
git merge main
git push origin staging
```

### Updating Nginx proxy config

If you need to change timeouts, add headers, or change the upstream port:
1. Edit `nginx/conf.d/giflove-staging.conf` or `nginx/conf.d/giflove-production.conf`
2. Commit and push to `staging` (or `main` for production)
3. The deploy workflow copies the updated file and reloads Nginx automatically

No SSH needed — the change goes through the normal deploy process.

---

## Part 4 — Troubleshooting

### Deploy failed: SSH connection refused
- Verify `VPS_HOST` secret is correct
- Check that port 22 is open: `ssh your-user@147.79.78.1`
- Check that `~/.ssh/authorized_keys` contains the deploy key's public key

### Deploy failed: sudo requires password
- The sudoers rule in `/etc/sudoers.d/giflove-deploy` is missing or incorrect
- SSH into VPS and re-run the `sudo visudo` step from Part 1A
- Test: `sudo nginx -t` should not ask for a password

### Deploy failed: `nginx -t` error
- A bad Nginx config was pushed
- The app keeps running (deploy stops at `set -e` before Docker rebuild)
- SSH in, check: `sudo nginx -t` to see the exact error
- Fix the config in `nginx/conf.d/`, commit, push again

### Deploy failed: Docker build error
- Check the Actions log for the build error
- Common causes: missing env var in `docker-compose.prod.yml`, Dockerfile issue, npm install failure
- Fix locally, push again

### App deployed but site shows old version
- Hard refresh in browser (`Ctrl+Shift+R`)
- Check the container is actually running the new image:
  ```bash
  docker compose -f docker-compose.prod.yml ps
  docker compose -f docker-compose.prod.yml logs app --tail=20
  ```

### CI passes but deploy doesn't trigger
- Confirm the push was to `staging` (not a feature branch) — deploys only trigger on `staging` and `main`
- Check GitHub Actions tab for any queued or failed runs

---

## Part 5 — Branch Protection (Recommended)

Set up branch protection rules so the CI check is required before merging.

**GitHub → repo → Settings → Branches → Add rule:**

For `staging`:
- Branch name pattern: `staging`
- ✅ Require status checks to pass before merging
  - Add check: `Lint & Build`
- ✅ Require branches to be up to date before merging

For `main`:
- Branch name pattern: `main`
- ✅ Require status checks to pass before merging
  - Add check: `Lint & Build`
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings

---

## Checklist — CI/CD Setup

### One-Time VPS Configuration
- [ ] SSHed into VPS and created `/etc/sudoers.d/giflove-deploy` with the three NOPASSWD rules
- [ ] Verified `sudo nginx -t` runs without a password prompt
- [ ] Generated deploy SSH key: `ssh-keygen -t ed25519 -C "github-actions-giflove" -f ~/.ssh/giflove_deploy`
- [ ] Added public key to `~/.ssh/authorized_keys` on VPS
- [ ] Confirmed permissions: `chmod 600 ~/.ssh/authorized_keys`

### GitHub Secrets
- [ ] `VPS_HOST` added (VPS IP: `147.79.78.1`)
- [ ] `VPS_USER` added (your VPS SSH username)
- [ ] `VPS_SSH_KEY` added (full private key content including header/footer)

### Workflow Verification
- [ ] Pushed a commit to `staging` → deploy-staging.yml runs without errors in Actions tab
- [ ] `staging.giflove.ca` reflects the change after deploy completes
- [ ] Opened a PR to `staging` → CI (ci.yml) runs automatically and passes
- [ ] Pushed to `main` → deploy-production.yml runs (when production is set up)

### Branch Protection (Optional but Recommended)
- [ ] Branch protection rule added for `staging` — requires CI to pass
- [ ] Branch protection rule added for `main` — requires CI to pass

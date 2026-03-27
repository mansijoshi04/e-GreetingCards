# CI/CD Pipeline Setup Guide

## Overview

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `ci.yml` | Every push + PR to `main` or `staging` | Lint + build check |
| `deploy-staging.yml` | Push to `staging` | SSH into VPS, pull, rebuild Docker |
| `deploy-production.yml` | Push to `main` | Same, targets production containers |

### Directory structure on VPS

The full repo is cloned at `~/apps/giflove-staging/`. The app lives at `~/apps/giflove-staging/e-greeting-cards/` — this is where `docker-compose.prod.yml`, `nginx/`, `app/`, etc. live.

The deploy script does:
```bash
cd ~/apps/giflove-staging/e-greeting-cards   # app directory
git pull origin staging                       # git finds .git at ~/apps/giflove-staging/
docker compose -f docker-compose.prod.yml up -d --build
docker image prune -f
```

No sudo required — nginx is managed by Certbot and does not need to be touched on deploy.

### Important: .github/workflows location

GitHub Actions only reads workflows from `<repo-root>/.github/workflows/`. Workflows inside a subdirectory (e.g. `e-greeting-cards/.github/workflows/`) will never trigger.

---

## Step 1 — VPS: Generate a deploy SSH key

This is the key GitHub Actions uses to SSH into the VPS as `mjoshi`.

```bash
ssh-keygen -t ed25519 -C "github-actions-giflove" -f ~/.ssh/giflove_deploy
```

When prompted for a passphrase — **press Enter twice** (leave it empty). GitHub Actions can't enter passphrases.

Add the public key to authorized_keys:

```bash
cat ~/.ssh/giflove_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Print the private key — you'll paste this into GitHub:

```bash
cat ~/.ssh/giflove_deploy
```

Copy the **entire output** including the header and footer lines:

```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

---

## Step 2 — GitHub: Add repository secrets

Go to: **github.com → e-GreetingCards repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|-------------|-------|
| `VPS_HOST` | `147.79.78.1` |
| `VPS_USER` | `mjoshi` |
| `VPS_SSH_KEY` | Full private key from Step 1 (including `-----BEGIN...` and `-----END...` lines) |

---

## Step 3 — VPS: Confirm the repo is cloned and .env exists

```bash
ls ~/apps/giflove-staging/e-greeting-cards/docker-compose.prod.yml
ls ~/apps/giflove-staging/e-greeting-cards/.env
```

If the repo isn't cloned yet:

```bash
mkdir -p ~/apps/giflove-staging
cd ~/apps/giflove-staging
git clone -b staging https://github.com/mansijoshi04/e-GreetingCards.git
cd e-greeting-cards
nano .env   # create with staging values
```

---

## Step 4 — VPS: Confirm Nginx + Certbot are set up (one-time)

Nginx is configured once manually and then managed by Certbot — CI/CD never touches it.

**Check if already done:**

```bash
ls /etc/nginx/sites-enabled/staging.giflove.ca
```

**If not, run once:**

```bash
sudo cp ~/apps/giflove-staging/e-greeting-cards/nginx/staging.giflove.ca /etc/nginx/sites-available/staging.giflove.ca
sudo ln -s /etc/nginx/sites-available/staging.giflove.ca /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d staging.giflove.ca
```

After Certbot runs, it manages SSL and the server block — never touch this file again.

---

## Step 5 — Trigger a deploy to verify

Push an empty commit to `staging`:

```bash
git checkout staging
git commit --allow-empty -m "chore: verify CI/CD pipeline"
git push origin staging
```

Go to **GitHub → Actions tab**. Two workflows should start:

1. **CI** — lint + build, completes in ~3 minutes
2. **Deploy Staging** — SSH deploy, completes in ~5 minutes

Confirm on the VPS:

```bash
cd ~/apps/giflove-staging/e-greeting-cards
docker compose -f docker-compose.prod.yml ps
```

Visit `https://staging.giflove.ca` to confirm the site loads.

---

## Step 6 — (Recommended) Branch protection rules

**GitHub → repo → Settings → Branches → Add rule**

For both `staging` and `main`:
- Branch name pattern: `staging` / `main`
- Check **Require status checks to pass before merging**
- Search for and add: `Lint & Build`
- Check **Require branches to be up to date before merging**
- For `main`: also check **Do not allow bypassing the above settings**

---

## Troubleshooting

**Workflows don't appear in Actions tab after push**
`.github/workflows/` is not at the repo root. It must be at `<repo-root>/.github/workflows/`, not inside a subdirectory like `e-greeting-cards/.github/workflows/`.

**"Host key verification failed"**
The deploy SSH key isn't in `authorized_keys`. Run:
```bash
cat ~/.ssh/authorized_keys
```
Last line should match `cat ~/.ssh/giflove_deploy.pub`. If not, re-run the `cat >> authorized_keys` step.

**"No such file or directory: ~/apps/giflove-staging"**
The repo isn't cloned. Do Step 3.

**CI fails with `next lint` interactive prompt**
`next lint` is deprecated and prompts interactively in CI. Use `npx eslint .` in the lint script instead.

---

## Checklist

### One-Time VPS Configuration
- [ ] `~/.ssh/giflove_deploy` key pair generated
- [ ] Public key added to `~/.ssh/authorized_keys`
- [ ] `~/apps/giflove-staging/e-greeting-cards/` exists with `.env` file
- [ ] `sites-available/staging.giflove.ca` set up and Certbot SSL configured

### GitHub Secrets
- [ ] `VPS_HOST` added (`147.79.78.1`)
- [ ] `VPS_USER` added (`mjoshi`)
- [ ] `VPS_SSH_KEY` added (full private key including header/footer)

### Verification
- [ ] Empty commit pushed to `staging`
- [ ] CI workflow passes (green) in Actions tab
- [ ] Deploy Staging workflow completes without errors
- [ ] `https://staging.giflove.ca` loads after deploy

### Branch Protection (Optional but Recommended)
- [ ] Branch protection rule added for `staging` — requires `Lint & Build` to pass
- [ ] Branch protection rule added for `main` — requires `Lint & Build` to pass

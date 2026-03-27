# CI/CD Pipeline Setup Guide

## Overview

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `ci.yml` | Every push + PR to `main` or `staging` | Lint + build check |
| `deploy-staging.yml` | Push to `staging` | SSH into VPS, pull, rebuild Docker |
| `deploy-production.yml` | Push to `main` | Same, targets production containers |

### Directory structure on VPS

The full repo is cloned at `~/apps/giflove-staging/`. The app lives at `~/apps/giflove-staging/e-greeting-cards/` — this is where `docker-compose.prod.yml`, `nginx/`, `app/`, etc. live. The deploy script `cd`s into the app directory and runs everything from there.

```bash
cd ~/apps/giflove-staging/e-greeting-cards   # app directory
git pull origin staging                       # git finds .git at ~/apps/giflove-staging/
sudo cp nginx/conf.d/giflove-staging.conf /etc/nginx/conf.d/giflove-staging.conf
docker compose -f docker-compose.prod.yml up -d --build
```

### Important: .github/workflows location

GitHub Actions only reads workflows from `<repo-root>/.github/workflows/`. If workflows are inside a subdirectory (e.g. `e-greeting-cards/.github/workflows/`), they will never trigger. Workflows must live at the repo root.

---

## Step 1 — VPS: Create the sudoers rule

The deploy script runs `sudo cp`, `sudo nginx -t`, and `sudo systemctl reload nginx` non-interactively over SSH. Without a passwordless sudo rule, GitHub Actions will hang and time out.

**SSH into the VPS as mjoshi:**

```bash
ssh mjoshi@147.79.78.1
```

Create the sudoers file:

```bash
sudo visudo -f /etc/sudoers.d/giflove-deploy
```

Paste exactly this:

```
mjoshi ALL=(ALL) NOPASSWD: /bin/cp /home/mjoshi/apps/*/e-greeting-cards/nginx/conf.d/* /etc/nginx/conf.d/*
mjoshi ALL=(ALL) NOPASSWD: /usr/sbin/nginx -t
mjoshi ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
```

Save and exit (`Ctrl+O`, Enter, `Ctrl+X`).

**Verify it works:**

```bash
sudo nginx -t
```

Should print `syntax is ok` with no password prompt.

---

## Step 2 — VPS: Generate a dedicated deploy SSH key

This is the key GitHub Actions uses to SSH into the VPS. Keep it separate from your personal key.

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

## Step 3 — GitHub: Add repository secrets

Go to: **github.com → e-GreetingCards repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|-------------|-------|
| `VPS_HOST` | `147.79.78.1` |
| `VPS_USER` | `mjoshi` |
| `VPS_SSH_KEY` | Full private key from Step 2 (including `-----BEGIN...` and `-----END...` lines) |

---

## Step 4 — VPS: Confirm the repo is cloned under mjoshi

```bash
ls ~/apps/giflove-staging/e-greeting-cards/docker-compose.prod.yml
```

If the directory doesn't exist, clone it:

```bash
mkdir -p ~/apps/giflove-staging
cd ~/apps/giflove-staging
git clone -b staging https://github.com/mansijoshi04/e-GreetingCards.git e-greeting-cards
cd e-greeting-cards
nano .env   # create with staging values
```

Confirm the `.env` file is present:

```bash
ls ~/apps/giflove-staging/e-greeting-cards/.env
```

---

## Step 5 — VPS: Confirm Nginx site config is set up (one-time)

The `conf.d/giflove-staging.conf` file managed by CI/CD contains only a `location` block — it is `include`-d inside the server block in `sites-available`. This must be set up once before CI/CD can manage it.

**Check if already done:**

```bash
ls /etc/nginx/sites-enabled/staging.giflove.ca
```

**If not, run once:**

```bash
sudo cp ~/apps/giflove-staging/e-greeting-cards/e-greeting-cards/nginx/staging.giflove.ca /etc/nginx/sites-available/staging.giflove.ca
sudo ln -s /etc/nginx/sites-available/staging.giflove.ca /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d staging.giflove.ca
```

After Certbot runs, it manages SSL renewal — never touch this file again.

---

## Step 6 — Trigger a deploy to verify

Push an empty commit to `staging`:

```bash
git checkout staging
git commit --allow-empty -m "chore: verify CI/CD pipeline"
git push origin staging
```

Go to **GitHub → Actions tab**. Two workflows should start:

1. **CI** — lint + build, completes in ~3 minutes
2. **Deploy Staging** — SSH deploy, completes in ~5 minutes

Then confirm on the VPS:

```bash
cd ~/apps/giflove-staging/e-greeting-cards/e-greeting-cards
docker compose -f docker-compose.prod.yml ps
```

Visit `https://staging.giflove.ca` to confirm the site loads.

---

## Step 7 — (Recommended) Branch protection rules

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

**"sudo: a password is required"**
The sudoers rule didn't save correctly. Redo Step 1 and test with `sudo nginx -t`.

**nginx config test fails with `"location" directive is not allowed here`**
The `sites-available/staging.giflove.ca` server block hasn't been set up yet. Do Step 5.

**"No such file or directory: ~/apps/giflove-staging"**
The repo isn't cloned under mjoshi. Do Step 4.

**CI fails with `eslint: not found`**
Use `npx eslint .` in the lint script, not `eslint .` directly.

**CI fails with `next lint` interactive prompt**
`next lint` is deprecated in Next.js 16 and prompts interactively in CI. Use `npx eslint .` instead.

---

## Checklist

### One-Time VPS Configuration
- [ ] `/etc/sudoers.d/giflove-deploy` created with NOPASSWD rules for `mjoshi`
- [ ] `sudo nginx -t` runs without password prompt as `mjoshi`
- [ ] `~/.ssh/giflove_deploy` key pair generated
- [ ] Public key added to `~/.ssh/authorized_keys`
- [ ] `~/apps/giflove-staging/e-greeting-cards/e-greeting-cards/` exists with `.env` file
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

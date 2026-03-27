# DNS Setup Guide — giflove.ca (GoDaddy)

## Current State Summary

**Good news: your DNS is almost entirely done.** The staging A record, all Resend records, and the production A record are already in place. There is one record to remove and nothing new to add.

---

## Step 1 — Remove This Record (Action Required)

| Type | Name | Data | Action |
|------|------|------|--------|
| A | `@` | `WebsiteBuilder Site` | **DELETE THIS** |

This is a GoDaddy Website Builder record that conflicts with your VPS. It points the apex domain to GoDaddy's builder instead of your server. Your other `A @ 147.79.78.1` record already correctly points to the VPS — this one just gets in the way.

**How to delete:** GoDaddy DNS Manager → find the `A` record with value `WebsiteBuilder Site` → click the trash icon.

---

## Step 2 — Verify These Records Are Present (No Action Needed)

Everything below already exists in your DNS. This is just a reference so you know what each one does.

### Apex & Subdomain Routing

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| A | `@` | `147.79.78.1` | `giflove.ca` → your VPS (production) |
| A | `staging` | `147.79.78.1` | `staging.giflove.ca` → your VPS (staging) |
| CNAME | `www` | `giflove.ca.` | `www.giflove.ca` redirects to apex |

Both `giflove.ca` and `staging.giflove.ca` already point to the same VPS IP. Nginx on the VPS routes each domain to the correct Docker container (port 3050 for prod, 3040 for staging).

### Resend Email Records

All five Resend records are already present and verified:

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` (priority 10) | Bounce & complaint handling |
| TXT | `resend._domainkey` | `p=MIGfMA0...` | DKIM signature — proves emails genuinely came from you |
| TXT | `dc-fd741b8612._spfm.send` | `v=spf1 include:amazonses.com ~all` | SPF sub-record used by Resend |
| TXT | `send` | `v=spf1 include:dc-fd741b8612._spfm.send.giflove.ca ~all` | SPF for the `send` subdomain |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=...` | DMARC policy — protects against spoofing |

#### What these records do together

- **DKIM** (`resend._domainkey`) — Resend cryptographically signs every outgoing email. Recipients' mail servers verify the signature to confirm the email wasn't tampered with.
- **SPF** (`send` TXT + `dc-fd741b8612._spfm.send` TXT) — Tells receiving mail servers that Resend's infrastructure (Amazon SES) is authorized to send on behalf of `giflove.ca`.
- **MX** (`send`) — Gives Resend a place to receive bounce notifications and spam complaints so your sender reputation stays healthy.
- **DMARC** (`_dmarc`) — Policy that tells receiving servers what to do if DKIM or SPF fail (`p=quarantine` = move to spam rather than reject). The `rua` address sends aggregate reports so you can monitor deliverability.

### System Records (Cannot Edit)

| Type | Name | Purpose |
|------|------|---------|
| NS | `@` | `ns35/ns36.domaincontrol.com` — GoDaddy nameservers. Cannot be changed. |
| SOA | `@` | Start of authority record. Managed by GoDaddy. |
| CNAME | `_domainconnect` | GoDaddy internal record. Leave as-is. |

---

## How Nginx Uses These Records

Once DNS propagates and Nginx is configured, the routing works like this:

```
Browser visits staging.giflove.ca
  → DNS resolves to 147.79.78.1 (your VPS)
  → Nginx receives request on port 443
  → Nginx checks the Host header: "staging.giflove.ca"
  → Nginx proxies to http://localhost:3040 (GifLove staging container)
  → Response returned

Browser visits giflove.ca
  → DNS resolves to 147.79.78.1 (same VPS)
  → Nginx checks Host header: "giflove.ca"
  → Nginx proxies to http://localhost:3050 (GifLove production container)
  → Response returned
```

SSL is handled by Certbot on the Nginx layer — your containers don't need to know about TLS.

---

## TTL Note

Your A records are set to 600 seconds (10 minutes). That's fast and good for now while you're actively deploying. Once everything is stable, you can raise it to 1 hour (3600) to reduce DNS query load — but it's not necessary.

---

## Checklist

### One-Time Actions
- [ ] **Delete** the `A @ WebsiteBuilder Site` record in GoDaddy DNS Manager

### Already Done — Verify in GoDaddy
- [x] `A @ 147.79.78.1` exists (production routing)
- [x] `A staging 147.79.78.1` exists (staging routing)
- [x] `CNAME www giflove.ca.` exists
- [x] `MX send feedback-smtp.us-east-1.amazonses.com` exists (Resend bounce handling)
- [x] `TXT resend._domainkey` exists (Resend DKIM)
- [x] `TXT dc-fd741b8612._spfm.send` exists (Resend SPF sub-record)
- [x] `TXT send` SPF record exists
- [x] `TXT _dmarc` exists (DMARC policy)

### Verify in Resend Dashboard
- [ ] Go to resend.com → Domains → `giflove.ca` → all checks show green
- [ ] Send a test email and confirm it arrives (not in spam)

### After VPS Nginx Setup (covered in deployment doc)
- [ ] `https://staging.giflove.ca` loads with a valid SSL padlock
- [ ] `https://giflove.ca` loads with a valid SSL padlock (when production is deployed)
- [ ] `https://www.giflove.ca` redirects correctly

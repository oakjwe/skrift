# Skrift

Local handwriting worksheet editor with automatic preview, browser persistence,
formatting helpers, supplied Icelandic handwriting fonts, and A4 printing.
No build step, package installation, external requests, or backend is required.

## Run locally

From the repository root, start a read-only local web server:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000/app/**. Stop the server with Ctrl+C.
Serve the repository root, because the fonts are loaded from `mms/`.
The server is bound to this computer only. This is a development command, not a
production deployment. Do not use `file://`; browser storage behavior varies.

## Use

- Type text: preview updates automatically and the editor keeps its contents.
- Text and settings are saved in localStorage for this browser and origin.
  Clearing browser data removes them; other devices/browsers do not share them.
- Enter or `{br}` starts a row. `{blank}` inserts one blank practice row.
- `{page}` starts a fresh page. Escape a token with a backslash (`\{br}`) to
  print the literal token. Unknown tokens are printed literally.
- Long text wraps onto more rows/pages. Blank space at the bottom remains ruled.
- Choose print, A4 portrait, scale 100%, and disable browser headers/footers.
  Preview and print share the same page DOM and physical dimensions.

No content is interpreted as HTML. Assets and data stay local. The original MMS
reference is preserved; font redistribution licensing has not been verified.
See PROJECT.md for context and docs/references/ for the original screenshots.

## Validation

Browser behavior and print alignment should be checked with the supplied fonts
on the target OS. The original Windows font-position adjustment is retained.

Run the optional logic checks when GNOME JavaScript (`gjs`) is available:

```bash
gjs tests/check.js
```

These use DOM doubles and do not replace visual/browser print testing.

## Proxmox / Portainer deployment

Run this container on a Docker host (VM or existing Docker LXC) inside Proxmox,
not on the Proxmox hypervisor itself. No database, volumes, or server-side user
data are needed. Browser localStorage still holds worksheets. Changing hostname,
scheme, or port creates a different storage origin; copy important worksheet text
before switching addresses.

The GitHub Actions workflow validates the app and tests the hardened container
before publishing `ghcr.io/oakjwe/skrift` on pushes to `main` or `v*` tags.
Pull requests validate without publishing. Images support amd64 and arm64.
`latest` follows main; `sha-<full commit hash>` identifies a specific revision.
Pushing this setup starts image publication; it does not deploy or restart servers.
The workflow uses GitHub's built-in token; no registry secret belongs in this repo.

Before deployment, wait for a successful workflow run. GHCR package visibility is
separate from repository visibility. Keep the package private unless you choose
otherwise. For private images, add a GHCR registry credential in Portainer using
a token with `read:packages` and access to this package. Do not put it in Compose
or a Git-tracked file. Font redistribution rights remain unverified; resolve them
before making the image or site public.

In Portainer on the intended Docker endpoint:

1. Add a stack from this repository's `compose.yaml` (or paste its contents).
2. Set `SKRIFT_TAG` to `sha-<full commit hash>` from a successful CI run.
3. Set `SKRIFT_BIND_IP` to the Docker host's private LAN IP for LAN access,
   and `SKRIFT_PORT` to an available port (default 8080). The default bind is
   loopback only. Keep access on LAN/VPN; no public NAT rule is needed.
4. Deploy the stack and open `http://<private-host-ip>:8080/`.

For CLI deployment, after reviewing the bind IP and image tag, create a local
`.env` from `.env.example`, adjust its values, and run on the Docker host:

```bash
docker compose config --quiet
docker compose pull
docker compose up -d
docker compose ps
```

These commands create/start the service and bind the configured host port.
The container runs without root, with a read-only filesystem, dropped capabilities,
and a small temporary filesystem. `/healthz` provides its health check.
Only the application and three font files are included in the image.
If using your private reverse proxy, route to the host's private port and retain
LAN/VPN access controls. Loopback binding works only for a proxy on that same host
network, not a separate proxy container or machine.

Updates are manual: select another successful commit image tag, pull, and
redeploy the stack. Roll back by restoring the previous tag and redeploying.
There is no automatic production deployment or container updater.
After deployment, verify fonts, Icelandic text, saving after reload, mobile layout,
and A4 printing in a real browser; logic tests do not establish print geometry.

For a local image build when Docker is installed:

```bash
docker build -t skrift:local .
docker run --rm -p 127.0.0.1:8080:8080 skrift:local
```

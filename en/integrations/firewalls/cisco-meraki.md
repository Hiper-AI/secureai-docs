---
title: "Cisco Meraki MX"
sidebarTitle: "Cisco Meraki MX"
icon: "/img/icons/cisco.svg"
description: "See the AI your people use behind your Meraki MX appliances and block it from SecureAI through the Dashboard API"
---

With this integration, SecureAI shows which AI services the people behind your Meraki MX appliances use, and
SecureAI blocks on the MX the providers you prohibit. The MX sends its logs over syslog to a collector in your
network, and SecureAI writes its block list into the content filtering of the networks you pick, through the Meraki
Dashboard API.

<Note>
The `cisco-meraki` connector is in **beta**. We tested discovery against a SecureAI tenant with syslog lines in the
format Cisco publishes, without a real MX. We tested writing the block list against the Meraki Dashboard, on a
network with no device; we haven't repeated it from a tenant yet. See [Tested versions](#tested-versions). During
the beta, the SecureAI team helps you with the setup.
</Note>

## How it works

1. The MX sends two kinds of syslog: `urls` (each HTTP request, and each HTTPS session with its host name) and
   `flows` (each connection that crosses the firewall, with IPs and ports). With the URLs role it also sends the
   content filtering blocks (`content_filtering_block`).
2. The SecureAI collector, a container that runs in your network, takes the host out of each `urls` line, keeps only
   the ones that go to an AI service and sends them to your tenant over HTTPS, without the query string. The rest of
   the browsing never leaves your network.
3. SecureAI reads the client's IP and MAC and the destination host from each line, and shows it under **Inventory →
   Network Sources** with the `cisco-meraki` connector.
4. When you turn on blocking, SecureAI writes its list into the **Blocked URL patterns** of each network you picked.
   It syncs again a few seconds after each block or release, and every 5 minutes.

The patterns you entered by hand in that list stay as they are. SecureAI remembers which ones it wrote and only adds
or removes those. It doesn't touch the blocked categories or the allowed URLs.

## Requirements

- An MX with the **Advanced Security** license. Without it, the network has no content filtering and SecureAI has
  nowhere to write the block. Discovery works anyway.
- A Dashboard API key from an administrator with write (full) access to the networks where SecureAI will block. The
  API has to be enabled for the organization (**Organization → Settings → Dashboard API access**). You generate the
  key under **My profile → API access**.
- A Linux machine with Docker on the MX's network for the collector. The MX must reach it over syslog, and it must
  reach your tenant over HTTPS.
- A SecureAI administrator with a second factor set up.

## 1. Connect the MX in SecureAI

1. Open **Admin → Integrations** and pick the **Network / SWG** category.
2. On the **Cisco Meraki MX** card, click **Connect**.
3. Under **Add a Cisco Meraki MX**, enter a name that lets you recognize the device and, if you want, the collector
   IP.
4. Click **Create and show the configuration**. SecureAI asks for your second factor, creates the log source and the
   feed the collector uses to filter, offers **Download the collector (.zip)** and shows `collector.env` and the
   **Values for the Dashboard**.

The tokens are shown only at that moment. Download the collector before closing the panel. If you lose the tokens,
**New tokens** on the device row generates new ones, and the old ones stop working.

## 2. Install the collector

1. Copy the `.zip` to a Linux machine with Docker on the MX's network and unzip it.
2. In the `secureai-collector` folder, run `docker compose up -d`.

The collector listens for syslog on port 514 of the machine, UDP and TCP. It's the same collector the other firewalls
use; the [Fortinet FortiGate](/en/integrations/firewalls/fortinet-fortigate#2-install-the-collector) guide shows the
contents of the files and how to run it without Docker.

## 3. Send the MX syslog to the collector

In the Dashboard: **Network-wide → General**, **Reporting** section, **Add a syslog server**:

- **Server IP**: the collector IP.
- **Port**: 514.
- **Roles**: **URLs** and **Flows**.

Save. From MX firmware 18.101, lines from the Flows role arrive with the type `firewall` instead of `flows`;
SecureAI reads both.

## 4. Turn on blocking

In the **Cisco Meraki MX** panel, **Blocking** tab:

1. Paste the **Dashboard API key**.
2. **Show my MX networks** lists the networks with an MX in the organizations that key sees. Pick the networks. If
   the key can't list organizations, type the network ids (`L_…` or `N_…`).
3. Check **I understand that SecureAI writes into the blocked URL patterns of these networks**.
4. Click **Turn on blocking**. SecureAI asks for your second factor and runs the first sync.

SecureAI stores the API key encrypted and never shows it again. The Activity Log records who turned blocking on.
Under **Inventory → Network Sources → Response & auto-block** you see the status (how many domains in how many
networks, and the last sync), change the networks with **Change networks** or turn it off with **Turn off**. When you
change the networks, SecureAI removes its patterns from the ones you dropped and writes them into the new ones.

Temporary blocks an analyst creates from **Network Sources** go to Meraki when the block destination is Meraki, or
automatic and your tenant has neither Cisco Umbrella nor Cloudflare Gateway blocking. A block through Meraki reaches
the whole network behind each MX you picked, not only the source IP.

## 5. Check

1. In the Dashboard, **Security & SD-WAN → Content filtering** of a network you picked: **Blocked URL patterns** shows
   the domains of the SecureAI block list, after your own.
2. From a machine behind the MX, open an AI service you prohibited. According to Cisco's documentation, the MX shows
   its block page over HTTP and drops the connection over HTTPS.
3. Under **Inventory → Network Sources**, the IP of that machine shows up with the `cisco-meraki` connector.

## Turn off blocking

**Turn off**, under **Response & auto-block**, asks for your second factor. SecureAI removes the patterns it wrote
from each network and leaves yours, and the MX stops blocking those domains. The Activity Log records it with
critical severity. If a network doesn't accept the change, blocking stays on and that network keeps the SecureAI
patterns until you turn it off again.

If you pause network enforcement in SecureAI, SecureAI stops writing to the networks and the MX keeps blocking the
last list.

## What SecureAI does when something fails

| Situation | What happens | Code |
|---|---|---|
| SecureAI can't build the block list | It doesn't write to any network | `FEED_UNAVAILABLE` |
| The Meraki API fails to read or write a network | That network keeps the list it had; the others go ahead. The next sync retries | `MERAKI_*` |
| Meraki answers without the pattern list | SecureAI doesn't treat it as empty and doesn't write to that network | `MERAKI_BAD_RESPONSE` |
| Your patterns plus SecureAI's exceed the configured limit | It doesn't write to any network, doesn't trim, and warns you with a critical alert | `MERAKI_LIMIT` |
| Meraki answers 429 | It waits for what `Retry-After` says and retries | |

The panel shows the code of the last failure.

## Limits

- **Without decryption, only the host.** The MX doesn't decrypt HTTPS: the `urls` log of an HTTPS session carries the
  host and the method `UNKNOWN`, with no path. Content filtering also decides by host, so SecureAI blocks whole
  domains.
- **`flows` lines don't add to the inventory.** They carry IPs and ports, no host: SecureAI accepts them and doesn't
  count them.
- **Content filtering blocks may not be counted.** In Cisco's documentation example, the `content_filtering_block`
  log carries the client's MAC and not its IP, and SecureAI can't tie it to a source. If your firmware adds
  `client_ip`, SecureAI counts it as blocked.
- **Entry limit.** Neither the API reference
  ([Update Network Appliance Content Filtering](https://developer.cisco.com/meraki/api-v1/update-network-appliance-content-filtering/))
  nor the MX content filtering guide publishes a maximum number of blocked patterns, so SecureAI doesn't cut by
  default. On a test network with no device, the Dashboard accepted and saved 20,000 patterns; we don't know how many
  an MX applies. If the Dashboard rejects the list, that network keeps the one it had and the panel shows
  `MERAKI_BAD_REQUEST`. If you know your organization's limit, ask support to set it: above it, SecureAI doesn't write
  to any network and warns you with `MERAKI_LIMIT`.
- **Wildcards.** The MX matches by stripping subdomains from left to right, so `openai.com` covers `api.openai.com`,
  and an asterisk inside a URL counts as text
  ([How to Filter Web Content Using MX and Cisco Talos](https://documentation.meraki.com/SASE_and_SD-WAN/MX/Operate_and_Maintain/Content_Filtering_and_Threat_Protection/Content_Filtering)).
  That's why SecureAI writes `*.openai.com` as `openai.com`. A wildcard in the middle (`bedrock.*.amazonaws.com`)
  can't be written without widening it, and SecureAI leaves it out; the panel says how many patterns it left out.
- **A block reaches the whole network behind the MX**, not a user or an IP.
- **Meraki has a "Generative AI" category.** SecureAI doesn't use it: it blocks by domain, provider by provider, so
  what you approve keeps working. If you turn it on by hand in the Dashboard, it can also block the providers you
  approved in SecureAI.

## Tested versions

| Date | Environment | Result |
|---|---|---|
| 2026-11-12 | Cisco DevNet sandbox, network with a virtual MX100, Observer role | The API returned the content filtering in the shape SecureAI reads |
| 2026-11-12 | Test network with no device, in our own Meraki organization | SecureAI added its domains next to a pattern entered by hand, removed a provider that was no longer prohibited and, when blocking was turned off, left only the hand-entered pattern. Blocked categories and allowed patterns didn't change. The Dashboard accepted 20,000 patterns |
| 2026-11-17 | Against a SecureAI tenant, without an MX | Setup from the console and discovery in Network Sources, with syslog lines in the format of Cisco's documentation sent to the collector |

We haven't tested with a real MX the log format or that the MX blocks subdomains: both come from Cisco's public
documentation ("Syslog Event Types and Log Samples" and the content filtering guide). We also haven't repeated the
block through the Dashboard API from a tenant. That's why the connector is in beta.

---
title: "Cisco Secure Firewall"
sidebarTitle: "Cisco Secure Firewall"
icon: "/img/icons/cisco.svg"
description: "See the AI your people use behind your Cisco Secure Firewalls and block it from SecureAI, without Cisco AI Defense"
---

With this integration, SecureAI shows which AI services the people behind your Cisco Secure Firewall Threat Defense
(FTD) devices use, from which device and how often, and you block them from SecureAI. The FTDs are managed by a
Management Center (FMC). You don't need Cisco AI Defense: the FTD sends its connection events to SecureAI and the FMC
downloads from SecureAI the list of domains it has to block.

## How it works

1. The FTD sends one syslog event per connection (messages `430002` and `430003`) to the SecureAI collector, a
   container that runs in your network. Each event carries the source (`SrcIP`, `User`), the destination (`URL`,
   `DNSQuery` or `ReferencedHost`), the application OpenAppID recognizes (`WebApplication`), the URL category
   (`URLCategory`) and the action (`AccessControlRuleAction`).
2. The collector keeps only the connections to AI services and sends them to your tenant over HTTPS. The rest of the
   browsing never leaves your network.
3. SecureAI counts each connection once, even when the FTD logs it at the start and at the end, and shows it under
   **Inventory → Network Sources** with the Cisco Secure Firewall connector.
4. When you block AI domains in SecureAI, they go into a block feed. The FMC downloads it every 30 minutes and
   applies it on the FTDs with Security Intelligence, by URL and by DNS.

## Requirements

- FMC and FTD 7.2 or later, with an FMC user who can edit objects, access control policies and Platform Settings,
  and deploy.
- Licenses: **Threat**, for Security Intelligence, and **URL Filtering**, so the FTD reports the URL category.
- A Linux machine with Docker on the FTD's network for the collector. The FTD must reach it over syslog, and it must
  reach your tenant over HTTPS.
- The FMC must reach your tenant (`https://<tenant>.hiperai.com`) over HTTPS to download the feed.
- A SecureAI administrator with a second factor set up: creating and rotating the tokens asks for it.

## 1. Connect the FTD in SecureAI

1. Open **Admin → Integrations** and pick the **Network / SWG** category.
2. On the **Cisco Secure Firewall** card, click **Connect**.
3. Under **Add a Cisco Secure Firewall**, enter a name that lets you recognize the device. The other two fields are
   optional:
   - **Collector IP**: SecureAI sets it as the syslog server in the values for the FMC.
   - **Public IP of the FMC**: the FMC downloads the list for its FTDs. If you enter its IP, SecureAI hands the block
     list only to that address, even to someone else who has the token.
4. Click **Create and show the configuration**. SecureAI asks for your second factor and creates the collector's log
   source, the FMC's block feed and the feed with the list of AI domains the collector uses to filter. Then it offers
   **Download the collector (.zip)** and shows `collector.env` and the **Values for the FMC**: the syslog server and
   the feed URL, with the token inside, for the URL feed and for the DNS feed.

The tokens are shown only at that moment. Download the collector and copy the values before closing the panel, and
store the tokens in your secrets manager. If you lose them, **New tokens** on the device row generates new ones, and
the old ones stop working.

To change later which address can download the block list, open **Actions → Allowed IP** on the device row. It takes IPv4 and IPv6. If you leave it empty, anyone with the token can download the list. **New tokens** keeps the allowed IP.

Under **Connected devices** you see whether logs are arriving and when the FMC last downloaded the block list. If
SecureAI refuses a download that had the right token, the panel shows which IP it came from and why: an IP that isn't
on the allowed list, or a disabled feed.

## 2. Install the collector

The panel's `.zip` holds `docker-compose.yml`, `vector.yaml` and `collector.env`. The collector is
[Vector](https://vector.dev) with the official `timberio/vector` image; SecureAI doesn't publish an image of its own.

1. Copy the `.zip` to a Linux machine with Docker on the FTD's network and unzip it.
2. In the `secureai-collector` folder, run `docker compose up -d`.

The collector listens for syslog on port 514 of the machine, UDP and TCP. Every hour it downloads the list of AI
domains from your tenant and only sends the lines whose destination is on that list. If your tenant stops answering,
it keeps the last list for 7 days. The
[Fortinet FortiGate](/en/integrations/firewalls/fortinet-fortigate#2-install-the-collector) guide shows the contents
of the files and how to run it without Docker: it's the same collector.

## 3. Send the connection events to the collector

In the FMC:

1. **Devices → Platform Settings**, the Threat Defense policy of your FTDs (if you don't have one, create it and
   assign the devices), **Syslog** section:
   - **Logging Setup** tab: turn on **Enable logging**;
   - **Syslog Servers → Add** tab: a network object with the collector IP, UDP, port 514 and the zone or interface
     the FTD reaches it through.
2. **Policies → Access Control**, your policy, **More → Logging**: check **Use the syslog settings configured in the
   FTD Platform Settings policy deployed on the device**. With the ALERT severity, the FTD sends the events as
   `%FTD-1-430003`, which is what SecureAI reads.
3. On the rules that carry traffic to the internet, **Logging** tab: check **Log at End of Connection** and, under
   **Send Connection Events to**, **Syslog Server**.
4. Deploy.

Logging at the end of the connection is enough: the end event carries everything in the start event plus the
counters. Without decryption, the FTD reports the host it reads from the SNI in `URL` (`https://chatgpt.com`) and the
application in `WebApplication` (`ChatGPT`, `Anthropic Claude`). Without the URL Filtering license it doesn't send
`URLCategory`.

## 4. Block with the SecureAI feed

### URL feed

1. **Objects → Object Management → Security Intelligence → URL Lists and Feeds → Add URL Lists and Feeds**:

   | Field | Value |
   |---|---|
   | Name | `secureai-ia-prohibida` |
   | Type | Feed |
   | Feed URL | The feed URL the panel shows: `https://feed:<feed token>@<tenant>.hiperai.com/api/network-feeds/<feed id>` |
   | Update Frequency | 30 minutes |

   The token goes in the URL, before the host, and the FMC sends it as HTTP Basic when it downloads the feed. Don't
   put it in a parameter (`?token=`): it would end up in logs.

2. In your access control policy, **Security Intelligence** step, **URLs** tab: pick the feed, the zone (Any) and
   **Add to Block List**.
3. Save and deploy.

The FMC doesn't accept a frequency below 30 minutes without an MD5 checksum URL, and SecureAI doesn't publish that
checksum yet. To skip the wait for the next download, **URL Lists and Feeds → Update Feeds** forces it.

One feed entry covers the domain and its subdomains: with `openai.com` in the feed, the FTD blocks `api.openai.com`.
It also accepts wildcards (`*.anthropic.com`).

On FMC 7.7 or later you can add the feed to the Block List through the REST API
(`PUT .../accesspolicies/{id}/securityintelligencepolicies/{id}`). On 7.2 and 7.4 that path is read-only.

### DNS feed

The FMC API can't create DNS feeds or edit DNS policies, so you do this step in the GUI, once:

1. **Objects → Object Management → Security Intelligence → DNS Lists and Feeds → Add DNS Lists and Feeds**: type
   Feed, with the DNS URL the panel shows and the same frequency.
2. **Policies → DNS**, the DNS policy your access control policy uses, **Add DNS Rule**: action **Domain Not Found**
   and, on the **DNS** tab, the feed. You can't edit the default Global Block List rule: create a new one.
3. If your access control policy uses another DNS policy, pick it under **Security Intelligence → DNS Policy**.
4. To send DNS blocks to SecureAI: on that same screen, the logging icon next to **DNS Policy** opens **DNS Block List
   Logging Options**. Check **Syslog Server** and click **OK**.
5. Save the policy and deploy.

After this step, the FMC downloads the feed on its own: what you block in SecureAI arrives without going back to the
GUI. A query for `chatgpt.com` that crosses the FTD gets NXDOMAIN, and so does `api.openai.com`, a subdomain of
`openai.com`.

The DNS block reaches only the queries that cross the FTD. A device that resolves through a DNS server that doesn't
go through the FTD (for example, an internal DNS server on the same side of the network) isn't blocked by DNS; the URL
block does reach it.

## 5. Check

1. From a device behind the FTD, open chatgpt.com. Within seconds the device shows up under **Inventory → Network
   Sources**, with the Cisco Secure Firewall connector, the source and, if the FTD knows it, the user.
2. On the device's row, open **Actions** and pick **Block**. Check the domains, pick the duration and enter the
   reason. **Enforced via** must read **Firewall block-list feed**. You can also prohibit the provider (for example,
   OpenAI) in SecureAI.
3. After the next feed download (up to 30 minutes; **Update Feeds** in the FMC brings it forward), the device can't
   reach chatgpt.com. The FTD sends the block over syslog and the device's row adds blocked calls.
4. To lift it, pick **Actions → Release** on the row. SecureAI takes the domains out of the feed and the FTD lets
   them through after the next download.

## Automatic blocking

In **Response & auto-block**, above the Network Sources list, turn on **Auto-block sources that exceed the
threshold** and set the call threshold, how long the block lasts and how many automatic blocks can be active at
once. When a source crosses the threshold, SecureAI puts its AI domains in the feed and takes them out when the block
expires. Saving these settings asks for your second factor.

## Limits

- **Without TLS decryption, the FTD sees the destination name, not the content.** It reads it from the DNS query and
  the SNI. SecureAI knows someone used ChatGPT, from which device and how many times; not what they wrote.
- **Up to 30 minutes between a block in SecureAI and the FMC download**, because of the feed's minimum frequency
  without a checksum. After each download, the FTD takes a few more minutes to apply the list. Against a SecureAI
  tenant we measured 2 min 37 s from the download to the block on the client, about 9 minutes to release, and 31
  minutes end to end for a prohibited provider with the FMC's normal refresh.
- **Disabling or deleting the feed in SecureAI doesn't unblock anything.** SecureAI answers 403 and the FMC keeps the
  last list. To unblock, use **Release**, take the provider off the prohibited list or take the feed out of the Block
  List.
- **A block reaches the whole network behind the FTD**, not a user or an IP: the feed is a list of domains.
- **If your tenant also has Cisco Umbrella or Cloudflare Gateway blocking, blocks go there and not to the feed.** To
  send them to the FMC, ask support to set the block destination to the feed.
- **DNS blocks don't reach SecureAI with the default settings.** The FMC sends DNS Security Intelligence logging only
  to the FMC; step 4 of [DNS feed](#dns-feed) also sends it over syslog. URL blocks go out over syslog without that
  step.
- **The FMC doesn't allow the same account in the GUI and the REST API at once.** If you automate with the API, use a
  separate user.
- **If you change the feed URL through the REST API, FMC 7.4.2 keeps downloading the old URL**, even after a forced
  deploy. When you create another feed object, the FMC reloads the list and downloads every feed from the new URL.
  The GUI doesn't have this problem: when you save the new URL, the FMC downloads the feeds right away. If you rotate
  the token with **New tokens**, enter the new URL in the FMC through the GUI.
- If SecureAI can't build the list, it answers with an error and the FMC keeps the previous one. It never gets an
  empty list because of an error.

## Tested versions

| Component | Version |
|---|---|
| FMC | 7.4.2 (FMCv) and 7.7 (Cisco DevNet sandbox) |
| FTD | 7.4.2 (FTDv) |
| Collector | Vector 0.46.1 |

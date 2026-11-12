---
title: "Fortinet FortiGate"
sidebarTitle: "Fortinet FortiGate"
icon: "/img/icons/fortinet.svg"
description: "See the AI your people use behind your FortiGates and block it from SecureAI, without Fortinet's GenAI module"
---

With this integration, SecureAI shows which AI services the people behind your FortiGates use, from which device and
how often, and you block them from SecureAI. You don't need Fortinet's GenAI control module: the FortiGate sends its
logs to SecureAI and downloads from SecureAI the list of domains it has to block.

<Note>
The integration is in **beta**. We tested it in a lab with FortiGate-VM and FortiOS 7.6.8; see
[Tested versions](#tested-versions).
</Note>

## How it works

1. The FortiGate sends its traffic logs (`type=traffic`) and security profile logs (`type=utm`, subtypes
   `webfilter`, `app-ctrl` and `dns`) over syslog to the SecureAI collector, a container that runs in your network.
2. The collector keeps only the lines whose destination is an AI service and sends them to your tenant over HTTPS.
   The rest of the browsing never leaves your network.
3. SecureAI reads the source (`srcip`, `user`, `srcname`), the destination (`hostname`, `qname` or the host in
   `url`), the decision (`action`, `utmaction`) and the FortiGuard classification (`app`, `appcat`, `catdesc`) from
   each line, and shows it under **Inventory → Network Sources**.
4. When you block AI domains in SecureAI, they go into a block feed. The FortiGate downloads it with an External
   Connector, and its DNS Filter profile stops resolving those domains.

## Requirements

- A FortiGate running FortiOS 7.2 or later, and an administrator with write access to Log & Report, Security
  Profiles, Security Fabric and Policy & Objects.
- A Linux machine with Docker on the FortiGate's network for the collector (1 vCPU and 1 GB handle thousands of
  events per second). The FortiGate must reach it over syslog, and it must reach your tenant over HTTPS.
- The FortiGate must reach your tenant (`https://<tenant>.hiperai.com`) over HTTPS to download the feed.
- A SecureAI administrator with a second factor set up: creating and rotating the tokens asks for it.

## 1. Connect the FortiGate in SecureAI

1. Open **Admin → Integrations** and pick the **Network / SWG** category.
2. On the **Fortinet FortiGate** card, click **Connect**.

![Fortinet FortiGate card in Integrations, Network / SWG category](/img/fortinet/console-card.png)

3. Under **Add a Fortinet FortiGate**, enter a name that lets you recognize the device. The other two fields are
   optional:
   - **Collector IP**: SecureAI sets it as the syslog server in the FortiGate configuration.
   - **Public IP of the firewall**: if you enter it, SecureAI hands the block list only to that address, even to
     someone else who has the token.

![Form to add a FortiGate](/img/fortinet/console-form.png)

4. Click **Create and show the configuration**. SecureAI asks for your second factor and creates three things: the
   collector's log source, the FortiGate's block feed, and the feed with the list of AI domains the collector uses
   to filter. Then it shows two blocks to copy: `collector.env`, with the collector's settings, and the FortiOS
   CLI, with the feed URL and token.

![Panel with collector.env and the FortiOS CLI](/img/fortinet/console-config.png)

The tokens are shown only at that moment. Copy both blocks before closing the panel and store them in your secrets
manager. If you lose them, **New tokens** on the device row generates new ones, and the old ones stop working.

Under **Connected devices** you see, for each FortiGate, whether its logs are arriving and when it last downloaded
the block list. If a device stops downloading it for more than 30 minutes, the panel warns you.

![Connected device: logs arriving and block list downloaded](/img/fortinet/console-devices.png)

## 2. Install the collector

On the Linux machine, save the `collector.env` block from step 1 next to the SecureAI collector and start it with
`docker compose up -d`. It listens for syslog on port 514, UDP and TCP.

## 3. Send the FortiGate logs to the collector

In the FortiOS GUI: **Log & Report → Log Settings**, **Global Settings** tab. Set **Syslog logging** to **Enable**
and enter the collector IP. In FortiOS 7.2 and 7.4 the option is called **Send logs to syslog**.

![Log Settings with syslog to the collector](/img/fortinet/fortigate-log-settings-syslog.png)

In the CLI it's the start of the block the panel gave you:

```
config log syslogd setting
    set status enable
    set server "<collector IP>"
    set port 514
    set mode udp
    set format default
end
```

`format default` sends FortiOS's native key=value format, which is what SecureAI reads. If you already send syslog
to another server, use `log syslogd2` (up to `syslogd4`) to leave it alone.

The policies that carry traffic to the internet need:

- **Log Allowed Traffic** set to *All Sessions* (`set logtraffic all`) or *Security Events* (`set logtraffic utm`);
- an SSL Inspection profile, even `certificate-inspection`, so FortiOS reads the destination name (SNI) of HTTPS
  connections;
- Application Control with the `default` profile or your own. FortiGuard classifies generative AI as `GenAI`;
- the DNS Filter profile from step 4, with **Log all DNS queries and responses**.

![Policy with DNS Filter, Application Control, SSL Inspection and Log Allowed Traffic](/img/fortinet/fortigate-policy-profiles.png)

## 4. Block with the SecureAI feed

The panel's CLI creates the `secureai-ia-prohibida` External Connector with the feed URL and token, and sets it to
**Block** in the `default` DNS Filter profile. If your policies use another profile, replace `default` with yours
before pasting it. In the GUI:

1. **Security Fabric → External Connectors → Create New → Threat Feeds → Domain Name**:

   | Field | Value |
   |---|---|
   | Name | `secureai-ia-prohibida` |
   | URI of external resource | The feed URL the panel shows |
   | HTTP basic authentication | On. Username: anything (for example `feed`). Password: the feed token |
   | Refresh Rate | 5 minutes |

   ![Domain Name External Connector](/img/fortinet/fortigate-external-connector.png)

   **View Entries** shows the list it downloaded. SecureAI writes each domain twice, `chatgpt.com` and
   `*.chatgpt.com`, to cover the domain and its subdomains. Until you block something, the list is empty.

   ![View Entries with the domains blocked from SecureAI](/img/fortinet/fortigate-view-entries.png)

2. In the DNS Filter profile your policies use (**Security Profiles → DNS Filter**), the connector's category shows
   up under **Remote Categories**. Set it to **Block** and keep **Redirect to Block Portal**.

   ![DNS Filter with the remote category set to Block](/img/fortinet/fortigate-dns-filter-remote-category.png)

3. Under **Options**, at the end of the profile, turn on **Allow DNS requests when a rating error occurs** and
   **Log all DNS queries and responses**.

   ![DNS Filter profile options](/img/fortinet/fortigate-dns-filter-options.png)

<Warning>
Without **Allow DNS requests when a rating error occurs** (`set options error-allow`), a FortiGate without the
FortiGuard DNS Filter subscription, or without a connection to FortiGuard, blocks every domain on a rating error,
not just the ones in the feed.
</Warning>

Through the CLI and the REST API, FortiOS leaves the connector's category at 0, which DNS Filter can't use. That's
why the panel's CLI assigns it 221; if another connector already uses it, pick a free one between 192 and 221 and
use the same one in the profile.

DNS Filter acts on the DNS queries that go through the FortiGate: those from devices that use it as their DNS
server, or those that cross a policy with the profile. A device that resolves another way (the browser's DNS over
HTTPS, a resolver that doesn't go through the FortiGate) isn't blocked this way.

## 5. Check

1. From a device behind the FortiGate, open chatgpt.com. Within a minute or two the device shows up under
   **Inventory → Network Sources**, with its calls, the providers and, if the FortiGate knows it, the user.

   ![Network Sources with the device the FortiGate detected](/img/fortinet/console-network-sources.png)

   In the source detail (**Actions → View details**), **Connectors** reads `fortinet-fortigate` and **Gateway
   enforcement** offers to block through the firewall feed.

   ![Source detail with the Fortinet connector](/img/fortinet/console-source-detail.png)

2. On the device's row, open **Actions** and pick **Block**.

   ![Source actions menu](/img/fortinet/console-block-menu.png)

3. Check the domains (for example `chatgpt.com` and `api.openai.com`), pick the duration (30 minutes up to **Until
   released**) and enter the reason. **Enforced via** must read **Firewall block-list feed**.

   ![Block dialog with the firewall feed as destination](/img/fortinet/console-block-dialog.png)

4. On the connector's next refresh, `nslookup chatgpt.com` from the device returns 208.91.112.55, the FortiGuard
   block portal IP, and the browser can't get through. Under **Log & Report → Security Events → DNS Query**, the
   `chatgpt.com` response has **Action** `redirect`.

   ![DNS Query log with the redirected response](/img/fortinet/fortigate-dns-log-redirect.png)

5. That log comes back to SecureAI. In the source detail, **Gateway enforcement** switches to **Enforcement
   confirmed** and counts the queries the FortiGate blocked since you created the block.

   ![Enforcement confirmed in the source detail](/img/fortinet/console-block-confirmed.png)

6. To lift it, pick **Actions → Release** on the row. SecureAI takes the domains out of the feed and the FortiGate
   resolves them again on its next refresh.

   ![Actions menu with Release](/img/fortinet/console-release-menu.png)

## Automatic blocking

In **Response & auto-block**, above the Network Sources list, turn on **Auto-block sources that exceed the
threshold** and set the call threshold (per day or per 7 days), how long the block lasts and how many automatic
blocks can be active at once. When a source crosses the threshold, SecureAI puts its AI domains in the feed and
takes them out when the block expires. Saving these settings asks for your second factor.

![Response & auto-block with the threshold](/img/fortinet/console-auto-block.png)

## Limits

- **Without TLS inspection, the FortiGate sees the destination name, not the content.** SecureAI knows someone used
  ChatGPT, from which device and how many times; not what they wrote.
- **The connector uses `https://`.** With `http://` the feed token travels in clear text.
- **Disabling or deleting the feed doesn't unblock anything.** The FortiGate keeps the last list it downloaded. To
  unblock, use **Release** or take the category out of the DNS Filter profile.
- **A block reaches the whole network behind the FortiGate**, not a user or an IP: the feed is a list of domains.
- **If your tenant also has Cisco Umbrella or Cloudflare Gateway blocking, blocks go there and not to the feed.** To
  send them to the FortiGate, ask support to set the block destination to the feed.
- **Counters are approximate.** FortiOS logs the same session in the security log and in the traffic log. SecureAI
  counts it once, unless the service restarts in between.
- If SecureAI can't build the list, it answers with an error and the FortiGate keeps the previous one. It never gets
  an empty list because of an error.

## Tested versions

| FortiOS | Device | Result |
|---|---|---|
| 7.6.8 | FortiGate-VM, in a lab | Setup from the console, discovery through DNS Filter and Application Control, manual and automatic blocking through the feed, enforcement confirmed and release |

We haven't tested it yet on FortiOS 7.2 or 7.4, or on physical devices. The steps use objects that exist in all
three versions; GUI menu names may change.

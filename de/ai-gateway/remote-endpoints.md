---
sidebar_position: 6
title: "Remote-Endpunkte"
---
# Remote-Endpunkte

Mit Remote-Endpunkten können Sie externe oder selbst gehostete Modellserver über AI-Gateway-Steuerungen mit SecureAI verbinden.

Dies ist nützlich, wenn Ihre Organisation eine eigene Modellinfrastruktur betreibt und dennoch eine zentralisierte Sicherheitsverwaltung wünscht.

## Wo zu konfigurieren

Gehen Sie zu **Admin → AI Gateway → Remote Endpoints**.

## Registrierungsoptionen

- **Schnellinstallation**: geführter Assistent, der einen Einrichtungsablauf mit einem Befehl generiert.
- **Manuelle Registrierung**:
  - **JSON einfügen**
  - **Manuelle Eingabe**-Felder

## Konnektivitätsmodi

- **Reverse Connect**: empfohlen für die meisten Bereitstellungen; ausgehende Verbindung, keine offenen eingehenden Ports.
- **Cloudflare Tunnel**: Zero-Trust-Konnektivität mit Tunnel-Token und Hostnamen.

## Täglicher Betrieb

Für jeden Endpunkt können Administratoren:

- **Gesundheitscheck** ausführen
- Führen Sie **mTLS überprüfen** aus.
- Überprüfen Sie die Endpunktdetails (Region, Fingerabdruck, Modelle, letzte Überprüfung).
- Endpunkt entfernen, wenn er außer Betrieb genommen wird

## Empfohlener Onboarding-Ablauf

1. Beginnen Sie mit der **Schnellinstallation**.
2. Wählen Sie den Verbindungsmodus.
3. Wählen Sie die gewünschten Modelle aus.
4. Schließen Sie die Registrierung ab.
5. Führen Sie eine Gesundheitsprüfung durch und überprüfen Sie mTLS.
6. Bestätigen Sie, dass der Endpunkt nach 5 bis 10 Minuten weiterhin fehlerfrei bleibt.

## Checkliste zur Fehlerbehebung

– Endpunkt nicht erreichbar: Überprüfen Sie den Konnektivitätsmodus und die Hostnamenwerte.
– TLS bestanden, aber fehlerhaft: Überprüfen Sie den Status des Remote-Gateways/Modelldienstes.
- Nicht verbunden: Bestätigen Sie, dass der Remote-Dienst ausgeführt wird und die Registrierung gültig ist.

## Best Practices

- Bevorzugen Sie Reverse Connect, es sei denn, Ihre Architektur erfordert einen Tunnelmodus.
- Sorgen Sie dafür, dass die Eigentümerschaft der Endpunkte je nach Organisation/Team klar ist.
- Überprüfen Sie den Zustand des Endpunkts nach Richtlinien- oder Schlüsseländerungen erneut.
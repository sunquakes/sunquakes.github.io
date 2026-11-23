---
description: "Fix VMware bridged-mode networking when Ubuntu 22.04 pings the gateway with Destination Host Unreachable — pin VMnet0, enable the bridge protocol, renew DHCP."
---

# Fix VMware Bridged Mode "Destination Host Unreachable" on Ubuntu 22.04

A fresh Ubuntu 22.04 VM in VMware bridged mode can't reach the LAN or the internet — `ping` to the gateway fails with `Destination Host Unreachable`. In most cases the root cause is on the Windows host side, not inside Ubuntu.

## The Problem

The VM is set to **Bridged** networking, but:

- `ip a` shows no IP on `ens33`, or an address outside the LAN subnet (e.g. `192.168.x.x` when the LAN is `10.0.0.x`)
- `ping <gateway-ip>` fails with `Destination Host Unreachable`
- The Windows host itself browses the internet normally

Since the host has internet, the instinct is to debug Ubuntu — netplan, `systemd-networkd`, firewalls. That's the wrong end of the pipe. The traffic never leaves the host because the VMware bridge itself is broken.

## Root Cause: VMnet0 "Auto-bridge" Picks the Wrong NIC

In bridged mode, VMware does not route through the host's network stack — it taps a **physical** NIC directly, so the VM appears on the LAN as its own device and gets its IP from the router, exactly like the host.

![Bridged topology: the Ubuntu VM and the Windows host sit on the same LAN subnet and both get their IPs from the router](/assets/posts/backend/linux/fix-vmware-bridge-destination-host-unreachable/01-bridged-topology.svg)

That tap is configured on `VMnet0`, and its default setting is **"Bridged: Automatic"**. With several adapters present — Wi-Fi, Ethernet, VPN taps, Hyper-V / WSL virtual adapters — auto-bridging frequently latches onto the wrong one. The VM then transmits onto a network that has no gateway, which is exactly what `Destination Host Unreachable` means. This is the cause in the large majority of cases.

### ❌ Bad Practice: Leave VMnet0 on "Automatic"

```text
VMnet0   Bridged: Automatic       ← VMware may bind to a VPN / Hyper-V adapter
```

**Impact:**

- VM frames are bridged onto an adapter with no path to the router
- Gateway ping fails with `Destination Host Unreachable`, no matter what Ubuntu is configured to do

### ✅ Good Practice: Pin VMnet0 to the Active Adapter

```text
VMnet0   Bridged: Realtek PCIe GbE Family Controller   ← the NIC that actually has internet
```

**Impact:**

- The VM shares the real LAN segment and gets a routable IP from the router's DHCP
- No changes needed inside Ubuntu beyond renewing its lease

## The Fix

### ✅ Step 1: Pin VMnet0 to the Adapter That Has Internet (Windows Host)

Open VMware **as Administrator**, then:

1. Menu: **Edit → Virtual Network Editor**
2. Click **Change Settings** (elevates to admin rights)
3. Select `VMnet0` (Bridged mode)
4. In the **Bridged to** dropdown, change **Automatic** to the NIC you actually use:
   - On Wi-Fi → pick the **wireless** adapter
   - Plugged in → pick the **Ethernet** adapter
5. Click **Apply → OK**

![Virtual Network Editor with VMnet0 selected and the Bridged to dropdown pinned to a specific adapter instead of Automatic](/assets/posts/backend/linux/fix-vmware-bridge-destination-host-unreachable/02-vmnet0-pin-adapter.svg)

> ⚠️ Never leave it on "Automatic" once you rely on bridged mode — auto-selection changes whenever adapters come and go (VPN connect/disconnect, docking a laptop), silently breaking the VM.

### ✅ Step 2: Enable VMware Bridge Protocol on That NIC

The chosen Windows adapter must actually allow VMware to tap it.

1. `Win + R` → `ncpa.cpl` → open **Network Connections**
2. Right-click the adapter you pinned in Step 1 → **Properties**
3. In the items list:
   - ✅ **Check** `VMware Bridge Protocol`
   - ❌ **Uncheck** filter drivers that sit on the adapter and can block bridged frames — e.g. `DNE LightWeight Filter` (Dell network assistant) or `Npcap` / `WinPcap` capture drivers

![Adapter Properties dialog with VMware Bridge Protocol checked and DNE LightWeight Filter and Npcap unchecked](/assets/posts/backend/linux/fix-vmware-bridge-destination-host-unreachable/03-bridge-protocol.svg)

If `VMware Bridge Protocol` is missing entirely, reinstall it via **Install → Service → VMware Bridge Protocol** in the same dialog.

### ✅ Step 3: Renew and Verify Inside Ubuntu 22.04

Check whether the VM now lands on the LAN subnet:

```bash
ip a
```

`ens33` should show an address in the same subnet as the host, e.g. `192.168.1.x`. If it has **no IP** yet, request one from the router's DHCP directly:

```bash
sudo dhclient ens33
```

Then test in order — gateway first, internet second:

```bash
ping 192.168.1.1    # LAN gateway
ping 8.8.8.8        # a public IP, proves traffic leaves the network
```

Once the gateway replies, external pings follow. If the gateway is reachable but hostnames fail, only DNS is missing — point `ens33` at public resolvers (see [Setting static IP in Ubuntu-22.04](/posts/backend/linux/setting-statics-ip-in-ubuntu)).

![Verification flow: ip a shows a LAN-subnet IP, ping the gateway, then ping a public IP](/assets/posts/backend/linux/fix-vmware-bridge-destination-host-unreachable/04-verify-flow.svg)

## Common Pitfalls to Avoid

### ❌ Pitfall 1: Debugging Ubuntu While the Bridge Is Broken

```bash
# ❌ Wasted effort while VMnet0 still taps the wrong NIC
sudo netplan apply
sudo systemctl restart systemd-networkd
```

```powershell
# ✅ Fix the host bridge first, then touch the VM at all
# Edit -> Virtual Network Editor -> VMnet0 -> pin the active NIC
```

**Why it's bad:** in bridged mode Ubuntu cannot reach a gateway the host never forwards frames to. Every guest-side change is invisible until `VMnet0` is pinned.

### ❌ Pitfall 2: Leaving Capture / Vendor Filter Drivers Enabled on the NIC

```text
❌ DNE LightWeight Filter, Npcap  — bound, intercepting bridged frames
✅ Only VMware Bridge Protocol     — the tap the VM actually needs
```

**Why it's bad:** these filter drivers sit in the same binding layer as the VMware bridge and can drop or hijack its frames, reproducing the exact same `Destination Host Unreachable` even with the right NIC pinned.

### ❌ Pitfall 3: A Static IP on the Wrong Subnet

```yaml
# ❌ Stale static config survives the move to bridged DHCP
ens33:
  addresses: [10.222.1.37/24]   # LAN is actually 192.168.1.0/24
```

```bash
# ✅ Let DHCP hand out a correct lease first
sudo dhclient -r ens33 && sudo dhclient ens33
```

**Why it's bad:** a hand-set address outside the LAN subnet passes `ip a` at a glance but can never reach the gateway — masking the fact that the bridge is now working fine.

## Summary

When a bridged VM reports `Destination Host Unreachable`:

1. **Pin `VMnet0` to the active NIC** - "Automatic" bridges onto VPN / virtual adapters and is the root cause in most cases
2. **Bind only VMware Bridge Protocol on that NIC** - check it is enabled; uncheck DNE / Npcap filter drivers
3. **Renew the lease inside Ubuntu, then verify in order** - `dhclient`, ping the gateway, ping a public IP

**Remember:** bridged mode taps a physical NIC — if the tap is on the wrong card, everything you fix inside the guest is pointless.

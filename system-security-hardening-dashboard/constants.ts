
import type { ScanCategory, PvpAction } from './types';
import { CheckStatus, UserRole } from './types';

export const SCAN_CATEGORIES: ScanCategory[] = [
  {
    id: 'system-hardening',
    title: 'System Hardening & Configuration',
    description: 'Verifies OS-level security settings, kernel parameters, and file system permissions based on CIS benchmarks.',
    checks: [
      { id: 'sh-1', title: 'Kernel Parameter Hardening', description: 'Checks sysctl values for network and memory security (e.g., tcp_syncookies, randomize_va_space).', status: CheckStatus.PENDING },
      { id: 'sh-2', title: 'File System Permissions', description: 'Audits permissions of critical system files and directories like /etc/shadow and /etc/sudoers.', status: CheckStatus.PENDING },
      { id: 'sh-3', title: 'Running Services Audit', description: 'Identifies unnecessary or insecure services running on the system.', status: CheckStatus.PENDING },
    ],
  },
  {
    id: 'webcam-mic',
    title: 'Webcam & Mic Guard',
    description: 'Simulates checks on device access permissions and PipeWire/portal configurations to detect potential eavesdropping vectors.',
    checks: [
      { id: 'wm-1', title: 'PipeWire Portal Inspection', description: 'Verifies that no unauthorized applications have persistent access to camera or microphone streams.', status: CheckStatus.PENDING },
      { id: 'wm-2', title: 'Device File Permissions', description: 'Checks permissions on /dev/video* and other input device files to prevent raw access.', status: CheckStatus.PENDING },
    ],
  },
  {
    id: 'keylogger',
    title: 'Keylogger Exposure Scan',
    description: 'Scans for common indicators of keyloggers, such as suspicious kernel modules and input device hooks.',
    checks: [
      { id: 'kl-1', title: 'Suspicious Kernel Modules', description: 'Scans loaded kernel modules against a list of known malicious or suspicious drivers.', status: CheckStatus.PENDING },
      { id: 'kl-2', title: 'Input Device Listeners', description: 'Checks for unusual processes with open file handles to /dev/input/event* devices.', status: CheckStatus.PENDING },
      { id: 'kl-3', title: 'LD_PRELOAD Hook Check', description: 'Examines environment variables for libraries that could be used to intercept input events.', status: CheckStatus.PENDING },
    ],
  },
  {
    id: 'network',
    title: 'DNS, ARP, & MITM Resistance',
    description: 'Simulates common network-level attacks within a safe, isolated environment to test host resilience.',
    checks: [
      { id: 'net-1', title: 'ARP Spoofing Resistance', description: 'Simulates an ARP poisoning attack to see if the host accepts unsolicited ARP replies.', status: CheckStatus.PENDING },
      { id: 'net-2', title: 'DNS Poisoning Resilience', description: 'Checks if the local DNS resolver validates DNS responses to prevent cache poisoning.', status: CheckStatus.PENDING },
      { id: 'net-3', title: 'Firewall Egress Rules', description: 'Audits firewall rules for overly permissive outbound traffic that could enable data exfiltration.', status: CheckStatus.PENDING },
    ],
  },
];

export const HACKER_PAYLOADS: PvpAction[] = [
  { id: 'phishing_email', name: 'Phishing Email', description: 'A low-cost attack that deals minor damage if it bypasses filters.', cost: 2, damage: 10, defense: 0, role: UserRole.HACKER },
  { id: 'ddos_swarm', name: 'DDoS Swarm', description: 'Overwhelms the target, dealing moderate, consistent damage.', cost: 4, damage: 20, defense: 0, role: UserRole.HACKER },
  { id: 'sql_injection', name: 'SQL Injection', description: 'A precise attack that bypasses weak defenses for high damage.', cost: 6, damage: 35, defense: 0, role: UserRole.HACKER },
  { id: 'credential_stuffing', name: 'Credential Stuffing', description: 'Attempts to find a weak password. Low damage, but cheap.', cost: 3, damage: 15, defense: 0, role: UserRole.HACKER },
  { id: 'rootkit_install', name: 'Rootkit Install', description: 'Ultimate attack. Very high cost, deals devastating damage.', cost: 10, damage: 60, defense: 0, role: UserRole.HACKER },
];

export const CYBER_SEC_COUNTERMEASURES: PvpAction[] = [
    { id: 'firewall_update', name: 'Firewall Update', description: 'Basic defense. Blocks a small amount of incoming damage.', cost: 2, damage: 0, defense: 10, role: UserRole.CYBER_SEC },
    { id: 'isolate_endpoint', name: 'Isolate Endpoint', description: 'Temporarily shields the system from most attacks.', cost: 5, damage: 0, defense: 30, role: UserRole.CYBER_SEC },
    { id: 'patch_vulnerability', name: 'Patch Vulnerability', description: 'Heals system integrity by fixing a known exploit.', cost: 4, damage: -20, defense: 0, role: UserRole.CYBER_SEC }, // Negative damage is healing
    { id: 'threat_intelligence_scan', name: 'Threat Intel Scan', description: 'Analyze attack patterns to gain energy for a stronger response.', cost: 1, damage: 0, defense: 5, role: UserRole.CYBER_SEC },
    { id: 'honeypot_deploy', name: 'Deploy Honeypot', description: 'Lays a trap. Blocks damage and reflects a portion back to the attacker.', cost: 7, damage: 15, defense: 15, role: UserRole.CYBER_SEC },
];

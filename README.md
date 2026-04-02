# n8n-nodes-trezor

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Trezor hardware wallets. This node provides 5 comprehensive resources for cryptocurrency wallet management, transaction signing, privacy operations, and device administration through secure hardware wallet interactions.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Hardware Wallet](https://img.shields.io/badge/Hardware-Wallet-green)
![Cryptocurrency](https://img.shields.io/badge/Cryptocurrency-Support-orange)
![Security](https://img.shields.io/badge/Security-Hardened-red)

## Features

- **Device Management** - Connect, initialize, and manage Trezor hardware wallets
- **Wallet Operations** - Generate addresses, check balances, and send transactions
- **Message Signing** - Cryptographically sign messages for authentication and verification
- **CoinJoin Privacy** - Enhanced privacy features for confidential transactions
- **Firmware Management** - Update and verify Trezor device firmware
- **Multi-Currency Support** - Support for Bitcoin, Ethereum, and other cryptocurrencies
- **Hardware Security** - Leverage secure element protection for private key operations
- **Transaction Verification** - On-device transaction confirmation and validation

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-trezor`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-trezor
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-trezor.git
cd n8n-nodes-trezor
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-trezor
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Trezor Connect API key for authentication | Yes |
| Device ID | Unique identifier for your Trezor device | Yes |
| Passphrase | Optional passphrase for additional security | No |
| Environment | Select between mainnet and testnet | Yes |

## Resources & Operations

### 1. Device Management

| Operation | Description |
|-----------|-------------|
| Connect Device | Establish connection with Trezor hardware wallet |
| Get Device Info | Retrieve device specifications and status |
| Initialize Device | Set up new device with initial configuration |
| Wipe Device | Securely erase all data from device |
| Reset Device | Factory reset device to default settings |
| Get Features | List supported features and capabilities |
| Change PIN | Update device PIN for security |
| Enable Passphrase | Configure passphrase protection |

### 2. Wallet Operations

| Operation | Description |
|-----------|-------------|
| Get Address | Generate receiving address for specified cryptocurrency |
| Get Balance | Check wallet balance for specific coins |
| Send Transaction | Create and broadcast cryptocurrency transaction |
| Get Transaction History | Retrieve transaction history for wallet |
| Sign Transaction | Sign transaction with hardware wallet |
| Verify Address | Confirm address ownership on device screen |
| Get Public Key | Retrieve public key for specified derivation path |
| Compose Transaction | Build unsigned transaction for later signing |

### 3. Message Signing

| Operation | Description |
|-----------|-------------|
| Sign Message | Cryptographically sign arbitrary message |
| Verify Signature | Verify message signature authenticity |
| Sign Login Challenge | Sign authentication challenge for login |
| Sign Typed Data | Sign structured data (EIP-712) |
| Sign Personal Message | Sign personal message with Ethereum format |
| Verify Identity | Verify identity using signed message |

### 4. CoinJoin Privacy

| Operation | Description |
|-----------|-------------|
| Initialize CoinJoin | Start CoinJoin privacy session |
| Register Inputs | Register UTXO inputs for mixing |
| Register Outputs | Register mixed outputs for privacy |
| Sign CoinJoin Round | Sign CoinJoin transaction round |
| Get Mixing Status | Check status of ongoing mixing process |
| Cancel CoinJoin | Cancel active CoinJoin session |

### 5. Firmware Management

| Operation | Description |
|-----------|-------------|
| Get Firmware Info | Retrieve current firmware version and details |
| Check Updates | Check for available firmware updates |
| Download Firmware | Download firmware update package |
| Install Firmware | Install firmware update on device |
| Verify Firmware | Verify firmware authenticity and integrity |
| Get Update History | Retrieve firmware update history |

## Usage Examples

```javascript
// Connect to Trezor device and get device information
{
  "resource": "DeviceManagement",
  "operation": "getDeviceInfo",
  "deviceId": "trezor_device_001"
}
```

```javascript
// Generate Bitcoin receiving address
{
  "resource": "WalletOperations", 
  "operation": "getAddress",
  "coin": "bitcoin",
  "path": "m/44'/0'/0'/0/0",
  "showOnTrezor": true
}
```

```javascript
// Sign a message for authentication
{
  "resource": "MessageSigning",
  "operation": "signMessage", 
  "message": "Login to MyApp at 2024-01-15 10:30:00",
  "path": "m/44'/0'/0'/0/0",
  "coin": "bitcoin"
}
```

```javascript
// Send Bitcoin transaction
{
  "resource": "WalletOperations",
  "operation": "sendTransaction",
  "coin": "bitcoin", 
  "outputs": [{
    "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    "amount": "100000"
  }],
  "fee": "5000"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Device not connected | Trezor device is not connected or detected | Connect device and ensure drivers are installed |
| PIN required | Device requires PIN entry | Enter PIN on device or through PIN matrix |
| Passphrase required | Device requires passphrase for access | Provide passphrase in credentials or on device |
| Firmware outdated | Device firmware version is not supported | Update firmware through Firmware Management resource |
| Transaction rejected | User rejected transaction on device | Confirm transaction approval on device screen |
| Invalid path | Derivation path format is incorrect | Use valid BIP32/44 derivation path format |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-trezor/issues)
- **Trezor Documentation**: [Trezor Connect API](https://github.com/trezor/connect)
- **Hardware Wallet Community**: [Trezor Community](https://trezor.io/community)
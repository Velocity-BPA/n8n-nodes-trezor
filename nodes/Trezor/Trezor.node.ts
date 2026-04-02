/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeApiError,
} from 'n8n-workflow';

// Import action operations and fields
import { deviceOperations, deviceFields, executeDeviceOperation } from './actions/device/device';
import { accountOperations, accountFields, executeAccountOperation } from './actions/account/account';
import { bitcoinOperations, bitcoinFields, executeBitcoinOperation } from './actions/bitcoin/bitcoin';
import { bitcoinLikeOperations, bitcoinLikeFields, executeBitcoinLikeOperation } from './actions/bitcoinLike/bitcoinLike';
import { ethereumOperations, ethereumFields, executeEthereumOperation } from './actions/ethereum/ethereum';
import { evmChainsOperations, evmChainsFields, executeEvmChainsOperation } from './actions/evmChains/evmChains';
import { cardanoOperations, cardanoFields, executeCardanoOperation } from './actions/cardano/cardano';
import { rippleOperations, rippleFields, executeRippleOperation } from './actions/ripple/ripple';
import { stellarOperations, stellarFields, executeStellarOperation } from './actions/stellar/stellar';
import { tezosOperations, tezosFields, executeTezosOperation } from './actions/tezos/tezos';
import { eosOperations, eosFields, executeEosOperation } from './actions/eos/eos';
import { binanceChainOperations, binanceChainFields, executeBinanceChainOperation } from './actions/binanceChain/binanceChain';
import { solanaOperations, solanaFields, executeSolanaOperation } from './actions/solana/solana';
import { multiCurrencyOperations, multiCurrencyFields, executeMultiCurrencyOperation } from './actions/multiCurrency/multiCurrency';
import { transactionOperations, transactionFields, executeTransactionOperation } from './actions/transaction/transaction';
import { addressOperations, addressFields, executeAddressOperation } from './actions/address/address';
import { signingOperations, signingFields, executeSigningOperation } from './actions/signing/signing';
import { passphraseOperations, passphraseFields, executePassphraseOperation } from './actions/passphrase/passphrase';
import { backupOperations, backupFields, executeBackupOperation } from './actions/backup/backup';
import { securityOperations, securityFields, executeSecurityOperation } from './actions/security/security';
import { coinjoinOperations, coinjoinFields, executeCoinjoinOperation } from './actions/coinjoin/coinjoin';
import { firmwareOperations, firmwareFields, executeFirmwareOperation } from './actions/firmware/firmware';
import { labelOperations, labelFields, executeLabelOperation } from './actions/label/label';
import { webauthnOperations, webauthnFields, executeWebauthnOperation } from './actions/webauthn/webauthn';
import { suiteOperations, suiteFields, executeSuiteOperation } from './actions/suite/suite';
import { utilityOperations, utilityFields, executeUtilityOperation } from './actions/utility/utility';

// Log licensing notice once per node load
let licenseNoticeLogged = false;
function logLicenseNotice(): void {
	if (!licenseNoticeLogged) {
		console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
		licenseNoticeLogged = true;
	}
}

export class Trezor implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Trezor',
		name: 'trezor',
		icon: 'file:trezor.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Trezor hardware wallet for cryptocurrency operations',
		defaults: {
			name: 'Trezor',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'trezorConnectApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Address', value: 'address' },
					{ name: 'Backup', value: 'backup' },
					{ name: 'Binance Chain', value: 'binanceChain' },
					{ name: 'Bitcoin', value: 'bitcoin' },
					{ name: 'Bitcoin-Like', value: 'bitcoinLike' },
					{ name: 'Cardano', value: 'cardano' },
					{ name: 'CoinJoin', value: 'coinjoin' },
					{ name: 'CoinJoin Privacy', value: 'coinJoinPrivacy' },
					{ name: 'Device', value: 'device' },
					{ name: 'Device Management', value: 'deviceManagement' },
					{ name: 'EOS', value: 'eos' },
					{ name: 'Ethereum', value: 'ethereum' },
					{ name: 'EVM Chains', value: 'evmChains' },
					{ name: 'Firmware', value: 'firmware' },
					{ name: 'Firmware Management', value: 'firmwareManagement' },
					{ name: 'Label', value: 'label' },
					{ name: 'Message Signing', value: 'messageSigning' },
					{ name: 'Multi-Currency', value: 'multiCurrency' },
					{ name: 'Passphrase', value: 'passphrase' },
					{ name: 'Ripple (XRP)', value: 'ripple' },
					{ name: 'Security', value: 'security' },
					{ name: 'Signing', value: 'signing' },
					{ name: 'Solana', value: 'solana' },
					{ name: 'Stellar', value: 'stellar' },
					{ name: 'Suite', value: 'suite' },
					{ name: 'Tezos', value: 'tezos' },
					{ name: 'Transaction', value: 'transaction' },
					{ name: 'Utility', value: 'utility' },
					{ name: 'Wallet Operations', value: 'walletOperations' },
					{ name: 'WebAuthn (FIDO2)', value: 'webauthn' },
				],
				default: 'device',
			},
			// Operations
			...deviceOperations,
			...accountOperations,
			...bitcoinOperations,
			...bitcoinLikeOperations,
			...ethereumOperations,
			...evmChainsOperations,
			...cardanoOperations,
			...rippleOperations,
			...stellarOperations,
			...tezosOperations,
			...eosOperations,
			...binanceChainOperations,
			...solanaOperations,
			...multiCurrencyOperations,
			...transactionOperations,
			...addressOperations,
			...signingOperations,
			...passphraseOperations,
			...backupOperations,
			...securityOperations,
			...coinjoinOperations,
			...firmwareOperations,
			...labelOperations,
			...webauthnOperations,
			...suiteOperations,
			...utilityOperations,
			// New operations from generated code
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['deviceManagement'] } },
				options: [
					{ name: 'Initialize', value: 'initialize', description: 'Initialize Trezor Connect', action: 'Initialize Trezor Connect' },
					{ name: 'Get Features', value: 'getFeatures', description: 'Get device features and capabilities', action: 'Get device features' },
					{ name: 'Get Device State', value: 'getDeviceState', description: 'Get current device state', action: 'Get device state' },
					{ name: 'Request Login', value: 'requestLogin', description: 'Request login challenge from device', action: 'Request login challenge' },
					{ name: 'Wipe Device', value: 'wipeDevice', description: 'Wipe device completely', action: 'Wipe device' },
					{ name: 'Reset Device', value: 'resetDevice', description: 'Initialize device setup', action: 'Reset device' },
				],
				default: 'initialize',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['walletOperations'] } },
				options: [
					{
						name: 'Get Public Key',
						value: 'getPublicKey',
						description: 'Get public key for specified derivation path',
						action: 'Get public key',
					},
					{
						name: 'Get Address',
						value: 'getAddress',
						description: 'Get address for specified derivation path',
						action: 'Get address',
					},
					{
						name: 'Get Account Info',
						value: 'getAccountInfo',
						description: 'Get account information and balance',
						action: 'Get account info',
					},
					{
						name: 'Compose Transaction',
						value: 'composeTransaction',
						description: 'Compose transaction with UTXOs',
						action: 'Compose transaction',
					},
					{
						name: 'Sign Transaction',
						value: 'signTransaction',
						description: 'Sign prepared transaction',
						action: 'Sign transaction',
					},
				],
				default: 'getPublicKey',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['messageSigning'] } },
				options: [
					{ name: 'Sign Message', value: 'signMessage', description: 'Sign message with private key', action: 'Sign a message' },
					{ name: 'Verify Message', value: 'verifyMessage', description: 'Verify signed message', action: 'Verify a message' },
					{ name: 'Cipher Key Value', value: 'cipherKeyValue', description: 'Encrypt/decrypt data using device key', action: 'Cipher key value' },
				],
				default: 'signMessage',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['coinJoinPrivacy'] } },
				options: [
					{ name: 'Authorize CoinJoin', value: 'authorizeCoinjoin', description: 'Authorize CoinJoin session', action: 'Authorize coinjoin' },
					{ name: 'Sign CoinJoin Transaction', value: 'signCoinjoinTx', description: 'Sign CoinJoin transaction', action: 'Sign coinjoin transaction' },
					{ name: 'Get CoinJoin Status', value: 'getCoinJoinStatus', description: 'Get current CoinJoin session status', action: 'Get coinjoin status' },
					{ name: 'End CoinJoin Session', value: 'endCoinJoinSession', description: 'End active CoinJoin session', action: 'End coinjoin session' }
				],
				default: 'authorizeCoinjoin',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['firmwareManagement'] } },
				options: [
					{ name: 'Update Firmware', value: 'firmwareUpdate', description: 'Update device firmware', action: 'Update firmware' },
					{ name: 'Get Firmware Hash', value: 'getFirmwareHash', description: 'Get current firmware hash', action: 'Get firmware hash' },
					{ name: 'Check Firmware Authenticity', value: 'checkFirmwareAuthenticity', description: 'Verify firmware authenticity', action: 'Check firmware authenticity' }
				],
				default: 'firmwareUpdate',
			},
			// Fields
			...deviceFields,
			...accountFields,
			...bitcoinFields,
			...bitcoinLikeFields,
			...ethereumFields,
			...evmChainsFields,
			...cardanoFields,
			...rippleFields,
			...stellarFields,
			...tezosFields,
			...eosFields,
			...binanceChainFields,
			...solanaFields,
			...multiCurrencyFields,
			...transactionFields,
			...addressFields,
			...signingFields,
			...passphraseFields,
			...backupFields,
			...securityFields,
			...coinjoinFields,
			...firmwareFields,
			...labelFields,
			...webauthnFields,
			...suiteFields,
			...utilityFields,
			// New fields from generated code
			{
				displayName: 'Manifest',
				name: 'manifest',
				type: 'json',
				displayOptions: { show: { resource: ['deviceManagement'], operation: ['initialize'] } },
				default: '{"email":"user@example.com","appUrl":"https://example.com"}',
				description: 'Application manifest containing email and appUrl for Trezor Connect initialization',
			},
			{
				displayName: 'Debug Mode',
				name: 'debug',
				type: 'boolean',
				displayOptions: { show: { resource: ['deviceManagement'], operation: ['initialize'] } },
				default: false,
				description: 'Enable debug mode for development purposes',
			},
			{
				displayName: 'Device Path',
				name: 'device',
				type: 'string',
				displayOptions: { show: { resource: ['deviceManagement'], operation: ['getFeatures', 'getDeviceState', 'wipeDevice', 'resetDevice'] } },
				default: '',
				description: 'Specific device path to target (optional)',
			},
			{
				displayName: 'Use Empty Passphrase',
				name: 'useEmptyPassphrase',
				type: 'boolean',
				displayOptions: { show: { resource: ['deviceManagement'], operation: ['getFeatures', 'getDeviceState'] } },
				default: false,
				description: 'Use empty passphrase for device operations',
			},
			{
				displayName: 'Callback URL',
				name: 'callback',
				type: 'string',
				displayOptions: { show: { resource: ['deviceManagement'], operation: ['requestLogin'] } },
				default: '',
				description: 'Callback URL for login challenge response (optional)',
			},
			{
				displayName: 'Async Challenge',
				name: 'asyncChallenge',
				type: 'boolean',
				displayOptions: { show: { resource: ['deviceManagement'], operation: ['requestLogin'] } },
				default: false,
				description: 'Use asynchronous challenge handling',
			},
			{
				displayName: 'Strength',
				name: 'strength',
				type: 'options',
				displayOptions: { show: { resource: ['deviceManagement'], operation: ['resetDevice'] } },
				options: [
					{ name: '128 bits', value: 128 },
					{ name: '192 bits', value: 192 },
					{ name: '256 bits', value: 256 },
				],
				default: 256,
				description: 'Seed strength in bits',
			},
			{
				displayName: 'Passphrase Protection',
				name: 'passphraseProtection',
				type: 'boolean',
				displayOptions: { show: { resource: ['deviceManagement'], operation: ['resetDevice'] } },
				default: false,
				description: 'Enable passphrase protection',
			},
			{
				displayName: 'PIN Protection',
				name: 'pinProtection',
				type: 'boolean',
				displayOptions: { show: { resource: ['deviceManagement'], operation: ['resetDevice'] } },
				default: true,
				description: 'Enable PIN protection',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				displayOptions: { show: { resource: ['deviceManagement'], operation: ['resetDevice'] } },
				default: 'en-US',
				description: 'Device language setting',
			},
			{
				displayName: 'Device Label',
				name: 'label',
				type: 'string',
				displayOptions: { show: { resource: ['deviceManagement'], operation: ['resetDevice'] } },
				default: 'My Trezor',
				description: 'Custom label for the device',
			},
			{
				displayName: 'Derivation Path',
				name: 'path',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['getPublicKey', 'getAddress', 'getAccountInfo'],
					},
				},
				default: "m/44'/0'/0'/0/0",
				description: 'HD derivation path (e.g., m/44\'/0\'/0\'/0/0)',
			},
			{
				displayName: 'Coin',
				name: 'coin',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['getPublicKey', 'getAddress', 'getAccountInfo', 'composeTransaction', 'signTransaction'],
					},
				},
				default: 'btc',
				description: 'Coin symbol (e.g., btc, eth, ltc)',
			},
			{
				displayName: 'Show on Trezor',
				name: 'showOnTrezor',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['getPublicKey', 'getAddress'],
					},
				},
				default: false,
				description: 'Whether to show the result on Trezor device screen',
			},
			{
				displayName: 'Cross Chain',
				name: 'crossChain',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['getPublicKey', 'getAddress'],
					},
				},
				default: false,
				description: 'Whether to use cross-chain functionality',
			},
			{
				displayName: 'Multisig',
				name: 'multisig',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['getAddress'],
					},
				},
				default: '{}',
				description: 'Multisig configuration object',
			},
			{
				displayName: 'Include Details',
				name: 'details',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['getAccountInfo'],
					},
				},
				default: true,
				description: 'Whether to include detailed transaction information',
			},
			{
				displayName: 'Include Tokens',
				name: 'tokens',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['getAccountInfo'],
					},
				},
				default: false,
				description: 'Whether to include token balances',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['getAccountInfo'],
					},
				},
				default: 1,
				description: 'Page number for pagination',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['getAccountInfo'],
					},
				},
				default: 25,
				description: 'Number of items per page',
			},
			{
				displayName: 'Outputs',
				name: 'outputs',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['composeTransaction', 'signTransaction'],
					},
				},
				default: '[]',
				description: 'Array of transaction outputs',
			},
			{
				displayName: 'Account',
				name: 'account',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['composeTransaction', 'signTransaction'],
					},
				},
				default: '{}',
				description: 'Account configuration object',
			},
			{
				displayName: 'UTXOs',
				name: 'utxos',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['composeTransaction'],
					},
				},
				default: '[]',
				description: 'Array of unspent transaction outputs',
			},
			{
				displayName: 'Change Address',
				name: 'changeAddress',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['composeTransaction'],
					},
				},
				default: '',
				description: 'Address for change output',
			},
			{
				displayName: 'Inputs',
				name: 'inputs',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['signTransaction'],
					},
				},
				default: '[]',
				description: 'Array of transaction inputs',
			},
			{
				displayName: 'Reference Transactions',
				name: 'refTxs',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['signTransaction'],
					},
				},
				default: '[]',
				description: 'Array of referenced transactions',
			},
			{
				displayName: 'Lock Time',
				name: 'locktime',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['walletOperations'],
						operation: ['signTransaction'],
					},
				},
				default: 0,
				description: 'Transaction lock time',
			},
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['messageSigning'], operation: ['signMessage', 'cipherKeyValue'] } },
				default: "m/44'/0'/0'/0/0",
				description: 'BIP44 derivation path',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['messageSigning'], operation: ['signMessage', 'verifyMessage'] } },
				default: '',
				description: 'Message to sign or verify',
			},
			{
				displayName: 'Coin',
				name: 'coin',
				type: 'string',
				required: false,
				displayOptions: { show: { resource: ['messageSigning'], operation: ['signMessage', 'verifyMessage'] } },
				default: 'Bitcoin',
				description: 'Cryptocurrency coin type',
			},
			{
				displayName: 'Hex',
				name: 'hex',
				type: 'boolean',
				required: false,
				displayOptions: { show: { resource: ['messageSigning'], operation: ['signMessage', 'verifyMessage'] } },
				default: false,
				description: 'Use hex encoding for message',
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['messageSigning'], operation: ['verifyMessage'] } },
				default: '',
				description: 'Address that signed the message',
			},
			{
				displayName: 'Signature',
				name: 'signature',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['messageSigning'], operation: ['verifyMessage'] } },
				default: '',
				description: 'Message signature to verify',
			},
			{
				displayName: 'Key',
				name: 'key',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['messageSigning'], operation: ['cipherKeyValue'] } },
				default: '',
				description: 'Key for cipher operation',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['messageSigning'], operation: ['cipherKeyValue'] } },
				default: '',
				description: 'Value to encrypt or decrypt',
			},
			{
				displayName: 'Encrypt',
				name: 'encrypt',
				type: 'boolean',
				required: false,
				displayOptions: { show: { resource: ['messageSigning'], operation: ['cipherKeyValue'] } },
				default: true,
				description: 'Whether to encrypt (true) or decrypt (false)',
			},
			{
				displayName: 'Ask On Encrypt',
				name: 'askOnEncrypt',
				type: 'boolean',
				required: false,
				displayOptions: { show: { resource: ['messageSigning'], operation: ['cipherKeyValue'] } },
				default: true,
				description: 'Ask for confirmation on encrypt',
			},
			{
				displayName: 'Ask On Decrypt',
				name: 'askOnDecrypt',
				type: 'boolean',
				required: false,
				displayOptions: { show: { resource: ['messageSigning'], operation: ['cipherKeyValue'] } },
				default: true,
				description: 'Ask for confirmation on decrypt',
			},
			{
				displayName: 'Coordinator',
				name: 'coordinator',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['coinJoinPrivacy'], operation: ['authorizeCoinjoin'] } },
				default: '',
				description: 'CoinJoin coordinator identifier'
			},
			{
				displayName: 'Max Rounds',
				name: 'maxRounds',
				type: 'number',
				required: true,
				displayOptions: { show: { resource: ['coinJoinPrivacy'], operation: ['authorizeCoinjoin'] } },
				default: 10,
				description: 'Maximum number of CoinJoin rounds'
			},
			{
				displayName: 'Max Coordinator Fee Rate',
				name: 'maxCoordinatorFeeRate',
				type: 'number',
				required: true,
				displayOptions: { show: { resource: ['coinJoinPrivacy'], operation: ['authorizeCoinjoin'] } },
				default: 1000000,
				description: 'Maximum coordinator fee rate in satoshis per million'
			},
			{
				displayName: 'Max Fee Per Kvbyte',
				name: 'maxFeePerKvbyte',
				type: 'number',
				required: true,
				displayOptions: { show: { resource: ['coinJoinPrivacy'], operation: ['authorizeCoinjoin'] } },
				default: 3906,
				description: 'Maximum fee per kilobyte in satoshis'
			},
			{
				displayName: 'Derivation Path',
				name: 'path',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['coinJoinPrivacy'], operation: ['authorizeCoinjoin'] } },
				default: "m/10025'/1'/0'/1'",
				description: 'BIP32 derivation path for CoinJoin'
			},
			{
				displayName: 'Coin',
				name: 'coin',
				type: 'options',
				required: true,
				displayOptions: { show: { resource: ['coinJoinPrivacy'], operation: ['authorizeCoinjoin'] } },
				options: [
					{ name: 'Bitcoin', value: 'Bitcoin' },
					{ name: 'Bitcoin Testnet', value: 'Testnet' }
				],
				default: 'Bitcoin',
				description: 'Cryptocurrency to use for CoinJoin'
			},
			{
				displayName: 'Coin',
				name: 'coin',
				type: 'options',
				required: true,
				displayOptions: { show: { resource: ['coinJoinPrivacy'], operation: ['signCoinjoinTx'] } },
				options: [
					{ name: 'Bitcoin', value: 'Bitcoin' },
					{ name: 'Bitcoin Testnet', value: 'Testnet' }
				],
				default: 'Bitcoin',
				description: 'Cryptocurrency for the transaction'
			},
			{
				displayName: 'Inputs',
				name: 'inputs',
				type: 'json',
				required: true,
				displayOptions: { show: { resource: ['coinJoinPrivacy'], operation: ['signCoinjoinTx'] } },
				default: '[]',
				description: 'Transaction inputs as JSON array'
			},
			{
				displayName: 'Outputs',
				name: 'outputs',
				type: 'json',
				required: true,
				displayOptions: { show: { resource: ['coinJoinPrivacy'], operation: ['signCoinjoinTx'] } },
				default: '[]',
				description: 'Transaction outputs as JSON array'
			},
			{
				displayName: 'Details',
				name: 'details',
				type: 'json',
				required: true,
				displayOptions: { show: { resource: ['coinJoinPrivacy'], operation: ['signCoinjoinTx'] } },
				default: '{}',
				description: 'CoinJoin transaction details as JSON object'
			},
			{
				displayName: 'Reference Transactions',
				name: 'refTxs',
				type: 'json',
				required: false,
				displayOptions: { show: { resource: ['coinJoinPrivacy'], operation: ['signCoinjoinTx'] } },
				default: '[]',
				description: 'Reference transactions as JSON array'
			},
			{
				displayName: 'Derivation Path',
				name: 'path',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['coinJoinPrivacy'], operation: ['getCoinJoinStatus'] } },
				default: "m/10025'/1'/0'/1'",
				description: 'BIP32 derivation path for CoinJoin'
			},
			{
				displayName: 'Derivation Path',
				name: 'path',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['coinJoinPrivacy'], operation: ['endCoinJoinSession'] } },
				default: "m/10025'/1'/0'/1'",
				description: 'BIP32 derivation path for CoinJoin session to end'
			},
			{
				displayName: 'Device',
				name: 'device',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['firmwareManagement'], operation: ['firmwareUpdate', 'getFirmwareHash', 'checkFirmwareAuthenticity'] } },
				default: '',
				description: 'Device identifier or path',
			},
			{
				displayName: 'Binary Data',
				name: 'binary',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['firmwareManagement'], operation: ['firmwareUpdate'] } },
				default: '',
				description: 'Firmware binary data (base64 encoded)',
			},
			{
				displayName: 'Version',
				name: 'version',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['firmwareManagement'], operation: ['firmwareUpdate'] } },
				default: '',
				description: 'Firmware version',
			},
			{
				displayName: 'Base URL',
				name: 'baseUrl',
				type: 'string',
				required: false,
				displayOptions: { show: { resource: ['firmwareManagement'], operation: ['firmwareUpdate'] } },
				default: '',
				description: 'Custom base URL for firmware download',
			},
			{
				displayName: 'Challenge',
				name: 'challenge',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['firmwareManagement'], operation: ['getFirmwareHash'] } },
				default: '',
				description: 'Challenge string for hash verification',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		logLicenseNotice();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				let result: INodeExecutionData[];

				switch (resource) {
					case 'device':
						result = await executeDeviceOperation.call(this, i);
						break;
					case 'account':
						result = await executeAccountOperation.call(this, i);
						break;
					case 'bitcoin':
						result = await executeBitcoinOperation.call(this, i);
						break;
					case 'bitcoinLike':
						result = await executeBitcoinLikeOperation.call(this, i);
						break;
					case 'ethereum':
						result = await executeEthereumOperation.call(this, i);
						break;
					case 'evmChains':
						result = await executeEvmChainsOperation.call(this, i);
						break;
					case 'cardano':
						result = await executeCardanoOperation.call(this, i);
						break;
					case 'ripple':
						result = await executeRippleOperation.call(this, i);
						break;
					case 'stellar':
						result = await executeStellarOperation.call(this, i);
						break;
					case 'tezos':
						result = await executeTezosOperation.call(this, i);
						break;
					case 'eos':
						result = await executeEosOperation.call(this, i);
						break;
					case 'binanceChain':
						result = await executeBinanceChainOperation.call(this, i);
						break;
					case 'solana':
						result = await executeSolanaOperation.call(this, i);
						break;
					case 'multiCurrency':
						result = await executeMultiCurrencyOperation.call(this, i);
						break;
					case 'transaction':
						result = await executeTransactionOperation.call(this, i);
						break;
					case 'address':
						result = await executeAddressOperation.call(this, i);
						break;
					case 'signing':
						result = await executeSigningOperation.call(this, i);
						break;
					case 'passphrase':
						result = await executePassphraseOperation.call(this, i);
						break;
					case 'backup':
						result = await executeBackupOperation.call(this, i);
						break;
					case 'security':
						result = await executeSecurityOperation.call(this, i);
						break;
					case 'coinjoin':
						result = await executeCoinjoinOperation.call(this, i);
						break;
					case 'firmware':
						result = await executeFirmwareOperation.call(this, i);
						break;
					case 'label':
						result = await executeLabelOperation.call(this, i);
						break;
					case 'webauthn':
						result = await executeWebauthnOperation.call(this, i);
						break;
					case 'suite':
						result = await executeSuiteOperation.call(this, i);
						break;
					case 'utility':
						result = await executeUtilityOperation.call(this, i);
						break;
					case 'deviceManagement':
						result = await executeDeviceManagementOperations.call(this, items);
						break;
					case 'walletOperations':
						result = await executeWalletOperationsOperations.call(this, items);
						break;
					case 'messageSigning':
						result = await executeMessageSigningOperations.call(this, items);
						break;
					case 'coinJoinPrivacy':
						result = await executeCoinJoinPrivacyOperations.call(this, items);
						break;
					case 'firmwareManagement':
						result = await executeFirmwareManagementOperations.call(this, items);
						break;
					default:
						throw new Error(`Unknown resource: ${resource}`);
				}

				returnData.push(...result);
			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeDeviceManagementOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('trezorConnectApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const baseUrl = credentials.baseUrl || 'https://connect.trezor.io/9/';

			switch (operation) {
				case 'initialize': {
					const manifest = this.getNodeParameter('manifest', i) as any;
					const debug = this.getNodeParameter('debug', i) as boolean;
					
					const options: any = {
						method: 'POST',
						url: `${baseUrl}init`,
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							manifest: typeof manifest === 'string' ? JSON.parse(manifest) : manifest,
							debug,
						}),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getFeatures': {
					const device = this.getNodeParameter('device', i) as string;
					const useEmptyPassphrase = this.getNodeParameter('useEmptyPassphrase', i) as boolean;
					
					const options: any = {
						method: 'POST',
						url: `${baseUrl}getFeatures`,
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							device: device || undefined,
							useEmptyPassphrase,
						}),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getDeviceState': {
					const device = this.getNodeParameter('device', i) as string;
					const useEmptyPassphrase = this.getNodeParameter('useEmptyPassphrase', i) as boolean;
					
					const options: any = {
						method: 'POST',
						url: `${baseUrl}getDeviceState`,
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							device: device || undefined,
							useEmptyPassphrase,
						}),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'requestLogin': {
					const callback = this.getNodeParameter('callback', i) as string;
					const asyncChallenge = this.getNodeParameter('asyncChallenge', i) as boolean;
					
					const options: any = {
						method: 'POST',
						url: `${baseUrl}requestLogin`,
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							callback: callback || undefined,
							asyncChallenge,
						}),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'wipeDevice': {
					const device = this.getNodeParameter('device', i) as string;
					
					const options: any = {
						method: 'POST',
						url: `${baseUrl}wipeDevice`,
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							device: device || undefined,
						}),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'resetDevice': {
					const device = this.getNodeParameter('device', i) as string;
					const strength = this.getNodeParameter('strength', i) as number;
					const passphraseProtection = this.getNodeParameter('passphraseProtection', i) as boolean;
					const pinProtection = this.getNodeParameter('pinProtection', i) as boolean;
					const language = this.getNodeParameter('language', i) as string;
					const label = this.getNodeParameter('label', i) as string;
					
					const options: any = {
						method: 'POST',
						url: `${baseUrl}resetDevice`,
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							device: device || undefined,
							strength,
							passphraseProtection,
							pinProtection,
							language,
							label,
						}),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeWalletOperationsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('trezorConnectApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getPublicKey': {
					const path = this.getNodeParameter('path', i) as string;
					const coin = this.getNodeParameter('coin', i) as string;
					const showOnTrezor = this.getNodeParameter('showOnTrezor', i) as boolean;
					const crossChain = this.getNodeParameter('crossChain', i) as boolean;

					const body: any = {
						path,
						coin,
						showOnTrezor,
						crossChain,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/getPublicKey`,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAddress': {
					const path = this.getNodeParameter('path', i) as string;
					const coin = this.getNodeParameter('coin', i) as string;
					const showOnTrezor = this.getNodeParameter('showOnTrezor', i) as boolean;
					const crossChain = this.getNodeParameter('crossChain', i) as boolean;
					const multisigParam = this.getNodeParameter('multisig', i) as string;

					const body: any = {
						path,
						coin,
						showOnTrezor,
						crossChain,
					};

					if (multisigParam) {
						try {
							body.multisig = JSON.parse(multisigParam);
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), `Invalid multisig JSON: ${error.message}`);
						}
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/getAddress`,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAccountInfo': {
					const coin = this.getNodeParameter('coin', i) as string;
					const path = this.getNodeParameter('path', i) as string;
					const details = this.getNodeParameter('details', i) as boolean;
					const tokens = this.getNodeParameter('tokens', i) as boolean;
					const page = this.getNodeParameter('page', i) as number;
					const pageSize = this.getNodeParameter('pageSize', i) as number;

					const body: any = {
						coin,
						path,
						details,
						tokens,
						page,
						pageSize,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/getAccountInfo`,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'composeTransaction': {
					const coin = this.getNodeParameter('coin', i) as string;
					const outputsParam = this.getNodeParameter('outputs', i) as string;
					const accountParam = this.getNodeParameter('account', i) as string;
					const utxosParam = this.getNodeParameter('utxos', i) as string;
					const changeAddress = this.getNodeParameter('changeAddress', i) as string;

					let outputs: any;
					let account: any;
					let utxos: any;

					try {
						outputs = JSON.parse(outputsParam);
					} catch (error: any) {
						throw new NodeOperationError(this.getNode(), `Invalid outputs JSON: ${error.message}`);
					}

					try {
						account = JSON.parse(accountParam);
					} catch (error: any) {
						throw new NodeOperationError(this.getNode(), `Invalid account JSON: ${error.message}`);
					}

					try {
						utxos = JSON.parse(utxosParam);
					} catch (error: any) {
						throw new NodeOperationError(this.getNode(), `Invalid UTXOs JSON: ${error.message}`);
					}

					const body: any = {
						coin,
						outputs,
						account,
						utxos,
					};

					if (changeAddress) {
						body.changeAddress = changeAddress;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/composeTransaction`,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'signTransaction': {
					const coin = this.getNodeParameter('coin', i) as string;
					const inputsParam = this.getNodeParameter('inputs', i) as string;
					const outputsParam = this.getNodeParameter('outputs', i) as string;
					const refTxsParam = this.getNodeParameter('refTxs', i) as string;
					const accountParam = this.getNodeParameter('account', i) as string;
					const locktime = this.getNodeParameter('locktime', i) as number;

					let inputs: any;
					let outputs: any;
					let refTxs: any;
					let account: any;

					try {
						inputs = JSON.parse(inputsParam);
					} catch (error: any) {
						throw new NodeOperationError(this.getNode(), `Invalid inputs JSON: ${error.message}`);
					}

					try {
						outputs = JSON.parse(outputsParam);
					} catch (error: any) {
						throw new NodeOperationError(this.getNode(), `Invalid outputs JSON: ${error.message}`);
					}

					try {
						refTxs = JSON.parse(refTxsParam);
					} catch (error: any) {
						throw new NodeOperationError(this.getNode(), `Invalid refTxs JSON: ${error.message}`);
					}

					try {
						account = JSON.parse(accountParam);
					} catch (error: any) {
						throw new NodeOperationError(this.getNode(), `Invalid account JSON: ${error.message}`);
					}

					const body: any = {
						coin,
						inputs,
						outputs,
						refTxs,
						account,
						locktime,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/signTransaction`,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeMessageSigningOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('trezorConnectApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'signMessage': {
					const path = this.getNodeParameter('path', i) as string;
					const message = this.getNodeParameter('message', i) as string;
					const coin = this.getNodeParameter('coin', i) as string;
					const hex = this.getNodeParameter('hex', i) as boolean;

					const body: any = {
						path,
						message,
						coin,
						hex,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/signMessage`,
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'verifyMessage': {
					const address = this.getNodeParameter('address', i) as string;
					const signature = this.getNodeParameter('signature', i) as string;
					const message = this.getNodeParameter('message', i) as string;
					const coin = this.getNodeParameter('coin', i) as string;
					const hex = this.getNodeParameter('hex', i) as boolean;

					const body: any = {
						address,
						signature,
						message,
						coin,
						hex,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/verifyMessage`,
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'cipherKeyValue': {
					const path = this.getNodeParameter('path', i) as string;
					const key = this.getNodeParameter('key', i) as string;
					const value = this.getNodeParameter('value', i) as string;
					const encrypt = this.getNodeParameter('encrypt', i) as boolean;
					const askOnEncrypt = this.getNodeParameter('askOnEncrypt', i) as boolean;
					const askOnDecrypt = this.getNodeParameter('askOnDecrypt', i) as boolean;

					const body: any = {
						path,
						key,
						value,
						encrypt,
						askOnEncrypt,
						askOnDecrypt,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/cipherKeyValue`,
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeCoinJoinPrivacyOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('trezorConnectApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'authorizeCoinjoin': {
					const coordinator = this.getNodeParameter('coordinator', i) as string;
					const maxRounds = this.getNodeParameter('maxRounds', i) as number;
					const maxCoordinatorFeeRate = this.getNodeParameter('maxCoordinatorFeeRate', i) as number;
					const maxFeePerKvbyte = this.getNodeParameter('maxFeePerKvbyte', i) as number;
					const path = this.getNodeParameter('path', i) as string;
					const coin = this.getNodeParameter('coin', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/authorizeCoinjoin`,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`
						},
						json: true,
						body: {
							coordinator,
							maxRounds,
							maxCoordinatorFeeRate,
							maxFeePerKvbyte,
							path,
							coin
						}
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'signCoinjoinTx': {
					const coin = this.getNodeParameter('coin', i) as string;
					const inputs = JSON.parse(this.getNodeParameter('inputs', i) as string);
					const outputs = JSON.parse(this.getNodeParameter('outputs', i) as string);
					const details = JSON.parse(this.getNodeParameter('details', i) as string);
					const refTxs = this.getNodeParameter('refTxs', i) ? JSON.parse(this.getNodeParameter('refTxs', i) as string) : [];

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/signCoinjoinTx`,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`
						},
						json: true,
						body: {
							coin,
							inputs,
							outputs,
							details,
							refTxs
						}
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCoinJoinStatus': {
					const path = this.getNodeParameter('path', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/getCoinJoinStatus`,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`
						},
						json: true,
						body: {
							path
						}
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'endCoinJoinSession': {
					const path = this.getNodeParameter('path', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/endCoinJoinSession`,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`
						},
						json: true,
						body: {
							path
						}
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeFirmwareManagementOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('trezorConnectApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const baseUrl = credentials.baseUrl || 'https://connect.trezor.io/9/';

			switch (operation) {
				case 'firmwareUpdate': {
					const device = this.getNodeParameter('device', i) as string;
					const binary = this.getNodeParameter('binary', i) as string;
					const version = this.getNodeParameter('version', i) as string;
					const customBaseUrl = this.getNodeParameter('baseUrl', i) as string;

					const options: any = {
						method: 'POST',
						url: `${baseUrl}firmwareUpdate`,
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							device,
							binary,
							version,
							baseUrl: customBaseUrl || undefined,
						}),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getFirmwareHash': {
					const device = this.getNodeParameter('device', i) as string;
					const challenge = this.getNodeParameter('challenge', i) as string;

					const options: any = {
						method: 'POST',
						url: `${baseUrl}getFirmwareHash`,
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							device,
							challenge,
						}),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'checkFirmwareAuthenticity': {
					const device = this.getNodeParameter('device', i) as string;

					const options: any = {
						method: 'POST',
						url: `${baseUrl}checkFirmwareAuthenticity`,
						headers: {
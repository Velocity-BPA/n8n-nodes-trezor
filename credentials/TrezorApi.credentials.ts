import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TrezorApi implements ICredentialType {
	name = 'trezorApi';
	displayName = 'Trezor API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://connect.trezor.io/9/',
			description: 'The base URL for Trezor Connect API',
		},
		{
			displayName: 'Device Authentication Notice',
			name: 'authNotice',
			type: 'notice',
			default: '',
			description: 'Trezor authentication requires physical interaction with your hardware device. No API keys or tokens are needed - authentication is handled through device-specific cryptographic signing and user confirmation on the physical device.',
		},
		{
			displayName: 'Application Manifest URL',
			name: 'manifestUrl',
			type: 'string',
			default: '',
			placeholder: 'https://your-app.com/trezor-manifest.json',
			description: 'Optional: URL to your application manifest file for Trezor Connect',
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
			placeholder: 'your-email@example.com',
			description: 'Optional: Email address for Trezor Connect integration',
		},
	];
}
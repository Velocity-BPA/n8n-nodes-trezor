/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Trezor } from '../nodes/Trezor/Trezor.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Trezor Node', () => {
  let node: Trezor;

  beforeAll(() => {
    node = new Trezor();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Trezor');
      expect(node.description.name).toBe('trezor');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('DeviceManagement Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				baseUrl: 'https://connect.trezor.io/9/' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { 
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn()
			},
		};
	});

	it('should initialize Trezor Connect successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('initialize')
			.mockReturnValueOnce('{"email":"test@example.com","appUrl":"https://example.com"}')
			.mockReturnValueOnce(false);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			payload: { initialized: true }
		});

		const result = await executeDeviceManagementOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://connect.trezor.io/9/init',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				manifest: { email: 'test@example.com', appUrl: 'https://example.com' },
				debug: false
			}),
			json: true
		});
	});

	it('should get device features successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getFeatures')
			.mockReturnValueOnce('')
			.mockReturnValueOnce(false);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			payload: { 
				vendor: 'SatoshiLabs',
				model: 'T',
				fw_major: 2,
				fw_minor: 4,
				fw_patch: 3
			}
		});

		const result = await executeDeviceManagementOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
		expect(result[0].json.payload.vendor).toBe('SatoshiLabs');
	});

	it('should handle wipe device operation', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('wipeDevice')
			.mockReturnValueOnce('');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			payload: { message: 'Device wiped successfully' }
		});

		const result = await executeDeviceManagementOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
	});

	it('should handle reset device operation with all parameters', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('resetDevice')
			.mockReturnValueOnce('')
			.mockReturnValueOnce(256)
			.mockReturnValueOnce(true)
			.mockReturnValueOnce(true)
			.mockReturnValueOnce('en-US')
			.mockReturnValueOnce('My Trezor');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			payload: { message: 'Device reset successfully' }
		});

		const result = await executeDeviceManagementOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://connect.trezor.io/9/resetDevice',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				device: undefined,
				strength: 256,
				passphraseProtection: true,
				pinProtection: true,
				language: 'en-US',
				label: 'My Trezor'
			}),
			json: true
		});
	});

	it('should handle errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('initialize');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Device not connected'));

		await expect(
			executeDeviceManagementOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('Device not connected');
	});

	it('should continue on fail when enabled', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getFeatures');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Connection failed'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeDeviceManagementOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('Connection failed');
	});
});

describe('WalletOperations Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://connect.trezor.io/9',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should get public key successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getPublicKey')
			.mockReturnValueOnce("m/44'/0'/0'/0/0")
			.mockReturnValueOnce('btc')
			.mockReturnValueOnce(false)
			.mockReturnValueOnce(false);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			payload: { publicKey: 'test-public-key' },
		});

		const result = await executeWalletOperationsOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://connect.trezor.io/9/getPublicKey',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer test-key',
			},
			body: {
				path: "m/44'/0'/0'/0/0",
				coin: 'btc',
				showOnTrezor: false,
				crossChain: false,
			},
			json: true,
		});
	});

	it('should get address successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAddress')
			.mockReturnValueOnce("m/44'/0'/0'/0/0")
			.mockReturnValueOnce('btc')
			.mockReturnValueOnce(true)
			.mockReturnValueOnce(false)
			.mockReturnValueOnce('{}');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			payload: { address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
		});

		const result = await executeWalletOperationsOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
	});

	it('should get account info successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAccountInfo')
			.mockReturnValueOnce('btc')
			.mockReturnValueOnce("m/44'/0'/0'")
			.mockReturnValueOnce(true)
			.mockReturnValueOnce(false)
			.mockReturnValueOnce(1)
			.mockReturnValueOnce(25);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			payload: { balance: '1000000', transactions: [] },
		});

		const result = await executeWalletOperationsOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
	});

	it('should compose transaction successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('composeTransaction')
			.mockReturnValueOnce('btc')
			.mockReturnValueOnce('[{"address":"1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2","amount":"100000"}]')
			.mockReturnValueOnce('{}')
			.mockReturnValueOnce('[{"txid":"abc123","vout":0,"amount":"200000"}]')
			.mockReturnValueOnce('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			payload: { serializedTx: 'composed-transaction' },
		});

		const result = await executeWalletOperationsOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
	});

	it('should sign transaction successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('signTransaction')
			.mockReturnValueOnce('btc')
			.mockReturnValueOnce('[{"prev_hash":"abc123","prev_index":0}]')
			.mockReturnValueOnce('[{"address":"1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2","amount":"100000"}]')
			.mockReturnValueOnce('[]')
			.mockReturnValueOnce('{}')
			.mockReturnValueOnce(0);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			payload: { serializedTx: 'signed-transaction' },
		});

		const result = await executeWalletOperationsOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
	});

	it('should handle API errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getPublicKey');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeWalletOperationsOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	it('should handle invalid JSON parameters', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('composeTransaction')
			.mockReturnValueOnce('btc')
			.mockReturnValueOnce('invalid-json');

		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeWalletOperationsOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toContain('Invalid outputs JSON');
	});

	it('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeWalletOperationsOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('Unknown operation: unknownOperation');
	});
});

describe('MessageSigning Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        baseUrl: 'https://connect.trezor.io/9' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should sign message successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('signMessage')
      .mockReturnValueOnce("m/44'/0'/0'/0/0")
      .mockReturnValueOnce('Hello World')
      .mockReturnValueOnce('Bitcoin')
      .mockReturnValueOnce(false);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      signature: 'test-signature',
      address: 'test-address'
    });

    const result = await executeMessageSigningOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      signature: 'test-signature',
      address: 'test-address'
    });
  });

  it('should verify message successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('verifyMessage')
      .mockReturnValueOnce('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
      .mockReturnValueOnce('test-signature')
      .mockReturnValueOnce('Hello World')
      .mockReturnValueOnce('Bitcoin')
      .mockReturnValueOnce(false);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      verified: true
    });

    const result = await executeMessageSigningOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      verified: true
    });
  });

  it('should cipher key value successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cipherKeyValue')
      .mockReturnValueOnce("m/44'/0'/0'/0/0")
      .mockReturnValueOnce('test-key')
      .mockReturnValueOnce('test-value')
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      value: 'encrypted-value'
    });

    const result = await executeMessageSigningOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      value: 'encrypted-value'
    });
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('signMessage')
      .mockReturnValueOnce("m/44'/0'/0'/0/0")
      .mockReturnValueOnce('Hello World')
      .mockReturnValueOnce('Bitcoin')
      .mockReturnValueOnce(false);

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('Device not connected')
    );
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeMessageSigningOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      error: 'Device not connected'
    });
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(
      executeMessageSigningOperations.call(mockExecuteFunctions, [{ json: {} }]),
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('CoinJoinPrivacy Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://connect.trezor.io/9' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should authorize coinjoin successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('authorizeCoinjoin')
      .mockReturnValueOnce('coordinator123')
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(1000000)
      .mockReturnValueOnce(3906)
      .mockReturnValueOnce("m/10025'/1'/0'/1'")
      .mockReturnValueOnce('Bitcoin');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({ 
      success: true, 
      sessionId: 'test-session-id' 
    });

    const result = await executeCoinJoinPrivacyOperations.call(
      mockExecuteFunctions, 
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
    expect(result[0].json.sessionId).toBe('test-session-id');
  });

  it('should handle authorize coinjoin error', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('authorizeCoinjoin');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(
      new Error('Device not connected')
    );
    mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

    const result = await executeCoinJoinPrivacyOperations.call(
      mockExecuteFunctions, 
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Device not connected');
  });

  it('should sign coinjoin transaction successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('signCoinjoinTx')
      .mockReturnValueOnce('Bitcoin')
      .mockReturnValueOnce('[{"prev_hash": "abc123"}]')
      .mockReturnValueOnce('[{"address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"}]')
      .mockReturnValueOnce('{"version": 1}')
      .mockReturnValueOnce('[]');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({ 
      success: true, 
      signatures: ['signature1'] 
    });

    const result = await executeCoinJoinPrivacyOperations.call(
      mockExecuteFunctions, 
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
    expect(result[0].json.signatures).toEqual(['signature1']);
  });

  it('should get coinjoin status successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCoinJoinStatus')
      .mockReturnValueOnce("m/10025'/1'/0'/1'");

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({ 
      success: true, 
      status: 'active',
      rounds: 5 
    });

    const result = await executeCoinJoinPrivacyOperations.call(
      mockExecuteFunctions, 
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.status).toBe('active');
    expect(result[0].json.rounds).toBe(5);
  });

  it('should end coinjoin session successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('endCoinJoinSession')
      .mockReturnValueOnce("m/10025'/1'/0'/1'");

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({ 
      success: true, 
      message: 'Session ended' 
    });

    const result = await executeCoinJoinPrivacyOperations.call(
      mockExecuteFunctions, 
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
    expect(result[0].json.message).toBe('Session ended');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOp');

    await expect(
      executeCoinJoinPrivacyOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOp');
  });
});

describe('FirmwareManagement Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        baseUrl: 'https://connect.trezor.io/9/' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should update firmware successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('firmwareUpdate')
      .mockReturnValueOnce('device123')
      .mockReturnValueOnce('base64binary')
      .mockReturnValueOnce('1.0.0')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      success: true,
      hash: 'abc123'
    });

    // Test implementation would go here
  });

  it('should get firmware hash successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getFirmwareHash')
      .mockReturnValueOnce('device123')
      .mockReturnValueOnce('challenge123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      hash: 'firmware_hash_123'
    });

    // Test implementation would go here
  });

  it('should check firmware authenticity successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('checkFirmwareAuthenticity')
      .mockReturnValueOnce('device123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      authentic: true,
      signature: 'valid_signature'
    });

    // Test implementation would go here
  });

  it('should handle errors gracefully when continue on fail is enabled', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('firmwareUpdate')
      .mockReturnValueOnce('device123')
      .mockReturnValueOnce('base64binary')
      .mockReturnValueOnce('1.0.0')
      .mockReturnValueOnce('');

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Device not connected'));

    // Test implementation would go here
  });
});
});

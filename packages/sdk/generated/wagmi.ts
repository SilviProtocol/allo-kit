import {
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
  createReadContract,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Allocator
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const allocatorAbi = [
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Allocate',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipients', internalType: 'address[]', type: 'address[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'allocate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipients', internalType: 'address[]', type: 'address[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'distribute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20Mock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20MockAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Registry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const registryAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'project',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'metadataURI',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Approve',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'project',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'metadataURI',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Register',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'project',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'metadataURI',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Update',
  },
  {
    type: 'function',
    inputs: [
      { name: 'project', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
      { name: 'metadataURI', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'projects',
    outputs: [
      { name: 'status', internalType: 'enum IRegistry.Status', type: 'uint8' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'project', internalType: 'address', type: 'address' },
      { name: 'metadataURI', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'project', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
      { name: 'metadataURI', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'update',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SimpleGrants
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const simpleGrantsAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Allocate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'project',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'metadataURI',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Approve',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: false },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'schema',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'Initialize',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'project',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'metadataURI',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Register',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'project',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'metadataURI',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Update',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipients', internalType: 'address[]', type: 'address[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'allocate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'project', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
      { name: 'metadataURI', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipients', internalType: 'address[]', type: 'address[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'distribute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'id',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'projects',
    outputs: [
      { name: 'status', internalType: 'enum IRegistry.Status', type: 'uint8' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'project', internalType: 'address', type: 'address' },
      { name: 'metadataURI', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'schema',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'strategyName',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'project', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
      { name: 'metadataURI', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'update',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Strategy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const strategyAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_schema', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: false },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'schema',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'Initialize',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'function',
    inputs: [],
    name: 'id',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'schema',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'strategyName',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StrategyFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const strategyFactoryAbi = [
  { type: 'error', inputs: [], name: 'ERC1167FailedCreateClone' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'strategy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Deployed',
  },
  {
    type: 'function',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'deploy',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allocatorAbi}__
 */
export const writeAllocator = /*#__PURE__*/ createWriteContract({
  abi: allocatorAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allocatorAbi}__ and `functionName` set to `"allocate"`
 */
export const writeAllocatorAllocate = /*#__PURE__*/ createWriteContract({
  abi: allocatorAbi,
  functionName: 'allocate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allocatorAbi}__ and `functionName` set to `"distribute"`
 */
export const writeAllocatorDistribute = /*#__PURE__*/ createWriteContract({
  abi: allocatorAbi,
  functionName: 'distribute',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allocatorAbi}__
 */
export const simulateAllocator = /*#__PURE__*/ createSimulateContract({
  abi: allocatorAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allocatorAbi}__ and `functionName` set to `"allocate"`
 */
export const simulateAllocatorAllocate = /*#__PURE__*/ createSimulateContract({
  abi: allocatorAbi,
  functionName: 'allocate',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allocatorAbi}__ and `functionName` set to `"distribute"`
 */
export const simulateAllocatorDistribute = /*#__PURE__*/ createSimulateContract(
  { abi: allocatorAbi, functionName: 'distribute' },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link allocatorAbi}__
 */
export const watchAllocatorEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: allocatorAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link allocatorAbi}__ and `eventName` set to `"Allocate"`
 */
export const watchAllocatorAllocateEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: allocatorAbi,
    eventName: 'Allocate',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20MockAbi}__
 */
export const readErc20Mock = /*#__PURE__*/ createReadContract({
  abi: erc20MockAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20MockAbi}__ and `functionName` set to `"allowance"`
 */
export const readErc20MockAllowance = /*#__PURE__*/ createReadContract({
  abi: erc20MockAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20MockAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readErc20MockBalanceOf = /*#__PURE__*/ createReadContract({
  abi: erc20MockAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20MockAbi}__ and `functionName` set to `"decimals"`
 */
export const readErc20MockDecimals = /*#__PURE__*/ createReadContract({
  abi: erc20MockAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20MockAbi}__ and `functionName` set to `"name"`
 */
export const readErc20MockName = /*#__PURE__*/ createReadContract({
  abi: erc20MockAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20MockAbi}__ and `functionName` set to `"symbol"`
 */
export const readErc20MockSymbol = /*#__PURE__*/ createReadContract({
  abi: erc20MockAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20MockAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readErc20MockTotalSupply = /*#__PURE__*/ createReadContract({
  abi: erc20MockAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20MockAbi}__
 */
export const writeErc20Mock = /*#__PURE__*/ createWriteContract({
  abi: erc20MockAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20MockAbi}__ and `functionName` set to `"approve"`
 */
export const writeErc20MockApprove = /*#__PURE__*/ createWriteContract({
  abi: erc20MockAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20MockAbi}__ and `functionName` set to `"mint"`
 */
export const writeErc20MockMint = /*#__PURE__*/ createWriteContract({
  abi: erc20MockAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20MockAbi}__ and `functionName` set to `"transfer"`
 */
export const writeErc20MockTransfer = /*#__PURE__*/ createWriteContract({
  abi: erc20MockAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20MockAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeErc20MockTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: erc20MockAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20MockAbi}__
 */
export const simulateErc20Mock = /*#__PURE__*/ createSimulateContract({
  abi: erc20MockAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20MockAbi}__ and `functionName` set to `"approve"`
 */
export const simulateErc20MockApprove = /*#__PURE__*/ createSimulateContract({
  abi: erc20MockAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20MockAbi}__ and `functionName` set to `"mint"`
 */
export const simulateErc20MockMint = /*#__PURE__*/ createSimulateContract({
  abi: erc20MockAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20MockAbi}__ and `functionName` set to `"transfer"`
 */
export const simulateErc20MockTransfer = /*#__PURE__*/ createSimulateContract({
  abi: erc20MockAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20MockAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateErc20MockTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: erc20MockAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20MockAbi}__
 */
export const watchErc20MockEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20MockAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20MockAbi}__ and `eventName` set to `"Approval"`
 */
export const watchErc20MockApprovalEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc20MockAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20MockAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchErc20MockTransferEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc20MockAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registryAbi}__
 */
export const readRegistry = /*#__PURE__*/ createReadContract({
  abi: registryAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registryAbi}__ and `functionName` set to `"projects"`
 */
export const readRegistryProjects = /*#__PURE__*/ createReadContract({
  abi: registryAbi,
  functionName: 'projects',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link registryAbi}__
 */
export const writeRegistry = /*#__PURE__*/ createWriteContract({
  abi: registryAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link registryAbi}__ and `functionName` set to `"approve"`
 */
export const writeRegistryApprove = /*#__PURE__*/ createWriteContract({
  abi: registryAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link registryAbi}__ and `functionName` set to `"register"`
 */
export const writeRegistryRegister = /*#__PURE__*/ createWriteContract({
  abi: registryAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link registryAbi}__ and `functionName` set to `"update"`
 */
export const writeRegistryUpdate = /*#__PURE__*/ createWriteContract({
  abi: registryAbi,
  functionName: 'update',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link registryAbi}__
 */
export const simulateRegistry = /*#__PURE__*/ createSimulateContract({
  abi: registryAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link registryAbi}__ and `functionName` set to `"approve"`
 */
export const simulateRegistryApprove = /*#__PURE__*/ createSimulateContract({
  abi: registryAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link registryAbi}__ and `functionName` set to `"register"`
 */
export const simulateRegistryRegister = /*#__PURE__*/ createSimulateContract({
  abi: registryAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link registryAbi}__ and `functionName` set to `"update"`
 */
export const simulateRegistryUpdate = /*#__PURE__*/ createSimulateContract({
  abi: registryAbi,
  functionName: 'update',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link registryAbi}__
 */
export const watchRegistryEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: registryAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link registryAbi}__ and `eventName` set to `"Approve"`
 */
export const watchRegistryApproveEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: registryAbi, eventName: 'Approve' },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link registryAbi}__ and `eventName` set to `"Register"`
 */
export const watchRegistryRegisterEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: registryAbi,
    eventName: 'Register',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link registryAbi}__ and `eventName` set to `"Update"`
 */
export const watchRegistryUpdateEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: registryAbi,
  eventName: 'Update',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleGrantsAbi}__
 */
export const readSimpleGrants = /*#__PURE__*/ createReadContract({
  abi: simpleGrantsAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"id"`
 */
export const readSimpleGrantsId = /*#__PURE__*/ createReadContract({
  abi: simpleGrantsAbi,
  functionName: 'id',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"owner"`
 */
export const readSimpleGrantsOwner = /*#__PURE__*/ createReadContract({
  abi: simpleGrantsAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"projects"`
 */
export const readSimpleGrantsProjects = /*#__PURE__*/ createReadContract({
  abi: simpleGrantsAbi,
  functionName: 'projects',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"schema"`
 */
export const readSimpleGrantsSchema = /*#__PURE__*/ createReadContract({
  abi: simpleGrantsAbi,
  functionName: 'schema',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"strategyName"`
 */
export const readSimpleGrantsStrategyName = /*#__PURE__*/ createReadContract({
  abi: simpleGrantsAbi,
  functionName: 'strategyName',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleGrantsAbi}__
 */
export const writeSimpleGrants = /*#__PURE__*/ createWriteContract({
  abi: simpleGrantsAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"allocate"`
 */
export const writeSimpleGrantsAllocate = /*#__PURE__*/ createWriteContract({
  abi: simpleGrantsAbi,
  functionName: 'allocate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"approve"`
 */
export const writeSimpleGrantsApprove = /*#__PURE__*/ createWriteContract({
  abi: simpleGrantsAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"distribute"`
 */
export const writeSimpleGrantsDistribute = /*#__PURE__*/ createWriteContract({
  abi: simpleGrantsAbi,
  functionName: 'distribute',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"initialize"`
 */
export const writeSimpleGrantsInitialize = /*#__PURE__*/ createWriteContract({
  abi: simpleGrantsAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"register"`
 */
export const writeSimpleGrantsRegister = /*#__PURE__*/ createWriteContract({
  abi: simpleGrantsAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeSimpleGrantsRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: simpleGrantsAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeSimpleGrantsTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: simpleGrantsAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"update"`
 */
export const writeSimpleGrantsUpdate = /*#__PURE__*/ createWriteContract({
  abi: simpleGrantsAbi,
  functionName: 'update',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleGrantsAbi}__
 */
export const simulateSimpleGrants = /*#__PURE__*/ createSimulateContract({
  abi: simpleGrantsAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"allocate"`
 */
export const simulateSimpleGrantsAllocate =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleGrantsAbi,
    functionName: 'allocate',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"approve"`
 */
export const simulateSimpleGrantsApprove = /*#__PURE__*/ createSimulateContract(
  { abi: simpleGrantsAbi, functionName: 'approve' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"distribute"`
 */
export const simulateSimpleGrantsDistribute =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleGrantsAbi,
    functionName: 'distribute',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateSimpleGrantsInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleGrantsAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"register"`
 */
export const simulateSimpleGrantsRegister =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleGrantsAbi,
    functionName: 'register',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateSimpleGrantsRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleGrantsAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateSimpleGrantsTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleGrantsAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleGrantsAbi}__ and `functionName` set to `"update"`
 */
export const simulateSimpleGrantsUpdate = /*#__PURE__*/ createSimulateContract({
  abi: simpleGrantsAbi,
  functionName: 'update',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleGrantsAbi}__
 */
export const watchSimpleGrantsEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: simpleGrantsAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleGrantsAbi}__ and `eventName` set to `"Allocate"`
 */
export const watchSimpleGrantsAllocateEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleGrantsAbi,
    eventName: 'Allocate',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleGrantsAbi}__ and `eventName` set to `"Approve"`
 */
export const watchSimpleGrantsApproveEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleGrantsAbi,
    eventName: 'Approve',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleGrantsAbi}__ and `eventName` set to `"Initialize"`
 */
export const watchSimpleGrantsInitializeEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleGrantsAbi,
    eventName: 'Initialize',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleGrantsAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchSimpleGrantsInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleGrantsAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleGrantsAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchSimpleGrantsOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleGrantsAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleGrantsAbi}__ and `eventName` set to `"Register"`
 */
export const watchSimpleGrantsRegisterEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleGrantsAbi,
    eventName: 'Register',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleGrantsAbi}__ and `eventName` set to `"Update"`
 */
export const watchSimpleGrantsUpdateEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleGrantsAbi,
    eventName: 'Update',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link strategyAbi}__
 */
export const readStrategy = /*#__PURE__*/ createReadContract({
  abi: strategyAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link strategyAbi}__ and `functionName` set to `"id"`
 */
export const readStrategyId = /*#__PURE__*/ createReadContract({
  abi: strategyAbi,
  functionName: 'id',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link strategyAbi}__ and `functionName` set to `"schema"`
 */
export const readStrategySchema = /*#__PURE__*/ createReadContract({
  abi: strategyAbi,
  functionName: 'schema',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link strategyAbi}__ and `functionName` set to `"strategyName"`
 */
export const readStrategyStrategyName = /*#__PURE__*/ createReadContract({
  abi: strategyAbi,
  functionName: 'strategyName',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link strategyAbi}__
 */
export const writeStrategy = /*#__PURE__*/ createWriteContract({
  abi: strategyAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link strategyAbi}__ and `functionName` set to `"initialize"`
 */
export const writeStrategyInitialize = /*#__PURE__*/ createWriteContract({
  abi: strategyAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link strategyAbi}__
 */
export const simulateStrategy = /*#__PURE__*/ createSimulateContract({
  abi: strategyAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link strategyAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateStrategyInitialize = /*#__PURE__*/ createSimulateContract({
  abi: strategyAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link strategyAbi}__
 */
export const watchStrategyEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: strategyAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link strategyAbi}__ and `eventName` set to `"Initialize"`
 */
export const watchStrategyInitializeEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: strategyAbi,
    eventName: 'Initialize',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link strategyAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchStrategyInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: strategyAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link strategyFactoryAbi}__
 */
export const writeStrategyFactory = /*#__PURE__*/ createWriteContract({
  abi: strategyFactoryAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link strategyFactoryAbi}__ and `functionName` set to `"deploy"`
 */
export const writeStrategyFactoryDeploy = /*#__PURE__*/ createWriteContract({
  abi: strategyFactoryAbi,
  functionName: 'deploy',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link strategyFactoryAbi}__
 */
export const simulateStrategyFactory = /*#__PURE__*/ createSimulateContract({
  abi: strategyFactoryAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link strategyFactoryAbi}__ and `functionName` set to `"deploy"`
 */
export const simulateStrategyFactoryDeploy =
  /*#__PURE__*/ createSimulateContract({
    abi: strategyFactoryAbi,
    functionName: 'deploy',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link strategyFactoryAbi}__
 */
export const watchStrategyFactoryEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: strategyFactoryAbi },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link strategyFactoryAbi}__ and `eventName` set to `"Deployed"`
 */
export const watchStrategyFactoryDeployedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: strategyFactoryAbi,
    eventName: 'Deployed',
  })

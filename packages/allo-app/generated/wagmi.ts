import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Pool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const poolAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_schema', internalType: 'string', type: 'string' },
      {
        name: '_config',
        internalType: 'struct PoolConfig',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'admins', internalType: 'address[]', type: 'address[]' },
          { name: 'allocationToken', internalType: 'address', type: 'address' },
          {
            name: 'distributionToken',
            internalType: 'address',
            type: 'address',
          },
          { name: 'maxAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'timestamps', internalType: 'uint64[]', type: 'uint64[]' },
          { name: 'metadataURI', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
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
        name: 'approver',
        internalType: 'address',
        type: 'address',
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
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'schema',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'config',
        internalType: 'struct PoolConfig',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'admins', internalType: 'address[]', type: 'address[]' },
          { name: 'allocationToken', internalType: 'address', type: 'address' },
          {
            name: 'distributionToken',
            internalType: 'address',
            type: 'address',
          },
          { name: 'maxAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'timestamps', internalType: 'uint64[]', type: 'uint64[]' },
          { name: 'metadataURI', internalType: 'string', type: 'string' },
        ],
        indexed: false,
      },
    ],
    name: 'Deployed',
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
        name: 'owner',
        internalType: 'address',
        type: 'address',
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
        name: 'rejecter',
        internalType: 'address',
        type: 'address',
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
    name: 'Reject',
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
        name: 'updater',
        internalType: 'address',
        type: 'address',
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
    name: '_allocate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'project', internalType: 'address', type: 'address' },
      { name: '_metadataURI', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: '_approve',
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
    name: '_distribute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'project', internalType: 'address', type: 'address' },
      { name: '_metadataURI', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: '_register',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'project', internalType: 'address', type: 'address' },
      { name: '_metadataURI', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: '_reject',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'project', internalType: 'address', type: 'address' },
      { name: '_metadataURI', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: '_update',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'config',
    outputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'allocationToken', internalType: 'address', type: 'address' },
      { name: 'distributionToken', internalType: 'address', type: 'address' },
      { name: 'maxAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'metadataURI', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_config',
        internalType: 'struct PoolConfig',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'admins', internalType: 'address[]', type: 'address[]' },
          { name: 'allocationToken', internalType: 'address', type: 'address' },
          {
            name: 'distributionToken',
            internalType: 'address',
            type: 'address',
          },
          { name: 'maxAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'timestamps', internalType: 'uint64[]', type: 'uint64[]' },
          { name: 'metadataURI', internalType: 'string', type: 'string' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'registrations',
    outputs: [
      { name: 'status', internalType: 'enum IPool.Status', type: 'uint8' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'metadataURI', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PoolFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const poolFactoryAbi = [
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
      { name: 'pool', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'config',
        internalType: 'struct PoolConfig',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'admins', internalType: 'address[]', type: 'address[]' },
          { name: 'allocationToken', internalType: 'address', type: 'address' },
          {
            name: 'distributionToken',
            internalType: 'address',
            type: 'address',
          },
          { name: 'maxAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'timestamps', internalType: 'uint64[]', type: 'uint64[]' },
          { name: 'metadataURI', internalType: 'string', type: 'string' },
        ],
        indexed: false,
      },
    ],
    name: 'Created',
  },
  {
    type: 'function',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      {
        name: 'config',
        internalType: 'struct PoolConfig',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'admins', internalType: 'address[]', type: 'address[]' },
          { name: 'allocationToken', internalType: 'address', type: 'address' },
          {
            name: 'distributionToken',
            internalType: 'address',
            type: 'address',
          },
          { name: 'maxAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'timestamps', internalType: 'uint64[]', type: 'uint64[]' },
          { name: 'metadataURI', internalType: 'string', type: 'string' },
        ],
      },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'deploy',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__
 */
export const useReadPool = /*#__PURE__*/ createUseReadContract({ abi: poolAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"config"`
 */
export const useReadPoolConfig = /*#__PURE__*/ createUseReadContract({
  abi: poolAbi,
  functionName: 'config',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"registrations"`
 */
export const useReadPoolRegistrations = /*#__PURE__*/ createUseReadContract({
  abi: poolAbi,
  functionName: 'registrations',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__
 */
export const useWritePool = /*#__PURE__*/ createUseWriteContract({
  abi: poolAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"_allocate"`
 */
export const useWritePoolAllocate = /*#__PURE__*/ createUseWriteContract({
  abi: poolAbi,
  functionName: '_allocate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"_approve"`
 */
export const useWritePoolApprove = /*#__PURE__*/ createUseWriteContract({
  abi: poolAbi,
  functionName: '_approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"_distribute"`
 */
export const useWritePoolDistribute = /*#__PURE__*/ createUseWriteContract({
  abi: poolAbi,
  functionName: '_distribute',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"_register"`
 */
export const useWritePoolRegister = /*#__PURE__*/ createUseWriteContract({
  abi: poolAbi,
  functionName: '_register',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"_reject"`
 */
export const useWritePoolReject = /*#__PURE__*/ createUseWriteContract({
  abi: poolAbi,
  functionName: '_reject',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"_update"`
 */
export const useWritePoolUpdate = /*#__PURE__*/ createUseWriteContract({
  abi: poolAbi,
  functionName: '_update',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"initialize"`
 */
export const useWritePoolInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: poolAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__
 */
export const useSimulatePool = /*#__PURE__*/ createUseSimulateContract({
  abi: poolAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"_allocate"`
 */
export const useSimulatePoolAllocate = /*#__PURE__*/ createUseSimulateContract({
  abi: poolAbi,
  functionName: '_allocate',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"_approve"`
 */
export const useSimulatePoolApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: poolAbi,
  functionName: '_approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"_distribute"`
 */
export const useSimulatePoolDistribute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    functionName: '_distribute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"_register"`
 */
export const useSimulatePoolRegister = /*#__PURE__*/ createUseSimulateContract({
  abi: poolAbi,
  functionName: '_register',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"_reject"`
 */
export const useSimulatePoolReject = /*#__PURE__*/ createUseSimulateContract({
  abi: poolAbi,
  functionName: '_reject',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"_update"`
 */
export const useSimulatePoolUpdate = /*#__PURE__*/ createUseSimulateContract({
  abi: poolAbi,
  functionName: '_update',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulatePoolInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__
 */
export const useWatchPoolEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: poolAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"Allocate"`
 */
export const useWatchPoolAllocateEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    eventName: 'Allocate',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"Approve"`
 */
export const useWatchPoolApproveEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    eventName: 'Approve',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"Deployed"`
 */
export const useWatchPoolDeployedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    eventName: 'Deployed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"Register"`
 */
export const useWatchPoolRegisterEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    eventName: 'Register',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"Reject"`
 */
export const useWatchPoolRejectEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    eventName: 'Reject',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"Update"`
 */
export const useWatchPoolUpdateEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    eventName: 'Update',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolFactoryAbi}__
 */
export const useWritePoolFactory = /*#__PURE__*/ createUseWriteContract({
  abi: poolFactoryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolFactoryAbi}__ and `functionName` set to `"deploy"`
 */
export const useWritePoolFactoryDeploy = /*#__PURE__*/ createUseWriteContract({
  abi: poolFactoryAbi,
  functionName: 'deploy',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolFactoryAbi}__
 */
export const useSimulatePoolFactory = /*#__PURE__*/ createUseSimulateContract({
  abi: poolFactoryAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolFactoryAbi}__ and `functionName` set to `"deploy"`
 */
export const useSimulatePoolFactoryDeploy =
  /*#__PURE__*/ createUseSimulateContract({
    abi: poolFactoryAbi,
    functionName: 'deploy',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolFactoryAbi}__
 */
export const useWatchPoolFactoryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: poolFactoryAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolFactoryAbi}__ and `eventName` set to `"Created"`
 */
export const useWatchPoolFactoryCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolFactoryAbi,
    eventName: 'Created',
  })

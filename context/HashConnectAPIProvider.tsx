import { HashConnect, HashConnectTypes, MessageTypes } from 'hashconnect'
import {
    AccountId,
    Client,
    Hbar,
    NftId,
    PrivateKey,
    TokenAssociateTransaction,
    TokenId,
    TokenMintTransaction,
    TokenNftInfoQuery,
    Transaction,
    TransactionId,
    TransferTransaction,
} from '@hashgraph/sdk'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MintItem } from '../pages'
import { client } from '../lib/sanity'

const NFT_COLLECTION = '0.0.30977681'
const SUPPLY_KEY =
    '54266676e59b36ec7c2617e26578377bc183777c1326c45bc3e72f7c7fdc2111'
const hashClient = Client.forTestnet().setOperator(
    '0.0.30909227',
    '302e020100300506032b657004220420e3826f57fd5714ecd546722badd9704c9d245834952ffdfe0edaced31fe6df61'
)

export function Utf8ArrayToStr(array: Uint8Array | undefined | null) {
    let out, i, len, c
    let char2, char3
    if (array) {
        out = ''
        len = array.length
        i = 0
        while (i < len) {
            c = array[i++]
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c)
                    break
                case 12:
                case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = array[i++]
                    out += String.fromCharCode(
                        ((c & 0x1f) << 6) | (char2 & 0x3f)
                    )
                    break
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++]
                    char3 = array[i++]
                    out += String.fromCharCode(
                        ((c & 0x0f) << 12) |
                            ((char2 & 0x3f) << 6) |
                            ((char3 & 0x3f) << 0)
                    )
                    break
            }
        }

        return out
    }
}
// Configure accounts and hashClient, and generate needed keys
type IPFSMetadata = {
    name: string
    description: string
    image: string
    class: string
    keyValues: {
        health: number
        strength: number
        speed: number
        magic: number
    }
    weapons: Array<string>
}

export type NFTInfoObject = {
    serial: number
    nftId: string
    owner: string
    metadataString: string | undefined
    metadata: IPFSMetadata
}

//Type declarations
export interface SaveData {
    topic: string
    pairingString: string
    privateKey: string
    pairedWalletData: HashConnectTypes.WalletMetadata | null
    pairedAccounts: string[]
    netWork?: string
    id?: string
    accountIds: string[]
}

const getNFTInfo = async (): Promise<NFTInfoObject[]> => {
    const operatorId = AccountId.fromString('0.0.30909227')
    const operatorKey = PrivateKey.fromString(
        '302e020100300506032b657004220420e3826f57fd5714ecd546722badd9704c9d245834952ffdfe0edaced31fe6df61'
    )

    const hashClient = Client.forTestnet().setOperator(operatorId, operatorKey)

    //IPFS content identifiers for which we will create a NFT

    let all = true
    const allNFTS = new Array<NFTInfoObject>()
    let i = 1
    while (all) {
        try {
            const queryTx = await new TokenNftInfoQuery()
                .setNftId(new NftId(TokenId.fromString(NFT_COLLECTION), i))
                .execute(hashClient)

            const owner = queryTx[0].accountId.toString()

            const metadata = Utf8ArrayToStr(queryTx[0].metadata)

            const metadataFormatted = await axios.get(
                `https://ipfs.io/ipfs/${metadata}`
            )

            allNFTS.push({
                serial: i,
                nftId: queryTx[0].nftId.toString(),
                owner: owner,
                metadataString: queryTx[0].metadata?.toLocaleString(),
                metadata: metadataFormatted.data,
            })

            i++
        } catch (e) {
            all = false
        }
    }

    return allNFTS
}

type Networks = 'testnet' | 'mainnet' | 'previewnet'

interface PropsType {
    children: React.ReactNode
    hashConnect: HashConnect
    netWork: Networks
    metaData?: HashConnectTypes.AppMetadata
    debug?: boolean
}

export interface HashConnectProviderAPI {
    connect: () => void
    walletData: SaveData
    hashConnect: HashConnect
    netWork: Networks
    metaData?: HashConnectTypes.AppMetadata
    installedExtensions: HashConnectTypes.WalletMetadata | null
    buildMintNftTransaction: () => Promise<void>
    associateCollection: () => Promise<void>
    nftInfo: Array<NFTInfoObject> | null
}

const INITIAL_SAVE_DATA: SaveData = {
    topic: '',
    pairingString: '',
    privateKey: '',
    pairedAccounts: [],
    pairedWalletData: null,
    accountIds: [],
}

const APP_CONFIG: HashConnectTypes.AppMetadata = {
    name: 'dApp Example',
    description: 'An example hedera dApp',
    icon: 'https://absolute.url/to/icon.png',
}

const loadLocalData = (): null | SaveData => {
    const foundData = localStorage.getItem('hashConnectData')

    if (foundData) {
        const saveData: SaveData = JSON.parse(foundData)

        // setSaveData(saveData);
        return saveData
    } else return null
}

const loadDetailItem = (): null | MintItem => {
    const foundData = localStorage.getItem('detailItemSelected')

    if (foundData) {
        const detailTokenData: MintItem = JSON.parse(foundData)

        // setSaveData(saveData);
        return detailTokenData
    } else return null
}

export const HashConnectAPIContext =
    React.createContext<HashConnectProviderAPI>({
        connect: () => null,
        hashConnect: new HashConnect(true),
        walletData: INITIAL_SAVE_DATA,
        netWork: 'testnet',
        installedExtensions: null,
        buildMintNftTransaction: () => new Promise<void>(() => {}),
        associateCollection: () => new Promise<void>(() => {}),
        nftInfo: null,
    })

export default function HashConnectProvider({
    children,
    hashConnect,
    metaData,
    netWork,
    debug,
}: PropsType) {
    //Saving Wallet Details in Ustate

    const [saveData, SetSaveData] = useState<SaveData>(INITIAL_SAVE_DATA)
    const [nftInfo] = useState<Array<NFTInfoObject> | null>(null)
    const [installedExtensions, setInstalledExtensions] =
        useState<HashConnectTypes.WalletMetadata | null>(null)

    const sendTransaction = async (
        trans: Uint8Array,
        acctToSign: string,
        return_trans = false
    ) => {
        const transaction: MessageTypes.Transaction = {
            topic: saveData.topic,
            byteArray: trans,
            metadata: {
                accountToSign: acctToSign,
                returnTransaction: return_trans,
            },
        }

        return await hashConnect.sendTransaction(saveData.topic, transaction)
    }

    const sendNft = async (_saveData: SaveData | null) => {
        const nftInfoQuery = await getNFTInfo()
        const account = _saveData?.accountIds[0]

        if (!account) {
            // eslint-disable-next-line no-throw-literal
            throw 'ERROR'
        }
        const serial: number | undefined = nftInfoQuery?.length

        if (!serial) {
            // eslint-disable-next-line no-throw-literal
            throw 'ERROR'
        }

        const nftTransfer = await new TransferTransaction()
            .addNftTransfer(
                new NftId(TokenId.fromString(NFT_COLLECTION), serial),
                AccountId.fromString('0.0.30909227'),
                AccountId.fromString(account.toString())
            )
            .execute(hashClient)

        const transactionReceipt = await nftTransfer.getReceipt(hashClient)
        if (debug)
            console.log(
                'The transfer transaction from my account to the new account was: ' +
                    transactionReceipt.status.toString()
            )
    }

    const mintNft = async (
        _saveData: SaveData | null,
        _detailItem: MintItem | null
    ) => {
        const account = _saveData?.accountIds[0]

        if (!account) {
            // eslint-disable-next-line no-throw-literal
            throw 'ERROR'
        }

        const itemCID = _detailItem?.metadata

        if (!itemCID) {
            throw 'ERROR'
        }

        const mintTx = await new TokenMintTransaction()
            .setTokenId(NFT_COLLECTION)
            .setMetadata([Buffer.from(itemCID)])
            .freezeWith(hashClient)

        const mintTxSign = await mintTx.sign(PrivateKey.fromString(SUPPLY_KEY))

        const mintTxSubmit = await mintTxSign.execute(hashClient)

        //Get the transaction receipt
        const mintRx = await mintTxSubmit.getReceipt(hashClient)

        //Log the serial number
        if (debug)
            console.log(
                `- Created NFT with serial: ${mintRx.serials[0].low} \n`
            )
    }

    const signAndMakeBytes = async (
        trans: Transaction,
        signingAcctId: string,
        privateKey?: string
    ) => {
        const privKey = PrivateKey.fromString(
            privateKey
                ? privateKey
                : '943fae2dba39a799f853ddd54f8dea80899efe6858cc4a7c67b676f58f8694fa'
        )
        const pubKey = privKey.publicKey

        const nodeId = [new AccountId(3)]
        const transId = TransactionId.generate(signingAcctId)

        trans.setNodeAccountIds(nodeId)
        trans.setTransactionId(transId)

        trans = await trans.freeze()

        const transBytes = trans.toBytes()

        const sig = await privKey.signTransaction(
            Transaction.fromBytes(transBytes) as any
        )

        const out = trans.addSignature(pubKey, sig)

        const outBytes = out.toBytes()

        return outBytes
    }

    /* const getRandomMetadata = (): string => {
        const cids = [
            'QmYPizx4qL1QV1Q6FhroDzmXa7oaixmDq5haJVTaS8YLpn',
            'QmSk4QUtjfBjj9whG5ahLoPvSr21AeeTjCYF534NYXrKzL',
        ]

        const selected = Math.round(Math.random() * 100000000) % cids.length

        return cids[selected]
    } */

    const associateCollection = async () => {
        const signingAcct = saveData?.accountIds[0]
        const assTrans = new TokenAssociateTransaction()
            .setAccountId(AccountId.fromString(signingAcct))
            .setTokenIds([TokenId.fromString(NFT_COLLECTION)])
        const privateKey = saveData?.privateKey
        const transactionBytes: Uint8Array = await signAndMakeBytes(
            assTrans,
            signingAcct,
            privateKey
        )

        await sendTransaction(transactionBytes, signingAcct, false)
    }

    const buildMintNftTransaction = async () => {
        const signingAcct = saveData.accountIds[0]
        const trans = new TransferTransaction()
            .addHbarTransfer(signingAcct, new Hbar(-1))
            .addHbarTransfer('0.0.30909227', new Hbar(1))

        const transactionBytes: Uint8Array = await signAndMakeBytes(
            trans,
            signingAcct
        )
        await sendTransaction(transactionBytes, signingAcct, false)
    }

    //? Initialize the package in mount
    const initializeHashConnect = async () => {
        const saveData = INITIAL_SAVE_DATA
        const localData = loadLocalData()
        try {
            if (!localData) {
                if (debug) console.log('===Local data not found.=====')

                //first init and store the private for later
                const initData = await hashConnect.init(metaData ?? APP_CONFIG)
                saveData.privateKey = initData.privKey

                //then connect, storing the new topic for later
                const state = await hashConnect.connect()
                saveData.topic = state.topic

                //generate a pairing string, which you can display and generate a QR code from
                saveData.pairingString = hashConnect.generatePairingString(
                    state,
                    netWork,
                    debug ?? false
                )

                //find any supported local wallets
                hashConnect.findLocalWallets()
            } else {
                if (debug) console.log('====Local data found====', localData)
                //use loaded data for initialization + connection

                await hashConnect.init(
                    metaData ?? APP_CONFIG,
                    localData?.privateKey
                )
                hashConnect.connect(
                    localData?.topic,
                    localData?.pairedWalletData ?? metaData
                )
            }
        } catch (error) {
            console.log(error)
        } finally {
            if (localData) {
                SetSaveData((prevData) => ({ ...prevData, ...localData }))
            } else {
                SetSaveData((prevData) => ({ ...prevData, ...saveData }))
            }
            if (debug) console.log('====Wallet details updated to state====')
        }
    }

    const saveDataInLocalStorage = (localData: {
        data: MessageTypes.ApprovePairing
        privateKey: string
    }) => {
        if (debug)
            console.info('===============Saving to localstorage::=============')
        const { metadata, ...restData } = localData.data
        SetSaveData((prevSaveData) => {
            prevSaveData.pairedWalletData = metadata
            prevSaveData.privateKey = localData.privateKey
            return { ...prevSaveData, ...restData }
        })
        const dataToSave = JSON.stringify({
            ...localData.data,
            privateKey: localData.privateKey,
        })
        localStorage.setItem('hashConnectData', dataToSave)
    }

    const additionalAccountResponseEventHandler = (
        data: MessageTypes.AdditionalAccountResponse
    ) => {
        if (debug)
            console.debug('=====additionalAccountResponseEvent======', data)
        // Do a thing
    }

    const foundExtensionEventHandler = (
        data: HashConnectTypes.WalletMetadata
    ) => {
        if (debug) console.debug('====foundExtensionEvent====', data)
        // Do a thing
        setInstalledExtensions(data)
    }

    const transactionResponseHandler = async (
        data: MessageTypes.TransactionResponse
    ) => {
        if (debug) console.debug('====Transaction data====', data)

        if (data.success) {
            const _saveData = loadLocalData()
            const _detailItem = loadDetailItem()

            const tokenId = _detailItem?._id

            if (!tokenId) {
                throw 'ERROE'
            }
            await client
                .patch(_detailItem?._id.toString())
                .dec({ supply: 1 })
                .commit()

            await mintNft(_saveData, _detailItem)
            await sendNft(_saveData)
        }
    }
    const pairingEventHandler = (data: MessageTypes.ApprovePairing) => {
        if (debug) console.log('====pairingEvent:::Wallet connected=====', data)
        // Save Data to localStorage
        saveDataInLocalStorage({ data: data, privateKey: saveData.privateKey })
    }

    useEffect(() => {
        //Intialize the setup
        initializeHashConnect()

        // Attach event handlers
        hashConnect.additionalAccountResponseEvent.on(
            additionalAccountResponseEventHandler
        )
        hashConnect.foundExtensionEvent.on(foundExtensionEventHandler)
        hashConnect.pairingEvent.on(pairingEventHandler)

        hashConnect.transactionResponseEvent.on(transactionResponseHandler)

        return () => {
            // Detach existing handlers
            hashConnect.additionalAccountResponseEvent.off(
                additionalAccountResponseEventHandler
            )
            hashConnect.foundExtensionEvent.off(foundExtensionEventHandler)
            hashConnect.pairingEvent.off(pairingEventHandler)
            hashConnect.transactionResponseEvent.off(transactionResponseHandler)
        }
    }, [])

    const connect = () => {
        if (installedExtensions) {
            if (debug) console.log('Pairing String::', saveData.pairingString)
            hashConnect.connectToLocalWallet(saveData?.pairingString)
        } else {
            if (debug) console.log('====No Extension is not in browser====')
            return 'wallet not installed'
        }
    }

    return (
        <HashConnectAPIContext.Provider
            value={{
                connect,
                hashConnect: hashConnect,
                walletData: saveData,
                netWork,
                installedExtensions,
                buildMintNftTransaction,
                associateCollection,
                nftInfo: nftInfo,
            }}
        >
            {children}
        </HashConnectAPIContext.Provider>
    )
}

const defaultProps: Partial<PropsType> = {
    metaData: {
        name: 'dApp Example',
        description: 'An example hedera dApp',
        icon: 'https://absolute.url/to/icon.png',
    },
    netWork: 'testnet',
    debug: false,
}

HashConnectProvider.defaultProps = defaultProps

export function useHashConnect() {
    const value = React.useContext(HashConnectAPIContext)
    return value
}

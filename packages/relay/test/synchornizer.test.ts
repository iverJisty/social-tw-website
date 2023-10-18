
import { ethers } from 'hardhat'
import { expect } from 'chai'
import { CircuitConfig } from '@unirep/circuits'
import { IncrementalMerkleTree, genStateTreeLeaf } from '@unirep/utils'
import { describe } from 'node:test'
import { deployApp } from '@unirep-app/contracts/scripts/utils'
import {
    createRandomUserIdentity,
    genEpochKeyProof,
    genUserState,
    randomData,
} from '@unirep-app/contracts/test/utils'
import { Unirep, UnirepApp } from '@unirep-app/contracts/typechain-types'
import { Identity } from '@semaphore-protocol/identity'
import { deployContracts, startServer } from './environment'
import { Server } from 'http'
import { UserState } from '@unirep/core'
import { UnirepSocialSynchronizer } from '../src/synchornizer'
import { UserStateFactory } from './utils/UserStateFactory'
import { userService } from '../src/services/UserService'
import e from 'express'

let snapshot: any
let express: Server
let sync: UnirepSocialSynchronizer

describe('Synchronize Comment Test', function () {

    let unirep: Unirep
    let app: UnirepApp
    let users: {hashUserId: string, id: Identity}[] = []

    const epochLength = 300



    before(async function () {
        snapshot = await ethers.provider.send('evm_snapshot', [])

        // Create two users identity
        for(let i = 0; i < 2; i++) {
            const [hashUserId, id] = createRandomUserIdentity()
            users.push({hashUserId, id})
        }

        // Deploy contract
        const contracts = await deployContracts(100000)
        unirep = contracts.unirep
        app = contracts.app

        // start server
        const { db, prover, provider, synchronizer, server } =
            await startServer(unirep, app)
        express = server
        sync = synchronizer
        const userStateFactory = new UserStateFactory(
            db,
            provider,
            prover,
            unirep,
            app,
            synchronizer
        )

        // Signup users
        for(let i = 0; i < 2; i++) {
            const userState = await genUserState(users[i].id, app)
            const { publicSignals, proof } =
                await userState.genUserSignUpProof()
            expect(
                await app.userSignUp(publicSignals, proof, users[i].hashUserId, false)
            )
                .to.emit(app, 'UserSignUp')
                .withArgs(users[i].hashUserId, false)
            
            expect(await app.userRegistry(users[i].hashUserId)).to.equal(true)
            userState.stop()
        }

        // User 0 post a thread
        const content = 'This is a thread'
        const userPostState = await genUserState(users[0].id, app)
        const { publicSignals: epochKeySig1, proof: epochKeyProof1 } =
            await userPostState.genEpochKeyProof()
        await app.post(epochKeySig1, epochKeyProof1, content)
        userPostState.stop()
    })

    describe('Synchronize Comment', function () {   
        it('should synchronize comment', async function () {
            // User 1 post a comment on the thread
            const userCommentState = await genUserState(users[1].id, app)

            // fixture
            const postId = 0
            const commentId = 0
            const comment = 'This is a comment'
            const epoch = await userCommentState.sync.loadCurrentEpoch()

            const { publicSignals: epochKeySig2, proof: epochKeyProof2 } =
                await userCommentState.genEpochKeyProof({
                    nonce: 0,
                })

            const tx = await app.leaveComment(epochKeySig2, epochKeyProof2, postId, comment)
            const receipt = await tx.wait()
            expect(receipt.events?.find((event) => event.event === 'Comment')).to.not.be.undefined

            if (receipt.events) {
                for (const event of receipt.events) {
                    console.log(`Event ${event.event} with args ${event.args}`);
                }
            }

            userCommentState.stop()

            // Check if the comment is synchronized
        })

    })
    

})
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, address, beginCell } from '@ton/core';
import { Main } from '../wrappers/Main';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Main', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Main');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let main: SandboxContract<Main>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        main = blockchain.openContract(Main.createFromConfig({
            owner_address: address("0QCUlZQsMl_AVoVrCN24e5xmplRA1L5wuQOjgkiiCV6ZOlCJ"),
            next_item_index: 0,
            content: beginCell().endCell(),
            nft_item_code: beginCell().endCell(),
            royalty_params: beginCell().endCell(),
        }, code));

        const deployResult = await main.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: main.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and main are ready to use
    });
});

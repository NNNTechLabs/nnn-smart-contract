import { address, beginCell, toNano } from '@ton/core';
import { Main } from '../wrappers/Main';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const main = provider.open(Main.createFromConfig({
        owner_address: address("0QCUlZQsMl_AVoVrCN24e5xmplRA1L5wuQOjgkiiCV6ZOlCJ"),
        next_item_index: 0,
        content: beginCell().endCell(),
        nft_item_code: beginCell().endCell(),
        royalty_params: beginCell().endCell(),
    }, await compile('Main')));

    await main.sendDeploy(provider.sender(), toNano('0.0005'));

    await provider.waitForDeploy(main.address);

}

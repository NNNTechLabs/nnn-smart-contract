import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MainConfig = {
    owner_address: Address;
    next_item_index: number;
    content: Cell;
    nft_item_code: Cell;
    royalty_params: Cell;
};

export function mainConfigToCell(config: MainConfig): Cell {
    return beginCell()
        .storeAddress(config.owner_address)
        .storeUint(config.next_item_index, 64)
        .storeRef(config.content)
        .storeRef(config.nft_item_code)
        .storeRef(config.royalty_params)
        .endCell();
}

export class Main implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Main(address);
    }

    static createFromConfig(config: MainConfig, code: Cell, workchain = 0) {
        const data = mainConfigToCell(config);
        const init = { code, data };
        return new Main(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
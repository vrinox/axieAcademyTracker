import Web3 from 'web3';
import SLP_ABI from '../../assets/abi/slp_abi.json';
import { AbiItem } from "web3-utils/types";

export class RoninWeb3{
    web3 = new Web3('https://api.roninchain.com/rpc');
    SLP_CONTRACT: string = "0xa8754b9fa15fc18bb59458815510e40a12cd2014";
    WETH_CONTRACT: string = '0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5';
    AXS_CONTRACT: string = '0x97a9107c1793bc407d6f527b77e7fff4d812bece';

    async getBalance(contract_cryto: string, ronin: string){
        const Contract = new this.web3.eth.Contract(
            SLP_ABI as AbiItem[],
            contract_cryto
        );
        return await Contract.methods.balanceOf(ronin).call();
    }
}
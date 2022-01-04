import Web3 from 'web3';
import SLP_ABI from '../../assets/abi/slp_abi.json';
import { AbiItem } from "web3-utils/types";

export class RoninWeb3{
    web3 = new Web3('https://api.roninchain.com/rpc');
    SLP_CONTRACT: string = "0xa8754b9fa15fc18bb59458815510e40a12cd2014";
    WETH_CONTRACT: string = '0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5';
    AXS_CONTRACT: string = '0x97a9107c1793bc407d6f527b77e7fff4d812bece';
    RONIN_PROVIDER_FREE = "https://proxy.roninchain.com/free-gas-rpc"

    async getBalance(contract_cryto: string, ronin: string){
        const Contract = new this.web3.eth.Contract(
            SLP_ABI as AbiItem[],
            contract_cryto
        );
        return await Contract.methods.balanceOf(ronin).call();
    }

    async getContracChekpoint(ronin: string, amount: number, timestamp: number, signature: string){
        let Contract = this.getContract();
        return await Contract.methods.checkpoint(ronin, amount, timestamp, signature);
    }

    async getTransaccionTransfer(to: string, amount: number){
        let contract = this.getContract();
        return await contract.methods.transfer(to, amount);
    }

    getContract(){
        let roningContrat = new Web3(this.RONIN_PROVIDER_FREE);
        return new roningContrat.eth.Contract(
            SLP_ABI as AbiItem[],
            this.SLP_CONTRACT
        );
    }

    getRoningProvier(){
        return new Web3(this.RONIN_PROVIDER_FREE)
    }

}
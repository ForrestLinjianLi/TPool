# TPool

## Introduction

Blockchain technology has attracted tremendous attention in both academia and the capital market. More specifically, we mainly focus on the direction of developing a decentralized job-searching application for freelancers, where reliability and mutual trust between the companies and freelancers are considerably the top priority. We present a decentralized project “TPool” using the blockchain technology, in which the company owners need to deposit the commission fees when they post the task, so that freelancers are guaranteed to receive payments after work. Also, a credit system is involved to urge freelancers to work effectively.

## How to run

1. Compile the smart contracts

    ```bash
    hardhat compile
    ```

2. Start a hardhat node

    ```bash
    npx hardhat node
    ```

   ![截屏2022-08-30 下午9.05.40.png](images/%25E6%2588%25AA%25E5%25B1%258F2022-08-30_%25E4%25B8%258B%25E5%258D%25889.05.40.png)

   The Account #0 is the owner of the deployed smart contract which is `0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266` here.

3. Deploy the smart contract

    ```bash
    npx hardhat run --network localhost scripts/taskPool_deploy.js
    ```

   ![截屏2022-08-30 下午9.09.48.png](images/%25E6%2588%25AA%25E5%25B1%258F2022-08-30_%25E4%25B8%258B%25E5%258D%25889.09.48.png)

   Now the smart contract is deployed at `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`. Check line 17 at `src/App.js` to make sure the tokenAdress is the same as the deployed address.

4. Start the program

    ```bash
    npm start
    ```


## Two roles

Once the program starts, the page renders differently based on the account of the Metamask you are in.

### Owner Account

![截屏2022-08-30 下午9.16.18.png](images/%25E6%2588%25AA%25E5%25B1%258F2022-08-30_%25E4%25B8%258B%25E5%258D%25889.16.18.png)

The account here is the owner account which is the task provider, then the page is gonna look like the following. It can create task, cancel task, confirm finished task and confirm all task takers.

![截屏2022-08-30 下午9.13.18.png](images/%25E6%2588%25AA%25E5%25B1%258F2022-08-30_%25E4%25B8%258B%25E5%258D%25889.13.18.png)

## Switch to another test account

![截屏2022-08-30 下午9.18.26.png](images/%25E6%2588%25AA%25E5%25B1%258F2022-08-30_%25E4%25B8%258B%25E5%258D%25889.18.26.png)

The page is different after refresh.

![截屏2022-08-30 下午9.20.19.png](images/%25E6%2588%25AA%25E5%25B1%258F2022-08-30_%25E4%25B8%258B%25E5%258D%25889.20.19.png)
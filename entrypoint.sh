#!/bin/bash

yarn hardhat compile
yarn hardhat:deploy --network $NETWORK
yarn start

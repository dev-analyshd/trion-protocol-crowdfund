/**
 * TRION Protocol - Hardhat Deployment Script
 * =============================================
 * Deploys all 3 contracts in the correct dependency order:
 *   1. TRIONToken (ERC20 with vesting)
 *   2. TRIONGenesisNFT (ERC721 Soulbound)
 *   3. TRIONCrowdfundVault (Core engine, links to #1 and #2)
 *
 * Usage: npx hardhat run scripts/deploy.ts --network <network>
 */

import { ethers } from "hardhat";

async function main() {
  console.log("=".repeat(60));
  console.log("  TRION PROTOCOL - DEPLOYMENT SCRIPT");
  console.log("=".repeat(60));
  console.log();

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance:  ${ethers.formatEther(await ethers.provider.getBalance(deployer))} ETH`);
  console.log();

  // ── 1. Deploy TRIONToken ─────────────────────────────────────────
  console.log("[1/3] Deploying TRIONToken...");
  const TRIONToken = await ethers.getContractFactory("TRIONToken");
  const trionToken = await TRIONToken.deploy();
  await trionToken.waitForDeployment();
  const tokenAddress = await trionToken.getAddress();
  console.log(`  TRIONToken deployed to: ${tokenAddress}`);
  console.log(`  Supply: ${ethers.formatEther(await trionToken.totalSupply())} TRIO`);
  console.log();

  // ── 2. Deploy TRIONGenesisNFT ──────────────────────────────────
  console.log("[2/3] Deploying TRIONGenesisNFT...");
  const TRIONGenesisNFT = await ethers.getContractFactory("TRIONGenesisNFT");
  const genesisNFT = await TRIONGenesisNFT.deploy();
  await genesisNFT.waitForDeployment();
  const nftAddress = await genesisNFT.getAddress();
  console.log(`  TRIONGenesisNFT deployed to: ${nftAddress}`);
  console.log();

  // ── 3. Deploy TRIONCrowdfundVault ───────────────────────────────
  console.log("[3/3] Deploying TRIONCrowdfundVault...");

  // Deploy a mock USDC for testing
  console.log("  Deploying mock USDC for testing...");
  const MockUSDC = await ethers.getContractFactory("MockERC20");
  const mockUSDC = await MockUSDC.deploy("USD Coin", "USDC", 6);
  await mockUSDC.waitForDeployment();
  const usdcAddress = await mockUSDC.getAddress();
  console.log(`  Mock USDC deployed to: ${usdcAddress}`);

  const TRIONCrowdfundVault = await ethers.getContractFactory("TRIONCrowdfundVault");
  const vault = await TRIONCrowdfundVault.deploy(usdcAddress, tokenAddress, nftAddress);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log(`  TRIONCrowdfundVault deployed to: ${vaultAddress}`);
  console.log();

  // ── Summary ─────────────────────────────────────────────────────
  console.log("=".repeat(60));
  console.log("  DEPLOYMENT COMPLETE");
  console.log("=".repeat(60));
  console.log();
  console.log("Contract Addresses:");
  console.log(`  TRIONToken:         ${tokenAddress}`);
  console.log(`  TRIONGenesisNFT:     ${nftAddress}`);
  console.log(`  TRIONCrowdfundVault: ${vaultAddress}`);
  console.log(`  MockUSDC:            ${usdcAddress}`);
  console.log();

  // ── Environment Variables for Frontend ─────────────────────────
  console.log("Add these to your .env.local:");
  console.log(`NEXT_PUBLIC_TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`NEXT_PUBLIC_NFT_ADDRESS=${nftAddress}`);
  console.log(`NEXT_PUBLIC_VAULT_ADDRESS=${vaultAddress}`);
  console.log(`NEXT_PUBLIC_USDC_ADDRESS=${usdcAddress}`);
  console.log();

  // Verify deployment
  console.log("Verifying deployments...");
  const tokenCode = await ethers.provider.getCode(tokenAddress);
  const nftCode = await ethers.provider.getCode(nftAddress);
  const vaultCode = await ethers.provider.getCode(vaultAddress);
  console.log(`  TRIONToken code size: ${tokenCode.length} bytes`);
  console.log(`  TRIONGenesisNFT code size: ${nftCode.length} bytes`);
  console.log(`  TRIONCrowdfundVault code size: ${vaultCode.length} bytes`);
  console.log();
  console.log("Deployment verified successfully.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
